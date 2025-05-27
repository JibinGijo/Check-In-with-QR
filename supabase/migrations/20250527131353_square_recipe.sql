/*
  # Fix RLS policies for attendees table

  1. Changes
    - Drop existing RLS policies that are not working correctly
    - Create new, properly configured RLS policies for the attendees table
    
  2. Security
    - Enable RLS on attendees table (already enabled)
    - Add policies for:
      - INSERT: Allow authenticated users to create attendees
      - SELECT: Allow authenticated users to read all attendees
      - UPDATE: Allow authenticated users to update attendee check-in status
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create attendees" ON attendees;
DROP POLICY IF EXISTS "Anyone can read attendees" ON attendees;
DROP POLICY IF EXISTS "Anyone can update attendee check-in status" ON attendees;

-- Create new policies with proper configuration
CREATE POLICY "Enable insert access for authenticated users"
ON public.attendees
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
ON public.attendees
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update access for authenticated users"
ON public.attendees
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);