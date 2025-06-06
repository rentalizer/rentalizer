
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
    
    // Use your provided AirDNA API key
    const airdnaApiKey = '563ec2eceemshee4a0b6d8e03f721b10e5cien566818f3fc3'
    
    console.log('🔑 Using AirDNA API key for market data...')

    try {
      // Call AirDNA market data endpoint
      const airdnaUrl = `https://api.airdna.co/v1/market/property_type_performance`
      
      const requestBody = {
        location: city,
        property_types: [`${propertyType}br`],
        start_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year ago
        end_date: new Date().toISOString().split('T')[0]
      }

      console.log(`📡 Calling AirDNA Market API: ${airdnaUrl}`)
      console.log(`📝 Request body:`, requestBody)
      
      const airdnaResponse = await fetch(airdnaUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airdnaApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (airdnaResponse.ok) {
        const airdnaData = await airdnaResponse.json()
        console.log(`✅ AirDNA Market API response received for ${city}`)
        
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              city: city,
              propertyType: propertyType,
              bathrooms: bathrooms,
              marketData: airdnaData,
              source: 'airdna_market_api'
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        const errorText = await airdnaResponse.text()
        console.error(`⚠️ AirDNA Market API error: ${airdnaResponse.status} - ${errorText}`)
        
        // Fallback to property search if market API fails
        const searchUrl = `https://api.airdna.co/v1/market/property_search`
        const searchBody = {
          location: city,
          bedrooms: parseInt(propertyType),
          bathrooms: parseInt(bathrooms),
          limit: 100
        }
        
        console.log(`🔄 Trying property search fallback: ${searchUrl}`)
        
        const searchResponse = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airdnaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchBody)
        })
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          console.log(`✅ AirDNA Property Search response received for ${city}`)
          
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                city: city,
                propertyType: propertyType,
                bathrooms: bathrooms,
                properties: searchData.results || searchData.data || searchData,
                source: 'airdna_property_search'
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        } else {
          const searchErrorText = await searchResponse.text()
          console.error(`❌ AirDNA Property Search error: ${searchResponse.status} - ${searchErrorText}`)
          
          return new Response(
            JSON.stringify({
              success: false,
              data: {
                city: city,
                propertyType: propertyType,
                bathrooms: bathrooms,
                message: `AirDNA API error: ${airdnaResponse.status}`,
                error: errorText,
                searchError: searchErrorText
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
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
