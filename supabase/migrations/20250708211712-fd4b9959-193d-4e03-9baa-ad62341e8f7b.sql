-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT TO public
USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO public
USING (auth.uid() = user_id);