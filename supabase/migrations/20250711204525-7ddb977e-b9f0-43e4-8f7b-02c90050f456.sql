
-- First, let's completely reset the RLS policies for the profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view completed profiles" ON public.profiles;

-- Create simplified and more permissive policies that should work
CREATE POLICY "Allow authenticated users to manage their profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow public read access to completed profiles
CREATE POLICY "Allow public to view completed profiles"
ON public.profiles
FOR SELECT
TO public
USING (profile_complete = true);

-- Grant explicit permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
