-- Row Level Security for MelbScore
-- Run in Supabase SQL Editor after creating apartments + reviews tables.
--
-- Effect:
--   - Anyone (anon) can READ apartments and reviews
--   - Nobody can INSERT/UPDATE/DELETE via the public anon key
--   - Server Actions use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) for writes

ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Apartments: read-only for API clients using the anon key
DROP POLICY IF EXISTS "apartments_public_read" ON apartments;
CREATE POLICY "apartments_public_read"
  ON apartments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Reviews: read-only for API clients using the anon key
DROP POLICY IF EXISTS "reviews_public_read" ON reviews;
CREATE POLICY "reviews_public_read"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Optional hardening at the database layer (safe to re-run)
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_content_length_check;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_content_length_check
  CHECK (content IS NULL OR char_length(content) <= 1000);

COMMENT ON TABLE reviews IS 'Writes must go through Next.js Server Actions (service role). Anon key is read-only.';
