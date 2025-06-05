import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

// Mapping of zip codes to actual neighborhood names
const zipToNeighborhoodMap: { [key: string]: string } = {
  // Austin, TX
  '78701': 'Downtown Austin',
  '78702': 'East Austin',
  '78703': 'Tarrytown',
  '78704': 'South Austin/Zilker',
  '78705': 'West Campus',
  '78712': 'University of Texas',
  '78717': 'Cedar Park',
  '78721': 'MLK/East Austin',
  '78722': 'Windsor Park',
  '78723': 'Georgian Acres',
  '78724': 'Del Valle',
  '78725': 'Pleasant Valley',
  '78726': 'Four Points',
  '78727': 'Allandale',
  '78728': 'Steiner Ranch',
  '78729': 'Northwest Hills',
  '78730': 'River Place',
  '78731': 'Northwest Austin',
  '78732': 'Lakeway',
  '78733': 'Bee Cave',
  '78734': 'Lakeway/Rough Hollow',
  '78735': 'Barton Creek',
  '78736': 'Oak Hill',
  '78737': 'Circle C',
  '78738': 'Bee Cave/Hill Country',
  '78739': 'Barton Creek West',
  '78741': 'Dove Springs',
  '78742': 'Montopolis',
  '78744': 'South Austin',
  '78745': 'South Lamar',
  '78746': 'West Lake Hills',
  '78747': 'Slaughter Lane',
  '78748': 'Sunset Valley',
  '78749': 'Circle C Ranch',
  '78750': 'Anderson Mill',
  '78751': 'Crestview',
  '78752': 'North Austin/Wooten',
  '78753': 'Coronado Hills',
  '78754': 'Walnut Creek',
  '78756': 'Brentwood',
  '78757': 'Allandale/Crestview',
  '78758': 'North Shoal Creek',
  '78759': 'Great Hills',
  
  // Houston, TX
  '77002': 'Downtown Houston',
  '77003': 'Third Ward',
  '77004': 'Museum District',
  '77005': 'West University',
  '77006': 'River Oaks',
  '77007': 'The Heights',
  '77008': 'Garden Oaks',
  '77019': 'River Oaks/Galleria',
  '77024': 'Memorial',
  '77025': 'Bellaire',
  '77027': 'River Oaks',
  '77030': 'Medical Center',
  '77035': 'Meyerland',
  '77056': 'Galleria',
  '77057': 'Galleria/Westside',
  '77063': 'Westchase',
  '77077': 'Energy Corridor',
  '77079': 'Memorial Northwest',
  '77098': 'Montrose',
  '77054': 'Midtown',
  '77081': 'Westbury',
  '77092': 'Northwest Houston',
  '77096': 'Sharpstown',
  '77401': 'Bellaire',
  '77429': 'Cypress',
  '77433': 'Cypress Northwest',
  '77449': 'Katy',
  '77459': 'Missouri City',
  '77478': 'Sugar Land',
  '77494': 'Katy/Cinco Ranch',

  // Dallas, TX
  '75201': 'Downtown Dallas',
  '75202': 'Deep Ellum',
  '75204': 'Fair Park',
  '75205': 'Highland Park',
  '75206': 'Lakewood',
  '75214': 'East Dallas',
  '75218': 'Casa Linda',
  '75219': 'Turtle Creek',
  '75225': 'Preston Center',
  '75230': 'North Dallas',
  '75240': 'Richardson',
  '75207': 'Oak Cliff',
  '75208': 'Kessler Park',
  '75209': 'Bluffview',
  '75220': 'Love Field',
  '75231': 'White Rock Lake',
  '75235': 'Hampton Roads',
  '75390': 'University Park',
  '75243': 'Lake Highlands',
  '75248': 'North Dallas/Addison',

  // Miami, FL
  '33101': 'Downtown Miami',
  '33109': 'Fisher Island',
  '33114': 'Doral',
  '33125': 'Flagami',
  '33129': 'South Beach',
  '33130': 'Edgewater',
  '33131': 'Brickell',
  '33132': 'Downtown/Park West',
  '33134': 'Coral Gables',
  '33139': 'South Beach',
  '33140': 'Mid-Beach',
  '33141': 'Bay Harbor Islands',
  '33142': 'Liberty City',
  '33143': 'Coral Gables',
  '33144': 'Coral Gables/Westchester',
  '33145': 'Coral Gables',
  '33146': 'Coral Gables',
  '33147': 'Little Haiti',
  '33149': 'South Beach',
  '33150': 'Sunny Isles Beach'
};

const getNeighborhoodName = (zipCode: string, city: string): string => {
  const neighborhoodName = zipToNeighborhoodMap[zipCode];
  return neighborhoodName ? `${city}, ${neighborhoodName}` : `${city}, ${zipCode}`;
};

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real Mashvisor API for ${city}`);
    
    const { data, error } = await supabase.functions.invoke('mashvisor-api', {
      body: {
        city,
        propertyType,
        bathrooms,
        requestNeighborhoods: true,
        comprehensiveNeighborhoods: true
      }
    });

    if (error) {
      throw new Error(`API call failed: ${error.message}`);
    }

    console.log('✅ Real Mashvisor API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Mashvisor API error:', error);
    throw error;
  }
};

export const processMarketData = async (marketData: any, city: string, propertyType: string, bathrooms: string): Promise<SubmarketData[]> => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Helper function to accurately calculate monthly STR revenue
  const calculateAccurateSTRRevenue = (data: any): number => {
    const nightRate = data.median_night_rate || data.night_rate || data.nightly_rate || 0;
    const occupancyRate = data.median_occupancy_rate || data.occupancy || data.occupancy_rate || 0;
    const revpar = data.revpar || data.revpan || 0;
    const directMonthlyRevenue = data.monthly_revenue || data.airbnb_revenue || 0;
    
    console.log(`📊 Revenue calculation for area - Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%, RevPAR: $${revpar}, Direct: $${directMonthlyRevenue}`);
    
    let monthlyRevenue = 0;
    
    // Method 1: Use RevPAR (most accurate daily revenue metric)
    if (revpar > 0) {
      monthlyRevenue = revpar * 30; // RevPAR is daily revenue per available room
      console.log(`💰 Using RevPAR calculation: $${revpar} × 30 days = $${monthlyRevenue}/month`);
    }
    // Method 2: Calculate from night rate and occupancy
    else if (nightRate > 0 && occupancyRate > 0) {
      const daysPerMonth = 30;
      const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth;
      monthlyRevenue = nightRate * occupiedDaysPerMonth;
      console.log(`💰 Using night rate calculation: $${nightRate} × ${occupiedDaysPerMonth.toFixed(1)} occupied days = $${monthlyRevenue}/month`);
    }
    // Method 3: Use direct monthly revenue if available and reasonable
    else if (directMonthlyRevenue > 500 && directMonthlyRevenue < 20000) {
      monthlyRevenue = directMonthlyRevenue;
      console.log(`💰 Using direct monthly revenue: $${directMonthlyRevenue}/month`);
    }
    
    return Math.round(monthlyRevenue);
  };

  // Handle successful API response
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle comprehensive neighborhoods from enhanced search
    if (responseData.allNeighborhoods && Array.isArray(responseData.allNeighborhoods)) {
      console.log(`📊 Processing ${responseData.allNeighborhoods.length} comprehensive neighborhoods`);
      
      responseData.allNeighborhoods.forEach((neighborhood: any) => {
        // Extract zip code from the original name and convert to friendly neighborhood name
        const originalName = neighborhood.name || neighborhood.neighborhood || neighborhood.area || neighborhood.location || 'Unknown';
        const zipCodeMatch = originalName.match(/Zip (\d{5})/);
        const zipCode = zipCodeMatch ? zipCodeMatch[1] : null;
        
        const displayName = zipCode ? getNeighborhoodName(zipCode, city) : `${city}, ${originalName}`;
        
        // Calculate accurate STR revenue
        const monthlyStrRevenue = calculateAccurateSTRRevenue(neighborhood);
        
        // Apply 25% markup to STR revenue
        const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
        
        // Extract rental data - be more precise about which field to use
        const monthlyRent = neighborhood.rental_income || neighborhood.median_rental_income || neighborhood.traditional_rental || neighborhood.rent || neighborhood.median_rent || 0;
        
        // Only include neighborhoods with meaningful data
        if (monthlyStrRevenue > 0 || monthlyRent > 0) {
          console.log(`📈 Adding neighborhood: ${displayName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}, Rent: $${monthlyRent}`);
          
          const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
          
          processedData.push({
            submarket: displayName,
            strRevenue: strRevenueWith25Markup,
            medianRent: monthlyRent,
            multiple: multiple
          });
        }
      });
    }
    
    // Handle rento-calculator-lookup data with neighborhoods_with_revenue
    else if (responseData.source === 'rento-calculator-lookup' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing rento-calculator lookup data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((location: any) => {
        const locationName = location.neighborhood || location.property_address || location.area || 'Unknown Location';
        
        // Calculate accurate STR revenue
        const monthlyStrRevenue = calculateAccurateSTRRevenue(location);
        
        // Apply 25% markup to STR revenue
        const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
        
        // Get rental data
        const monthlyRent = location.rental_income || location.median_rental_income || location.traditional_rental || location.rent || 0;
        
        if (monthlyStrRevenue > 0 || monthlyRent > 0) {
          console.log(`📈 Adding location: ${locationName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}, Rent: $${monthlyRent}`);
          
          const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
          
          processedData.push({
            submarket: `${city}, ${locationName}`,
            strRevenue: strRevenueWith25Markup,
            medianRent: monthlyRent,
            multiple: multiple
          });
        }
      });
    }
    
    // Handle standard city-level data as fallback
    else if (responseData.content) {
      const content = responseData.content;
      
      console.log('📊 Processing city-level data as fallback:', content);
      
      // Calculate accurate STR revenue for city
      const monthlyStrRevenue = calculateAccurateSTRRevenue(content);
      
      // Apply 25% markup to STR revenue
      const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
      
      // Get rental data
      const monthlyRent = content.median_rental_income || content.rental_income || content.rent || 0;
      
      if (monthlyStrRevenue > 0 || monthlyRent > 0) {
        const multiple = (strRevenueWith25Markup > 0 && monthlyRent > 0) ? strRevenueWith25Markup / monthlyRent : 0;
        
        processedData.push({
          submarket: `${responseData.city || city}, City Average`,
          strRevenue: strRevenueWith25Markup,
          medianRent: monthlyRent,
          multiple: multiple
        });
      }
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid data found from Mashvisor');
    
    const cityName = marketData?.data?.city || city || 'Unknown City';
    const message = marketData?.data?.message || 'No neighborhood data available from Mashvisor API';
    
    processedData.push({
      submarket: `${cityName}, ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Remove duplicates based on submarket name
  const uniqueData = processedData.filter((item, index, self) => 
    index === self.findIndex(t => t.submarket === item.submarket)
  );

  // Sort by multiple first (highest revenue-to-rent ratio), then by STR revenue
  uniqueData.sort((a, b) => {
    if (a.multiple > 0 && b.multiple > 0) {
      return b.multiple - a.multiple;
    }
    return b.strRevenue - a.strRevenue;
  });

  console.log(`✅ Final processed neighborhoods (${uniqueData.length} unique):`, uniqueData.map(d => ({
    neighborhood: d.submarket,
    monthlyRevenueWith25Markup: d.strRevenue,
    monthlyRentFromMashvisor: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return uniqueData;
};
