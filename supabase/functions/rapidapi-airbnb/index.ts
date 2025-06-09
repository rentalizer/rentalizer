
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
    const { city, propertyType, action } = await req.json();
    
    console.log(`🚀 Processing RapidAPI Airbnb request for ${city}`);
    
    // Updated to use the correct API host that you're subscribed to
    const rapidApiKey = '563ec2eceemshee4eb6d8e03f721p1oe15cjsn5666181f3c3';
    const rapidApiHost = 'airbnb-api5.p.rapidapi.com';
    
    try {
      console.log(`📡 Making API call to: https://${rapidApiHost}`);
      console.log(`🔑 Using API key: ${rapidApiKey.substring(0, 8)}...`);
      
      // Try the main search endpoint with proper URL parameter
      const searchUrl = `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes`;
      const response = await fetch(`https://${rapidApiHost}/search`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: searchUrl,
          limit: 20
        })
      });

      console.log(`📊 API Response Status: ${response.status}`);
      console.log(`📊 API Response Headers:`, Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const apiData = await response.json();
        console.log(`✅ Real API Response Data:`, JSON.stringify(apiData, null, 2));
        
        // Process the real API response from airbnb-api5
        const processedData = {
          success: true,
          data: {
            city: city,
            properties: apiData.results || apiData.data || apiData.listings || apiData.properties || []
          }
        };
        
        return new Response(JSON.stringify(processedData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        const errorText = await response.text();
        console.error(`❌ RapidAPI Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Try alternative GET endpoint if POST fails
        console.log(`🔄 Trying alternative GET endpoint...`);
        
        const altResponse = await fetch(`https://${rapidApiHost}/listings?location=${encodeURIComponent(city)}&limit=20`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': rapidApiHost,
            'Accept': 'application/json'
          }
        });
        
        console.log(`📊 Alternative API Response Status: ${altResponse.status}`);
        
        if (altResponse.ok) {
          const altApiData = await altResponse.json();
          console.log(`✅ Alternative API Response:`, JSON.stringify(altApiData, null, 2));
          
          const processedData = {
            success: true,
            data: {
              city: city,
              properties: altApiData.results || altApiData.data || altApiData.listings || []
            }
          };
          
          return new Response(JSON.stringify(processedData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        throw new Error(`Both API calls failed: ${response.status} and ${altResponse.status}`);
      }
    } catch (apiError) {
      console.error('❌ RapidAPI Error Details:', apiError);
      console.warn('⚠️ API failed - returning NA data structure');
      
      // Return NA data structure when APIs fail
      const naData = {
        success: false,
        data: {
          city: city,
          properties: [
            {
              id: "na-1",
              name: "No Data Available",
              location: `${city}`,
              price: 0,
              monthly_revenue: 0,
              occupancy_rate: 0,
              rating: 0,
              reviews: 0,
              neighborhood: "API Failed"
            }
          ]
        }
      };

      return new Response(JSON.stringify(naData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('💥 Edge Function Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
