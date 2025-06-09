
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
    
    const openAIApiKey = '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';
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🔑 OpenAI API key configured, making request...');

    // Enhanced prompt for better rental data
    const prompt = `You are a real estate market analyst. Provide current median rental rates for ${bedrooms}-bedroom, ${bathrooms}-bathroom apartments in ${city}.

Return exactly 8 neighborhoods with their typical monthly rent prices. Use this EXACT JSON format:
[
  {"neighborhood": "Downtown ${city}", "rent": 2800, "address": "Downtown ${city}, ${city}"},
  {"neighborhood": "Midtown", "rent": 2400, "address": "Midtown, ${city}"},
  {"neighborhood": "East Side", "rent": 2200, "address": "East Side, ${city}"},
  {"neighborhood": "West End", "rent": 2600, "address": "West End, ${city}"},
  {"neighborhood": "Uptown", "rent": 2900, "address": "Uptown, ${city}"},
  {"neighborhood": "South ${city}", "rent": 2100, "address": "South ${city}, ${city}"},
  {"neighborhood": "North ${city}", "rent": 2300, "address": "North ${city}, ${city}"},
  {"neighborhood": "Central ${city}", "rent": 2500, "address": "Central ${city}, ${city}"}
]

Requirements:
- Return ONLY the JSON array, no explanations
- Use realistic rent prices for ${city} market
- Include diverse neighborhoods across price ranges
- All rent values should be numbers (not strings)
- Each neighborhood must have a unique name`;

    console.log('📝 Sending request to OpenAI with prompt...');

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
            content: 'You are a real estate market analyst that provides rental market data. Always return valid JSON arrays with realistic rental rates.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    console.log('✅ OpenAI API response received');

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('🤖 Raw OpenAI response:', aiResponse);
    
    // Parse the JSON response
    let rentals;
    try {
      // Clean the response in case there are markdown code blocks
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      console.log('🧹 Cleaned response:', cleanedResponse);
      
      rentals = JSON.parse(cleanedResponse);
      
      // Validate that we have an array with the expected structure
      if (!Array.isArray(rentals) || rentals.length === 0) {
        throw new Error('Invalid data structure returned - not an array');
      }
      
      console.log(`📊 Parsed ${rentals.length} rental records`);
      
      // Validate each rental object
      rentals.forEach((rental, index) => {
        if (!rental.neighborhood || !rental.rent || !rental.address) {
          console.error(`❌ Invalid rental data at index ${index}:`, rental);
          throw new Error(`Invalid rental data at index ${index} - missing required fields`);
        }
        if (typeof rental.rent !== 'number') {
          console.error(`❌ Invalid rent type at index ${index}:`, typeof rental.rent);
          throw new Error(`Invalid rent type at index ${index} - must be number`);
        }
        console.log(`✅ Valid rental ${index}: ${rental.neighborhood} - $${rental.rent}`);
      });
      
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      console.error('Raw response that failed:', aiResponse);
      throw new Error(`Invalid response format from OpenAI: ${parseError.message}`);
    }

    const processedData = {
      success: true,
      data: {
        city: city,
        rentals: rentals,
        source: 'OpenAI ChatGPT',
        dataDate: new Date().toISOString(),
        bedrooms: bedrooms,
        bathrooms: bathrooms
      }
    };

    console.log('✅ Final processed data:', processedData);

    return new Response(JSON.stringify(processedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 OpenAI Rental Data Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch rental data from OpenAI ChatGPT'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
