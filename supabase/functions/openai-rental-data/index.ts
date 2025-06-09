
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, bedrooms, bathrooms } = await req.json();
    
    console.log(`🤖 Fetching OpenAI rental data for ${city} - ${bedrooms}BR/${bathrooms}BA`);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a prompt that matches ChatGPT's approach for rental data
    const prompt = `Provide ONLY real rental rates for ${bedrooms}-bedroom, ${bathrooms}-bathroom apartments in ${city} as of the last 30 days. 

List 5-8 different neighborhoods with their current median rent prices. Format as JSON array with this exact structure:
[
  {"neighborhood": "Neighborhood Name", "rent": 3500, "address": "Neighborhood Name, ${city}"}
]

Requirements:
- Use ONLY real market data from the last 30 days
- NO estimates or approximations
- Include diverse price ranges across different neighborhoods
- Rent prices must be accurate current market rates
- Return ONLY the JSON array, no other text`;

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
            content: 'You are a real estate data analyst that provides only accurate, current rental market data. Never provide estimates or approximations. Only use real data from the last 30 days.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent data
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('🤖 OpenAI rental response:', aiResponse);
    
    // Parse the JSON response
    let rentals;
    try {
      // Clean the response in case there are markdown code blocks
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      rentals = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from OpenAI');
    }

    const processedData = {
      success: true,
      data: {
        city: city,
        rentals: rentals,
        source: 'OpenAI ChatGPT',
        dataDate: 'Last 30 days'
      }
    };

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 OpenAI Rental Data Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch real rental data from OpenAI'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
