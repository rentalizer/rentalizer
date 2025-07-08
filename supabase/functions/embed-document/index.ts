import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title = '', docType, textContent, url, metadata } = await req.json();

    console.log('Processing document');

    // Auto-generate title from content if not provided
    const autoTitle = title || generateTitleFromContent(textContent, docType);

    // Split text into chunks if it's too long (max 8191 tokens for OpenAI)
    const chunks = splitTextIntoChunks(textContent, 6000);
    const allDocIds = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkTitle = chunks.length > 1 ? `${autoTitle} (Part ${i + 1})` : autoTitle;

      // Generate embedding using OpenAI
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: chunk,
        }),
      });

      if (!embeddingResponse.ok) {
        const errorText = await embeddingResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI embedding failed: ${errorText}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Store in Supabase
      const { data, error } = await supabase
        .from('richie_docs')
        .insert({
          title: chunkTitle,
          doc_type: docType || 'pdf',
          url: url || null,
          text_content: chunk,
          embedding: embedding,
          file_size: chunk.length,
          metadata: {
            ...metadata,
            chunk_index: i,
            total_chunks: chunks.length,
            original_title: autoTitle
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      allDocIds.push(data.id);
      console.log(`Embedded chunk ${i + 1}/${chunks.length} for: ${autoTitle}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      documentIds: allDocIds,
      chunks: chunks.length,
      message: `Successfully embedded ${chunks.length} chunk(s) for "${autoTitle}"` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in embed-document function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateTitleFromContent(text: string, docType: string): string {
  if (!text || text.trim().length === 0) {
    return `${docType} Document`;
  }

  // Clean and get first meaningful words
  const cleanText = text.trim().replace(/\s+/g, ' ');
  const words = cleanText.split(' ').filter(word => word.length > 2);
  
  // Take first 6-8 words for title, ensuring it's not too long
  const titleWords = words.slice(0, 8);
  let title = titleWords.join(' ');
  
  // Limit to 60 characters
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  return title || `${docType} Document`;
}

function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
      }
      currentChunk = trimmedSentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + '.');
  }
  
  return chunks.length > 0 ? chunks : [text];
}