
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { state, propertyType, bathrooms } = await req.json()
    
    console.log(`🔍 Mashvisor Edge Function called for ${state} state (${propertyType}BR/${bathrooms}BA)`)
    
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

    // Define major cities for each state
    const stateCities = {
      'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
      'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
      'TX': ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
      'NY': ['New York', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
      'CO': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'],
      'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
      'OR': ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro'],
      'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler'],
      'NV': ['Las Vegas', 'Reno', 'Henderson', 'Carson City', 'Sparks'],
      'TN': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
      'NC': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
      'GA': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
      'SC': ['Charleston', 'Columbia', 'Greenville', 'Rock Hill', 'Mount Pleasant'],
      'VA': ['Virginia Beach', 'Norfolk', 'Richmond', 'Newport News', 'Alexandria'],
      'IL': ['Chicago', 'Aurora', 'Peoria', 'Rockford', 'Elgin'],
      'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
      'MI': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'],
      'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
      'MA': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
      'MD': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie']
    }

    const cities = stateCities[state as keyof typeof stateCities] || []
    
    if (cities.length === 0) {
      console.log(`❌ No major cities defined for state: ${state}`)
      const fallbackData = {
        success: false,
        data: {
          fallback: true,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: `No major cities available for analysis in ${state}`,
          content: { cities: [] }
        }
      }

      return new Response(
        JSON.stringify(fallbackData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`📍 Analyzing ${cities.length} major cities in ${state}:`, cities.join(', '))

    // Query multiple cities and collect results
    const cityResults = []
    
    for (const city of cities) {
      try {
        // Use the rento-calculator lookup endpoint with city parameter
        const mashvisorUrl = new URL('https://api.mashvisor.com/v1.1/client/rento-calculator/lookup')
        
        mashvisorUrl.searchParams.append('state', state)
        mashvisorUrl.searchParams.append('city', city)
        mashvisorUrl.searchParams.append('resource', 'airbnb')
        mashvisorUrl.searchParams.append('beds', propertyType)
        
        console.log(`📡 Calling Mashvisor for ${city}, ${state}:`, mashvisorUrl.toString())
        
        const mashvisorResponse = await fetch(mashvisorUrl.toString(), {
          method: 'GET',
          headers: {
            'x-api-key': mashvisorApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })

        if (mashvisorResponse.ok) {
          const cityData = await mashvisorResponse.json()
          console.log(`✅ Successfully fetched data for ${city}`)
          
          cityResults.push({
            city: city,
            state: state,
            data: cityData
          })
        } else {
          const errorText = await mashvisorResponse.text()
          console.log(`⚠️ Failed to fetch data for ${city}: ${mashvisorResponse.status} - ${errorText.substring(0, 100)}`)
        }
      } catch (error) {
        console.log(`⚠️ Error fetching data for ${city}:`, error)
      }
    }

    console.log(`📊 Successfully fetched data for ${cityResults.length}/${cities.length} cities`)

    if (cityResults.length === 0) {
      console.log('❌ No successful API calls for any cities')
      const fallbackData = {
        success: false,
        data: {
          fallback: true,
          state: state,
          propertyType: propertyType,
          bathrooms: bathrooms,
          message: `Mashvisor API unavailable for ${state} cities`,
          content: { cities: [] }
        }
      }

      return new Response(
        JSON.stringify(fallbackData),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return successful results
    const successData = {
      success: true,
      data: {
        state: state,
        propertyType: propertyType,
        bathrooms: bathrooms,
        content: {
          cities: cityResults
        }
      }
    }

    return new Response(
      JSON.stringify(successData),
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
        content: { cities: [] }
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
