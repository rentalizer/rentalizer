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
    const { city, propertyType, bathrooms, zipCode, address, lat, lng } = await req.json()
    
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
    let finalResult = null

    // Strategy 1: Address Level - Try address endpoint first if we have full details
    if (address && zipCode && lat && lng) {
      const addressUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}&address=${encodeURIComponent(address)}&city=${encodedCity}&lat=${lat}&lng=${lng}`
      const addressResult = await callMashvisorAPI(addressUrl, mashvisorApiKey, 'Address level endpoint')
      
      if (addressResult.success) {
        finalResult = {
          success: true,
          data: {
            city: city,
            state: state,
            propertyType: propertyType,
            bathrooms: bathrooms,
            zipCode: zipCode,
            address: address,
            source: 'address',
            ...addressResult.data
          }
        }
      }
    }

    // Strategy 2: Zip Code Level - If we have zip code but no full address
    if (!finalResult && zipCode) {
      const zipUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}`
      const zipResult = await callMashvisorAPI(zipUrl, mashvisorApiKey, 'Zip code level endpoint')
      
      if (zipResult.success) {
        finalResult = {
          success: true,
          data: {
            city: city,
            state: state,
            propertyType: propertyType,
            bathrooms: bathrooms,
            zipCode: zipCode,
            source: 'zipcode',
            ...zipResult.data
          }
        }
      }
    }

    // Strategy 3: City Level - Try city level lookup for revenue data
    if (!finalResult) {
      const cityUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodedCity}&resource=airbnb&beds=${propertyType}`
      const cityResult = await callMashvisorAPI(cityUrl, mashvisorApiKey, 'City level endpoint')
      
      if (cityResult.success) {
        finalResult = {
          success: true,
          data: {
            city: city,
            state: state,
            propertyType: propertyType,
            bathrooms: bathrooms,
            source: 'city',
            ...cityResult.data
          }
        }
      }
    }

    // Strategy 4: Neighborhood Level - Fallback to neighborhoods endpoint
    if (!finalResult) {
      const neighborhoodUrl = `https://api.mashvisor.com/v1.1/client/city/neighborhoods/${state}/${encodedCity}`
      const neighborhoodResult = await callMashvisorAPI(neighborhoodUrl, mashvisorApiKey, 'Neighborhood endpoint')
      
      if (neighborhoodResult.success) {
        finalResult = {
          success: true,
          data: {
            city: city,
            state: state,
            propertyType: propertyType,
            bathrooms: bathrooms,
            source: 'neighborhoods',
            ...neighborhoodResult.data
          }
        }
      }
    }

    // If we got successful data from any endpoint, return it
    if (finalResult) {
      return new Response(
        JSON.stringify(finalResult),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If all endpoints failed, return error
    console.log(`❌ All Mashvisor endpoints failed for ${city}`)
    
    const errorData = {
      success: false,
      data: {
        city: city,
        state: state,
        propertyType: propertyType,
        bathrooms: bathrooms,
        message: `All Mashvisor API endpoints failed for ${city}. Please try a different city or check your API key.`,
        content: {}
      }
    }

    return new Response(
      JSON.stringify(errorData),
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
