-- Update RLS policy to allow all authenticated users to view user profiles for member count
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- Create policy allowing all authenticated users to view all profiles
CREATE POLICY "Authenticated users can view all profiles" 
ON user_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Keep the existing admin policy for completeness
-- The "Admins can view all user profiles" policy already exists and will handle admin access