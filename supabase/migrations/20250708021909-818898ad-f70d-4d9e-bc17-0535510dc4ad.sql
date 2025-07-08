-- Enable the vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for Richie's knowledge base documents
CREATE TABLE public.richie_docs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'pdf',
  url TEXT,
  text_content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_size INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE public.richie_docs ENABLE ROW LEVEL SECURITY;

-- Create policies for document access
CREATE POLICY "Admins can manage richie docs" 
ON public.richie_docs 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can read richie docs" 
ON public.richie_docs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create index for vector similarity search
CREATE INDEX ON public.richie_docs USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create table for tracking Ask Richie usage
CREATE TABLE public.richie_chat_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  sources_used JSONB DEFAULT '[]'::jsonb,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for usage tracking
ALTER TABLE public.richie_chat_usage ENABLE ROW LEVEL SECURITY;

-- Policies for usage tracking
CREATE POLICY "Users can view their own chat history" 
ON public.richie_chat_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert chat usage" 
ON public.richie_chat_usage 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all chat usage" 
ON public.richie_chat_usage 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_richie_docs_updated_at
BEFORE UPDATE ON public.richie_docs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();