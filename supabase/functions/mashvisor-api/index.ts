
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

    // Step 1: Get neighborhoods list first
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

    const neighborhoods = neighborhoodResult.data.content?.results || []
    console.log(`📋 Found ${neighborhoods.length} neighborhoods in ${city}`)

    // Step 2: Get city-level rento-calculator data as baseline
    const cityRentoUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodedCity}&resource=airbnb&beds=${propertyType}`
    console.log(`🏙️ Getting city-level rento-calculator data:`, cityRentoUrl)
    
    const cityRentoResult = await callMashvisorAPI(cityRentoUrl, mashvisorApiKey, `City-level rento-calculator for ${city}`)
    
    let cityBaseline = null
    if (cityRentoResult.success && cityRentoResult.data.content) {
      const content = cityRentoResult.data.content
      cityBaseline = {
        airbnb_revenue: (content.airbnb?.revenue || content.revenue || 0) * 12, // Convert to annual
        rental_income: (content.rental?.rent || content.rent || content.traditional_rental || 0) * 12, // Convert to annual
        occupancy_rate: content.airbnb?.occupancy || content.occupancy || 0,
        night_rate: content.airbnb?.night_rate || content.night_rate || 0
      }
      console.log(`✅ City baseline data:`, cityBaseline)
    }

    // Step 3: Try to get neighborhood-specific data using rento-calculator lookup
    const neighborhoodData = []
    const limitedNeighborhoods = neighborhoods.slice(0, 8) // Test more neighborhoods since this should be faster
    
    for (const [index, neighborhood] of limitedNeighborhoods.entries()) {
      const neighborhoodName = neighborhood.name || 'Unknown'
      console.log(`🏘️ [${index + 1}/${limitedNeighborhoods.length}] Processing neighborhood: ${neighborhoodName}`)
      
      // Try rento-calculator lookup with neighborhood name as part of city parameter
      const neighborhoodCityParam = `${city} ${neighborhoodName}`
      const neighborhoodRentoUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(neighborhoodCityParam)}&resource=airbnb&beds=${propertyType}`
      
      console.log(`🔗 Neighborhood rento-calculator URL:`, neighborhoodRentoUrl)
      
      const neighborhoodRentoResult = await callMashvisorAPI(neighborhoodRentoUrl, mashvisorApiKey, `Neighborhood rento-calculator for ${neighborhoodName}`)
      
      if (neighborhoodRentoResult.success && neighborhoodRentoResult.data.content) {
        const content = neighborhoodRentoResult.data.content
        
        const airbnbRevenue = (content.airbnb?.revenue || content.revenue || 0) * 12 // Convert to annual
        const rentalIncome = (content.rental?.rent || content.rent || content.traditional_rental || 0) * 12 // Convert to annual
        const occupancyRate = content.airbnb?.occupancy || content.occupancy || 0
        const nightRate = content.airbnb?.night_rate || content.night_rate || 0
        
        console.log(`💰 ${neighborhoodName} rento-calculator data:`, {
          airbnb_revenue: airbnbRevenue,
          rental_income: rentalIncome,
          occupancy_rate: occupancyRate,
          night_rate: nightRate
        })
        
        if (airbnbRevenue > 0 || rentalIncome > 0) {
          neighborhoodData.push({
            neighborhood: neighborhoodName,
            airbnb_revenue: Math.round(airbnbRevenue),
            rental_income: Math.round(rentalIncome),
            occupancy_rate: occupancyRate,
            median_night_rate: nightRate,
            api_neighborhood: neighborhoodName,
            api_city: city,
            api_state: state,
            data_source: 'rento_calculator'
          })
          
          console.log(`✅ Added rento-calculator data for ${neighborhoodName}: STR $${Math.round(airbnbRevenue)}, Rent $${Math.round(rentalIncome)}`)
        } else {
          console.log(`⚠️ No revenue data for ${neighborhoodName} in rento-calculator`)
        }
      } else {
        console.log(`❌ Failed to get rento-calculator data for ${neighborhoodName}`)
      }
      
      // Add delay between neighborhoods to avoid rate limiting
      if (index < limitedNeighborhoods.length - 1) {
        console.log(`⏳ Waiting 500ms before next neighborhood...`)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log(`📊 Final summary: Successfully processed ${neighborhoodData.length} neighborhoods with rento-calculator data out of ${limitedNeighborhoods.length} attempted`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'rento-calculator-neighborhood',
          total_neighborhoods: neighborhoods.length,
          processed_neighborhoods: limitedNeighborhoods.length,
          city_baseline: cityBaseline,
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
