-- Delete any existing admin role for this user first
DELETE FROM public.user_roles WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Insert you as admin directly 
INSERT INTO public.user_roles (user_id, role) 
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'admin'::app_role);