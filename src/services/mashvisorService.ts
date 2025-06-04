
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
  
  // Handle the response data structure from property analytics endpoint
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    
    // If content is an object with property analytics data
    if (content.airbnb && content.traditional_rental) {
      const airbnbRevenue = content.airbnb.revenue || 0;
      const traditionalRent = content.traditional_rental.revenue || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: content.neighborhood || content.area || `${marketData.data.city || 'Unknown City'} Center`,
        strRevenue: airbnbRevenue,
        medianRent: traditionalRent,
        multiple: multiple
      });
    }
    // If content is an array of neighborhood data
    else if (Array.isArray(content)) {
      content.forEach((item: any) => {
        const airbnbRevenue = item.airbnb?.revenue || item.airbnb_revenue || 0;
        const traditionalRent = item.traditional_rental?.revenue || item.rental_income || 0;
        const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
        
        processedData.push({
          submarket: item.neighborhood || item.area || item.name || 'Unknown Area',
          strRevenue: airbnbRevenue,
          medianRent: traditionalRent,
          multiple: multiple
        });
      });
    }
    // If it's a single property analysis
    else if (typeof content === 'object') {
      const airbnbRevenue = content.airbnb_revenue || content.str_revenue || 0;
      const traditionalRent = content.rental_income || content.median_rent || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: content.neighborhood || content.area || 'Market Analysis',
        strRevenue: airbnbRevenue,
        medianRent: traditionalRent,
        multiple: multiple
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Data Available',
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by multiple (highest first), with failed data at the end
  processedData.sort((a, b) => {
    if (a.multiple === 0 && b.multiple === 0) return 0;
    if (a.multiple === 0) return 1;
    if (b.multiple === 0) return -1;
    return b.multiple - a.multiple;
  });

  return processedData;
};
