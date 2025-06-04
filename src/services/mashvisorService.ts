
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
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }

    console.log('✅ OpenAI rent data response:', data);
    return data;
  } catch (error) {
    console.error('❌ OpenAI rent lookup error:', error);
    return null;
  }
};

export const processMarketData = async (marketData: any, city: string, propertyType: string, bathrooms: string): Promise<SubmarketData[]> => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Get rent data from OpenAI
  const rentData = await fetchRentDataFromOpenAI(city, propertyType, bathrooms);
  
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
        
        const dataSource = location.data_source || 'unknown';
        
        console.log(`📈 Processing location: ${locationName}, Monthly STR: $${monthlyStrRevenue}, With 25% markup: $${strRevenueWith25Markup}, Source: ${dataSource}`);
        
        // Use rent from OpenAI instead of Mashvisor
        const medianRent = rentData?.neighborhoods?.[locationName] || rentData?.cityAverage || 0;
        
        if (strRevenueWith25Markup > 0 || medianRent > 0) {
          const multiple = medianRent > 0 ? strRevenueWith25Markup / medianRent : 0;
          
          processedData.push({
            submarket: `${locationName}`,
            strRevenue: strRevenueWith25Markup, // STR revenue with 25% markup
            medianRent: medianRent, // From OpenAI API
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
      
      // Use rent from OpenAI instead of Mashvisor
      const medianRent = rentData?.cityAverage || 0;
      
      if (strRevenueWith25Markup > 0 || medianRent > 0) {
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
    console.log('❌ No valid data found');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = marketData?.data?.message || 'No revenue data available from Mashvisor API';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first) - only meaningful if we have revenue data
  if (processedData.some(d => d.strRevenue > 0)) {
    processedData.sort((a, b) => b.strRevenue - a.strRevenue);
  }

  console.log('✅ Processed market data with 25% markup:', processedData.map(d => ({
    submarket: d.submarket,
    monthlyRevenueWith25Markup: d.strRevenue,
    monthlyRentFromOpenAI: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
