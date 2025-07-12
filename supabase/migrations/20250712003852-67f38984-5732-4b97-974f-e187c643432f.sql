-- Update the admin deletion policy to be more permissive for testing
DROP POLICY IF EXISTS "Admins can delete any discussion" ON public.discussions;

-- Create a more permissive policy that allows admins OR discussion owners to delete
CREATE POLICY "Admins and owners can delete discussions" 
ON public.discussions 
FOR DELETE 
USING (
  is_admin() OR 
  (auth.uid() IS NOT NULL AND (auth.uid())::text = (user_id)::text)
);