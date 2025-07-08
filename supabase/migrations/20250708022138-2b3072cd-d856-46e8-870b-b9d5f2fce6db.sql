-- Create RPC function for semantic similarity search
CREATE OR REPLACE FUNCTION match_richie_docs(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.78,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  doc_type text,
  url text,
  text_content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    richie_docs.id,
    richie_docs.title,
    richie_docs.doc_type,
    richie_docs.url,
    richie_docs.text_content,
    1 - (richie_docs.embedding <=> query_embedding) AS similarity
  FROM richie_docs
  WHERE 1 - (richie_docs.embedding <=> query_embedding) > match_threshold
  ORDER BY richie_docs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;