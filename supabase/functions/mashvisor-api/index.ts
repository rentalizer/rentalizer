
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
      
      // Add detailed logging of the response structure
      console.log(`🔍 ${description} response keys:`, Object.keys(data))
      if (data.content) {
        console.log(`🔍 ${description} content type:`, typeof data.content)
        if (Array.isArray(data.content)) {
          console.log(`🔍 ${description} content array length:`, data.content.length)
          if (data.content.length > 0) {
            console.log(`🔍 ${description} first item keys:`, Object.keys(data.content[0]))
          }
        } else {
          console.log(`🔍 ${description} content keys:`, Object.keys(data.content))
        }
      }
      
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

    // Step 2: Try property listings endpoint for more granular data
    const neighborhoods = neighborhoodResult.data.content?.results || []
    console.log(`📋 Found ${neighborhoods.length} neighborhoods in ${city}`)

    const neighborhoodData = []
    
    // Limit to first 3 neighborhoods to avoid timeout and test different approach
    const limitedNeighborhoods = neighborhoods.slice(0, 3)
    
    for (const [index, neighborhood] of limitedNeighborhoods.entries()) {
      const neighborhoodName = neighborhood.name || 'Unknown'
      console.log(`🏘️ [${index + 1}/${limitedNeighborhoods.length}] Processing neighborhood: ${neighborhoodName}`)
      
      // Try property listings endpoint for this neighborhood
      const listingsUrl = `https://api.mashvisor.com/v1.1/client/property/search?state=${state}&city=${encodedCity}&neighborhood=${encodeURIComponent(neighborhoodName)}&beds=${propertyType}&source=Airbnb&page=1&items=10`
      console.log(`🔗 Property listings URL for ${neighborhoodName}:`, listingsUrl)
      
      const listingsResult = await callMashvisorAPI(listingsUrl, mashvisorApiKey, `Property listings for ${neighborhoodName}`)
      
      if (listingsResult.success && listingsResult.data.content) {
        const content = listingsResult.data.content
        console.log(`📊 Listings response structure for ${neighborhoodName}:`, {
          hasResults: !!content.results,
          resultsLength: content.results?.length || 0,
          hasProperties: !!content.properties,
          propertiesLength: content.properties?.length || 0
        })
        
        // Try to extract revenue data from property listings
        const properties = content.results || content.properties || []
        
        if (properties.length > 0) {
          console.log(`📊 Found ${properties.length} properties in ${neighborhoodName}`)
          console.log(`🔍 First property keys:`, Object.keys(properties[0]))
          console.log(`🔍 First property sample:`, {
            address: properties[0].address,
            rental_income: properties[0].rental_income,
            airbnb_income: properties[0].airbnb_income,
            monthly_revenue: properties[0].monthly_revenue,
            revenue: properties[0].revenue,
            price: properties[0].price
          })
          
          // Calculate averages from property data
          let totalAirbnbRevenue = 0
          let totalRentalIncome = 0
          let validProperties = 0
          
          properties.forEach(property => {
            const airbnbRevenue = property.airbnb_income || property.monthly_revenue || property.revenue || 0
            const rentalIncome = property.rental_income || property.rent || 0
            
            if (airbnbRevenue > 0 || rentalIncome > 0) {
              totalAirbnbRevenue += airbnbRevenue * 12 // Convert monthly to annual
              totalRentalIncome += rentalIncome * 12 // Convert monthly to annual
              validProperties++
            }
          })
          
          if (validProperties > 0) {
            const avgAirbnbRevenue = Math.round(totalAirbnbRevenue / validProperties)
            const avgRentalIncome = Math.round(totalRentalIncome / validProperties)
            
            console.log(`💰 Calculated averages for ${neighborhoodName}:`, {
              avgAirbnbRevenue,
              avgRentalIncome,
              validProperties,
              source: 'property listings aggregation'
            })
            
            neighborhoodData.push({
              neighborhood: neighborhoodName,
              airbnb_revenue: avgAirbnbRevenue,
              rental_income: avgRentalIncome,
              median_night_rate: 0,
              occupancy_rate: 0,
              sample_size: validProperties,
              api_neighborhood: neighborhoodName,
              api_city: city,
              api_state: state
            })
            console.log(`✅ Added property-based data for ${neighborhoodName}: STR $${avgAirbnbRevenue}, Rent $${avgRentalIncome}`)
          } else {
            console.log(`⚠️ No valid property data for ${neighborhoodName}`)
          }
        } else {
          console.log(`❌ No properties found for ${neighborhoodName}`)
        }
      } else {
        console.log(`❌ Failed to get property listings for ${neighborhoodName}:`, listingsResult.error || 'Unknown error')
      }
      
      // Add delay to avoid rate limiting
      if (index < limitedNeighborhoods.length - 1) {
        console.log(`⏳ Waiting 500ms before next API call...`)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log(`📊 Final summary: Successfully processed ${neighborhoodData.length} neighborhoods with property data out of ${limitedNeighborhoods.length} attempted`)
    
    // Check for data variation
    if (neighborhoodData.length > 1) {
      const revenues = neighborhoodData.map(n => n.airbnb_revenue)
      const rents = neighborhoodData.map(n => n.rental_income)
      const uniqueRevenues = new Set(revenues).size
      const uniqueRents = new Set(rents).size
      
      console.log(`📈 Data variation check:`, {
        uniqueRevenues,
        uniqueRents,
        totalNeighborhoods: neighborhoodData.length,
        hasVariation: uniqueRevenues > 1 || uniqueRents > 1
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'property-listings',
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
