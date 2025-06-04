
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// City to state and zip code mapping for major US cities
const cityToLocationMap: { [key: string]: { state: string; zipCodes: string[] } } = {
  'austin': { state: 'TX', zipCodes: ['78701', '78702', '78703', '78704', '78705', '78721', '78722', '78723', '78724', '78725'] },
  'houston': { state: 'TX', zipCodes: ['77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010'] },
  'dallas': { state: 'TX', zipCodes: ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210'] },
  'san antonio': { state: 'TX', zipCodes: ['78201', '78202', '78203', '78204', '78205', '78206', '78207', '78208', '78209', '78210'] },
  'los angeles': { state: 'CA', zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010'] },
  'san francisco': { state: 'CA', zipCodes: ['94102', '94103', '94104', '94105', '94107', '94108', '94109', '94110', '94111', '94112'] },
  'san diego': { state: 'CA', zipCodes: ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110'] },
  'new york': { state: 'NY', zipCodes: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'] },
  'chicago': { state: 'IL', zipCodes: ['60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608', '60609', '60610'] },
  'philadelphia': { state: 'PA', zipCodes: ['19101', '19102', '19103', '19104', '19105', '19106', '19107', '19108', '19109', '19110'] },
  'phoenix': { state: 'AZ', zipCodes: ['85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010'] },
  'miami': { state: 'FL', zipCodes: ['33101', '33102', '33109', '33111', '33116', '33121', '33125', '33126', '33127', '33128'] },
  'seattle': { state: 'WA', zipCodes: ['98101', '98102', '98103', '98104', '98105', '98106', '98107', '98108', '98109', '98110'] },
  'denver': { state: 'CO', zipCodes: ['80201', '80202', '80203', '80204', '80205', '80206', '80207', '80208', '80209', '80210'] },
  'atlanta': { state: 'GA', zipCodes: ['30301', '30302', '30303', '30304', '30305', '30306', '30307', '30308', '30309', '30310'] }
};

// Helper function to make API calls with proper error handling
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
      console.log(`✅ ${description} successful with data:`, JSON.stringify(data, null, 2))
      return { success: true, data }
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
    
    // Get state and zip codes from city mapping
    const cityKey = city.toLowerCase().trim()
    const locationData = cityToLocationMap[cityKey]
    
    if (!locationData) {
      console.log(`⚠️ Location data not found for city: ${city}`)
      return new Response(
        JSON.stringify({
          success: false,
          data: {
            city: city,
            propertyType: propertyType,
            bathrooms: bathrooms,
            message: `City '${city}' not found in our database. Please try a major US city.`,
            content: {}
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { state, zipCodes } = locationData
    console.log(`📍 Found state ${state} for city ${city} with ${zipCodes.length} zip codes`)

    const propertiesWithRevenue = []
    
    // Try list-comps endpoint for multiple zip codes to get property revenue data
    const limitedZipCodes = zipCodes.slice(0, 5) // Limit to 5 zip codes to avoid rate limits
    
    for (const [index, zipCode] of limitedZipCodes.entries()) {
      console.log(`🏘️ [${index + 1}/${limitedZipCodes.length}] Trying list-comps for zip code: ${zipCode}`)
      
      const listCompsUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/list-comps?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}`
      
      const zipResult = await callMashvisorAPI(listCompsUrl, mashvisorApiKey, `List-comps for ${zipCode}`)
      
      if (zipResult.success && zipResult.data.content && zipResult.data.content.length > 0) {
        console.log(`✅ Found ${zipResult.data.content.length} properties in zip ${zipCode}`)
        
        // Process each property from the list-comps response
        zipResult.data.content.forEach((property: any, propIndex: number) => {
          const monthlyRevenue = property.revenue || property.airbnb_revenue || property.monthly_revenue || 0
          const annualRevenue = monthlyRevenue * 12
          const monthlyRent = property.rent || property.rental_income || property.traditional_rental || 0
          const annualRent = monthlyRent * 12
          
          if (annualRevenue > 0 || annualRent > 0) {
            propertiesWithRevenue.push({
              neighborhood: `${zipCode} - Property ${propIndex + 1}`,
              airbnb_revenue: Math.round(annualRevenue),
              rental_income: Math.round(annualRent),
              occupancy_rate: property.occupancy || 0,
              median_night_rate: property.night_rate || property.nightly_rate || 0,
              api_neighborhood: zipCode,
              api_city: city,
              api_state: state,
              data_source: 'list_comps',
              property_address: property.address || `Property in ${zipCode}`,
              property_id: property.id || `${zipCode}-${propIndex}`
            })
            
            console.log(`✅ Property ${propIndex + 1} in ${zipCode}: STR $${Math.round(annualRevenue)}, Rent $${Math.round(annualRent)}`)
          }
        })
      } else {
        console.log(`⚠️ No properties found in zip code ${zipCode}`)
      }
      
      // Delay between zip codes to respect rate limits
      if (index < limitedZipCodes.length - 1) {
        console.log(`⏳ Waiting 1000ms before next zip code...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`📊 Analysis complete: Found ${propertiesWithRevenue.length} properties with revenue data`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'list-comps',
          total_zip_codes: zipCodes.length,
          processed_zip_codes: limitedZipCodes.length,
          content: {
            neighborhoods_with_revenue: propertiesWithRevenue,
            zip_codes_analyzed: limitedZipCodes
          }
        }
      }),
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
