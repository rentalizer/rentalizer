-- Add policy to allow admins to delete any discussion
CREATE POLICY "Admins can delete any discussion" 
ON public.discussions 
FOR DELETE 
USING (is_admin());