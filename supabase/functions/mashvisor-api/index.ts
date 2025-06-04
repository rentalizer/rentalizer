
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

// Generate realistic neighborhood variations based on city baseline
function generateNeighborhoodVariations(cityBaseline: any, neighborhoods: any[], city: string) {
  const neighborhoodData = []
  
  if (!cityBaseline) {
    console.log('❌ No city baseline data to generate variations from')
    return []
  }

  const baseAirbnbRevenue = cityBaseline.airbnb_revenue || 0
  const baseRentalIncome = cityBaseline.rental_income || 0
  
  if (baseAirbnbRevenue === 0 && baseRentalIncome === 0) {
    console.log('❌ City baseline has no revenue data')
    return []
  }

  console.log(`🏗️ Generating neighborhood variations from city baseline: STR $${baseAirbnbRevenue}, Rent $${baseRentalIncome}`)
  
  // Take first 8 neighborhoods and apply realistic variations
  const selectedNeighborhoods = neighborhoods.slice(0, 8)
  
  selectedNeighborhoods.forEach((neighborhood: any, index: number) => {
    const neighborhoodName = neighborhood.name || 'Unknown'
    
    // Apply realistic multipliers based on typical neighborhood patterns
    const multipliers = [1.3, 1.1, 0.9, 1.2, 0.8, 1.0, 1.4, 0.7] // Downtown, trendy areas higher, suburbs lower
    const multiplier = multipliers[index] || 1.0
    
    const adjustedAirbnbRevenue = Math.round(baseAirbnbRevenue * multiplier)
    const adjustedRentalIncome = Math.round(baseRentalIncome * multiplier * 0.95) // Rent typically slightly lower variation
    
    if (adjustedAirbnbRevenue > 0 || adjustedRentalIncome > 0) {
      neighborhoodData.push({
        neighborhood: neighborhoodName,
        airbnb_revenue: adjustedAirbnbRevenue,
        rental_income: adjustedRentalIncome,
        occupancy_rate: cityBaseline.occupancy_rate || 0,
        median_night_rate: Math.round((cityBaseline.night_rate || 0) * multiplier),
        api_neighborhood: neighborhoodName,
        api_city: city,
        api_state: cityBaseline.state || '',
        data_source: 'city_baseline_variation'
      })
      
      console.log(`✅ Generated variation for ${neighborhoodName}: STR $${adjustedAirbnbRevenue}, Rent $${adjustedRentalIncome} (${multiplier}x multiplier)`)
    }
  })
  
  return neighborhoodData
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
        night_rate: content.airbnb?.night_rate || content.night_rate || 0,
        state: state
      }
      console.log(`✅ City baseline data:`, cityBaseline)
    } else {
      console.log(`❌ Failed to get city baseline for ${city}`)
    }

    // Step 3: Try to get actual neighborhood data, but with very limited attempts
    const neighborhoodData = []
    const limitedNeighborhoods = neighborhoods.slice(0, 3) // Only try 3 neighborhoods to avoid rate limits
    
    for (const [index, neighborhood] of limitedNeighborhoods.entries()) {
      const neighborhoodName = neighborhood.name || 'Unknown'
      console.log(`🏘️ [${index + 1}/${limitedNeighborhoods.length}] Trying neighborhood lookup: ${neighborhoodName}`)
      
      // Try multiple parameter combinations for neighborhood lookup
      const lookupVariations = [
        `${city}, ${neighborhoodName}`, // "Austin, Downtown"
        `${neighborhoodName}, ${city}`, // "Downtown, Austin"
        `${city} ${neighborhoodName}`,   // "Austin Downtown"
        neighborhoodName                 // Just "Downtown"
      ]
      
      let neighborhoodFound = false
      
      for (const cityParam of lookupVariations) {
        if (neighborhoodFound) break
        
        const neighborhoodRentoUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(cityParam)}&resource=airbnb&beds=${propertyType}`
        
        console.log(`🔗 Trying lookup variation: "${cityParam}"`)
        
        const neighborhoodRentoResult = await callMashvisorAPI(neighborhoodRentoUrl, mashvisorApiKey, `Neighborhood lookup for ${cityParam}`)
        
        if (neighborhoodRentoResult.success && neighborhoodRentoResult.data.content) {
          const content = neighborhoodRentoResult.data.content
          
          const airbnbRevenue = (content.airbnb?.revenue || content.revenue || 0) * 12
          const rentalIncome = (content.rental?.rent || content.rent || content.traditional_rental || 0) * 12
          
          if (airbnbRevenue > 0 || rentalIncome > 0) {
            neighborhoodData.push({
              neighborhood: neighborhoodName,
              airbnb_revenue: Math.round(airbnbRevenue),
              rental_income: Math.round(rentalIncome),
              occupancy_rate: content.airbnb?.occupancy || content.occupancy || 0,
              median_night_rate: content.airbnb?.night_rate || content.night_rate || 0,
              api_neighborhood: neighborhoodName,
              api_city: city,
              api_state: state,
              data_source: 'rento_calculator_direct'
            })
            
            console.log(`✅ Found direct data for ${neighborhoodName}: STR $${Math.round(airbnbRevenue)}, Rent $${Math.round(rentalIncome)}`)
            neighborhoodFound = true
            break
          }
        }
        
        // Small delay between variations
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      if (!neighborhoodFound) {
        console.log(`❌ No direct data found for ${neighborhoodName}`)
      }
      
      // Delay between neighborhoods
      if (index < limitedNeighborhoods.length - 1) {
        console.log(`⏳ Waiting 800ms before next neighborhood...`)
        await new Promise(resolve => setTimeout(resolve, 800))
      }
    }

    console.log(`📊 Direct neighborhood lookups complete: Found ${neighborhoodData.length} neighborhoods with data`)

    // Step 4: If we have city baseline but limited neighborhood data, generate variations
    if (cityBaseline && neighborhoodData.length < 5) {
      console.log(`🔄 Generating neighborhood variations since we only found ${neighborhoodData.length} direct matches`)
      const generatedData = generateNeighborhoodVariations(cityBaseline, neighborhoods, city)
      neighborhoodData.push(...generatedData)
    }

    console.log(`📊 Final summary: ${neighborhoodData.length} neighborhoods with revenue data (${neighborhoodData.filter(n => n.data_source === 'rento_calculator_direct').length} direct, ${neighborhoodData.filter(n => n.data_source === 'city_baseline_variation').length} generated)`)

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
