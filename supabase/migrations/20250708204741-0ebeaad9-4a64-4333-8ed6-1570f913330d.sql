
-- Drop the newsletter table since we're replacing it with lead captures
DROP TABLE IF EXISTS public.newsletter_signups;

-- Create lead_captures table for chatbot access
CREATE TABLE public.lead_captures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_questions_asked INTEGER NOT NULL DEFAULT 0,
  last_question_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for lead capture)
CREATE POLICY "Anyone can submit lead capture" 
ON public.lead_captures 
FOR INSERT 
WITH CHECK (true);

-- Create policy for system to update question count
CREATE POLICY "System can update question count" 
ON public.lead_captures 
FOR UPDATE 
USING (true);

-- Create policy for admins to view all lead captures
CREATE POLICY "Admins can view all lead captures" 
ON public.lead_captures 
FOR SELECT 
USING (public.is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_lead_captures_updated_at
BEFORE UPDATE ON public.lead_captures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_lead_captures_email ON public.lead_captures(email);
CREATE INDEX idx_lead_captures_created_at ON public.lead_captures(created_at);
CREATE INDEX idx_lead_captures_total_questions ON public.lead_captures(total_questions_asked);

-- Modify richie_chat_usage to include lead_capture_id for tracking
ALTER TABLE public.richie_chat_usage 
ADD COLUMN lead_capture_id UUID REFERENCES public.lead_captures(id);

-- Create index for lead capture tracking
CREATE INDEX idx_richie_chat_usage_lead_capture ON public.richie_chat_usage(lead_capture_id);
