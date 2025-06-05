
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, propertyType, bathrooms } = await req.json()
    
    console.log(`🔍 AirDNA API call for ${city} (${propertyType}BR/${bathrooms}BA)`)
    
    // Check for RapidAPI key - now using the correct key
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY') || '563ec2cceemshee4eb6d8e03f721p10e5cjsn566618f8f3c3'
    
    if (!rapidApiKey) {
      console.error('❌ RAPIDAPI_KEY not found in environment')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'RapidAPI key not configured. Please set RAPIDAPI_KEY in Supabase secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔑 RapidAPI key found, calling AirDNA API...')

    try {
      // Call the actual AirDNA API via RapidAPI
      const airdnaUrl = `https://airdna2.p.rapidapi.com/properties`
      
      const searchParams = new URLSearchParams({
        location: city,
        bedrooms: propertyType,
        bathrooms: bathrooms,
        limit: '50'
      })

      console.log(`📡 Calling AirDNA API: ${airdnaUrl}?${searchParams}`)
      
      const airdnaResponse = await fetch(`${airdnaUrl}?${searchParams}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'airdna2.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      })

      if (airdnaResponse.ok) {
        const airdnaData = await airdnaResponse.json()
        console.log(`✅ AirDNA API response received for ${city}`)
        
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              city: city,
              propertyType: propertyType,
              bathrooms: bathrooms,
              properties: airdnaData.results || airdnaData.data || airdnaData,
              total: airdnaData.total || 0
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        const errorText = await airdnaResponse.text()
        console.error(`⚠️ AirDNA API error: ${airdnaResponse.status} - ${errorText}`)
        
        return new Response(
          JSON.stringify({
            success: false,
            data: {
              city: city,
              propertyType: propertyType,
              bathrooms: bathrooms,
              message: `AirDNA API error: ${airdnaResponse.status}`,
              error: errorText
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } catch (apiError) {
      console.error(`❌ Error calling AirDNA API:`, apiError)
      
      return new Response(
        JSON.stringify({
          success: false,
          data: {
            city: city,
            propertyType: propertyType,
            bathrooms: bathrooms,
            message: 'Failed to connect to AirDNA API',
            error: apiError.message
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        data: {
          message: 'Service temporarily unavailable',
          error: error.message
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
