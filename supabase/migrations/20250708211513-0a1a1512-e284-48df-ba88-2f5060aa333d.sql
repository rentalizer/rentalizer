-- Temporarily disable RLS to allow lead captures to work
ALTER TABLE public.lead_captures DISABLE ROW LEVEL SECURITY;

-- Then re-enable with simplified policies
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all lead captures" ON public.lead_captures;
DROP POLICY IF EXISTS "Allow lead capture submissions" ON public.lead_captures;
DROP POLICY IF EXISTS "Allow question count updates" ON public.lead_captures;

-- Create simple, working policies
CREATE POLICY "allow_all_lead_inserts" ON public.lead_captures
FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "allow_all_lead_updates" ON public.lead_captures  
FOR UPDATE TO public
USING (true);

CREATE POLICY "allow_admin_select" ON public.lead_captures
FOR SELECT TO public
USING (
  CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE is_admin()
  END
);