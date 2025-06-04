
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

    const prompt = `Please provide the current median monthly rent for ${propertyType}-bedroom, ${bathrooms}-bathroom apartments in ${city} and its major neighborhoods/districts. 

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no additional text):
{
  "cityAverage": [number],
  "neighborhoods": {
    "Neighborhood 1": [number],
    "Neighborhood 2": [number],
    "Neighborhood 3": [number],
    "Neighborhood 4": [number],
    "Neighborhood 5": [number]
  }
}

Use current 2024 market data and provide realistic rent variations between neighborhoods. Include at least 5 different neighborhoods with varied rent prices (some higher-end, some mid-range, some affordable areas).`;

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
            content: 'You are a real estate data expert. Provide accurate current market rental data in valid JSON format only. Never use markdown code blocks or any additional formatting. Return only the raw JSON object.' 
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
    let rentDataText = data.choices[0].message.content.trim();
    
    console.log('📊 OpenAI rent response:', rentDataText);
    
    // Clean up markdown code blocks if they exist
    rentDataText = rentDataText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const rentData = JSON.parse(rentDataText);
      console.log('✅ Parsed rent data:', rentData);
      
      // Validate the structure
      if (!rentData.cityAverage || !rentData.neighborhoods || typeof rentData.neighborhoods !== 'object') {
        throw new Error('Invalid data structure from OpenAI');
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: rentData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      console.error('❌ Raw response was:', rentDataText);
      
      // Fallback: try to extract numbers from the response
      const numbers = rentDataText.match(/\d{3,4}/g);
      const cityAverage = numbers && numbers.length > 0 ? parseInt(numbers[0]) : 0;
      
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
