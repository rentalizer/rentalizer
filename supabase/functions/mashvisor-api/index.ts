
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

// Expanded zip code to neighborhood mapping for cleaner display
const zipToNeighborhoodMap: { [key: string]: { [key: string]: string } } = {
  'miami': {
    '33101': 'Downtown Miami',
    '33109': 'South Beach',
    '33114': 'Doral',
    '33125': 'Little Havana',
    '33129': 'Brickell',
    '33130': 'Midtown Miami',
    '33131': 'Downtown Core',
    '33132': 'Arts District',
    '33134': 'Coral Gables',
    '33139': 'Miami Beach',
    '33140': 'North Beach',
    '33141': 'North Miami Beach',
    '33142': 'Liberty City',
    '33143': 'Coral Terrace',
    '33144': 'Flagami'
  },
  'austin': {
    '78701': 'Downtown Austin',
    '78702': 'East Austin',
    '78703': 'Zilker',
    '78704': 'South Lamar',
    '78705': 'West Campus',
    '78712': 'University Area',
    '78717': 'The Domain',
    '78721': 'Mueller',
    '78722': 'Clarksville',
    '78723': 'Hyde Park',
    '78724': 'Del Valle',
    '78725': 'Montopolis',
    '78726': 'Four Points',
    '78727': 'Allandale',
    '78728': 'Oak Hill',
    '78729': 'Northwest Hills',
    '78730': 'West Lake Hills',
    '78731': 'Tarrytown',
    '78732': 'Bee Cave',
    '78733': 'Steiner Ranch'
  },
  'houston': {
    '77002': 'Downtown Houston',
    '77003': 'Third Ward',
    '77004': 'Museum District',
    '77005': 'Rice Village',
    '77006': 'River Oaks',
    '77007': 'Heights',
    '77008': 'Garden Oaks',
    '77019': 'Galleria',
    '77024': 'Memorial',
    '77025': 'Bellaire',
    '77027': 'River Oaks',
    '77030': 'Texas Medical Center',
    '77035': 'Meyerland',
    '77056': 'Uptown',
    '77057': 'Westchase',
    '77063': 'Southwest Houston',
    '77077': 'Energy Corridor',
    '77079': 'Memorial Villages',
    '77098': 'Montrose'
  },
  'dallas': {
    '75201': 'Downtown Dallas',
    '75202': 'Arts District',
    '75204': 'Fair Park',
    '75205': 'Highland Park',
    '75206': 'Lakewood',
    '75214': 'White Rock',
    '75218': 'Casa Linda',
    '75219': 'Turtle Creek',
    '75225': 'Preston Center',
    '75230': 'North Dallas',
    '75240': 'Richardson',
    '75201': 'Deep Ellum',
    '75207': 'Oak Cliff',
    '75208': 'Kessler Park',
    '75209': 'Bluffview',
    '75220': 'Love Field',
    '75231': 'Lake Highlands',
    '75235': 'Redbird'
  },
  'denver': {
    '80202': 'Downtown Denver',
    '80203': 'Capitol Hill',
    '80204': 'Highlands',
    '80205': 'Park Hill',
    '80206': 'Cherry Creek',
    '80209': 'Glendale',
    '80210': 'Washington Park',
    '80211': 'Berkeley',
    '80218': 'Mayfair',
    '80220': 'Lowry',
    '80222': 'Glendale',
    '80224': 'Goldsmith',
    '80230': 'Stapleton',
    '80238': 'Montbello',
    '80239': 'Gateway',
    '80246': 'Virginia Village',
    '80247': 'Westwood'
  }
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
    
    // Try city-level lookup first for comprehensive data
    console.log(`🏙️ Trying city-level lookup for: ${city}, ${state}`)
    
    const cityLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&city=${encodeURIComponent(city)}&resource=airbnb&beds=${propertyType}`
    
    const cityResult = await callMashvisorAPI(cityLookupUrl, mashvisorApiKey, `City lookup for ${city}`)
    
    if (cityResult.success && cityResult.data.content) {
      console.log(`✅ City lookup successful for ${city}`)
      
      const content = cityResult.data.content
      
      // Extract city-level revenue data - trying multiple field names
      const monthlyStrRevenue = content.airbnb_revenue || content.revenue || content.revpar || content.revpan || 0
      const monthlyRentRevenue = content.median_rental_income || content.adjusted_rental_income || content.rental_income || content.rent || 0
      const nightRate = content.median_night_rate || content.night_rate || content.nightly_rate || 0
      const occupancyRate = content.median_occupancy_rate || content.occupancy || content.occupancy_rate || 0
      
      console.log(`📈 City ${city} data - STR: $${monthlyStrRevenue}, Rent: $${monthlyRentRevenue}, Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%`)
      
      // Calculate annual revenues and estimated STR if needed
      let annualStrRevenue = monthlyStrRevenue * 12
      let annualRentRevenue = monthlyRentRevenue * 12
      
      // If we have night rate and occupancy, calculate STR revenue
      if (nightRate > 0 && occupancyRate > 0 && annualStrRevenue === 0) {
        const daysPerMonth = 30
        const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth
        const monthlyCalculatedStr = nightRate * occupiedDaysPerMonth
        annualStrRevenue = monthlyCalculatedStr * 12
        
        console.log(`💡 Calculated STR revenue from night rate ($${nightRate}) x occupancy (${occupancyRate}%) = $${monthlyCalculatedStr}/month`)
      }
      
      if (annualStrRevenue > 0 || annualRentRevenue > 0) {
        neighborhoodsWithRevenue.push({
          neighborhood: `${city}, City Average`,
          airbnb_revenue: Math.round(annualStrRevenue),
          rental_income: Math.round(annualRentRevenue),
          occupancy_rate: occupancyRate,
          median_night_rate: nightRate,
          api_neighborhood: city,
          api_city: city,
          api_state: state,
          data_source: 'city_lookup',
          property_address: `${city}, ${state}`,
          property_id: `city-${city.toLowerCase().replace(/\s+/g, '-')}`,
          raw_data: {
            airbnb_revenue: content.airbnb_revenue,
            revenue: content.revenue,
            revpar: content.revpar,
            revpan: content.revpan,
            median_rental_income: content.median_rental_income,
            adjusted_rental_income: content.adjusted_rental_income,
            rental_income: content.rental_income,
            median_night_rate: content.median_night_rate,
            median_occupancy_rate: content.median_occupancy_rate
          }
        })
      }
      
      // Try to get neighborhood-level data by checking different zip codes in the city
      const majorZipCodes: { [key: string]: string[] } = {
        'austin': ['78701', '78702', '78703', '78704', '78705', '78712', '78717', '78721', '78722', '78723', '78724', '78725', '78726', '78727', '78728', '78729', '78730', '78731', '78732', '78733'],
        'houston': ['77002', '77003', '77004', '77005', '77006', '77007', '77008', '77019', '77024', '77025', '77027', '77030', '77035', '77056', '77057', '77063', '77077', '77079', '77098'],
        'dallas': ['75201', '75202', '75204', '75205', '75206', '75214', '75218', '75219', '75225', '75230', '75240', '75207', '75208', '75209', '75220', '75231', '75235'],
        'miami': ['33101', '33109', '33114', '33125', '33129', '33130', '33131', '33132', '33134', '33139', '33140', '33141', '33142', '33143', '33144'],
        'denver': ['80202', '80203', '80204', '80205', '80206', '80209', '80210', '80211', '80218', '80220', '80222', '80224', '80230', '80238', '80239', '80246', '80247']
      }
      
      const zipCodes = majorZipCodes[cityKey] || []
      
      if (zipCodes.length > 0) {
        console.log(`🏘️ Trying ${zipCodes.length} zip codes for neighborhood data in ${city}`)
        
        // Try more zip codes to get better neighborhood variety (up to 10)
        const samplesToTry = zipCodes.slice(0, 10)
        
        for (const zipCode of samplesToTry) {
          try {
            const zipLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}`
            
            const zipResult = await callMashvisorAPI(zipLookupUrl, mashvisorApiKey, `Zip ${zipCode} lookup`)
            
            if (zipResult.success && zipResult.data.content) {
              const zipContent = zipResult.data.content
              
              const zipMonthlyStr = zipContent.airbnb_revenue || zipContent.revenue || zipContent.revpar || zipContent.revpan || 0
              const zipMonthlyRent = zipContent.median_rental_income || zipContent.adjusted_rental_income || zipContent.rental_income || zipContent.rent || 0
              const zipNightRate = zipContent.median_night_rate || zipContent.night_rate || zipContent.nightly_rate || 0
              const zipOccupancy = zipContent.median_occupancy_rate || zipContent.occupancy || zipContent.occupancy_rate || 0
              
              let zipAnnualStr = zipMonthlyStr * 12
              let zipAnnualRent = zipMonthlyRent * 12
              
              // Calculate STR if needed
              if (zipNightRate > 0 && zipOccupancy > 0 && zipAnnualStr === 0) {
                const daysPerMonth = 30
                const occupiedDaysPerMonth = (zipOccupancy / 100) * daysPerMonth
                const monthlyCalculatedStr = zipNightRate * occupiedDaysPerMonth
                zipAnnualStr = monthlyCalculatedStr * 12
              }
              
              if (zipAnnualStr > 0 || zipAnnualRent > 0) {
                // Get neighborhood name from mapping or use a cleaner default
                const neighborhoodName = zipToNeighborhoodMap[cityKey]?.[zipCode] || `District ${zipCode.slice(-2)}`
                
                neighborhoodsWithRevenue.push({
                  neighborhood: `${city}, ${neighborhoodName}`,
                  airbnb_revenue: Math.round(zipAnnualStr),
                  rental_income: Math.round(zipAnnualRent),
                  occupancy_rate: zipOccupancy,
                  median_night_rate: zipNightRate,
                  api_neighborhood: neighborhoodName,
                  api_city: city,
                  api_state: state,
                  data_source: 'zip_lookup',
                  property_address: `${neighborhoodName}, ${city}, ${state}`,
                  property_id: `neighborhood-${neighborhoodName.toLowerCase().replace(/\s+/g, '-')}`,
                  raw_data: {
                    zip_code: zipCode,
                    airbnb_revenue: zipContent.airbnb_revenue,
                    revenue: zipContent.revenue,
                    median_rental_income: zipContent.median_rental_income,
                    adjusted_rental_income: zipContent.adjusted_rental_income,
                    median_night_rate: zipContent.median_night_rate,
                    median_occupancy_rate: zipContent.median_occupancy_rate
                  }
                })
              }
            }
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
            
          } catch (error) {
            console.log(`⚠️ Error fetching zip ${zipCode}:`, error)
            continue
          }
        }
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
