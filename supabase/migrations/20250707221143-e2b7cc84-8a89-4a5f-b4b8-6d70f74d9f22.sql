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

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Drop the existing overly permissive policy on profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create new restrictive policies for the profiles table
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