-- Re-enable RLS and create working policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Temporary permissive update policy" ON public.profiles;
DROP POLICY IF EXISTS "Temporary permissive select policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public limited profile access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create simple, working policies
CREATE POLICY "Allow all for authenticated users"
ON public.profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for public access to complete profiles
CREATE POLICY "Public can view complete profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (profile_complete = true);