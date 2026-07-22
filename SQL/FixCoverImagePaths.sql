-- Fix mismatched cover_image paths without wiping reviews.
-- Run in Supabase SQL Editor on existing production data.

UPDATE apartments SET cover_image = '/victoria-one.jpg'
WHERE cover_image IN ('/victoriaone.jpg', 'victoriaone.jpg', '/victoriaone.jpeg');

UPDATE apartments SET cover_image = '/swanstoncentral.jpeg'
WHERE cover_image IN ('/swanstoncentral.jpg', 'swanstoncentral.jpg', 'swanstoncentral.jpeg');

UPDATE apartments SET cover_image = '/Scape_Swanston.jpg'
WHERE cover_image IN ('/scape.jpg', 'scape.jpg', '/Scape_Swanston.jpg');

UPDATE apartments SET cover_image = '/unilodge-lincoln-house.jpg'
WHERE cover_image IN ('/unilodge.jpg', 'unilodge.jpg', 'unilodge-lincoln-house.jpg');

-- Local filenames that were never uploaded to /public → fall back to default Unsplash in app
UPDATE apartments SET cover_image = NULL
WHERE cover_image IN (
  '/iglu.jpg', 'iglu.jpg',
  '/yugo.jpg', 'yugo.jpg',
  '/journal.jpg', 'journal.jpg',
  '/switch.jpg', 'switch.jpg',
  '/melbournegrand.jpg', 'melbournegrand.jpg'
);
