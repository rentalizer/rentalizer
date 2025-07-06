-- Create events table for community calendar
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  duration TEXT DEFAULT '1 hour',
  location TEXT DEFAULT 'Zoom',
  zoom_link TEXT,
  event_type TEXT DEFAULT 'workshop',
  attendees TEXT DEFAULT 'All members',
  is_recurring BOOLEAN DEFAULT false,
  remind_members BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view events
CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- Only authenticated users can create events
CREATE POLICY "Authenticated users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can edit their own events, admins can edit all
CREATE POLICY "Users can edit their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Users can delete their own events, admins can delete all
CREATE POLICY "Users can delete their own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create an index for querying events by date (useful for reminder system)
CREATE INDEX idx_events_date_remind ON public.events (event_date, remind_members) WHERE remind_members = true;