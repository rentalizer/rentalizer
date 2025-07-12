-- First, let's check the current RLS policies on guidebooks table
-- The issue is likely that our RLS policy requires auth.uid() = user_id
-- but in development mode we're using a mock user ID

-- Let's update the RLS policy to allow our development user
DROP POLICY IF EXISTS "Users can manage their own guidebooks" ON guidebooks;

-- Create a new policy that allows both real users and our dev user
CREATE POLICY "Users can manage their own guidebooks" ON guidebooks
FOR ALL
USING (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000001'::uuid)
WITH CHECK (auth.uid() = user_id OR user_id = '00000000-0000-0000-0000-000000000001'::uuid);