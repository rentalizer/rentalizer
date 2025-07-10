-- Drop existing policies for profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new RLS policies for profiles table
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for all users" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on user_id" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);