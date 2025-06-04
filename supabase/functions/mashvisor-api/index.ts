
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

    // Use the rento-calculator list-comps endpoint
    const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/rento-calculator/list-comps')
    
    // Add filters for property type and location
    mashvisorUrl.searchParams.append('bedrooms', propertyType)
    mashvisorUrl.searchParams.append('bathrooms', bathrooms)
    mashvisorUrl.searchParams.append('state', 'CA') // Default to CA, can be made dynamic later
    mashvisorUrl.searchParams.append('city', city.toLowerCase())
    
    console.log('📡 Calling Mashvisor rento-calculator/list-comps API:', mashvisorUrl.toString())
    
    const mashvisorResponse = await fetch(mashvisorUrl.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': mashvisorApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log('📊 Mashvisor API Response status:', mashvisorResponse.status)

    if (!mashvisorResponse.ok) {
      const errorText = await mashvisorResponse.text()
      console.error(`❌ Mashvisor API failed (${mashvisorResponse.status}):`, errorText.substring(0, 200))
      
      // Return fallback data when Mashvisor API is down
      console.log('🔄 Mashvisor API unavailable, returning fallback data')
      
      const fallbackData = {
        success: true,
        data: {
          fallback: true,
          city: city,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: 'Mashvisor API temporarily unavailable. Showing sample data.',
          comps: [
            {
              address: `${city} Downtown`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3500,
              long_term_rent: Math.floor(Math.random() * 500) + 2000,
            },
            {
              address: `${city} Midtown`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3200,
              long_term_rent: Math.floor(Math.random() * 500) + 1900,
            },
            {
              address: `${city} Uptown`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3800,
              long_term_rent: Math.floor(Math.random() * 500) + 2100,
            },
            {
              address: `${city} Waterfront`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 4200,
              long_term_rent: Math.floor(Math.random() * 500) + 2300,
            },
            {
              address: `${city} Historic District`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3600,
              long_term_rent: Math.floor(Math.random() * 500) + 2000,
            }
          ]
        }
      }

      return new Response(
        JSON.stringify(fallbackData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await mashvisorResponse.json()
    console.log('✅ Mashvisor rento-calculator/list-comps API Success - Data keys:', Object.keys(data))

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    // Return fallback data on any error
    const { city = 'Unknown City', propertyType = '2', bathrooms = '2' } = await req.json().catch(() => ({}))
    
    const fallbackData = {
      success: true,
      data: {
        fallback: true,
        city: city,
        propertyType: propertyType,
        bathrooms: bathrooms,
        message: 'Service temporarily unavailable. Showing sample data.',
        comps: [
          {
            address: `${city} Sample Area 1`,
            airbnb_revenue: Math.floor(Math.random() * 1000) + 3500,
            long_term_rent: Math.floor(Math.random() * 500) + 2000,
          },
          {
            address: `${city} Sample Area 2`,
            airbnb_revenue: Math.floor(Math.random() * 1000) + 3200,
            long_term_rent: Math.floor(Math.random() * 500) + 1900,
          }
        ]
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
