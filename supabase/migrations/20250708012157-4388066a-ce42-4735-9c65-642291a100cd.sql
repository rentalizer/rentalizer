-- Create news_items table for the news feed
CREATE TABLE public.news_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[],
  featured_image_url TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  engagement_score INTEGER NOT NULL DEFAULT 0,
  admin_submitted BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'published'
);

-- Enable Row Level Security
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Create policies for news items
CREATE POLICY "Anyone can view published news items" 
ON public.news_items 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage news items" 
ON public.news_items 
FOR ALL 
USING (is_admin());

CREATE POLICY "Authenticated users can submit news items" 
ON public.news_items 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND submitted_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_news_items_published_at ON public.news_items(published_at DESC);
CREATE INDEX idx_news_items_source ON public.news_items(source);
CREATE INDEX idx_news_items_tags ON public.news_items USING GIN(tags);
CREATE INDEX idx_news_items_pinned ON public.news_items(is_pinned, published_at DESC);
CREATE INDEX idx_news_items_engagement ON public.news_items(engagement_score DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_items_updated_at
BEFORE UPDATE ON public.news_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update engagement scores
CREATE OR REPLACE FUNCTION public.update_news_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple engagement score calculation: views + (clicks * 3)
  NEW.engagement_score = NEW.view_count + (NEW.click_count * 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for engagement score updates
CREATE TRIGGER update_engagement_score
BEFORE UPDATE ON public.news_items
FOR EACH ROW
WHEN (OLD.view_count IS DISTINCT FROM NEW.view_count OR OLD.click_count IS DISTINCT FROM NEW.click_count)
EXECUTE FUNCTION public.update_news_engagement_score();