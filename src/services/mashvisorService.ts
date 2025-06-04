
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
      
      console.log(`🏙️ Processing ${cityName}:`, cityData);
      
      if (cityData && cityData.status === 'success' && cityData.content) {
        const content = cityData.content;
        
        // Extract STR revenue data
        const strRevenue = content.adjusted_rental_income || content.median_rental_income || 0;
        
        // Calculate traditional rent estimate based on property value and market ratios
        const homeValue = content.median_home_value || 0;
        const priceToRentRatio = content.price_to_rent_ratio || 12; // Default market ratio
        const estimatedMonthlyRent = homeValue > 0 ? homeValue / priceToRentRatio : 0;
        const annualRent = estimatedMonthlyRent * 12;
        
        console.log(`📈 ${cityName} - STR: $${strRevenue}, Rent: $${annualRent}`);
        
        if (strRevenue > 0) {
          const multiple = annualRent > 0 ? strRevenue / annualRent : 0;
          
          processedData.push({
            submarket: `${cityName}, ${cityResult.state}`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(annualRent),
            multiple: multiple
          });
        } else {
          // Add city with no STR data
          processedData.push({
            submarket: `${cityName}, ${cityResult.state} - No STR Data`,
            strRevenue: 0,
            medianRent: Math.round(annualRent),
            multiple: 0
          });
        }
      } else {
        // Add city with no data
        processedData.push({
          submarket: `${cityName}, ${cityResult.state} - API Error`,
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
    rent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
