-- Add policy for admins to delete direct messages
CREATE POLICY "Admins can delete direct messages" ON public.direct_messages
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));