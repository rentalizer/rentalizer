
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Expanded city to state mapping for major US cities
const cityToStateMap: { [key: string]: string } = {
  // Texas
  'austin': 'TX',
  'houston': 'TX',
  'dallas': 'TX',
  'san antonio': 'TX',
  'fort worth': 'TX',
  'el paso': 'TX',
  'arlington': 'TX',
  'corpus christi': 'TX',
  'plano': 'TX',
  'irving': 'TX',
  
  // California
  'los angeles': 'CA',
  'san francisco': 'CA',
  'san diego': 'CA',
  'san jose': 'CA',
  'fresno': 'CA',
  'sacramento': 'CA',
  'long beach': 'CA',
  'oakland': 'CA',
  'bakersfield': 'CA',
  'anaheim': 'CA',
  'santa ana': 'CA',
  'riverside': 'CA',
  'stockton': 'CA',
  'irvine': 'CA',
  'fremont': 'CA',
  
  // Florida
  'miami': 'FL',
  'tampa': 'FL',
  'orlando': 'FL',
  'jacksonville': 'FL',
  'st. petersburg': 'FL',
  'hialeah': 'FL',
  'tallahassee': 'FL',
  'fort lauderdale': 'FL',
  'port st. lucie': 'FL',
  'cape coral': 'FL',
  'pembroke pines': 'FL',
  'hollywood': 'FL',
  'gainesville': 'FL',
  'coral springs': 'FL',
  'clearwater': 'FL',
  
  // New York
  'new york': 'NY',
  'buffalo': 'NY',
  'rochester': 'NY',
  'yonkers': 'NY',
  'syracuse': 'NY',
  'albany': 'NY',
  'new rochelle': 'NY',
  'mount vernon': 'NY',
  'schenectady': 'NY',
  'utica': 'NY',
  
  // Illinois
  'chicago': 'IL',
  'aurora': 'IL',
  'peoria': 'IL',
  'rockford': 'IL',
  'elgin': 'IL',
  'naperville': 'IL',
  'sterling heights': 'IL',
  'joliet': 'IL',
  'waukegan': 'IL',
  'cicero': 'IL',
  
  // Pennsylvania
  'philadelphia': 'PA',
  'pittsburgh': 'PA',
  'allentown': 'PA',
  'erie': 'PA',
  'reading': 'PA',
  'scranton': 'PA',
  'bethlehem': 'PA',
  'lancaster': 'PA',
  'harrisburg': 'PA',
  'altoona': 'PA',
  
  // Ohio
  'columbus': 'OH',
  'cleveland': 'OH',
  'cincinnati': 'OH',
  'toledo': 'OH',
  'akron': 'OH',
  'dayton': 'OH',
  'parma': 'OH',
  'canton': 'OH',
  'youngstown': 'OH',
  'lorain': 'OH',
  
  // Other major cities
  'phoenix': 'AZ',
  'tucson': 'AZ',
  'mesa': 'AZ',
  'chandler': 'AZ',
  'scottsdale': 'AZ',
  'glendale': 'AZ',
  'tempe': 'AZ',
  
  'atlanta': 'GA',
  'augusta': 'GA',
  'columbus': 'GA',
  'savannah': 'GA',
  'athens': 'GA',
  'sandy springs': 'GA',
  
  'charlotte': 'NC',
  'raleigh': 'NC',
  'greensboro': 'NC',
  'durham': 'NC',
  'winston-salem': 'NC',
  'fayetteville': 'NC',
  'cary': 'NC',
  
  'seattle': 'WA',
  'spokane': 'WA',
  'tacoma': 'WA',
  'vancouver': 'WA',
  'bellevue': 'WA',
  'kent': 'WA',
  'everett': 'WA',
  
  'denver': 'CO',
  'colorado springs': 'CO',
  'aurora': 'CO',
  'fort collins': 'CO',
  'lakewood': 'CO',
  'thornton': 'CO',
  'arvada': 'CO',
  
  'las vegas': 'NV',
  'henderson': 'NV',
  'reno': 'NV',
  'north las vegas': 'NV',
  'sparks': 'NV',
  
  'nashville': 'TN',
  'memphis': 'TN',
  'knoxville': 'TN',
  'chattanooga': 'TN',
  'clarksville': 'TN',
  'murfreesboro': 'TN',
  
  'boston': 'MA',
  'worcester': 'MA',
  'springfield': 'MA',
  'lowell': 'MA',
  'cambridge': 'MA',
  'brockton': 'MA',
  'new bedford': 'MA',
  
  'detroit': 'MI',
  'grand rapids': 'MI',
  'warren': 'MI',
  'sterling heights': 'MI',
  'lansing': 'MI',
  'ann arbor': 'MI',
  'flint': 'MI',
  
  'baltimore': 'MD',
  'frederick': 'MD',
  'rockville': 'MD',
  'gaithersburg': 'MD',
  'bowie': 'MD',
  'hagerstown': 'MD',
  
  'louisville': 'KY',
  'lexington': 'KY',
  'bowling green': 'KY',
  'owensboro': 'KY',
  'covington': 'KY',
  
  'portland': 'OR',
  'salem': 'OR',
  'eugene': 'OR',
  'gresham': 'OR',
  'hillsboro': 'OR',
  'bend': 'OR',
  
  'oklahoma city': 'OK',
  'tulsa': 'OK',
  'norman': 'OK',
  'broken arrow': 'OK',
  'lawton': 'OK',
  
  'milwaukee': 'WI',
  'madison': 'WI',
  'green bay': 'WI',
  'kenosha': 'WI',
  'racine': 'WI',
  
  'minneapolis': 'MN',
  'saint paul': 'MN',
  'rochester': 'MN',
  'duluth': 'MN',
  'bloomington': 'MN',
  
  'kansas city': 'MO',
  'st. louis': 'MO',
  'springfield': 'MO',
  'independence': 'MO',
  'columbia': 'MO',
  
  'virginia beach': 'VA',
  'norfolk': 'VA',
  'chesapeake': 'VA',
  'richmond': 'VA',
  'newport news': 'VA',
  'alexandria': 'VA',
  'hampton': 'VA',
  
  'indianapolis': 'IN',
  'fort wayne': 'IN',
  'evansville': 'IN',
  'south bend': 'IN',
  'carmel': 'IN',
  
  'jacksonville': 'FL',
  'albuquerque': 'NM',
  'omaha': 'NE',
  'lincoln': 'NE',
  'wichita': 'KS',
  'overland park': 'KS',
  'little rock': 'AR',
  'baton rouge': 'LA',
  'new orleans': 'LA',
  'shreveport': 'LA',
  'des moines': 'IA',
  'salt lake city': 'UT',
  'west valley city': 'UT',
  'provo': 'UT',
  'birmingham': 'AL',
  'huntsville': 'AL',
  'mobile': 'AL',
  'jackson': 'MS',
  'charleston': 'SC',
  'columbia': 'SC',
  'north charleston': 'SC'
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
      
      // Calculate proper STR revenue using the right methodology
      const nightRate = content.median_night_rate || content.night_rate || content.nightly_rate || 0
      const occupancyRate = content.median_occupancy_rate || content.occupancy || content.occupancy_rate || 0
      const monthlyRentRevenue = content.median_rental_income || content.adjusted_rental_income || content.rental_income || content.rent || 0
      
      // Calculate monthly STR revenue: (nightly rate × occupancy rate × 30 days)
      let monthlyStrRevenue = 0
      if (nightRate > 0 && occupancyRate > 0) {
        const daysPerMonth = 30
        const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth
        monthlyStrRevenue = nightRate * occupiedDaysPerMonth
        
        console.log(`💰 Calculated STR revenue: $${nightRate}/night × ${occupancyRate}% occupancy × ${daysPerMonth} days = $${monthlyStrRevenue}/month`)
      }
      
      // Fallback: try using revpar if it seems like monthly data
      if (monthlyStrRevenue === 0) {
        const revpar = content.revpar || content.revpan || 0
        if (revpar > 1000) { // If revpar is > $1000, it's likely monthly
          monthlyStrRevenue = revpar
          console.log(`💰 Using revpar as monthly STR revenue: $${monthlyStrRevenue}`)
        } else if (revpar > 0) {
          // If revpar is small, it might be daily - multiply by days and occupancy
          monthlyStrRevenue = revpar * 30
          console.log(`💰 Using revpar as daily STR revenue: $${revpar} × 30 days = $${monthlyStrRevenue}`)
        }
      }
      
      console.log(`📈 City ${city} data - STR: $${monthlyStrRevenue}/month, Rent: $${monthlyRentRevenue}/month, Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%`)
      
      if (monthlyStrRevenue > 0 || monthlyRentRevenue > 0) {
        neighborhoodsWithRevenue.push({
          neighborhood: `${city}, City Average`,
          airbnb_revenue: Math.round(monthlyStrRevenue * 12), // Convert to annual for display
          rental_income: Math.round(monthlyRentRevenue), // Keep monthly
          occupancy_rate: occupancyRate,
          median_night_rate: nightRate,
          api_neighborhood: city,
          api_city: city,
          api_state: state,
          data_source: 'city_lookup',
          property_address: `${city}, ${state}`,
          property_id: `city-${city.toLowerCase().replace(/\s+/g, '-')}`,
          raw_data: {
            calculated_monthly_str: monthlyStrRevenue,
            median_night_rate: nightRate,
            median_occupancy_rate: occupancyRate,
            median_rental_income: monthlyRentRevenue,
            revpar: content.revpar,
            revpan: content.revpan
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
        
        // Try more zip codes to get better neighborhood variety (up to 15)
        const samplesToTry = zipCodes.slice(0, 15)
        
        for (const zipCode of samplesToTry) {
          try {
            const zipLookupUrl = `https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zipCode}&resource=airbnb&beds=${propertyType}`
            
            const zipResult = await callMashvisorAPI(zipLookupUrl, mashvisorApiKey, `Zip ${zipCode} lookup`)
            
            if (zipResult.success && zipResult.data.content) {
              const zipContent = zipResult.data.content
              
              const zipNightRate = zipContent.median_night_rate || zipContent.night_rate || zipContent.nightly_rate || 0
              const zipOccupancy = zipContent.median_occupancy_rate || zipContent.occupancy || zipContent.occupancy_rate || 0
              const zipMonthlyRent = zipContent.median_rental_income || zipContent.adjusted_rental_income || zipContent.rental_income || zipContent.rent || 0
              
              // Calculate monthly STR revenue properly
              let zipMonthlyStr = 0
              if (zipNightRate > 0 && zipOccupancy > 0) {
                const daysPerMonth = 30
                const occupiedDaysPerMonth = (zipOccupancy / 100) * daysPerMonth
                zipMonthlyStr = zipNightRate * occupiedDaysPerMonth
              }
              
              // Fallback to revpar if calculation didn't work
              if (zipMonthlyStr === 0) {
                const revpar = zipContent.revpar || zipContent.revpan || 0
                if (revpar > 1000) {
                  zipMonthlyStr = revpar
                } else if (revpar > 0) {
                  zipMonthlyStr = revpar * 30
                }
              }
              
              if (zipMonthlyStr > 0 || zipMonthlyRent > 0) {
                // Get neighborhood name from mapping or use a cleaner default
                const neighborhoodName = zipToNeighborhoodMap[cityKey]?.[zipCode] || `District ${zipCode.slice(-2)}`
                
                neighborhoodsWithRevenue.push({
                  neighborhood: `${city}, ${neighborhoodName}`,
                  airbnb_revenue: Math.round(zipMonthlyStr * 12), // Convert to annual for display
                  rental_income: Math.round(zipMonthlyRent), // Keep monthly
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
                    calculated_monthly_str: zipMonthlyStr,
                    median_night_rate: zipNightRate,
                    median_occupancy_rate: zipOccupancy,
                    median_rental_income: zipMonthlyRent,
                    revpar: zipContent.revpar,
                    revpan: zipContent.revpan
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
