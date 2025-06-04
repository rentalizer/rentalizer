
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
    
    // Check multiple possible environment variable names for the API key
    const mashvisorApiKey = Deno.env.get('MASHVISOR_API_KEY') || 
                           Deno.env.get('MASHVISOR_API') || 
                           Deno.env.get('AIRDNA_API_KEY')
    
    console.log('🔍 Available environment variables:', Object.keys(Deno.env.toObject()).filter(key => 
      key.toLowerCase().includes('api') || key.toLowerCase().includes('key')
    ))
    
    if (!mashvisorApiKey) {
      console.error('❌ MASHVISOR_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please set MASHVISOR_API_KEY in Supabase secrets.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔑 Using API key:', `${mashvisorApiKey.substring(0, 8)}...${mashvisorApiKey.substring(mashvisorApiKey.length - 4)}`)

    // Call Mashvisor API with proper parameters
    const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/airbnb-property/active-listings')
    
    // Add query parameters based on the API documentation
    if (city) mashvisorUrl.searchParams.append('city', city)
    if (propertyType) mashvisorUrl.searchParams.append('bedrooms', propertyType)
    if (bathrooms) mashvisorUrl.searchParams.append('bathrooms', bathrooms)
    mashvisorUrl.searchParams.append('state', 'CA') // Default to CA, you might want to make this dynamic
    
    console.log('📡 Calling Mashvisor API:', mashvisorUrl.toString())
    
    const mashvisorResponse = await fetch(mashvisorUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': mashvisorApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('📊 Mashvisor API Response status:', mashvisorResponse.status)
    console.log('📊 Mashvisor API Response headers:', Object.fromEntries(mashvisorResponse.headers.entries()))

    if (!mashvisorResponse.ok) {
      const errorText = await mashvisorResponse.text()
      console.error(`❌ Mashvisor API failed (${mashvisorResponse.status}):`, errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `Mashvisor API error: ${mashvisorResponse.status}`,
          details: errorText,
          url: mashvisorUrl.toString()
        }),
        { 
          status: mashvisorResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await mashvisorResponse.json()
    console.log('✅ Mashvisor API Success - Data keys:', Object.keys(data))
    console.log('✅ Raw response structure:', JSON.stringify(data, null, 2).substring(0, 1000))

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
