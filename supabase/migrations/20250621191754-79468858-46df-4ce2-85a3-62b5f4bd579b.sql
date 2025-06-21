
-- Delete the user profiles from the public schema first
DELETE FROM public.user_profiles 
WHERE email IN ('richie@dialogo.us', 'rich@istayusa.com');

-- Delete the users from the auth schema (this will cascade and remove related data)
DELETE FROM auth.users 
WHERE email IN ('richie@dialogo.us', 'rich@istayusa.com');
