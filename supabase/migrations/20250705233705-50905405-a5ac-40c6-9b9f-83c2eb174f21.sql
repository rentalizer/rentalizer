-- Add policy for admins to view all user profiles
CREATE POLICY "Admins can view all user profiles" ON public.user_profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));