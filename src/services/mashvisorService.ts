
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

export const processMarketData = (marketData: any): SubmarketData[] => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing market data structure:', marketData);
  
  // Handle successful API response
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle rento-calculator-lookup data with neighborhoods_with_revenue
    if (responseData.source === 'rento-calculator-lookup' && responseData.content?.neighborhoods_with_revenue) {
      console.log('📊 Processing rento-calculator lookup data from Mashvisor API');
      
      const neighborhoodsWithRevenue = responseData.content.neighborhoods_with_revenue;
      
      neighborhoodsWithRevenue.forEach((location: any) => {
        const locationName = location.neighborhood || location.property_address || 'Unknown Location';
        const strRevenue = location.airbnb_revenue || 0;
        const rentRevenue = location.rental_income || 0;
        const dataSource = location.data_source || 'unknown';
        
        console.log(`📈 Processing location: ${locationName}, STR: $${strRevenue}, Rent: $${rentRevenue}, Source: ${dataSource}`);
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${locationName}`,
            strRevenue: strRevenue,
            medianRent: rentRevenue,
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
      const monthlyRentRevenue = content.median_rental_income || content.adjusted_rental_income || content.rental_income || content.rent || 0;
      const nightRate = content.median_night_rate || content.night_rate || content.nightly_rate || 0;
      const occupancyRate = content.median_occupancy_rate || content.occupancy || content.occupancy_rate || 0;
      
      console.log(`📊 Extracted data - Monthly STR: $${monthlyStrRevenue}, Monthly Rent: $${monthlyRentRevenue}, Night Rate: $${nightRate}, Occupancy: ${occupancyRate}%`);
      
      let annualStrRevenue = monthlyStrRevenue * 12;
      let annualRentRevenue = monthlyRentRevenue * 12;
      
      // Calculate STR revenue from night rate and occupancy if needed
      if (nightRate > 0 && occupancyRate > 0 && annualStrRevenue === 0) {
        const daysPerMonth = 30;
        const occupiedDaysPerMonth = (occupancyRate / 100) * daysPerMonth;
        const monthlyCalculatedStr = nightRate * occupiedDaysPerMonth;
        annualStrRevenue = monthlyCalculatedStr * 12;
        
        console.log(`💡 Calculated STR revenue: $${nightRate} x ${occupiedDaysPerMonth} days/month x 12 = $${annualStrRevenue}/year`);
      }
      
      if (annualStrRevenue > 0 || annualRentRevenue > 0) {
        const multiple = annualRentRevenue > 0 ? annualStrRevenue / annualRentRevenue : 0;
        
        processedData.push({
          submarket: `${responseData.city} - City Data`,
          strRevenue: Math.round(annualStrRevenue),
          medianRent: Math.round(annualRentRevenue),
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

  console.log('✅ Processed market data:', processedData.map(d => ({
    submarket: d.submarket,
    revenue: d.strRevenue,
    rent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
