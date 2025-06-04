
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
    
    console.log(`🔍 Mashvisor Edge Function called for ${city} (${propertyType}BR/${bathrooms}BA)`)
    
    // Check for Mashvisor API key
    const mashvisorApiKey = Deno.env.get('MASHVISOR_API_KEY')
    
    if (!mashvisorApiKey) {
      console.error('❌ MASHVISOR_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Mashvisor API key not configured. Please set MASHVISOR_API_KEY in Supabase secrets.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔑 Using Mashvisor API key:', `${mashvisorApiKey.substring(0, 8)}...${mashvisorApiKey.substring(mashvisorApiKey.length - 4)}`)
    console.log(`📍 Analyzing specific city: ${city}`)

    try {
      // Use the rento-calculator lookup endpoint with just city parameter
      const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/rento-calculator/lookup')
      
      mashvisorUrl.searchParams.append('city', city)
      mashvisorUrl.searchParams.append('resource', 'airbnb')
      mashvisorUrl.searchParams.append('beds', propertyType)
      
      console.log(`📡 Calling Mashvisor for ${city}:`, mashvisorUrl.toString())
      
      const mashvisorResponse = await fetch(mashvisorUrl.toString(), {
        method: 'GET',
        headers: {
          'x-api-key': mashvisorApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (mashvisorResponse.ok) {
        const cityData = await mashvisorResponse.json()
        console.log(`✅ Successfully fetched data for ${city}`)
        
        // Return successful result for single city
        const successData = {
          success: true,
          data: {
            city: city,
            propertyType: propertyType,
            bathrooms: bathrooms,
            ...cityData
          }
        }

        return new Response(
          JSON.stringify(successData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        const errorText = await mashvisorResponse.text()
        console.log(`⚠️ Failed to fetch data for ${city}: ${mashvisorResponse.status} - ${errorText.substring(0, 100)}`)
        
        // Return fallback data
        const fallbackData = {
          success: false,
          data: {
            city: city,
            propertyType: propertyType,
            bathrooms: bathrooms,
            message: `Mashvisor API error: ${mashvisorResponse.status}`,
            content: {}
          }
        }

        return new Response(
          JSON.stringify(fallbackData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } catch (error) {
      console.log(`⚠️ Error fetching data for ${city}:`, error)
      
      const fallbackData = {
        success: false,
        data: {
          city: city,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: 'API request failed',
          content: {}
        }
      }

      return new Response(
        JSON.stringify(fallbackData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    const fallbackData = {
      success: false,
      data: {
        fallback: true,
        message: 'Service temporarily unavailable.',
        content: {}
      }
    }

    return new Response(
      JSON.stringify(fallbackData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
