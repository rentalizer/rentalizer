
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
    const { state, propertyType, bathrooms } = await req.json()
    
    console.log(`🔍 Mashvisor Edge Function called for ${state} state (${propertyType}BR/${bathrooms}BA)`)
    
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

    // Use the rento-calculator lookup endpoint for state-level data
    const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/rento-calculator/lookup')
    
    // Add parameters for state-level lookup
    mashvisorUrl.searchParams.append('state', state)
    mashvisorUrl.searchParams.append('resource', 'airbnb')
    mashvisorUrl.searchParams.append('beds', propertyType)
    
    console.log('📡 Calling Mashvisor rento-calculator/lookup API:', mashvisorUrl.toString())
    
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
      
      const stateNames = {
        'CA': 'California',
        'FL': 'Florida', 
        'TX': 'Texas',
        'NY': 'New York',
        'CO': 'Colorado',
        'WA': 'Washington',
        'OR': 'Oregon',
        'AZ': 'Arizona',
        'NV': 'Nevada',
        'TN': 'Tennessee'
      }
      
      const stateName = stateNames[state as keyof typeof stateNames] || state
      
      const fallbackData = {
        success: true,
        data: {
          fallback: true,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: 'Mashvisor API temporarily unavailable. Showing sample data.',
          comps: [
            {
              area: `${stateName} Metro Areas`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3500,
              long_term_rent: Math.floor(Math.random() * 500) + 2000,
            },
            {
              area: `${stateName} Urban Centers`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3200,
              long_term_rent: Math.floor(Math.random() * 500) + 1900,
            },
            {
              area: `${stateName} Suburban Areas`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 3800,
              long_term_rent: Math.floor(Math.random() * 500) + 2100,
            },
            {
              area: `${stateName} Tourist Districts`,
              airbnb_revenue: Math.floor(Math.random() * 1000) + 4200,
              long_term_rent: Math.floor(Math.random() * 500) + 2300,
            },
            {
              area: `${stateName} Emerging Markets`,
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
    console.log('✅ Mashvisor rento-calculator/lookup API Success')
    console.log('📋 Response Data Structure:', {
      status: data.status,
      hasContent: !!data.content,
      contentKeys: data.content ? Object.keys(data.content) : [],
      medianRentalIncome: data.content?.median_rental_income,
      adjustedRentalIncome: data.content?.adjusted_rental_income,
      medianNightRate: data.content?.median_night_rate,
      occupancyRate: data.content?.median_occupancy_rate,
      sampleSize: data.content?.sample_size,
      state: data.content?.market?.state || data.content?.state
    })

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    // Return fallback data on any error
    const { state = 'Unknown State', propertyType = '2', bathrooms = '2' } = await req.json().catch(() => ({}))
    
    const fallbackData = {
      success: true,
      data: {
        fallback: true,
        state: state,
        propertyType: propertyType,
        bathrooms: bathrooms,
        message: 'Service temporarily unavailable. Showing sample data.',
        comps: [
          {
            area: `${state} Sample Area 1`,
            airbnb_revenue: Math.floor(Math.random() * 1000) + 3500,
            long_term_rent: Math.floor(Math.random() * 500) + 2000,
          },
          {
            area: `${state} Sample Area 2`,
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
