-- Drop the problematic view
DROP VIEW IF EXISTS public.public_profiles;

-- Instead, create a more secure approach using a function
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  first_name text,
  last_name text,
  display_name text,
  avatar_url text,
  bio text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.first_name,
    p.last_name,
    p.display_name,
    p.avatar_url,
    p.bio
  FROM public.profiles p
  WHERE p.user_id = profile_user_id 
    AND p.profile_complete = true;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon;

-- Add a policy to allow public access to limited profile data through direct queries
-- This replaces the view with a more secure RLS approach
CREATE POLICY "Public can view limited profile data"
ON public.profiles
FOR SELECT
TO public
USING (
  profile_complete = true AND
  -- Only allow access to specific columns by checking the query context
  true
);

-- However, let's be more restrictive and only allow specific columns
-- by creating a more targeted approach
DROP POLICY IF EXISTS "Public can view limited profile data" ON public.profiles;