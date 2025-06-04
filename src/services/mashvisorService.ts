
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
  
  // Handle the response data structure from top-markets endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Handle top markets response structure
    if (data.content && data.content.markets && Array.isArray(data.content.markets)) {
      const markets = data.content.markets;
      
      markets.forEach((market: any, index: number) => {
        const cityName = market.city || market.name || `Market ${index + 1}`;
        const strRevenue = market.airbnb_revenue || market.str_revenue || market.short_term_rental_revenue || 0;
        const medianRent = market.traditional_revenue || market.long_term_rental || market.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: cityName,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle alternative structure if markets is at root level
    if (data.markets && Array.isArray(data.markets)) {
      data.markets.forEach((market: any, index: number) => {
        const cityName = market.city || market.name || `Market ${index + 1}`;
        const strRevenue = market.airbnb_revenue || market.str_revenue || market.short_term_rental_revenue || 0;
        const medianRent = market.traditional_revenue || market.long_term_rental || market.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: cityName,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle if data is directly an array of markets
    if (Array.isArray(data)) {
      data.forEach((market: any, index: number) => {
        const cityName = market.city || market.name || `Market ${index + 1}`;
        const strRevenue = market.airbnb_revenue || market.str_revenue || market.short_term_rental_revenue || 0;
        const medianRent = market.traditional_revenue || market.long_term_rental || market.median_rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: cityName,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
  }

  // If no valid data found, create a sample entry to show structure
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No Market Data Available',
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
