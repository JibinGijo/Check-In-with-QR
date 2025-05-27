/*
  # Create attendees table

  1. New Tables
    - `attendees`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `organization` (text, nullable)
      - `checked_in` (boolean)
      - `check_in_time` (timestamptz, nullable)
      - `qr_code` (text)
      - `email_sent` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `attendees` table
    - Add policies for authenticated users to:
      - Read all attendees
      - Insert new attendees
      - Update attendee check-in status
*/

CREATE TABLE IF NOT EXISTS attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  organization text,
  checked_in boolean DEFAULT false,
  check_in_time timestamptz,
  qr_code text NOT NULL,
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read attendees"
  ON attendees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create attendees"
  ON attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update attendee check-in status"
  ON attendees
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);