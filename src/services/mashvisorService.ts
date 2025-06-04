
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
  
  // Handle fallback data structure
  if (marketData && marketData.data && marketData.data.fallback) {
    const comps = marketData.data.comps || [];
    
    comps.forEach((comp: any) => {
      const address = comp.address || 'Unknown Area';
      const strRevenue = comp.airbnb_revenue || 0;
      const medianRent = comp.long_term_rent || 0;
      const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
      
      processedData.push({
        submarket: address,
        strRevenue: Math.round(strRevenue),
        medianRent: Math.round(medianRent),
        multiple: multiple
      });
    });

    // Sort by multiple (highest first)
    processedData.sort((a, b) => b.multiple - a.multiple);
    
    return processedData;
  }

  // Handle the response data structure from rento-calculator/revenue-stats endpoint
  if (marketData && marketData.data) {
    const data = marketData.data;
    
    // Check if the API returned a status indicating no data available
    if (data.content && data.content.status === 40 && !data.content.stats) {
      console.log('⚠️ Mashvisor API returned status 40 - no revenue stats available for this market');
      
      processedData.push({
        submarket: `No revenue statistics available for this market`,
        strRevenue: 0,
        medianRent: 0,
        multiple: 0
      });
      
      return processedData;
    }
    
    // Handle revenue-stats response structure
    if (data.content && data.content.stats) {
      const stats = data.content.stats;
      
      // Process different submarkets or neighborhoods if available
      if (stats.neighborhoods && Array.isArray(stats.neighborhoods)) {
        stats.neighborhoods.forEach((neighborhood: any, index: number) => {
          const name = neighborhood.name || neighborhood.neighborhood || `Neighborhood ${index + 1}`;
          const strRevenue = neighborhood.airbnb_revenue || neighborhood.str_revenue || neighborhood.revenue || 0;
          const medianRent = neighborhood.traditional_rent || neighborhood.long_term_rent || neighborhood.rent || 0;
          const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
          
          if (strRevenue > 0 && medianRent > 0) {
            processedData.push({
              submarket: name,
              strRevenue: Math.round(strRevenue),
              medianRent: Math.round(medianRent),
              multiple: multiple
            });
          }
        });
      }
      
      // If no neighborhoods, try to use overall stats
      if (processedData.length === 0 && stats.average) {
        const avgStats = stats.average;
        const strRevenue = avgStats.airbnb_revenue || avgStats.str_revenue || avgStats.revenue || 0;
        const medianRent = avgStats.traditional_rent || avgStats.long_term_rent || avgStats.rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: `${marketData.data.city || 'City'} Average`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      }
      
      // If still no data, try direct stats properties
      if (processedData.length === 0) {
        const strRevenue = stats.airbnb_revenue || stats.str_revenue || stats.revenue || 0;
        const medianRent = stats.traditional_rent || stats.long_term_rent || stats.rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: `${marketData.data.city || 'Market'} Statistics`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      }
    }
    
    // Handle if data is directly an array of stats
    if (Array.isArray(data)) {
      data.forEach((stat: any, index: number) => {
        const name = stat.name || stat.neighborhood || stat.submarket || `Area ${index + 1}`;
        const strRevenue = stat.airbnb_revenue || stat.str_revenue || stat.revenue || 0;
        const medianRent = stat.traditional_rent || stat.long_term_rent || stat.rent || 0;
        const multiple = medianRent > 0 ? strRevenue / medianRent : 0;
        
        if (strRevenue > 0 && medianRent > 0) {
          processedData.push({
            submarket: name,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(medianRent),
            multiple: multiple
          });
        }
      });
    }
  }

  // If no valid data found, create a more informative message
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'Mashvisor API - No revenue statistics available for this market',
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
