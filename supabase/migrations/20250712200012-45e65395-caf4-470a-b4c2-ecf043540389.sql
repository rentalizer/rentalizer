-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage their own guidebooks" ON guidebooks;

-- Create a new policy that allows the development user ID specifically
CREATE POLICY "Users can manage their own guidebooks" ON guidebooks
FOR ALL
USING (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
)
WITH CHECK (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);