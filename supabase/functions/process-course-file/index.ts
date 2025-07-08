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
    const { fileName, filePath, docType = 'pdf' } = await req.json();

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

    if (fileExtension === 'txt' || fileExtension === 'md') {
      // Text files can be read directly
      textContent = await fileData.text();
    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      // Word files need special handling
      textContent = await extractTextFromWord(fileData, fileExtension);
    } else if (fileExtension === 'pdf') {
      // For PDF files, we'll need to extract text
      textContent = await extractTextFromPDF(fileData);
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    if (!textContent.trim()) {
      throw new Error('No text content extracted from file');
    }

    // Auto-generate title from content
    const autoTitle = generateTitleFromContent(textContent, fileName, docType);

    // Split text into chunks for better embedding
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
      console.log(`Embedded chunk ${i + 1}/${chunks.length} for: ${autoTitle}`);
    }

    // Clean up the uploaded file
    await supabase.storage
      .from('course-materials')
      .remove([filePath]);

    return new Response(JSON.stringify({
      success: true,
      documentIds: allDocIds,
      chunks: chunks.length,
      message: `Successfully processed "${autoTitle}" into ${chunks.length} chunk(s)`
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

async function extractTextFromWord(fileData: Blob, fileExtension: string): Promise<string> {
  try {
    // For Word files, we'll use a simple approach - convert to text
    // This is a basic implementation that extracts readable text from Word files
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    if (fileExtension === 'docx') {
      // DOCX files are ZIP archives containing XML
      // For now, we'll extract basic text content
      const decoder = new TextDecoder('utf-8', { fatal: false });
      let text = decoder.decode(uint8Array);
      
      // Basic cleanup for DOCX content
      text = text.replace(/<[^>]*>/g, ' '); // Remove XML tags
      text = text.replace(/\s+/g, ' '); // Normalize whitespace
      text = text.replace(/[^\x20-\x7E\n\r\t]/g, ''); // Keep only printable ASCII + whitespace
      text = text.trim();
      
      if (text.length < 50) {
        throw new Error('Could not extract readable text from DOCX file. Please copy the text and use "Paste Text" tab instead.');
      }
      
      return text;
    } else {
      // DOC files are binary format - more complex to parse
      throw new Error('DOC files require conversion. Please save as DOCX or copy the text and use "Paste Text" tab instead.');
    }
  } catch (error) {
    throw new Error(`Failed to extract text from Word file: ${error.message}. Please copy the text and use "Paste Text" tab instead.`);
  }
}

async function extractTextFromPDF(fileData: Blob): Promise<string> {
  // PDF processing requires additional setup. For now, guide users to copy/paste text.
  throw new Error('PDF text extraction is not yet available. Please copy the text from your PDF and use the "Paste Text" tab instead.');
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

function generateTitleFromContent(text: string, fileName: string, docType: string): string {
  if (!text || text.trim().length === 0) {
    return fileName.replace(/\.[^/.]+$/, "") || `${docType} Document`;
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
  
  return title || fileName.replace(/\.[^/.]+$/, "") || `${docType} Document`;
}