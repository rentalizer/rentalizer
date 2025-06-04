
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
  'los angeles': 'CA',
  'san francisco': 'CA',
  'san diego': 'CA',
  'new york': 'NY',
  'chicago': 'IL',
  'philadelphia': 'PA',
  'phoenix': 'AZ',
  'miami': 'FL',
  'seattle': 'WA',
  'denver': 'CO',
  'atlanta': 'GA'
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

    const neighborhoodsWithRevenue = []
    
    // Try city-level lookup first for comprehensive neighborhood data
    console.log(`🏙️ Trying city-level lookup for: ${city}, ${state}`)
    
    const cityLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=airbnb&beds=${propertyType}`
    
    const cityResult = await callMashvisorAPI(cityLookupUrl, mashvisorApiKey, `City lookup for ${city}`)
    
    if (cityResult.success && cityResult.data.content) {
      console.log(`✅ City lookup successful for ${city}`)
      
      const content = cityResult.data.content
      
      // Extract city-level data
      if (content.airbnb_revenue || content.rental_income || content.revenue || content.rent) {
        const monthlyStrRevenue = content.airbnb_revenue || content.revenue || 0
        const monthlyRentRevenue = content.rental_income || content.rent || 0
        const annualStrRevenue = monthlyStrRevenue * 12
        const annualRentRevenue = monthlyRentRevenue * 12
        
        console.log(`📈 City ${city}: Monthly STR: $${monthlyStrRevenue}, Monthly Rent: $${monthlyRentRevenue}`)
        
        if (annualStrRevenue > 0 || annualRentRevenue > 0) {
          neighborhoodsWithRevenue.push({
            neighborhood: `${city} - City Average`,
            airbnb_revenue: Math.round(annualStrRevenue),
            rental_income: Math.round(annualRentRevenue),
            occupancy_rate: content.occupancy || content.occupancy_rate || 0,
            median_night_rate: content.night_rate || content.nightly_rate || content.rate || 0,
            api_neighborhood: city,
            api_city: city,
            api_state: state,
            data_source: 'city_lookup',
            property_address: `${city}, ${state}`,
            property_id: `city-${city.toLowerCase().replace(/\s+/g, '-')}`,
            raw_data: {
              airbnb_revenue: content.airbnb_revenue,
              rental_income: content.rental_income,
              revenue: content.revenue,
              rent: content.rent,
              occupancy: content.occupancy,
              night_rate: content.night_rate
            }
          })
        }
      }
      
      // Extract neighborhood data if available
      if (content.neighborhoods && Array.isArray(content.neighborhoods)) {
        console.log(`🏘️ Found ${content.neighborhoods.length} neighborhoods in ${city}`)
        
        content.neighborhoods.forEach((neighborhood: any, index: number) => {
          const neighborhoodName = neighborhood.name || neighborhood.neighborhood || `Neighborhood ${index + 1}`
          const monthlyStrRevenue = neighborhood.airbnb_revenue || neighborhood.revenue || 0
          const monthlyRentRevenue = neighborhood.rental_income || neighborhood.rent || 0
          const annualStrRevenue = monthlyStrRevenue * 12
          const annualRentRevenue = monthlyRentRevenue * 12
          
          console.log(`🏠 Neighborhood ${neighborhoodName}: Monthly STR: $${monthlyStrRevenue}, Monthly Rent: $${monthlyRentRevenue}`)
          
          if (annualStrRevenue > 0 || annualRentRevenue > 0) {
            neighborhoodsWithRevenue.push({
              neighborhood: `${neighborhoodName} - ${city}`,
              airbnb_revenue: Math.round(annualStrRevenue),
              rental_income: Math.round(annualRentRevenue),
              occupancy_rate: neighborhood.occupancy || neighborhood.occupancy_rate || 0,
              median_night_rate: neighborhood.night_rate || neighborhood.nightly_rate || neighborhood.rate || 0,
              api_neighborhood: neighborhoodName,
              api_city: city,
              api_state: state,
              data_source: 'neighborhood_lookup',
              property_address: `${neighborhoodName}, ${city}, ${state}`,
              property_id: `neighborhood-${neighborhoodName.toLowerCase().replace(/\s+/g, '-')}-${index}`,
              raw_data: {
                airbnb_revenue: neighborhood.airbnb_revenue,
                rental_income: neighborhood.rental_income,
                revenue: neighborhood.revenue,
                rent: neighborhood.rent,
                occupancy: neighborhood.occupancy,
                night_rate: neighborhood.night_rate
              }
            })
          }
        })
      }
      
      // Extract address-level data if available
      if (content.addresses && Array.isArray(content.addresses)) {
        console.log(`🏠 Found ${content.addresses.length} addresses in ${city}`)
        
        content.addresses.forEach((address: any, index: number) => {
          const addressName = address.address || address.property_address || `Address ${index + 1}`
          const monthlyStrRevenue = address.airbnb_revenue || address.revenue || 0
          const monthlyRentRevenue = address.rental_income || address.rent || 0
          const annualStrRevenue = monthlyStrRevenue * 12
          const annualRentRevenue = monthlyRentRevenue * 12
          
          console.log(`🏠 Address ${addressName}: Monthly STR: $${monthlyStrRevenue}, Monthly Rent: $${monthlyRentRevenue}`)
          
          if (annualStrRevenue > 0 || annualRentRevenue > 0) {
            neighborhoodsWithRevenue.push({
              neighborhood: `${addressName}`,
              airbnb_revenue: Math.round(annualStrRevenue),
              rental_income: Math.round(annualRentRevenue),
              occupancy_rate: address.occupancy || address.occupancy_rate || 0,
              median_night_rate: address.night_rate || address.nightly_rate || address.rate || 0,
              api_neighborhood: address.neighborhood || city,
              api_city: city,
              api_state: state,
              data_source: 'address_lookup',
              property_address: addressName,
              property_id: `address-${index}`,
              raw_data: {
                airbnb_revenue: address.airbnb_revenue,
                rental_income: address.rental_income,
                revenue: address.revenue,
                rent: address.rent,
                occupancy: address.occupancy,
                night_rate: address.night_rate,
                lat: address.lat,
                lng: address.lng
              }
            })
          }
        })
      }
    } else {
      console.log(`⚠️ City lookup failed for ${city}`)
    }

    console.log(`📊 Analysis complete: Found ${neighborhoodsWithRevenue.length} locations with revenue data`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          city: city,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          source: 'rento-calculator-lookup',
          content: {
            neighborhoods_with_revenue: neighborhoodsWithRevenue
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
