
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
  
  // Handle the response data structure from investment endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle investment response structure
    if (data.content) {
      const content = data.content;
      
      // Handle single city investment data
      if (content.airbnb_revenue || content.traditional_rental || content.rental_income) {
        const airbnbRevenue = content.airbnb_revenue || content.str_revenue || 0;
        const traditionalRent = content.traditional_rental || content.rental_income || content.long_term_rental || 0;
        const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
        
        processedData.push({
          submarket: content.city || data.city || 'Market Analysis',
          strRevenue: airbnbRevenue,
          medianRent: traditionalRent,
          multiple: multiple
        });
      }
      
      // Handle multiple properties or submarkets within investment data
      if (content.properties && Array.isArray(content.properties)) {
        content.properties.forEach((property: any, index: number) => {
          const airbnbRevenue = property.airbnb_revenue || property.str_revenue || property.rental_income_airbnb || 0;
          const traditionalRent = property.rental_income || property.long_term_rental || property.traditional_rental || 0;
          const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
          
          processedData.push({
            submarket: property.neighborhood || property.address || `Property ${index + 1}`,
            strRevenue: airbnbRevenue,
            medianRent: traditionalRent,
            multiple: multiple
          });
        });
      }
      
      // Handle investment metrics by property type
      if (content.property_types && typeof content.property_types === 'object') {
        Object.keys(content.property_types).forEach((propertyType) => {
          const typeData = content.property_types[propertyType];
          const airbnbRevenue = typeData.airbnb_revenue || typeData.str_revenue || 0;
          const traditionalRent = typeData.traditional_rental || typeData.rental_income || 0;
          const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
          
          processedData.push({
            submarket: `${propertyType} Properties`,
            strRevenue: airbnbRevenue,
            medianRent: traditionalRent,
            multiple: multiple
          });
        });
      }
    }
    
    // Handle direct data structure
    if (data.airbnb_revenue || data.rental_income || data.traditional_rental) {
      const airbnbRevenue = data.airbnb_revenue || data.str_revenue || 0;
      const traditionalRent = data.rental_income || data.traditional_rental || data.long_term_rental || 0;
      const multiple = traditionalRent > 0 ? airbnbRevenue / traditionalRent : 0;
      
      processedData.push({
        submarket: data.city || 'Market Analysis',
        strRevenue: airbnbRevenue,
        medianRent: traditionalRent,
        multiple: multiple
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Investment Data Available',
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
