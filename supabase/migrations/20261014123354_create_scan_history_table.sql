/*
# Create scan history table for AI Crop Disease Detection app

1. New Tables
- `scan_history`
  - `id` (uuid, primary key)
  - `image_url` (text, the data URL of the scanned leaf image)
  - `crop_type` (text, e.g. "Tomato", "Maize", "Potato")
  - `disease_name` (text, the detected disease name or "Healthy")
  - `confidence` (numeric, confidence percentage 0-100)
  - `severity` (text, e.g. "None", "Low", "Moderate", "High")
  - `is_healthy` (boolean, whether the plant was found healthy)
  - `treatment` (text, recommended treatment/action)
  - `created_at` (timestamp, when the scan was made)

2. Security
- Enable RLS on `scan_history`.
- Allow anon + authenticated CRUD because this is a demo app with no sign-in.
- Data is intentionally shared/public for demo purposes.
*/

CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  crop_type text NOT NULL,
  disease_name text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  severity text NOT NULL DEFAULT 'None',
  is_healthy boolean NOT NULL DEFAULT false,
  treatment text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scans" ON scan_history;
CREATE POLICY "anon_select_scans" ON scan_history FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scans" ON scan_history;
CREATE POLICY "anon_insert_scans" ON scan_history FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scans" ON scan_history;
CREATE POLICY "anon_update_scans" ON scan_history FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scans" ON scan_history;
CREATE POLICY "anon_delete_scans" ON scan_history FOR DELETE
TO anon, authenticated USING (true);
