
-- Delete the user profile from the public schema
DELETE FROM public.user_profiles 
WHERE email = 'richie@dialogo.us';

-- Delete the user from the auth schema (this will cascade and remove related data)
DELETE FROM auth.users 
WHERE email = 'richie@dialogo.us';
