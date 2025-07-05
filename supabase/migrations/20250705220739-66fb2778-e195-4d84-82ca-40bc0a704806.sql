-- Add a policy to allow users to make themselves admin if no admin exists yet
CREATE POLICY "Users can make themselves admin if no admin exists"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'admin' AND 
  user_id = auth.uid() AND
  NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  )
);