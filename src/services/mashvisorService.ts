
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const fetchRealMarketData = async (state: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real Mashvisor API for ${state} state`);
    
    const { data, error } = await supabase.functions.invoke('mashvisor-api', {
      body: {
        state,
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
  
  // Handle successful API response with neighborhoods data
  if (marketData && marketData.success && marketData.data && marketData.data.content && marketData.data.content.neighborhoods) {
    const neighborhoods = marketData.data.content.neighborhoods;
    console.log('📊 Processing neighborhoods data:', neighborhoods.length, 'neighborhoods found');
    
    neighborhoods.forEach((neighborhood: any) => {
      if (neighborhood.airbnb && neighborhood.airbnb.revenue && neighborhood.traditional_rental) {
        const airbnbRevenue = neighborhood.airbnb.revenue.annual || neighborhood.airbnb.revenue.monthly * 12 || 0;
        const traditionalRent = neighborhood.traditional_rental.monthly_rent * 12 || 0;
        
        if (airbnbRevenue > 0 && traditionalRent > 0) {
          const multiple = airbnbRevenue / traditionalRent;
          
          processedData.push({
            submarket: neighborhood.name || 'Unknown Neighborhood',
            strRevenue: Math.round(airbnbRevenue),
            medianRent: Math.round(traditionalRent),
            multiple: multiple
          });
        }
      }
    });
  }
  
  // Handle API failure or no data
  else {
    console.log('❌ No valid neighborhoods data found');
    
    const state = marketData?.data?.state || 'Unknown State';
    const message = marketData?.data?.message || 'No market data available';
    
    processedData.push({
      submarket: `${state} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Processed market data:', processedData.map(d => ({
    submarket: d.submarket,
    revenue: d.strRevenue,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
