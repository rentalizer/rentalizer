import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const airdnaApiKey = Deno.env.get('AIRDNA_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`Testing AirDNA API key: ${airdnaApiKey ? 'Present' : 'Missing'}`);

    if (!airdnaApiKey) {
      return new Response(
        JSON.stringify({ error: 'No AirDNA API key found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test different AirDNA endpoints to see which ones work
    const testEndpoints = [
      'https://airdna1.p.rapidapi.com/locations',
      'https://airdna1.p.rapidapi.com/markets',
      'https://airdna1.p.rapidapi.com/suggest_market?query=san+diego',
      'https://airdna1.p.rapidapi.com/property_search?city=san+diego',
      'https://airdna1.p.rapidapi.com/market_data?location=san+diego',
      'https://airdna1.p.rapidapi.com/rentalizer?location=san+diego'
    ];

    const results = [];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': airdnaApiKey,
            'X-RapidAPI-Host': 'airdna1.p.rapidapi.com'
          }
        });

        const responseText = await response.text();
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          response: responseText.length > 500 ? responseText.substring(0, 500) + '...' : responseText
        });

        console.log(`${endpoint}: ${response.status} - ${responseText.substring(0, 100)}`);

      } catch (error) {
        results.push({
          endpoint,
          error: error.message
        });
        console.error(`Error testing ${endpoint}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'AirDNA API endpoints tested',
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in test function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});