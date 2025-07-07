-- Create a view for public profile information (name, image, bio only)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  first_name,
  last_name,
  display_name,
  avatar_url,
  bio
FROM public.profiles
WHERE profile_complete = true;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create new policies for profiles table
-- Admins can see all profile data
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Users can see their own complete profile
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for the public profiles view
-- Anyone can view public profile information (limited fields)
CREATE POLICY "Anyone can view public profiles"
ON public.public_profiles
FOR SELECT
TO public
USING (true);