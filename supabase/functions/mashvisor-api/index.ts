
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

    // Use the neighborhoods endpoint which is better for state-level data
    const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/neighborhoods')
    
    // Add parameters for state-level lookup
    mashvisorUrl.searchParams.append('state', state)
    mashvisorUrl.searchParams.append('investment_type', 'airbnb')
    
    console.log('📡 Calling Mashvisor neighborhoods API:', mashvisorUrl.toString())
    
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
      console.log('🔄 Mashvisor API unavailable, returning no data message')
      
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
        success: false,
        data: {
          fallback: true,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: `No Mashvisor data available for ${stateName}. API returned: ${mashvisorResponse.status}`,
          content: null
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
    console.log('✅ Mashvisor neighborhoods API Success')
    console.log('📋 Response Data Structure:', {
      status: data.status,
      hasContent: !!data.content,
      neighborhoods: data.content?.neighborhoods?.length || 0,
      sampleNeighborhood: data.content?.neighborhoods?.[0] || null
    })

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    const fallbackData = {
      success: false,
      data: {
        fallback: true,
        message: 'Service temporarily unavailable.',
        content: null
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
