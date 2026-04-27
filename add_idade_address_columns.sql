-- Migration: add idade and address columns to invites table
-- Run this in Supabase SQL Editor

ALTER TABLE public.invites
  ADD COLUMN IF NOT EXISTS idade text,
  ADD COLUMN IF NOT EXISTS address text;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invites'
  AND column_name IN ('idade', 'address')
ORDER BY column_name;
