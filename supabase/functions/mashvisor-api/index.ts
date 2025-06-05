
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to make API calls with proper error handling and validation
async function callMashvisorAPI(url: string, apiKey: string, description: string) {
  console.log(`📡 Calling ${description}:`, url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    console.log(`📊 ${description} response status: ${response.status}`)

    if (response.ok) {
      const data = await response.json()
      
      // Validate the response structure
      if (data && (data.status === 'success' || data.success)) {
        console.log(`✅ ${description} successful with valid data`)
        return { success: true, data }
      } else {
        console.log(`⚠️ ${description} returned unsuccessful status:`, data?.status || 'unknown')
        return { success: false, data }
      }
    } else {
      const errorText = await response.text()
      console.log(`⚠️ ${description} failed: ${response.status} - ${errorText.substring(0, 200)}`)
      return { success: false, status: response.status, error: errorText }
    }
  } catch (error) {
    console.log(`❌ ${description} error:`, error)
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, propertyType, bathrooms, comprehensiveNeighborhoods } = await req.json()
    
    console.log(`🔍 Mashvisor API called for ${city} (${propertyType}BR/${bathrooms}BA)${comprehensiveNeighborhoods ? ' - Comprehensive mode' : ''}`)
    
    // Check for Mashvisor API key
    const mashvisorApiKey = Deno.env.get('MASHVISOR_API_KEY')
    
    if (!mashvisorApiKey) {
      console.error('❌ MASHVISOR_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Mashvisor API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔑 Using Mashvisor API key:', `${mashvisorApiKey.substring(0, 8)}...${mashvisorApiKey.substring(mashvisorApiKey.length - 4)}`)
    
    // Comprehensive state mapping
    const cityToStateMap: { [key: string]: string } = {
      // Major cities with comprehensive mapping
      'austin': 'TX', 'houston': 'TX', 'dallas': 'TX', 'san antonio': 'TX', 'fort worth': 'TX',
      'los angeles': 'CA', 'san francisco': 'CA', 'san diego': 'CA', 'san jose': 'CA', 'sacramento': 'CA',
      'new york': 'NY', 'brooklyn': 'NY', 'queens': 'NY', 'manhattan': 'NY', 'buffalo': 'NY',
      'miami': 'FL', 'orlando': 'FL', 'tampa': 'FL', 'jacksonville': 'FL', 'fort lauderdale': 'FL',
      'chicago': 'IL', 'aurora': 'IL', 'rockford': 'IL', 'joliet': 'IL', 'naperville': 'IL',
      'phoenix': 'AZ', 'tucson': 'AZ', 'mesa': 'AZ', 'chandler': 'AZ', 'scottsdale': 'AZ',
      'philadelphia': 'PA', 'pittsburgh': 'PA', 'allentown': 'PA', 'erie': 'PA',
      'atlanta': 'GA', 'augusta': 'GA', 'columbus': 'GA', 'savannah': 'GA',
      'denver': 'CO', 'colorado springs': 'CO', 'aurora': 'CO', 'fort collins': 'CO',
      'seattle': 'WA', 'spokane': 'WA', 'tacoma': 'WA', 'vancouver': 'WA',
      'las vegas': 'NV', 'henderson': 'NV', 'reno': 'NV',
      'portland': 'OR', 'salem': 'OR', 'eugene': 'OR',
      'boston': 'MA', 'worcester': 'MA', 'springfield': 'MA',
      'nashville': 'TN', 'memphis': 'TN', 'knoxville': 'TN',
      'charlotte': 'NC', 'raleigh': 'NC', 'greensboro': 'NC'
    };

    const cityKey = city.toLowerCase().trim()
    const state = cityToStateMap[cityKey]
    
    if (!state) {
      console.log(`⚠️ State not found for city: ${city}`)
      return new Response(
        JSON.stringify({
          success: false,
          data: {
            city: city,
            message: `City '${city}' not found in our database. Please try a major US city.`
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`📍 Found state ${state} for city ${city}`)

    const allNeighborhoods = []
    
    if (comprehensiveNeighborhoods) {
      console.log(`🏘️ Starting comprehensive neighborhood search for ${city}, ${state}`)
      
      // Enhanced zip code data for major cities
      const cityZipCodes: { [key: string]: string[] } = {
        'austin': [
          '78701', '78702', '78703', '78704', '78705', '78712', '78717', '78721', '78722', '78723',
          '78724', '78725', '78726', '78727', '78728', '78729', '78730', '78731', '78732', '78733',
          '78734', '78735', '78736', '78737', '78738', '78739', '78741', '78742', '78744', '78745',
          '78746', '78747', '78748', '78749', '78750', '78751', '78752', '78753', '78754', '78756',
          '78757', '78758', '78759'
        ],
        'houston': [
          '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77019', '77024', '77025',
          '77027', '77030', '77035', '77056', '77057', '77063', '77077', '77079', '77098', '77054',
          '77081', '77092', '77096', '77401', '77429', '77433', '77449', '77459', '77478', '77494'
        ],
        'dallas': [
          '75201', '75202', '75204', '75205', '75206', '75214', '75218', '75219', '75225', '75230',
          '75240', '75207', '75208', '75209', '75220', '75231', '75235', '75390', '75243', '75248'
        ],
        'miami': [
          '33101', '33109', '33114', '33125', '33129', '33130', '33131', '33132', '33134', '33139',
          '33140', '33141', '33142', '33143', '33144', '33145', '33146', '33147', '33149', '33150'
        ]
      };

      const zipCodes = cityZipCodes[cityKey] || []
      
      if (zipCodes.length > 0) {
        console.log(`🏘️ Processing ${zipCodes.length} zip codes for ${city}`)
        
        for (const zipCode of zipCodes) {
          try {
            const zipLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}`
            
            const zipResult = await callMashvisorAPI(zipLookupUrl, mashvisorApiKey, `Zip ${zipCode} lookup`)
            
            if (zipResult.success && zipResult.data?.content) {
              console.log(`✅ Zip ${zipCode} lookup successful`)
              
              const content = zipResult.data.content
              
              // Only include areas with meaningful data
              const hasValidData = (
                content.median_night_rate > 0 || 
                content.revpar > 0 || 
                content.median_rental_income > 0
              )
              
              if (hasValidData) {
                allNeighborhoods.push({
                  name: `${city} - Zip ${zipCode}`,
                  neighborhood: `${city} - Zip ${zipCode}`,
                  area: `Zip ${zipCode}`,
                  city: city,
                  state: state,
                  zipCode: zipCode,
                  median_night_rate: content.median_night_rate || 0,
                  median_occupancy_rate: content.median_occupancy_rate || 0,
                  revpar: content.revpar || content.revpan || 0,
                  rental_income: content.median_rental_income || content.adjusted_rental_income || 0,
                  sample_size: content.sample_size || 0
                })
              }
            }
            
            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 100))
            
          } catch (error) {
            console.log(`⚠️ Error processing zip ${zipCode}:`, error)
            continue
          }
        }
      }
    }
    
    // If comprehensive search found data, return it
    if (allNeighborhoods.length > 0) {
      console.log(`📊 Comprehensive search complete: Found ${allNeighborhoods.length} neighborhoods with valid data`)
      
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            source: 'comprehensive-neighborhoods',
            city: city,
            state: state,
            allNeighborhoods: allNeighborhoods,
            count: allNeighborhoods.length
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Fallback to city-level lookup
    console.log(`🏙️ Falling back to city-level lookup for: ${city}, ${state}`)
    
    const cityLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=airbnb&beds=${propertyType}`
    
    const cityResult = await callMashvisorAPI(cityLookupUrl, mashvisorApiKey, `City lookup for ${city}`)
    
    if (cityResult.success) {
      console.log(`✅ City lookup successful for ${city}`)
      return new Response(
        JSON.stringify({
          success: true,
          data: cityResult.data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Final fallback
    console.log(`❌ All lookups failed for ${city}`)
    return new Response(
      JSON.stringify({
        success: false,
        data: {
          city: city,
          state: state,
          message: `No data available for ${city}. Please try a different city.`
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Service temporarily unavailable'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
