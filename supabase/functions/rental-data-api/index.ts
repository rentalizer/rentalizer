
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
    const { city, bedrooms, bathrooms, action } = await req.json();
    
    console.log(`🏠 Processing rental data request for ${city} - ${bedrooms}BR/${bathrooms}BA`);
    
    // Try multiple rental APIs to get real data
    const rapidApiKey = '563ec2eceemshee4eb6d8e03f721p1oe15cjsn5666181f3c3';
    
    try {
      // Try RentSpider API first
      console.log(`📡 Trying RentSpider API for ${city}`);
      
      const rentSpiderResponse = await fetch(`https://rentspider-com.p.rapidapi.com/rentals`, {
        method: 'POST',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'rentspider-com.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: city,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          limit: 20
        })
      });

      if (rentSpiderResponse.ok) {
        const rentData = await rentSpiderResponse.json();
        console.log(`✅ RentSpider data:`, rentData);
        
        const processedRentals = {
          success: true,
          data: {
            city: city,
            rentals: rentData.listings || rentData.results || rentData.data || []
          }
        };
        
        return new Response(JSON.stringify(processedRentals), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Try alternative rental API
      console.log(`📡 Trying Apartments.com API for ${city}`);
      
      const apartmentsResponse = await fetch(`https://apartments-com-api.p.rapidapi.com/search`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'apartments-com-api.p.rapidapi.com',
        },
        body: JSON.stringify({
          location: city,
          bedrooms: bedrooms,
          bathrooms: bathrooms
        })
      });

      if (apartmentsResponse.ok) {
        const apartmentData = await apartmentsResponse.json();
        console.log(`✅ Apartments.com data:`, apartmentData);
        
        const processedApartments = {
          success: true,
          data: {
            city: city,
            rentals: apartmentData.properties || apartmentData.listings || []
          }
        };
        
        return new Response(JSON.stringify(processedApartments), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

    } catch (apiError) {
      console.error('❌ All rental APIs failed:', apiError);
    }

    // If all real APIs fail, return empty data (no fake data)
    console.warn('⚠️ No real rental data available - returning empty results');
    
    const emptyData = {
      success: false,
      data: {
        city: city,
        rentals: [],
        message: "No real rental data available for this market"
      }
    };

    return new Response(JSON.stringify(emptyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Rental API Edge Function Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
