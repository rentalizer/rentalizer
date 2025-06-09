
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
    const { city, bedrooms, bathrooms, neighborhood } = await req.json();
    
    const searchLocation = neighborhood ? `${neighborhood}, ${city}` : city;
    console.log(`🤖 Fetching OpenAI rental data for ${searchLocation} - ${bedrooms}BR apartments`);
    
    const openAIApiKey = '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';
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🔑 OpenAI API key configured, making request...');

    // Enhanced prompt for specific neighborhood or city-wide search
    const prompt = neighborhood 
      ? `You are a real estate data analyst with access to current rental market data from public platforms like Zumper, Rentometer, and Rentcafe.com.

Task: Find the current MEDIAN monthly rent for ${bedrooms}-bedroom APARTMENTS ONLY in the ${neighborhood} neighborhood of ${city}.

Data Requirements:
- Pull the most recent data from public rental platforms (Zumper, Rentometer, Rentcafe.com)
- Return MEDIAN rent values only (not averages or ranges)
- Focus on APARTMENTS only (exclude houses, condos, townhomes)
- Based on user choice of ${bedrooms} bedrooms
- Use current market data (2024-2025)

Return exactly this JSON format for ${neighborhood}:
[
  {"neighborhood": "${neighborhood}", "rent": [median_rent_number], "address": "${neighborhood}, ${city}"}
]

Requirements:
- Return ONLY the JSON array, no explanations
- All rent values must be numbers (not strings)
- Use realistic MEDIAN apartment rents for ${bedrooms}BR units in ${neighborhood}, ${city}
- Base data on current market rates from public rental platforms`
      : `You are a real estate data analyst with access to current rental market data from public platforms like Zumper, Rentometer, and Rentcafe.com.

Task: Find the current MEDIAN monthly rent for ${bedrooms}-bedroom APARTMENTS ONLY in ${city}.

Data Requirements:
- Pull the most recent data from public rental platforms (Zumper, Rentometer, Rentcafe.com)
- Return MEDIAN rent values only (not averages or ranges)
- Focus on APARTMENTS only (exclude houses, condos, townhomes)
- Based on user choice of ${bedrooms} bedrooms
- Provide data for exactly 8 different neighborhoods in ${city}
- Use current market data (2024-2025)

Return exactly this JSON format with 8 neighborhoods:
[
  {"neighborhood": "Downtown ${city}", "rent": [median_rent_number], "address": "Downtown ${city}, ${city}"},
  {"neighborhood": "Midtown", "rent": [median_rent_number], "address": "Midtown, ${city}"},
  {"neighborhood": "East Side", "rent": [median_rent_number], "address": "East Side, ${city}"},
  {"neighborhood": "West End", "rent": [median_rent_number], "address": "West End, ${city}"},
  {"neighborhood": "Uptown", "rent": [median_rent_number], "address": "Uptown, ${city}"},
  {"neighborhood": "South ${city}", "rent": [median_rent_number], "address": "South ${city}, ${city}"},
  {"neighborhood": "North ${city}", "rent": [median_rent_number], "address": "North ${city}, ${city}"},
  {"neighborhood": "Central ${city}", "rent": [median_rent_number], "address": "Central ${city}, ${city}"}
]

Requirements:
- Return ONLY the JSON array, no explanations
- All rent values must be numbers (not strings)
- Use realistic MEDIAN apartment rents for ${bedrooms}BR units in ${city}
- Base data on current market rates from public rental platforms`;

    console.log('📝 Sending enhanced request to OpenAI...');

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
            content: 'You are a real estate market analyst that provides current median rental data from public platforms like Zumper, Rentometer, and Rentcafe.com. Always return accurate median rent values for apartments only, formatted as valid JSON arrays.' 
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
        console.log(`✅ Valid rental ${index}: ${rental.neighborhood} - $${rental.rent} (median)`);
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
        neighborhood: neighborhood || null,
        rentals: rentals,
        source: 'OpenAI ChatGPT - Public Rental Platforms',
        dataDate: new Date().toISOString(),
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        dataType: 'Median Apartment Rents'
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
      message: 'Failed to fetch median apartment rental data from public platforms'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
