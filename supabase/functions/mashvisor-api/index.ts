
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// City to state mapping for major US cities
const cityToStateMap: { [key: string]: string } = {
  'austin': 'TX',
  'houston': 'TX',
  'dallas': 'TX',
  'san antonio': 'TX',
  'fort worth': 'TX',
  'los angeles': 'CA',
  'san francisco': 'CA',
  'san diego': 'CA',
  'sacramento': 'CA',
  'oakland': 'CA',
  'fresno': 'CA',
  'new york': 'NY',
  'brooklyn': 'NY',
  'queens': 'NY',
  'manhattan': 'NY',
  'bronx': 'NY',
  'chicago': 'IL',
  'philadelphia': 'PA',
  'phoenix': 'AZ',
  'tucson': 'AZ',
  'san jose': 'CA',
  'jacksonville': 'FL',
  'miami': 'FL',
  'tampa': 'FL',
  'orlando': 'FL',
  'fort lauderdale': 'FL',
  'indianapolis': 'IN',
  'columbus': 'OH',
  'charlotte': 'NC',
  'seattle': 'WA',
  'denver': 'CO',
  'washington': 'DC',
  'boston': 'MA',
  'el paso': 'TX',
  'detroit': 'MI',
  'nashville': 'TN',
  'memphis': 'TN',
  'portland': 'OR',
  'oklahoma city': 'OK',
  'las vegas': 'NV',
  'louisville': 'KY',
  'baltimore': 'MD',
  'milwaukee': 'WI',
  'albuquerque': 'NM',
  'kansas city': 'MO',
  'mesa': 'AZ',
  'virginia beach': 'VA',
  'atlanta': 'GA',
  'colorado springs': 'CO',
  'omaha': 'NE',
  'raleigh': 'NC',
  'long beach': 'CA',
  'miami beach': 'FL',
  'minneapolis': 'MN',
  'tulsa': 'OK',
  'cleveland': 'OH',
  'wichita': 'KS',
  'new orleans': 'LA'
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
      console.log(`✅ ${description} successful`)
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
    
    // Get state from city mapping
    const cityKey = city.toLowerCase().trim()
    const state = cityToStateMap[cityKey]
    
    if (!state) {
      console.log(`⚠️ State not found for city: ${city}`)
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

    console.log(`📍 Found state ${state} for city ${city}`)
    const encodedCity = encodeURIComponent(city)

    // Step 1: Get neighborhoods list
    const neighborhoodUrl = `https://api.mashvisor.com/v1.1/client/city/neighborhoods/${state}/${encodedCity}`
    const neighborhoodResult = await callMashvisorAPI(neighborhoodUrl, mashvisorApiKey, 'Neighborhood list endpoint')
    
    if (!neighborhoodResult.success) {
      console.log(`❌ Failed to get neighborhoods for ${city}`)
      return new Response(
        JSON.stringify({
          success: false,
          data: {
            city: city,
            state: state,
            propertyType: propertyType,
            bathrooms: bathrooms,
            message: `Failed to fetch neighborhoods for ${city}`,
            content: {}
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Step 2: Use property search + property estimates approach
    const neighborhoods = neighborhoodResult.data.content?.results || []
    console.log(`📋 Found ${neighborhoods.length} neighborhoods in ${city}`)

    const neighborhoodData = []
    
    // Limit to first 5 neighborhoods to avoid timeout
    const limitedNeighborhoods = neighborhoods.slice(0, 5)
    
    for (const [index, neighborhood] of limitedNeighborhoods.entries()) {
      const neighborhoodName = neighborhood.name || 'Unknown'
      console.log(`🏘️ [${index + 1}/${limitedNeighborhoods.length}] Processing neighborhood: ${neighborhoodName}`)
      
      // First, search for properties in this neighborhood
      const propertySearchUrl = `https://api.mashvisor.com/v1.1/client/property?state=${state}&city=${encodedCity}&neighborhood=${encodeURIComponent(neighborhoodName)}&beds=${propertyType}&source=Airbnb&items=5`
      console.log(`🔗 Property search URL for ${neighborhoodName}:`, propertySearchUrl)
      
      const propertySearchResult = await callMashvisorAPI(propertySearchUrl, mashvisorApiKey, `Property search for ${neighborhoodName}`)
      
      if (propertySearchResult.success && propertySearchResult.data.content) {
        const properties = propertySearchResult.data.content.results || propertySearchResult.data.content || []
        
        console.log(`📊 Found ${properties.length} properties in ${neighborhoodName}`)
        
        if (properties.length > 0) {
          // Get estimates for each property
          const propertyEstimates = []
          
          for (const property of properties.slice(0, 3)) { // Limit to 3 properties per neighborhood
            const propertyId = property.id || property.pid || property.property_id
            
            if (propertyId) {
              console.log(`🏠 Getting estimates for property ID: ${propertyId}`)
              
              const estimatesUrl = `https://api.mashvisor.com/v1.1/client/property/estimates/${propertyId}?state=${state}`
              const estimatesResult = await callMashvisorAPI(estimatesUrl, mashvisorApiKey, `Property estimates for ${propertyId}`)
              
              if (estimatesResult.success && estimatesResult.data.content) {
                const estimates = estimatesResult.data.content
                
                // Extract revenue data from estimates
                const airbnbRevenue = estimates.airbnb?.revenue || estimates.airbnb_revenue || 0
                const rentalRevenue = estimates.rental?.revenue || estimates.traditional_rental || estimates.rental_revenue || 0
                
                console.log(`💰 Property ${propertyId} estimates:`, {
                  airbnb_revenue: airbnbRevenue,
                  rental_revenue: rentalRevenue,
                  address: property.address || 'Unknown'
                })
                
                if (airbnbRevenue > 0 || rentalRevenue > 0) {
                  propertyEstimates.push({
                    property_id: propertyId,
                    airbnb_revenue: airbnbRevenue,
                    rental_revenue: rentalRevenue,
                    address: property.address || 'Unknown Address'
                  })
                }
              } else {
                console.log(`❌ Failed to get estimates for property ${propertyId}`)
              }
              
              // Add delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 500))
            }
          }
          
          // Calculate averages from property estimates
          if (propertyEstimates.length > 0) {
            let totalAirbnbRevenue = 0
            let totalRentalRevenue = 0
            
            propertyEstimates.forEach(estimate => {
              totalAirbnbRevenue += estimate.airbnb_revenue
              totalRentalRevenue += estimate.rental_revenue
            })
            
            const avgAirbnbRevenue = Math.round((totalAirbnbRevenue / propertyEstimates.length) * 12) // Convert to annual
            const avgRentalRevenue = Math.round((totalRentalRevenue / propertyEstimates.length) * 12) // Convert to annual
            
            console.log(`💰 Calculated averages for ${neighborhoodName}:`, {
              avgAirbnbRevenue,
              avgRentalRevenue,
              sampleSize: propertyEstimates.length
            })
            
            if (avgAirbnbRevenue > 0 || avgRentalRevenue > 0) {
              neighborhoodData.push({
                neighborhood: neighborhoodName,
                airbnb_revenue: avgAirbnbRevenue,
                rental_income: avgRentalRevenue,
                median_night_rate: 0,
                occupancy_rate: 0,
                sample_size: propertyEstimates.length,
                api_neighborhood: neighborhoodName,
                api_city: city,
                api_state: state,
                data_source: 'property_estimates'
              })
              
              console.log(`✅ Added property estimates data for ${neighborhoodName}: STR $${avgAirbnbRevenue}, Rent $${avgRentalRevenue}`)
            }
          } else {
            console.log(`⚠️ No valid property estimates for ${neighborhoodName}`)
          }
        } else {
          console.log(`❌ No properties found for ${neighborhoodName}`)
        }
      } else {
        console.log(`❌ Failed to search properties for ${neighborhoodName}`)
      }
      
      // Add delay between neighborhoods to avoid rate limiting
      if (index < limitedNeighborhoods.length - 1) {
        console.log(`⏳ Waiting 1000ms before next neighborhood...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`📊 Final summary: Successfully processed ${neighborhoodData.length} neighborhoods with property estimates out of ${limitedNeighborhoods.length} attempted`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'property-estimates',
          total_neighborhoods: neighborhoods.length,
          processed_neighborhoods: limitedNeighborhoods.length,
          content: {
            neighborhoods_with_revenue: neighborhoodData,
            all_neighborhoods: neighborhoods
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
