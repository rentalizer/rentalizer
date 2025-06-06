
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, propertyType, bathrooms } = await req.json()
    
    console.log(`🔍 Mashvisor Lookup API called for ${city} (${propertyType}BR/${bathrooms}BA)`)
    
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

    try {
      // First get neighborhoods for the city
      const neighborhoodsUrl = `https://api.mashvisor.com/v1.1/client/city/neighborhoods/${state}/${encodeURIComponent(city)}`
      
      console.log(`📡 Fetching neighborhoods from:`, neighborhoodsUrl)
      
      const neighborhoodsResponse = await fetch(neighborhoodsUrl, {
        method: 'GET',
        headers: {
          'x-api-key': mashvisorApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      let neighborhoods = []
      if (neighborhoodsResponse.ok) {
        const neighborhoodData = await neighborhoodsResponse.json()
        neighborhoods = neighborhoodData.content?.results || []
        console.log(`✅ Found ${neighborhoods.length} neighborhoods`)
      } else {
        console.log(`⚠️ Could not fetch neighborhoods: ${neighborhoodsResponse.status}`)
      }

      // Now get rental data using the lookup endpoint for each neighborhood
      const rentalDataPromises = []
      
      // City-level lookup for Airbnb
      const cityAirbnbUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=airbnb&beds=${propertyType}`
      rentalDataPromises.push(
        fetch(cityAirbnbUrl, {
          headers: { 'x-api-key': mashvisorApiKey }
        }).then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            return { type: 'city_airbnb', data, neighborhood: 'City Average' }
          }
          return null
        }).catch(() => null)
      )

      // City-level lookup for Traditional
      const cityTraditionalUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=traditional&beds=${propertyType}`
      rentalDataPromises.push(
        fetch(cityTraditionalUrl, {
          headers: { 'x-api-key': mashvisorApiKey }
        }).then(async (res) => {
          if (res.ok) {
            const data = await res.json()
            return { type: 'city_traditional', data, neighborhood: 'City Average' }
          }
          return null
        }).catch(() => null)
      )

      // Get data for top neighborhoods if available
      if (neighborhoods.length > 0) {
        const topNeighborhoods = neighborhoods.slice(0, 10) // Limit to prevent too many API calls
        
        for (const neighborhood of topNeighborhoods) {
          const neighborhoodName = neighborhood.name || neighborhood.neighborhood
          
          // Airbnb data for neighborhood
          const neighborhoodAirbnbUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&neighborhood=${encodeURIComponent(neighborhoodName)}&resource=airbnb&beds=${propertyType}`
          rentalDataPromises.push(
            fetch(neighborhoodAirbnbUrl, {
              headers: { 'x-api-key': mashvisorApiKey }
            }).then(async (res) => {
              if (res.ok) {
                const data = await res.json()
                return { type: 'neighborhood_airbnb', data, neighborhood: neighborhoodName }
              }
              return null
            }).catch(() => null)
          )

          // Traditional data for neighborhood
          const neighborhoodTraditionalUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&neighborhood=${encodeURIComponent(neighborhoodName)}&resource=traditional&beds=${propertyType}`
          rentalDataPromises.push(
            fetch(neighborhoodTraditionalUrl, {
              headers: { 'x-api-key': mashvisorApiKey }
            }).then(async (res) => {
              if (res.ok) {
                const data = await res.json()
                return { type: 'neighborhood_traditional', data, neighborhood: neighborhoodName }
              }
              return null
            }).catch(() => null)
          )
        }
      }

      console.log(`📊 Making ${rentalDataPromises.length} API calls for rental data`)
      
      // Execute all API calls
      const rentalResults = await Promise.all(rentalDataPromises)
      const validResults = rentalResults.filter(result => result !== null)

      console.log(`✅ Got ${validResults.length} valid rental data responses`)

      // Combine the data
      const combinedData = {
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          neighborhoods: neighborhoods,
          rentalData: validResults,
          message: 'Real rental data from Mashvisor lookup API'
        }
      }

      return new Response(
        JSON.stringify(combinedData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (error) {
      console.log(`⚠️ Error fetching data for ${city}:`, error)
      
      const fallbackData = {
        success: false,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: 'API request failed',
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
