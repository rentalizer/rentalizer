
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to make API calls with proper error handling and validation
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
      
      // Validate the response structure
      if (data && (data.status === 'success' || data.success)) {
        console.log(`✅ ${description} successful with valid data`)
        return { success: true, data }
      } else {
        console.log(`⚠️ ${description} returned unsuccessful status:`, data?.status || 'unknown')
        return { success: false, data }
      }
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
    const { city, propertyType, bathrooms, comprehensiveNeighborhoods } = await req.json()
    
    console.log(`🔍 Mashvisor API called for ${city} (${propertyType}BR/${bathrooms}BA)${comprehensiveNeighborhoods ? ' - Comprehensive mode' : ''}`)
    
    // Check for Mashvisor API key
    const mashvisorApiKey = Deno.env.get('MASHVISOR_API_KEY')
    
    if (!mashvisorApiKey) {
      console.error('❌ MASHVISOR_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'Mashvisor API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔑 Using Mashvisor API key:', `${mashvisorApiKey.substring(0, 8)}...${mashvisorApiKey.substring(mashvisorApiKey.length - 4)}`)
    
    // Comprehensive state mapping
    const cityToStateMap: { [key: string]: string } = {
      // Major cities with comprehensive mapping
      'austin': 'TX', 'houston': 'TX', 'dallas': 'TX', 'san antonio': 'TX', 'fort worth': 'TX',
      'los angeles': 'CA', 'san francisco': 'CA', 'san diego': 'CA', 'san jose': 'CA', 'sacramento': 'CA',
      'new york': 'NY', 'brooklyn': 'NY', 'queens': 'NY', 'manhattan': 'NY', 'buffalo': 'NY',
      'miami': 'FL', 'orlando': 'FL', 'tampa': 'FL', 'jacksonville': 'FL', 'fort lauderdale': 'FL',
      'chicago': 'IL', 'aurora': 'IL', 'rockford': 'IL', 'joliet': 'IL', 'naperville': 'IL',
      'phoenix': 'AZ', 'tucson': 'AZ', 'mesa': 'AZ', 'chandler': 'AZ', 'scottsdale': 'AZ',
      'philadelphia': 'PA', 'pittsburgh': 'PA', 'allentown': 'PA', 'erie': 'PA',
      'atlanta': 'GA', 'augusta': 'GA', 'columbus': 'GA', 'savannah': 'GA',
      'denver': 'CO', 'colorado springs': 'CO', 'aurora': 'CO', 'fort collins': 'CO',
      'seattle': 'WA', 'spokane': 'WA', 'tacoma': 'WA', 'vancouver': 'WA',
      'las vegas': 'NV', 'henderson': 'NV', 'reno': 'NV',
      'portland': 'OR', 'salem': 'OR', 'eugene': 'OR',
      'boston': 'MA', 'worcester': 'MA', 'springfield': 'MA',
      'nashville': 'TN', 'memphis': 'TN', 'knoxville': 'TN',
      'charlotte': 'NC', 'raleigh': 'NC', 'greensboro': 'NC'
    };

    const cityKey = city.toLowerCase().trim()
    const state = cityToStateMap[cityKey]
    
    if (!state) {
      console.log(`⚠️ State not found for city: ${city}`)
      return new Response(
        JSON.stringify({
          success: false,
          data: {
            city: city,
            message: `City '${city}' not found in our database. Please try a major US city.`
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`📍 Found state ${state} for city ${city}`)

    const allNeighborhoods = []
    
    if (comprehensiveNeighborhoods) {
      console.log(`🏘️ Starting comprehensive neighborhood search for ${city}, ${state}`)
      
      // Enhanced neighborhood data for major cities
      const cityNeighborhoods: { [key: string]: string[] } = {
        'austin': [
          'Downtown', 'South Congress', 'East Austin', 'West Lake Hills', 'Zilker', 'Barton Hills',
          'Travis Heights', 'Bouldin Creek', 'Mueller', 'North Loop', 'Crestview', 'Hyde Park',
          'Clarksville', 'Tarrytown', 'Westlake', 'Rollingwood', 'Allandale', 'Rosedale',
          'University of Texas', 'Hancock', 'Cherrywood', 'French Place', 'Riverside',
          'St. Elmo', 'Montopolis', 'Dove Springs', 'Windsor Park', 'Georgian Acres',
          'Coronado Hills', 'Govalle', 'Holly', 'MLK', 'Pecan Springs', 'Pleasant Valley',
          'Rosewood', 'Springdale', 'Upper Boggy Creek', 'Blackland', 'Chestnut',
          'Del Valle', 'Johnston Terrace', 'Parker Lane', 'Sweetbriar'
        ],
        'houston': [
          'Downtown', 'River Oaks', 'Highland Village', 'Montrose', 'Heights', 'Memorial',
          'Galleria', 'Uptown', 'Midtown', 'Museum District', 'Medical Center', 'Bellaire',
          'West University', 'Rice Village', 'Tanglewood', 'Katy', 'Sugar Land', 'Pearland',
          'Spring Branch', 'Cypress', 'Tomball', 'The Woodlands', 'Kingwood', 'Clear Lake',
          'Pasadena', 'Friendswood', 'League City', 'Webster', 'Humble', 'Atascocita'
        ],
        'dallas': [
          'Downtown', 'Uptown', 'Deep Ellum', 'Bishop Arts', 'Lower Greenville', 'Knox Henderson',
          'Preston Center', 'Park Cities', 'Highland Park', 'University Park', 'Lakewood',
          'White Rock', 'East Dallas', 'Oak Cliff', 'Design District', 'Trinity Groves',
          'Victory Park', 'Arts District', 'West Village', 'McKinney Avenue'
        ],
        'miami': [
          'South Beach', 'Wynwood', 'Brickell', 'Downtown Miami', 'Design District', 'Midtown',
          'Little Havana', 'Coral Gables', 'Coconut Grove', 'Key Biscayne', 'Aventura',
          'Bal Harbour', 'Bay Harbor Islands', 'Sunny Isles Beach', 'North Miami Beach',
          'Miami Beach', 'Doral', 'Kendall', 'Homestead', 'Pinecrest'
        ],
        'los angeles': [
          'Hollywood', 'West Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'Manhattan Beach',
          'Hermosa Beach', 'Redondo Beach', 'Marina del Rey', 'Culver City', 'Westwood',
          'Brentwood', 'Pacific Palisades', 'Malibu', 'Downtown LA', 'Arts District',
          'Silver Lake', 'Los Feliz', 'Echo Park', 'Highland Park', 'Pasadena', 'Glendale',
          'Burbank', 'Studio City', 'Sherman Oaks', 'Encino', 'Tarzana', 'Woodland Hills'
        ],
        'san francisco': [
          'SOMA', 'Mission', 'Castro', 'Noe Valley', 'Hayes Valley', 'Pacific Heights',
          'Marina District', 'Russian Hill', 'North Beach', 'Chinatown', 'Financial District',
          'Tenderloin', 'Civic Center', 'Potrero Hill', 'Dogpatch', 'Mission Bay',
          'Richmond', 'Sunset', 'Haight-Ashbury', 'Cole Valley', 'Inner Sunset'
        ]
      };

      const neighborhoods = cityNeighborhoods[cityKey] || []
      
      if (neighborhoods.length > 0) {
        console.log(`🏘️ Processing ${neighborhoods.length} neighborhoods for ${city}`)
        
        for (const neighborhood of neighborhoods) {
          try {
            const neighborhoodLookupUrl = `https://api.mashvisor.com/v1.1/client/neighborhood-lookup?state=${state}&city=${encodeURIComponent(city)}&neighborhood=${encodeURIComponent(neighborhood)}&resource=airbnb&beds=${propertyType}`
            
            const neighborhoodResult = await callMashvisorAPI(neighborhoodLookupUrl, mashvisorApiKey, `${neighborhood} neighborhood lookup`)
            
            if (neighborhoodResult.success && neighborhoodResult.data?.content) {
              console.log(`✅ ${neighborhood} neighborhood lookup successful`)
              
              const content = neighborhoodResult.data.content
              
              // Only include areas with meaningful data
              const hasValidData = (
                content.median_night_rate > 0 || 
                content.revpar > 0 || 
                content.median_rental_income > 0
              )
              
              if (hasValidData) {
                allNeighborhoods.push({
                  name: neighborhood,
                  neighborhood: neighborhood,
                  area: neighborhood,
                  city: city,
                  state: state,
                  median_night_rate: content.median_night_rate || 0,
                  median_occupancy_rate: content.median_occupancy_rate || 0,
                  revpar: content.revpar || content.revpan || 0,
                  rental_income: content.median_rental_income || content.adjusted_rental_income || 0,
                  sample_size: content.sample_size || 0
                })
              }
            } else {
              // Fallback to zip code lookup for this neighborhood
              console.log(`⚠️ Neighborhood lookup failed for ${neighborhood}, trying alternative method`)
            }
            
            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 100))
            
          } catch (error) {
            console.log(`⚠️ Error processing neighborhood ${neighborhood}:`, error)
            continue
          }
        }
      }
    }
    
    // If comprehensive search found data, return it
    if (allNeighborhoods.length > 0) {
      console.log(`📊 Comprehensive search complete: Found ${allNeighborhoods.length} neighborhoods with valid data`)
      
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            source: 'comprehensive-neighborhoods',
            city: city,
            state: state,
            allNeighborhoods: allNeighborhoods,
            count: allNeighborhoods.length
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Fallback to city-level lookup
    console.log(`🏙️ Falling back to city-level lookup for: ${city}, ${state}`)
    
    const cityLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=airbnb&beds=${propertyType}`
    
    const cityResult = await callMashvisorAPI(cityLookupUrl, mashvisorApiKey, `City lookup for ${city}`)
    
    if (cityResult.success) {
      console.log(`✅ City lookup successful for ${city}`)
      return new Response(
        JSON.stringify({
          success: true,
          data: cityResult.data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // Final fallback
    console.log(`❌ All lookups failed for ${city}`)
    return new Response(
      JSON.stringify({
        success: false,
        data: {
          city: city,
          state: state,
          message: `No data available for ${city}. Please try a different city.`
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge Function Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Service temporarily unavailable'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
