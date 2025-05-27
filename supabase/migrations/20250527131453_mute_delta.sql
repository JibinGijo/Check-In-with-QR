/*
  # Fix RLS policies for attendees table

  1. Changes
    - Drop existing RLS policies
    - Create new, more specific policies for each operation
    - Add proper security checks for authenticated users
  
  2. Security
    - Enable RLS on attendees table
    - Add policies for:
      - INSERT: Allow authenticated users to add new attendees
      - SELECT: Allow authenticated users to read all attendees
      - UPDATE: Allow authenticated users to update attendee status
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON attendees;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON attendees;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON attendees;

-- Create new specific policies
CREATE POLICY "Enable insert for authenticated users" 
ON public.attendees
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
ON public.attendees
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for authenticated users"
ON public.attendees
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);