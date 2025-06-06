
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
    const { city, propertyType, bathrooms, listingId, action = 'market_search' } = await req.json()
    
    console.log(`🔍 AirDNA API call - Action: ${action}`)
    
    // Use your provided AirDNA API key
    const airdnaApiKey = '563ec2eceemshee4a0b6d8e03f721b10e5cien566818f3fc3'
    
    console.log('🔑 Using AirDNA API key for data...')

    try {
      // Handle comps request for specific listing
      if (action === 'get_comps' && listingId) {
        console.log(`🏠 Fetching comps for listing: ${listingId}`)
        
        const compsUrl = `https://api.airdna.co/api/enterprise/v2/listing/${listingId}/comps`
        
        const compsResponse = await fetch(compsUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airdnaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagination: { page_size: 10, offset: 0 },
            currency: 'usd'
          })
        })

        if (compsResponse.ok) {
          const compsData = await compsResponse.json()
          console.log(`✅ AirDNA Comps API response received for listing ${listingId}`)
          
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                listingId: listingId,
                comps: compsData,
                source: 'airdna_comps_api'
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        } else {
          const errorText = await compsResponse.text()
          console.error(`❌ AirDNA Comps API error: ${compsResponse.status} - ${errorText}`)
          
          return new Response(
            JSON.stringify({
              success: false,
              data: {
                listingId: listingId,
                message: `AirDNA Comps API error: ${compsResponse.status}`,
                error: errorText
              }
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      }

      // Original market data search logic
      console.log(`🔍 AirDNA market search for ${city} (${propertyType}BR/${bathrooms}BA)`)
      
      // Try property search to get listing IDs first
      const searchUrl = `https://api.airdna.co/v1/market/property_search`
      const searchBody = {
        location: city,
        bedrooms: parseInt(propertyType),
        bathrooms: parseInt(bathrooms),
        limit: 50
      }
      
      console.log(`🔄 Trying property search: ${searchUrl}`)
      
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
        
        // Extract listing IDs for potential comps lookup
        const listings = searchData.results || searchData.data || searchData
        const listingIds = Array.isArray(listings) 
          ? listings.slice(0, 5).map((listing: any) => listing.listing_id || listing.id).filter(Boolean)
          : []
        
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              city: city,
              propertyType: propertyType,
              bathrooms: bathrooms,
              properties: listings,
              listingIds: listingIds, // Include listing IDs for comps lookup
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
              message: `AirDNA API error: ${searchResponse.status}`,
              error: searchErrorText
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
