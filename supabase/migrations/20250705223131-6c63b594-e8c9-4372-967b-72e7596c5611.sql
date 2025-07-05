-- Delete any existing role for this user first
DELETE FROM public.user_roles WHERE user_id = '4c1c3756-0815-4d9f-929e-9c12f1b6d9db';

-- Insert admin role for the real authenticated user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('4c1c3756-0815-4d9f-929e-9c12f1b6d9db', 'admin'::app_role);