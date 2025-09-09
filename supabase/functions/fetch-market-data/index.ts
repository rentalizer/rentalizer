import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, propertyType = '2', bathrooms = '2' } = await req.json();

    if (!city || !city.trim()) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching market data for: ${city}, ${propertyType}BR/${bathrooms}BA`);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's API keys if authenticated
    const authHeader = req.headers.get('Authorization');
    let userApiKeys = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: apiKeys } = await supabase
          .from('user_api_keys')
          .select('airdna_api_key, rental_api_key')
          .eq('user_id', user.id)
          .single();
        
        userApiKeys = apiKeys;
      }
    }

    // Check if we have real API keys or valid OpenAI key
    const hasValidApiKeys = userApiKeys?.airdna_api_key || userApiKeys?.rental_api_key;
    const hasValidOpenAI = openaiApiKey && (openaiApiKey.startsWith('sk-') || openaiApiKey.startsWith('sk-proj-'));
    
    if (!hasValidApiKeys && !hasValidOpenAI) {
      console.log('No valid API keys available for real data');
      return new Response(
        JSON.stringify({ 
          error: 'No available data',
          message: 'Real market data requires valid API keys. Please configure your API keys or check your OpenAI configuration.',
          submarkets: []
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Try to fetch real data using available APIs
    if (hasValidApiKeys) {
      // TODO: Implement real API calls to AirDNA, RentSpree, etc.
      console.log('Real API keys available but not implemented yet');
    }

    // If we reach here, we only have OpenAI - try to get real neighborhoods
    const neighborhoods = await generateRealNeighborhoods(city);
    
    // If OpenAI failed to generate real neighborhoods, return no data
    if (!neighborhoods || neighborhoods.length === 0) {
      console.log('Failed to generate real neighborhoods');
      return new Response(
        JSON.stringify({ 
          error: 'No available data',
          message: 'Unable to fetch real market data for this city.',
          submarkets: []
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`No real market data available for ${city}`);

    return new Response(
      JSON.stringify({ 
        error: 'No available data',
        message: 'Real market data is not available for this city.',
        submarkets: []
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in fetch-market-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch market data',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateRealNeighborhoods(city: string): Promise<string[]> {
  console.log(`Attempting to generate neighborhoods for ${city}, OpenAI key available: ${!!openaiApiKey}`);
  
  if (!openaiApiKey || !(openaiApiKey.startsWith('sk-') || openaiApiKey.startsWith('sk-proj-'))) {
    console.log('No valid OpenAI API key available');
    return [];
  }

  try {
    console.log(`Making OpenAI API call for ${city} neighborhoods...`);
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
            content: 'You are a local real estate expert who knows actual neighborhood names. Provide 8 real, specific neighborhood names that exist in the given city. Return ONLY the neighborhood names, one per line, no numbers, bullets, or descriptions. Use actual neighborhood names that locals would recognize.'
          },
          {
            role: 'user',
            content: `List 8 real, actual neighborhood names in ${city} that are popular for short-term rentals. Include well-known districts, historic areas, and neighborhoods that tourists visit. Use the exact names locals use.`
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('OpenAI response received:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0]?.message?.content) {
      const neighborhoods = data.choices[0].message.content
        .trim()
        .split('\n')
        .map((name: string) => name.trim())
        .filter((name: string) => name.length > 0 && !name.match(/^\d+\./) && !name.includes('•'))
        .slice(0, 8);
      
      console.log(`Successfully generated ${neighborhoods.length} AI neighborhoods for ${city}:`, neighborhoods);
      
      if (neighborhoods.length >= 4) {
        return neighborhoods;
      }
    }
    
    console.log('OpenAI response insufficient');
    return [];
  } catch (error) {
    console.error('OpenAI API error:', error);
    return [];
  }
}

// Helper functions removed - no longer generating fake data