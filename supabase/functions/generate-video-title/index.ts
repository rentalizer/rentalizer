
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const { transcript } = await req.json();
    
    if (!transcript || transcript.trim().length < 10) {
      throw new Error("Transcript too short to generate a meaningful title");
    }

    const prompt = `Based on this video transcript, generate a concise, professional title (max 60 characters) that captures the main topic. Focus on the key subject matter, strategy, or lesson being discussed.

Transcript: ${transcript.substring(0, 1000)}...

Return only the title, nothing else.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating concise, professional video titles. Generate titles that are descriptive, engaging, and under 60 characters.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content.trim().replace(/['"]/g, '');

    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating title:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to generate title",
      title: "Untitled Video" // Fallback title
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
