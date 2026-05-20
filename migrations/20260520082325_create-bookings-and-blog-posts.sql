CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_category TEXT NOT NULL,
  full_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT NOT NULL,
  license_type     TEXT NOT NULL,
  preferred_date   TEXT NOT NULL,
  preferred_time   TEXT NOT NULL,
  booking_date     TIMESTAMPTZ DEFAULT NOW(),
  status           TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  image_url    TEXT,
  image_hint   TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
