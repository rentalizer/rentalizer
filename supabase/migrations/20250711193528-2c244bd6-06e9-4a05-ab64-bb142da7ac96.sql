
-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new, properly structured policies
-- Allow users to view all profiles (for community features)
CREATE POLICY "Enable select for all users" ON public.profiles
FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile with proper USING and WITH CHECK clauses
CREATE POLICY "Enable update for users based on user_id" ON public.profiles
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
