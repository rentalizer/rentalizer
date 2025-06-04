
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
  
  // Handle successful API response with city data
  if (marketData && marketData.success && marketData.data && marketData.data.content && marketData.data.content.cities) {
    const cities = marketData.data.content.cities;
    console.log('📊 Processing cities data:', cities.length, 'cities found');
    
    cities.forEach((cityResult: any) => {
      const cityName = cityResult.city;
      const cityData = cityResult.data;
      
      if (cityData && cityData.content && cityData.content.airbnb && cityData.content.traditional_rental) {
        const airbnbData = cityData.content.airbnb;
        const rentalData = cityData.content.traditional_rental;
        
        // Extract revenue data (try different possible fields)
        const airbnbRevenue = airbnbData.revenue || airbnbData.annual_revenue || (airbnbData.monthly_revenue * 12) || 0;
        const traditionalRent = (rentalData.monthly_rent * 12) || rentalData.annual_rent || 0;
        
        if (airbnbRevenue > 0 && traditionalRent > 0) {
          const multiple = airbnbRevenue / traditionalRent;
          
          processedData.push({
            submarket: `${cityName}, ${cityResult.state}`,
            strRevenue: Math.round(airbnbRevenue),
            medianRent: Math.round(traditionalRent),
            multiple: multiple
          });
        } else if (airbnbRevenue > 0) {
          // If we have revenue but no rental data, still show the city
          processedData.push({
            submarket: `${cityName}, ${cityResult.state}`,
            strRevenue: Math.round(airbnbRevenue),
            medianRent: 0,
            multiple: 0
          });
        }
      } else {
        // Add city even if no data, to show we tried
        processedData.push({
          submarket: `${cityName}, ${cityResult.state} - No Data`,
          strRevenue: 0,
          medianRent: 0,
          multiple: 0
        });
      }
    });
  }
  
  // Handle API failure or no data
  else {
    console.log('❌ No valid cities data found');
    
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
