-- Remove the problematic development policies that are causing infinite recursion
DROP POLICY IF EXISTS "Development admin access to user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Development admin access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Development admin access to user_roles" ON public.user_roles;

-- Add the user richie@dialogous.com as an admin in the database
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'richie@dialogous.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'
);

-- Also add any user with richie@istayusa.com if it exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'richie@istayusa.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'
);