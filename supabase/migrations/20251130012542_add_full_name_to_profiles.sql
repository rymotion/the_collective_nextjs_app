/*
  # Add full_name field to profiles table

  1. Changes
    - Add `full_name` column to profiles table for storing user's legal name

  2. Notes
    - This is optional field for professional purposes
    - Uses IF NOT EXISTS to safely handle existing column
*/

-- Add full_name column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
END $$;
