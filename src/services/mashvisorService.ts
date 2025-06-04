
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
  
  // Handle the response data structure from rento-calculator lookup endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle rento-calculator response structure
    if (data.content || data.result) {
      const content = data.content || data.result;
      
      // If it's an array of results (multiple properties/areas)
      if (Array.isArray(content)) {
        content.forEach((item: any, index: number) => {
          const airbnbRevenue = item.airbnb_revenue || item.str_revenue || item.rental_income_airbnb || 0;
          const traditionalRent = item.rental_income || item.long_term_rental || item.traditional_rental || 0;
          const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
          
          processedData.push({
            submarket: item.neighborhood || item.area || item.address || `Area ${index + 1}`,
            strRevenue: airbnbRevenue,
            medianRent: traditionalRent,
            multiple: multiple
          });
        });
      }
      // If it's a single result object
      else if (typeof content === 'object') {
        const airbnbRevenue = content.airbnb_revenue || content.str_revenue || content.rental_income_airbnb || 0;
        const traditionalRent = content.rental_income || content.long_term_rental || content.traditional_rental || 0;
        const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
        
        processedData.push({
          submarket: content.neighborhood || content.area || content.address || data.city || 'Market Analysis',
          strRevenue: airbnbRevenue,
          medianRent: traditionalRent,
          multiple: multiple
        });
      }
    }
    // Handle direct data structure
    else if (data.airbnb_revenue || data.rental_income) {
      const airbnbRevenue = data.airbnb_revenue || data.str_revenue || 0;
      const traditionalRent = data.rental_income || data.long_term_rental || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: data.neighborhood || data.area || data.city || 'Market Analysis',
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
