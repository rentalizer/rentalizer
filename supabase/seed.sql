--
-- This is a basic seed file to create the 'guidebooks' table,
-- which was causing the migration error.
-- This file will be run automatically by 'supabase start'
-- to set up your local database schema.
--

-- Enable the 'uuid-ossp' extension to work with UUIDs
-- This is often a dependency for Supabase projects
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'guidebooks' table
CREATE TABLE IF NOT EXISTS public.guidebooks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  content jsonb,
  is_published boolean NOT NULL DEFAULT false,

  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.guidebooks ENABLE ROW LEVEL SECURITY;

-- Create a basic policy to prevent future errors
-- This policy allows public access to published guidebooks
DROP POLICY IF EXISTS "Published guidebooks are viewable" ON public.guidebooks;
CREATE POLICY "Published guidebooks are viewable"
  ON public.guidebooks FOR SELECT
  USING (is_published = true);
