/*
  # Add Service Images Support

  ## Overview
  This migration adds image URL support to services for visual illustrations of each service.

  ## Changes
  - Add `image_url` column to `services` table
  - Stores URLs to external images (e.g., from Pexels)
  - Allows admins to manage service illustrations from the back office

  ## New Columns
  - `image_url` (text) - Optional URL to service illustration image
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url text DEFAULT '';
  END IF;
END $$;
