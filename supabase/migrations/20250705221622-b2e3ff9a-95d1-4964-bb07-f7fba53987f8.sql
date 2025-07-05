-- Remove the problematic foreign key constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- The user_id should just be a UUID without foreign key to auth.users
-- This follows Supabase best practices for security reasons