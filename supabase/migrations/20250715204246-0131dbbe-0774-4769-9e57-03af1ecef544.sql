
-- Add is_pinned column to discussions table
ALTER TABLE public.discussions 
ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance when sorting by pinned status
CREATE INDEX idx_discussions_pinned_created ON public.discussions(is_pinned DESC, created_at DESC);
