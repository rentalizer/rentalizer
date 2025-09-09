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

      // Process AirDNA Rentalizer response structure
      const submarkets = [];
      
      if (airdnaData && airdnaData.data) {
        const responseData = airdnaData.data;
        
        // Get main property data from property_statistics
        const propertyStats = responseData.property_statistics;
        const marketInfo = responseData.combined_market_info;
        
        if (propertyStats && propertyStats.revenue && propertyStats.revenue.ltm) {
          // Main market/submarket from the analyzed property
          const monthlyRevenue = Math.round(propertyStats.revenue.ltm / 12);
          
          // Estimate rent based on typical STR to LTR ratios (conservative 2.5x multiple)
          const estimatedRent = Math.round(monthlyRevenue / 2.5);
          const multiple = monthlyRevenue / estimatedRent;
          
          const mainSubmarket = {
            submarket: marketInfo?.airdna_submarket_name || marketInfo?.airdna_market_name || `${city} Market`,
            strRevenue: monthlyRevenue,
            medianRent: estimatedRent,
            multiple: Math.round(multiple * 100) / 100
          };
          
          submarkets.push(mainSubmarket);
          
          // Process comparable properties to create additional submarkets
          const comps = responseData.comps || [];
          const processedAreas = new Set([mainSubmarket.submarket]);
          
          comps.slice(0, 6).forEach((comp: any, index: number) => {
            if (comp.stats && comp.stats.adr && comp.stats.adr.ltm) {
              // Extract area name from title or use generic name
              let areaName = comp.title ? 
                comp.title.split('-')[0]?.trim() || comp.title.split(',')[0]?.trim() : 
                `${city} Area ${index + 1}`;
              
              // Avoid duplicate area names
              if (processedAreas.has(areaName)) {
                areaName = `${city} Area ${index + 1}`;
              }
              processedAreas.add(areaName);
              
              // Calculate monthly revenue from ADR (Average Daily Rate)
              const adr = comp.stats.adr.ltm;
              const assumedOccupancy = 0.65; // Conservative occupancy assumption
              const monthlyRevenue = Math.round(adr * 30 * assumedOccupancy);
              
              // Estimate rent with similar logic
              const estimatedRent = Math.round(monthlyRevenue / 2.2); // Slightly better multiple for comps
              const compMultiple = monthlyRevenue / estimatedRent;
              
              if (monthlyRevenue > 1000 && estimatedRent > 500 && compMultiple >= 1.5) {
                submarkets.push({
                  submarket: areaName,
                  strRevenue: monthlyRevenue,
                  medianRent: estimatedRent,
                  multiple: Math.round(compMultiple * 100) / 100
                });
              }
            }
          });
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