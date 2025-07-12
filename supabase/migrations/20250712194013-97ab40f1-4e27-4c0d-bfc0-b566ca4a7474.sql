-- Create guidebooks table
CREATE TABLE public.guidebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_name TEXT NOT NULL,
  property_address TEXT,
  cover_photo_url TEXT,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  shareable_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guidebook_sections table
CREATE TABLE public.guidebook_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guidebook_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (guidebook_id) REFERENCES public.guidebooks(id) ON DELETE CASCADE
);

-- Create guidebook_cards table
CREATE TABLE public.guidebook_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL,
  card_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'image', 'video', 'link', 'template'
  title TEXT,
  content TEXT,
  media_url TEXT,
  link_url TEXT,
  template_type TEXT, -- 'wifi', 'checkin', 'checkout', 'rules'
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (section_id) REFERENCES public.guidebook_sections(id) ON DELETE CASCADE
);

-- Create guidebook_analytics table (for tracking engagement)
CREATE TABLE public.guidebook_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guidebook_id UUID NOT NULL,
  guest_ip TEXT,
  action TEXT NOT NULL, -- 'view', 'section_click', 'card_click'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (guidebook_id) REFERENCES public.guidebooks(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.guidebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidebook_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidebook_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidebook_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for guidebooks
CREATE POLICY "Users can manage their own guidebooks" 
ON public.guidebooks 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Published guidebooks are publicly viewable" 
ON public.guidebooks 
FOR SELECT 
USING (is_published = true);

-- Create policies for sections
CREATE POLICY "Users can manage sections of their guidebooks" 
ON public.guidebook_sections 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.guidebooks 
    WHERE guidebooks.id = guidebook_sections.guidebook_id 
    AND guidebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Published guidebook sections are publicly viewable" 
ON public.guidebook_sections 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.guidebooks 
    WHERE guidebooks.id = guidebook_sections.guidebook_id 
    AND guidebooks.is_published = true
  )
);

-- Create policies for cards
CREATE POLICY "Users can manage cards of their guidebooks" 
ON public.guidebook_cards 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.guidebook_sections 
    JOIN public.guidebooks ON guidebooks.id = guidebook_sections.guidebook_id
    WHERE guidebook_sections.id = guidebook_cards.section_id 
    AND guidebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Published guidebook cards are publicly viewable" 
ON public.guidebook_cards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.guidebook_sections 
    JOIN public.guidebooks ON guidebooks.id = guidebook_sections.guidebook_id
    WHERE guidebook_sections.id = guidebook_cards.section_id 
    AND guidebooks.is_published = true
  )
);

-- Create policies for analytics
CREATE POLICY "Anyone can insert analytics data" 
ON public.guidebook_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view analytics for their guidebooks" 
ON public.guidebook_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.guidebooks 
    WHERE guidebooks.id = guidebook_analytics.guidebook_id 
    AND guidebooks.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE TRIGGER update_guidebooks_updated_at
BEFORE UPDATE ON public.guidebooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guidebook_sections_updated_at
BEFORE UPDATE ON public.guidebook_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guidebook_cards_updated_at
BEFORE UPDATE ON public.guidebook_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_guidebooks_user_id ON public.guidebooks(user_id);
CREATE INDEX idx_guidebook_sections_guidebook_id ON public.guidebook_sections(guidebook_id);
CREATE INDEX idx_guidebook_sections_order ON public.guidebook_sections(guidebook_id, display_order);
CREATE INDEX idx_guidebook_cards_section_id ON public.guidebook_cards(section_id);
CREATE INDEX idx_guidebook_cards_order ON public.guidebook_cards(section_id, display_order);
CREATE INDEX idx_guidebook_analytics_guidebook_id ON public.guidebook_analytics(guidebook_id);