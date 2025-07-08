-- Fix the lead_captures RLS policy to allow anonymous submissions
DROP POLICY IF EXISTS "Anyone can submit lead capture" ON public.lead_captures;

-- Create a proper policy that allows anyone to insert lead captures
CREATE POLICY "Allow lead capture submissions" 
ON public.lead_captures 
FOR INSERT 
WITH CHECK (true);

-- Also allow the system/service role to update question counts
DROP POLICY IF EXISTS "System can update question count" ON public.lead_captures;

CREATE POLICY "Allow question count updates" 
ON public.lead_captures 
FOR UPDATE 
USING (true)
WITH CHECK (true);