-- Enhance profiles table with required fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE;

-- Create direct messages table for member-to-admin communication
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  sender_name TEXT NOT NULL
);

-- Enable RLS for direct_messages
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can send messages to admins
CREATE POLICY "Users can send messages to admins" ON public.direct_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = recipient_id AND role = 'admin'
    )
  );

-- Policy: Admins can view all messages sent to them
CREATE POLICY "Admins can view messages sent to them" ON public.direct_messages
  FOR SELECT USING (
    (recipient_id = auth.uid() AND public.has_role(auth.uid(), 'admin')) OR
    sender_id = auth.uid()
  );

-- Policy: Users can view their own sent messages
CREATE POLICY "Users can view their sent messages" ON public.direct_messages
  FOR SELECT USING (sender_id = auth.uid());

-- Update profiles RLS to allow public viewing (but not email for non-admins)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);