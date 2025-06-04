
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

    // Step 2: Get revenue data for each neighborhood
    const neighborhoods = neighborhoodResult.data.content?.results || []
    console.log(`📋 Found ${neighborhoods.length} neighborhoods in ${city}`)

    const neighborhoodData = []
    
    // Limit to first 10 neighborhoods to avoid timeout
    const limitedNeighborhoods = neighborhoods.slice(0, 10)
    
    for (const neighborhood of limitedNeighborhoods) {
      const neighborhoodName = neighborhood.name || 'Unknown'
      console.log(`🏘️ Fetching data for neighborhood: ${neighborhoodName}`)
      
      // Try to get revenue data for this specific neighborhood
      const rentoUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodedCity}&neighborhood=${encodeURIComponent(neighborhoodName)}&resource=airbnb&beds=${propertyType}`
      const rentoResult = await callMashvisorAPI(rentoUrl, mashvisorApiKey, `Rento-calculator for ${neighborhoodName}`)
      
      if (rentoResult.success && rentoResult.data.content) {
        const content = rentoResult.data.content
        
        // Extract revenue data
        const airbnbRevenue = content.median_night_rate ? (content.median_night_rate * content.median_occupancy_rate * 365 / 100) || 0 : 0
        const adjustedRevenue = content.adjusted_rental_income ? content.adjusted_rental_income * 12 : airbnbRevenue
        const rentalIncome = content.median_rental_income ? content.median_rental_income * 12 : 0
        
        if (adjustedRevenue > 0 || rentalIncome > 0) {
          neighborhoodData.push({
            neighborhood: neighborhoodName,
            airbnb_revenue: Math.round(adjustedRevenue),
            rental_income: Math.round(rentalIncome),
            median_night_rate: content.median_night_rate || 0,
            occupancy_rate: content.median_occupancy_rate || 0,
            sample_size: content.sample_size || 0
          })
          console.log(`✅ Revenue data found for ${neighborhoodName}: STR $${Math.round(adjustedRevenue)}, Rent $${Math.round(rentalIncome)}`)
        } else {
          console.log(`⚠️ No revenue data for ${neighborhoodName}`)
        }
      } else {
        console.log(`❌ Failed to get revenue data for ${neighborhoodName}`)
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`📊 Successfully processed ${neighborhoodData.length} neighborhoods with revenue data`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'neighborhood-revenue',
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
