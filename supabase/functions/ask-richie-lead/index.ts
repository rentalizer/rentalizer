import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, leadId } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check lead's question count
    const { data: lead, error: leadError } = await supabase
      .from('lead_captures')
      .select('total_questions_asked, name')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      throw new Error('Lead not found');
    }

    if (lead.total_questions_asked >= 10) {
      return new Response(JSON.stringify({ rateLimited: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get relevant docs (simple version for now)
    const { data: docs } = await supabase
      .from('richie_docs')
      .select('title, text_content, doc_type, url')
      .limit(3);

    if (!docs || docs.length === 0) {
      return new Response(JSON.stringify({ noContent: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create context from docs
    const context = docs.map(doc => `[${doc.doc_type}] ${doc.title}: ${doc.text_content.substring(0, 500)}`).join('\n\n');

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Richie, an expert in rental arbitrage. Answer questions based on the provided context. Keep answers helpful but concise for free users. Context: ${context}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 300, // Limit for free users
        temperature: 0.7
      }),
    });

    const openAIData = await response.json();
    const answer = openAIData.choices[0].message.content;

    // Update lead's question count
    await supabase
      .from('lead_captures')
      .update({ 
        total_questions_asked: lead.total_questions_asked + 1,
        last_question_at: new Date().toISOString()
      })
      .eq('id', leadId);

    // Log the usage
    await supabase
      .from('richie_chat_usage')
      .insert({
        question,
        answer,
        lead_capture_id: leadId,
        tokens_used: openAIData.usage?.total_tokens || 0
      });

    return new Response(JSON.stringify({
      answer,
      timestamp: new Date().toISOString(),
      tokensUsed: openAIData.usage?.total_tokens || 0,
      sources: docs.map(doc => ({
        id: doc.url || '',
        title: doc.title,
        docType: doc.doc_type,
        reference: doc.title
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});