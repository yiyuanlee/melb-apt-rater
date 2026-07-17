# MelbScore — Melbourne Apartment Ratings

**A Hupu-style apartment review community for Melbourne, built with Next.js + Supabase.**

MelbScore helps **international students, office workers, and renters in Melbourne** share and discover real apartment living experiences. Inspired by Hupu-style scoring, it makes it easier to learn how a building actually feels to live in—before you sign a lease.

Browse ratings, hot rankings, immersive detail pages, and community reviews—with lightweight anti-abuse controls so scores stay more trustworthy.

**Live demo:** [https://melbaptrater.vercel.app](https://melbaptrater.vercel.app)

> 中文文档见 [README.zh-CN.md](./README.zh-CN.md)

---

## Overview

**Goal:** give everyone looking to rent in Melbourne access to honest, community-driven reviews.

You can:

- Browse popular Melbourne apartments (sorted by review activity)
- See live average scores on a **1–10** scale
- Submit your own rating and written experience
- Open immersive, full-bleed apartment detail pages
- Rely on simple rate limiting to reduce duplicate spam scores
- View images from Supabase Storage, local `public/` assets, and Unsplash

---

## Features

### Hot rankings

The homepage ranks apartments by review volume so the most-discussed buildings surface first.

### Real-time ratings

- Scores and comments are written to the database on submit
- A PostgreSQL trigger keeps `rating_avg` and `rating_count` in sync
- No manual backend recalculation required

### Immersive detail pages

- Large cover imagery on apartment pages
- Clear score presentation
- Community-first, review-focused layout

### Anti-spam controls

Simple **IP hash** rate limiting:

- Blocks repeat scoring from the same IP within 24 hours
- Helps keep ratings more objective

### Review community

Renters commonly discuss:

- Soundproofing
- Elevator speed
- Property management quality
- Safety
- Nearby amenities

### Multi-source images

Supports mixed image sources:

- Supabase Storage (cloud uploads)
- Local static files under `public/`
- Unsplash (remote images)

---

## Tech stack

| Layer | Technology |
|------|------------|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| Styling | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Quick start

### 1. Clone the repo

```bash
git clone https://github.com/yiyuanlee/melb_apt_rater.git
cd melb_apt_rater
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to **`.env.local`** and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_Supabase_Anon_Key

# Server-only — do NOT prefix with NEXT_PUBLIC_, and never commit this
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
```

Find `service_role` in Supabase: **Project Settings → API → service_role (secret)**.  
On Vercel, add the same variables (do not expose the service role key to the browser).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Security setup (required)

Review writes must **not** go through the browser anon key alone—otherwise anyone can call the Supabase API and spam ratings.

1. In the Supabase **SQL Editor**, run **`SQL/RLS_policies.sql`**
   - Public read: allow `SELECT` on `apartments` / `reviews`
   - Block anonymous writes: anon key cannot `INSERT` / `UPDATE` / `DELETE`
2. Set **`SUPABASE_SERVICE_ROLE_KEY`** in `.env.local` and Vercel (Server Actions only)
3. Submissions are validated in `app/actions.ts`: score 1–10, content length, apartment exists, 24h IP limit

---

## Database setup (Supabase)

This project uses Supabase PostgreSQL. Run the following in the Supabase **SQL Editor**.

### 1. Create tables

```sql
CREATE TABLE apartments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    cover_image TEXT,
    rating_avg NUMERIC(3, 1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
    content TEXT,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    upvotes INTEGER DEFAULT 0,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Auto-update rating stats (trigger)

```sql
CREATE OR REPLACE FUNCTION update_apartment_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE apartments
    SET
        rating_avg = (
            SELECT COALESCE(ROUND(AVG(score), 1), 0)
            FROM reviews
            WHERE apartment_id = NEW.apartment_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE apartment_id = NEW.apartment_id
        )
    WHERE id = NEW.apartment_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_added
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_apartment_stats();
```

You can also use the SQL scripts under the [`SQL/`](./SQL) folder (seeds, RLS policies, rating updater).

---

## Project structure

```
melb_apt_rater/
├── app/
│   ├── page.tsx
│   ├── actions.ts
│   └── apartment/[id]/
├── components/
│   ├── ApartmentCard.tsx
│   └── ReviewForm.tsx
├── lib/
│   ├── supabase.ts
│   ├── supabase-admin.ts
│   └── review-security.ts
├── SQL/
├── public/
└── next.config.ts
```

---

## Deployment

Deploy on Vercel:

1. Push the repo to GitHub
2. Import the project in Vercel
3. Add the environment variables
4. Deploy

---

## Roadmap

- [x] Basic rating & review system
- [x] Image display (local + remote)
- [ ] Search
- [ ] Map mode
- [ ] User authentication
- [ ] Review image uploads
- [ ] Multi-dimension scores (soundproofing, safety, etc.)

---

## Contributing

Issues and pull requests are welcome. Stars are appreciated!

---

## License

MIT License
