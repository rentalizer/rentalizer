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
const airdnaApiKey = Deno.env.get('AIRDNA_API_KEY');

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
    console.log(`AirDNA API key available: ${!!airdnaApiKey}`);

    // If no AirDNA API key, return no data available
    if (!airdnaApiKey) {
      console.log('No AirDNA API key available - returning no data');
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

    try {
      // Try to fetch real AirDNA data
      console.log(`Calling AirDNA API for ${city}...`);
      
      // Use the correct Rentalizer endpoint from your AirDNA dashboard
      const endpoint = `https://airdna1.p.rapidapi.com/rentalizer?address=${encodeURIComponent(city)}&bedrooms=${propertyType}&bathrooms=${bathrooms}&accommodate=2`;
      console.log(`Using AirDNA endpoint: ${endpoint}`);
      
      const airdnaResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': airdnaApiKey,
          'X-RapidAPI-Host': 'airdna1.p.rapidapi.com'
        }
      });

      console.log(`AirDNA API response status: ${airdnaResponse.status}`);

      if (!airdnaResponse.ok) {
        console.error(`AirDNA API error: ${airdnaResponse.status} ${airdnaResponse.statusText}`);
        const errorText = await airdnaResponse.text();
        console.error('AirDNA error response:', errorText);
        
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

      const airdnaData = await airdnaResponse.json();
      console.log('AirDNA data received:', JSON.stringify(airdnaData, null, 2));

      if (!airdnaData || !airdnaData.data || airdnaData.data.length === 0) {
        console.log('No AirDNA data available for this city');
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

      // Process AirDNA data to match our expected format
      const submarkets = [];
      
      if (airdnaData && airdnaData.data) {
        // Handle different AirDNA response formats
        const data = Array.isArray(airdnaData.data) ? airdnaData.data : [airdnaData.data];
        
        data.slice(0, 8).forEach((item: any, index: number) => {
          const submarket = {
            submarket: item.market_name || item.neighborhood || item.area || `${city} Area ${index + 1}`,
            strRevenue: Math.round(item.monthly_revenue || item.revenue || item.rental_income || 0),
            medianRent: Math.round(item.monthly_rent || item.rent || item.long_term_rent || 0),
            multiple: 0
          };
          
          // Calculate multiple if we have both values
          if (submarket.strRevenue > 0 && submarket.medianRent > 0) {
            submarket.multiple = Math.round((submarket.strRevenue / submarket.medianRent) * 100) / 100;
          }
          
          // Only include submarkets with valid data and good multiple
          if (submarket.strRevenue > 0 && submarket.medianRent > 0 && submarket.multiple >= 1.0) {
            submarkets.push(submarket);
          }
        });
      } else if (airdnaData && (airdnaData.monthly_revenue || airdnaData.revenue)) {
        // Handle single property response
        const submarket = {
          submarket: airdnaData.market_name || airdnaData.neighborhood || `${city} Market`,
          strRevenue: Math.round(airdnaData.monthly_revenue || airdnaData.revenue || 0),
          medianRent: Math.round(airdnaData.monthly_rent || airdnaData.rent || airdnaData.long_term_rent || 0),
          multiple: 0
        };
        
        if (submarket.strRevenue > 0 && submarket.medianRent > 0) {
          submarket.multiple = Math.round((submarket.strRevenue / submarket.medianRent) * 100) / 100;
          if (submarket.multiple >= 1.0) {
            submarkets.push(submarket);
          }
        }
      }

      console.log(`Processed ${submarkets.length} real submarkets from AirDNA`);

      if (submarkets.length === 0) {
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

      return new Response(
        JSON.stringify({
          submarkets: submarkets.sort((a: any, b: any) => b.multiple - a.multiple),
          city,
          propertyType,
          bathrooms,
          dataSource: 'airdna_real_data'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (apiError) {
      console.error('Error calling AirDNA API:', apiError);
      
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

  } catch (error) {
    console.error('Error in fetch-market-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Unable to process request',
        submarkets: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});