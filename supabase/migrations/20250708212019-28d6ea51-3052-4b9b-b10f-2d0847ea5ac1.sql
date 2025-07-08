-- Drop all policies and recreate from scratch
DROP POLICY IF EXISTS "allow_all_lead_inserts" ON public.lead_captures;
DROP POLICY IF EXISTS "allow_all_lead_updates" ON public.lead_captures;
DROP POLICY IF EXISTS "allow_admin_select" ON public.lead_captures;

-- Create very simple policies that definitely work
CREATE POLICY "lead_insert_policy" ON public.lead_captures
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "lead_update_policy" ON public.lead_captures
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "lead_select_policy" ON public.lead_captures
FOR SELECT 
USING (
  -- Allow if user is admin OR if no user (for checking existing leads)
  COALESCE(is_admin(), false) OR auth.uid() IS NULL
);