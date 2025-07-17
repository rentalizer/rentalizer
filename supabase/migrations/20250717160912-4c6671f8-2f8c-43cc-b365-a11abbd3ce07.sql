-- Update RLS policies for user_profiles to allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;

-- Create updated policy for admins to view all user profiles
CREATE POLICY "Admins can view all user profiles" 
ON user_profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  auth.uid() = id
);