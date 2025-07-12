-- Check current RLS policies on guidebook_sections
-- Update the policy to allow our development user ID

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage sections of their guidebooks" ON guidebook_sections;

-- Create new policy that allows development user
CREATE POLICY "Users can manage sections of their guidebooks" ON guidebook_sections
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM guidebooks 
    WHERE guidebooks.id = guidebook_sections.guidebook_id 
    AND (
      guidebooks.user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
      (auth.uid() IS NOT NULL AND guidebooks.user_id = auth.uid())
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM guidebooks 
    WHERE guidebooks.id = guidebook_sections.guidebook_id 
    AND (
      guidebooks.user_id = '00000000-0000-0000-0000-000000000001'::uuid OR 
      (auth.uid() IS NOT NULL AND guidebooks.user_id = auth.uid())
    )
  )
);