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

const RICHIE_SYSTEM_PROMPT = `You are Richie Matthews—a direct, data-driven rental arbitrage mentor who teaches detailed, actionable strategies using 2 bed/2 bath apartments.

CRITICAL RULES:
• No emojis
• Be EXTREMELY specific and tactical—give exact platform names, specific design tips, precise pricing strategies
• Always cite sources like this: [doc-14: Houston Market Guide]
• If unsure about details, recommend they bring it to the next live Q&A
• Tone: direct, tactical, never generic or fluffy
• Give comprehensive, detailed responses (up to 1000 tokens when needed for thoroughness)
• If asked legal advice → say: "I'm not an attorney, so I can't give legal advice."
• If asked personal data or private opinions → decline respectfully

RESPONSE STYLE:
• Break down complex topics into specific, actionable steps
• Include specific platform names, exact dollar amounts, precise percentages
• Give tactical "hacks" and insider tips when relevant
• For optimization questions: cover platforms, design, pricing, operations, and guest experience
• Use bullet points and clear formatting for readability
• Always end with a concrete next action step

EXAMPLE OF DETAILED RESPONSE:
When asked about listing optimization, give specifics like:
• Exact platforms: Airbnb, VRBO, Booking.com, plus direct booking site
• Specific design elements: bright lighting, neutral colors, 6+ photos per room
• Pricing tactics: 20% above comparable hotels, adjust for events, use dynamic pricing tools
• Operational hacks: keyless entry, noise monitors, local guidebooks`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userId } = await req.json();

    if (!question || !userId) {
      return new Response(JSON.stringify({ error: 'Question and userId are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing question:', question);

    // Check user's subscription status and rate limits
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();

    // Check daily usage for free users
    if (userProfile?.subscription_status === 'trial') {
      const today = new Date().toISOString().split('T')[0];
      const { count: todayUsage } = await supabase
        .from('richie_chat_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today + 'T00:00:00.000Z')
        .lte('created_at', today + 'T23:59:59.999Z');

      if (todayUsage && todayUsage >= 25) {
        return new Response(JSON.stringify({ 
          error: 'Daily limit reached. Upgrade to Pro for unlimited questions.',
          rateLimited: true 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate embedding for the question
    const questionEmbeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + openAIApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: question,
      }),
    });

    const questionEmbeddingData = await questionEmbeddingResponse.json();
    const questionEmbedding = questionEmbeddingData.data[0].embedding;

    // Perform similarity search in Supabase
    const { data: similarDocs, error: searchError } = await supabase.rpc(
      'match_richie_docs',
      {
        query_embedding: questionEmbedding,
        match_threshold: 0.78,
        match_count: 5
      }
    );

    if (searchError) {
      console.error('Search error:', searchError);
      // Fallback to regular search if RPC fails
      const { data: allDocs } = await supabase
        .from('richie_docs')
        .select('*')
        .limit(5);
      
      if (!allDocs || allDocs.length === 0) {
        return new Response(JSON.stringify({ 
          error: 'No knowledge base content available yet. Please upload some documents first.',
          noContent: true 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const relevantDocs = similarDocs || [];
    console.log('Found ' + relevantDocs.length + ' relevant documents');

    // Build context from relevant documents
    let context = '';
    const sources = [];

    relevantDocs.forEach((doc, index) => {
      context += '[doc-' + (index + 1) + ': ' + doc.title + ']\n' + doc.text_content + '\n\n';
      sources.push({
        id: doc.id,
        title: doc.title,
        docType: doc.doc_type,
        url: doc.url,
        reference: 'doc-' + (index + 1)
      });
    });

    // Generate response using GPT-4o
    const messages = [
      { role: 'system', content: RICHIE_SYSTEM_PROMPT },
      { 
        role: 'user', 
        content: 'Based on the following context from my training materials, answer this question as Richie Matthews:\n\nCONTEXT:\n' + context + '\n\nQUESTION: ' + question + '\n\nRemember to cite sources using the [doc-X: Title] format and follow all the formatting rules.' 
      }
    ];

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + openAIApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('OpenAI API failed: ' + errorText);
    }

    const gptData = await gptResponse.json();
    const answer = gptData.choices[0].message.content;
    const tokensUsed = gptData.usage?.total_tokens || 0;

    // Log the interaction
    await supabase
      .from('richie_chat_usage')
      .insert({
        user_id: userId,
        question: question,
        answer: answer,
        sources_used: sources,
        tokens_used: tokensUsed
      });

    return new Response(JSON.stringify({
      answer: answer,
      sources: sources,
      tokensUsed: tokensUsed,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ask-richie function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackMessage: "I'm having trouble accessing my knowledge base right now. Please try again in a moment or bring your question to the next live Q&A."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Note: The match_richie_docs RPC function needs to be created separately
// This will be added in a follow-up migration