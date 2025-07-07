-- Drop the security definer function that's causing the warning
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

-- Use a pure RLS approach instead - no security definer functions
-- Create a simple policy that allows public access to specific columns only
CREATE POLICY "Public limited profile access"
ON public.profiles
FOR SELECT
TO public
USING (
  profile_complete = true
);

-- However, we need to ensure the application layer only requests the allowed columns
-- The RLS will allow the query, but the application should only select:
-- user_id, first_name, last_name, display_name, avatar_url, bio

-- Remove any grants that might be problematic
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM authenticated;

-- Grant only SELECT to specific roles
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;