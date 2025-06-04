
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real Mashvisor API for ${city}`);
    
    const { data, error } = await supabase.functions.invoke('mashvisor-api', {
      body: {
        city,
        propertyType,
        bathrooms
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

const fetchRentDataFromOpenAI = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🤖 Calling OpenAI API for rent data in ${city}`);
    
    const { data, error } = await supabase.functions.invoke('openai-rent-lookup', {
      body: {
        city,
        propertyType,
        bathrooms
      }
    });

    if (error) {
      console.error('❌ OpenAI API call failed:', error.message);
      return null;
    }

    if (!data || !data.success) {
      console.error('❌ OpenAI API returned error:', data);
      return null;
    }

    console.log('✅ OpenAI rent data response:', data.data);
    return data.data;
  } catch (error) {
    console.error('❌ OpenAI rent lookup error:', error);
    return null;
  }
};

// Helper function to find matching neighborhood rent
const findNeighborhoodRent = (locationName: string, rentData: any, cityAverage: number) => {
  if (!rentData || !rentData.neighborhoods) {
    return cityAverage;
  }

  // Clean up location name for better matching
  const cleanLocationName = locationName
    .replace(/^.*,\s*/, '') // Remove city prefix like "Austin, "
    .toLowerCase()
    .trim();

  console.log(`🔍 Looking for rent data for: "${cleanLocationName}"`);

  // Try exact match first
  for (const [neighborhood, rent] of Object.entries(rentData.neighborhoods)) {
    if (neighborhood.toLowerCase() === cleanLocationName) {
      console.log(`🎯 Exact match found: ${neighborhood} = $${rent}`);
      return rent as number;
    }
  }

  // Try partial matches for common neighborhood patterns
  const neighborhoodMappings = {
    'downtown': ['downtown', 'central', 'city center'],
    'east': ['east austin', 'eastside'],
    'south': ['south austin', 'south congress', 'south lamar'],
    'west': ['west austin', 'westlake', 'west campus'],
    'north': ['north austin', 'north loop'],
    'mueller': ['mueller'],
    'zilker': ['zilker', 'south lamar'],
    'clarksville': ['clarksville'],
    'hyde park': ['hyde park'],
    'university': ['university', 'west campus'],
    'domain': ['domain', 'north austin'],
    'four points': ['four points', 'westlake']
  };

  for (const [key, variations] of Object.entries(neighborhoodMappings)) {
    if (variations.some(variation => cleanLocationName.includes(variation))) {
      // Find matching OpenAI neighborhood
      for (const [neighborhood, rent] of Object.entries(rentData.neighborhoods)) {
        const neighborhoodLower = neighborhood.toLowerCase();
        if (variations.some(variation => neighborhoodLower.includes(variation))) {
          console.log(`🎯 Pattern match found: ${cleanLocationName} → ${neighborhood} = $${rent}`);
          return rent as number;
        }
      }
    }
  }

  console.log(`⚠️ No match found for "${cleanLocationName}", using city average: $${cityAverage}`);
  return cityAverage;
};

export const processMarketData = async (marketData: any, city: string, propertyType: string, bathrooms: string): Promise<SubmarketData[]> => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Get rent data from OpenAI
  const rentData = await fetchRentDataFromOpenAI(city, propertyType, bathrooms);
  console.log('🏠 OpenAI rent data received:', rentData);
  
  // Handle successful API response
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle rento-calculator-lookup data with neighborhoods_with_revenue
    if (responseData.source === 'rento-calculator-lookup' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing rento-calculator lookup data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((location: any) => {
        const locationName = location.neighborhood || location.property_address || 'Unknown Location';
        const annualStrRevenue = location.airbnb_revenue || 0;
        const monthlyStrRevenue = Math.round(annualStrRevenue / 12); // Convert annual to monthly
        
        // Apply 25% markup to STR revenue as per your formula
        const strRevenueWith25Markup = Math.round(monthlyStrRevenue * 1.25);
        
        console.log(`📈 Processing location: ${locationName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}`);
        
        // Use rent from OpenAI with improved neighborhood matching
        const medianRent = findNeighborhoodRent(locationName, rentData, rentData?.cityAverage || 0);
        
        if (strRevenueWith25Markup > 0) {
          const multiple = medianRent > 0 ? strRevenueWith25Markup / medianRent : 0;
          
          processedData.push({
            submarket: locationName,
            strRevenue: strRevenueWith25Markup, // STR revenue with 25% markup
            medianRent: medianRent, // From OpenAI API with improved matching
            multiple: multiple
          });
        }
      });
    }
    
    // Handle fallback case with basic content structure
    else if (responseData.content) {
      const content = responseData.content;
      
      console.log('📊 Processing fallback rento-calculator data:', content);
      
      // Try to extract revenue data from various field names
      const monthlyStrRevenue = content.airbnb_revenue || content.revenue || content.revpar || content.revpan || 0;
      const nightRate = content.median_night_rate || content.night_rate || content.nightly_rate || 0;
      const occupancyRate = content.median_occupancy_rate || content.occupancy || content.occupancy_rate || 0;
      
      console.log(`📊 Extracted data - Monthly STR: $${monthlyStrRevenue}, Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%`);
      
      let calculatedMonthlyStr = monthlyStrRevenue;
      
      // Calculate STR revenue from night rate and occupancy if needed
      if (nightRate > 0 && occupancyRate > 0 && calculatedMonthlyStr === 0) {
        const daysPerMonth = 30;
        const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth;
        calculatedMonthlyStr = nightRate * occupiedDaysPerMonth;
        
        console.log(`💡 Calculated monthly STR revenue: $${nightRate} x ${occupiedDaysPerMonth} days/month = $${calculatedMonthlyStr}/month`);
      }
      
      // Apply 25% markup to STR revenue as per your formula
      const strRevenueWith25Markup = Math.round(calculatedMonthlyStr * 1.25);
      
      // Use rent from OpenAI
      const medianRent = rentData?.cityAverage || 0;
      
      if (strRevenueWith25Markup > 0) {
        const multiple = medianRent > 0 ? strRevenueWith25Markup / medianRent : 0;
        
        processedData.push({
          submarket: `${responseData.city} - City Data`,
          strRevenue: strRevenueWith25Markup, // STR revenue with 25% markup
          medianRent: medianRent, // From OpenAI API
          multiple: multiple
        });
      }
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid data found from Mashvisor');
    
    const cityName = marketData?.data?.city || city || 'Unknown City';
    const message = marketData?.data?.message || 'No revenue data available from Mashvisor API';
    
    // Still try to get rent data from OpenAI even if Mashvisor failed
    const medianRent = rentData?.cityAverage || 0;
    
    processedData.push({
      submarket: `${cityName} - ${message}`,
      strRevenue: 0,
      medianRent: medianRent,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first) - only meaningful if we have revenue data
  if (processedData.some(d => d.strRevenue > 0)) {
    processedData.sort((a, b) => b.strRevenue - a.strRevenue);
  }

  console.log('✅ Final processed market data with improved rent matching:', processedData.map(d => ({
    submarket: d.submarket,
    monthlyRevenueWith25Markup: d.strRevenue,
    monthlyRentFromOpenAI: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
