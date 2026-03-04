/*
  # Create daily_metrics table

  ## Summary
  Core table for The Lifestyle Method DM setter performance tracker.
  Stores one row per day with 9 outreach/conversion metric columns.

  ## New Tables

  ### `daily_metrics`
  - `id` (uuid, PK) — auto-generated
  - `date` (date, UNIQUE) — one entry per calendar day
  - `lifestyle_commenters_reached` (int) — "Lifestyle" post commenters contacted
  - `story_poll_voters_reached` (int) — Story poll voters contacted
  - `engaged_followers_reached` (int) — Engaged followers contacted
  - `new_followers_reached` (int) — New followers contacted
  - `follow_ups` (int) — Follow-up messages sent
  - `offers_to_book` (int) — Offers to book a call made
  - `booking_links_sent` (int) — Booking links sent to prospects
  - `calls_booked` (int) — Calls successfully booked
  - `deals_closed` (int) — Deals closed
  - `notes` (text) — Optional daily notes
  - `created_at` (timestamptz) — row creation time
  - `updated_at` (timestamptz) — auto-updated on every change

  ## Security
  - RLS enabled
  - Public SELECT for anon (Trevor's dashboard is public, no login)
  - Anon INSERT/UPDATE/DELETE for admin panel (V0: URL-obscurity protection)

  ## Notes
  1. UNIQUE constraint on `date` prevents duplicate days
  2. An `updated_at` trigger fires on every UPDATE
*/

CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  lifestyle_commenters_reached integer NOT NULL DEFAULT 0,
  story_poll_voters_reached integer NOT NULL DEFAULT 0,
  engaged_followers_reached integer NOT NULL DEFAULT 0,
  new_followers_reached integer NOT NULL DEFAULT 0,
  follow_ups integer NOT NULL DEFAULT 0,
  offers_to_book integer NOT NULL DEFAULT 0,
  booking_links_sent integer NOT NULL DEFAULT 0,
  calls_booked integer NOT NULL DEFAULT 0,
  deals_closed integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_metrics_date_unique UNIQUE (date)
);

ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all daily metrics"
  ON daily_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon insert daily metrics"
  ON daily_metrics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon update daily metrics"
  ON daily_metrics FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon delete daily metrics"
  ON daily_metrics FOR DELETE
  TO anon
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_metrics_updated_at'
  ) THEN
    CREATE TRIGGER update_daily_metrics_updated_at
      BEFORE UPDATE ON daily_metrics
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
