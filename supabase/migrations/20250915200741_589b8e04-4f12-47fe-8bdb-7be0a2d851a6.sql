-- Fix critical security vulnerability in lead_captures table
-- Remove public read access and restrict to admins only

-- Drop the existing problematic policy that allows unauthenticated access
DROP POLICY IF EXISTS "lead_select_policy" ON public.lead_captures;

-- Create new secure policy that only allows admins to view lead data
CREATE POLICY "Admins can view lead captures" 
ON public.lead_captures 
FOR SELECT 
USING (is_admin());

-- Keep the existing insert policy for lead capture form submissions
-- (lead_insert_policy already exists and allows public inserts)

-- Keep the existing update policy for updating lead questions count
-- (lead_update_policy already exists)