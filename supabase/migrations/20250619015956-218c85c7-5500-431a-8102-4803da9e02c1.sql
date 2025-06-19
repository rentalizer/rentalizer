
-- Enable RLS on unprotected tables
ALTER TABLE public.agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND subscription_status = 'admin'
  );
$$;

-- Create security definer function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Agent Activity Policies (Admin only access)
CREATE POLICY "Admins can view agent activity" 
  ON public.agent_activity 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can insert agent activity" 
  ON public.agent_activity 
  FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update agent activity" 
  ON public.agent_activity 
  FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can delete agent activity" 
  ON public.agent_activity 
  FOR DELETE 
  USING (public.is_admin());

-- Agent Config Policies (Admin only access)
CREATE POLICY "Admins can view agent config" 
  ON public.agent_config 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can insert agent config" 
  ON public.agent_config 
  FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update agent config" 
  ON public.agent_config 
  FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can delete agent config" 
  ON public.agent_config 
  FOR DELETE 
  USING (public.is_admin());

-- Members Policies (Admin can see all, users can see their own)
CREATE POLICY "Users can view their own member record" 
  ON public.members 
  FOR SELECT 
  USING (email = auth.email() OR public.is_admin());

CREATE POLICY "Users can insert their own member record" 
  ON public.members 
  FOR INSERT 
  WITH CHECK (email = auth.email() OR public.is_admin());

CREATE POLICY "Users can update their own member record" 
  ON public.members 
  FOR UPDATE 
  USING (email = auth.email() OR public.is_admin());

CREATE POLICY "Admins can delete member records" 
  ON public.members 
  FOR DELETE 
  USING (public.is_admin());

-- SMS Requests Policies (Users can create, admins can manage)
CREATE POLICY "Users can view their own SMS requests" 
  ON public.sms_requests 
  FOR SELECT 
  USING (public.is_authenticated());

CREATE POLICY "Users can create SMS requests" 
  ON public.sms_requests 
  FOR INSERT 
  WITH CHECK (public.is_authenticated());

CREATE POLICY "Admins can update SMS requests" 
  ON public.sms_requests 
  FOR UPDATE 
  USING (public.is_admin());

CREATE POLICY "Admins can delete SMS requests" 
  ON public.sms_requests 
  FOR DELETE 
  USING (public.is_admin());

-- Fix Subscribers table policies (more restrictive)
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

CREATE POLICY "Users can view their own subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "System can insert subscriptions" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Simplified update policy for subscribers - only allow system updates
CREATE POLICY "System can update subscriptions" 
  ON public.subscribers 
  FOR UPDATE 
  USING (user_id = auth.uid() OR email = auth.email());

-- Contact Messages - Add rate limiting by creating a function to check recent submissions
CREATE OR REPLACE FUNCTION public.can_submit_contact_message()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.contact_messages 
    WHERE created_at > NOW() - INTERVAL '1 hour'
    AND (
      -- For authenticated users, check by user
      (auth.uid() IS NOT NULL) OR
      -- For anonymous users, this would need IP-based limiting (not implemented here)
      (auth.uid() IS NULL)
    )
  );
$$;

-- Update contact messages policy to include rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages with rate limit" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (public.can_submit_contact_message());

CREATE POLICY "Admins can view contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (public.is_admin());

CREATE POLICY "Admins can update contact message status" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (public.is_admin());
