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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, filePath, docType = 'pdf', title } = await req.json();

    console.log('Processing course file:', fileName);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('course-materials')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert file to text based on type
    let textContent = '';
    const fileExtension = fileName.toLowerCase().split('.').pop();

    if (fileExtension === 'pdf') {
      // For PDF files, we'll need to extract text
      // For now, we'll ask the user to provide text content or use a PDF-to-text service
      textContent = await extractTextFromPDF(fileData);
    } else if (fileExtension === 'txt' || fileExtension === 'md') {
      // Text files can be read directly
      textContent = await fileData.text();
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    if (!textContent.trim()) {
      throw new Error('No text content extracted from file');
    }

    // Split text into chunks for better embedding
    const chunks = splitTextIntoChunks(textContent, 6000);
    const allDocIds = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkTitle = chunks.length > 1 ? `${title || fileName} (Part ${i + 1})` : (title || fileName);

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
        throw new Error(`OpenAI embedding failed: ${errorText}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Store in Supabase
      const { data, error } = await supabase
        .from('richie_docs')
        .insert({
          title: chunkTitle,
          doc_type: docType,
          url: null,
          text_content: chunk,
          embedding: embedding,
          file_size: chunk.length,
          metadata: {
            source_file: fileName,
            chunk_index: i,
            total_chunks: chunks.length,
            upload_date: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      allDocIds.push(data.id);
      console.log(`Embedded chunk ${i + 1}/${chunks.length} for: ${fileName}`);
    }

    // Clean up the uploaded file
    await supabase.storage
      .from('course-materials')
      .remove([filePath]);

    return new Response(JSON.stringify({
      success: true,
      documentIds: allDocIds,
      chunks: chunks.length,
      message: `Successfully processed "${fileName}" into ${chunks.length} chunk(s)`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing course file:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractTextFromPDF(fileData: Blob): Promise<string> {
  // For now, return an instruction for manual text extraction
  // In a production setup, you'd use a PDF parsing library
  throw new Error('PDF processing requires manual text extraction. Please copy and paste the text content from your PDF.');
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