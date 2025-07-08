-- Add more permissive temporary policy for debugging
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a very permissive policy temporarily to see if it's an RLS issue
CREATE POLICY "Temporary permissive update policy" 
ON public.profiles 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Also ensure the SELECT policy allows the user to see their profile
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;

CREATE POLICY "Temporary permissive select policy"
ON public.profiles
FOR SELECT 
USING (true);