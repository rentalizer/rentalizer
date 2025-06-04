
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, propertyType, bathrooms } = await req.json();
    
    console.log(`🤖 OpenAI rent lookup for ${city} (${propertyType}BR/${bathrooms}BA)`);
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Please provide the current median monthly rent for ${propertyType}-bedroom, ${bathrooms}-bathroom apartments in ${city}. 

Return the data in JSON format with the following structure:
{
  "cityAverage": [median rent number],
  "neighborhoods": {
    "Neighborhood 1": [rent amount],
    "Neighborhood 2": [rent amount],
    "Neighborhood 3": [rent amount]
  }
}

Only return the JSON object, no additional text. Use current 2024 market data.`;

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
            content: 'You are a real estate data expert. Provide accurate current market rental data in JSON format only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const rentDataText = data.choices[0].message.content;
    
    console.log('📊 OpenAI rent response:', rentDataText);
    
    try {
      const rentData = JSON.parse(rentDataText);
      console.log('✅ Parsed rent data:', rentData);
      
      return new Response(JSON.stringify({
        success: true,
        data: rentData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      
      // Fallback: try to extract numbers from the response
      const cityAverage = parseInt(rentDataText.match(/\d{3,4}/)?.[0] || '0');
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          cityAverage: cityAverage,
          neighborhoods: {}
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('❌ OpenAI rent lookup error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
