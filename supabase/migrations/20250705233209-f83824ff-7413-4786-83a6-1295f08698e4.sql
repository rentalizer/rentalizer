-- Add user_profiles for existing auth.users who don't have them yet
INSERT INTO public.user_profiles (id, email, subscription_status, created_at)
SELECT 
  au.id, 
  au.email, 
  'trial'::text as subscription_status,
  au.created_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- Also create basic profiles entries for them
INSERT INTO public.profiles (user_id, display_name, profile_complete, created_at)
SELECT 
  au.id,
  split_part(au.email, '@', 1) as display_name,
  false as profile_complete,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;