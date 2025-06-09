
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
    const prompt = `You are a real estate data analyst. Provide ONLY accurate rental rates for ${bedrooms}-bedroom, ${bathrooms}-bathroom apartments in ${city} as of the LAST 30 DAYS ONLY.

List 8-10 different neighborhoods with their current median rent prices. Format as JSON array with this exact structure:
[
  {"neighborhood": "Neighborhood Name", "rent": 3600, "address": "Neighborhood Name, ${city}"}
]

CRITICAL REQUIREMENTS:
- Use ONLY real market data from the LAST 30 DAYS
- NO estimates, approximations, or old data
- Include diverse neighborhoods across different price ranges
- Rent prices must be accurate current market rates for ${bedrooms}BR/${bathrooms}BA units
- Return ONLY the JSON array, no other text or explanations
- Data must be from December 2024 to January 2025 timeframe`;

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
            content: 'You are a real estate data analyst that provides only accurate, current rental market data from the last 30 days. Never provide estimates or approximations. Only use real data from December 2024 to January 2025.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent data
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
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
      
      // Validate that we have an array with the expected structure
      if (!Array.isArray(rentals) || rentals.length === 0) {
        throw new Error('Invalid data structure returned');
      }
      
      // Validate each rental object
      rentals.forEach((rental, index) => {
        if (!rental.neighborhood || !rental.rent || !rental.address) {
          throw new Error(`Invalid rental data at index ${index}`);
        }
      });
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', aiResponse);
      throw new Error('Invalid response format from OpenAI');
    }

    const processedData = {
      success: true,
      data: {
        city: city,
        rentals: rentals,
        source: 'OpenAI ChatGPT',
        dataDate: 'Last 30 days (Dec 2024 - Jan 2025)',
        bedrooms: bedrooms,
        bathrooms: bathrooms
      }
    };

    console.log('✅ Processed rental data:', processedData);

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 OpenAI Rental Data Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch real rental data from OpenAI ChatGPT'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
