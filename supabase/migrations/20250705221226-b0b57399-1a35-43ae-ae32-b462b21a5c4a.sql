-- Drop the problematic policy and create a simpler one
DROP POLICY IF EXISTS "Users can make themselves admin if no admin exists" ON public.user_roles;

-- Create a temporary policy that allows any authenticated user to insert admin role if no admin exists
CREATE POLICY "Bootstrap first admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'admin'::app_role AND 
  user_id = auth.uid() AND
  (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin'::app_role) = 0
);