
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling real AirDNA API for ${city}`);
    
    const { data, error } = await supabase.functions.invoke('airdna-api', {
      body: {
        city,
        propertyType,
        bathrooms
      }
    });

    if (error) {
      throw new Error(`API call failed: ${error.message}`);
    }

    console.log('✅ Real AirDNA API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ AirDNA API error:', error);
    throw error;
  }
};

export const processMarketData = (marketData: any): SubmarketData[] => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing AirDNA market data structure:', marketData);
  
  // Handle successful API response with market data
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle AirDNA data structure - typically has markets or properties array
    const markets = responseData.markets || responseData.properties || responseData.data || [];
    
    console.log('📊 Processing AirDNA market data:', markets);
    
    // Handle array of markets/properties
    if (Array.isArray(markets)) {
      markets.forEach((market: any) => {
        const marketName = market.market_name || market.name || market.location || 'Unknown Market';
        const strRevenue = (market.revenue || market.adr || market.annual_revenue || 0) * 12; // Annualize if needed
        const rentRevenue = (market.long_term_rental || market.rental_income || market.rent || 0) * 12; // Annualize if needed
        
        if (strRevenue > 0 || rentRevenue > 0) {
          const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
          
          processedData.push({
            submarket: `${marketName} - ${responseData.city}`,
            strRevenue: Math.round(strRevenue),
            medianRent: Math.round(rentRevenue),
            multiple: multiple
          });
        }
      });
    }
    
    // Handle object with market data
    else if (typeof markets === 'object' && markets !== null) {
      Object.keys(markets).forEach((key) => {
        const market = markets[key];
        if (typeof market === 'object') {
          const marketName = market.market_name || market.name || key || 'Unknown Market';
          const strRevenue = (market.revenue || market.adr || market.annual_revenue || 0) * 12;
          const rentRevenue = (market.long_term_rental || market.rental_income || market.rent || 0) * 12;
          
          if (strRevenue > 0 || rentRevenue > 0) {
            const multiple = rentRevenue > 0 ? strRevenue / rentRevenue : 0;
            
            processedData.push({
              submarket: `${marketName} - ${responseData.city}`,
              strRevenue: Math.round(strRevenue),
              medianRent: Math.round(rentRevenue),
              multiple: multiple
            });
          }
        }
      });
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid market data found from AirDNA');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = marketData?.data?.message || 'No market data available';
    
    processedData.push({
      submarket: `${city} - ${message}`,
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Processed AirDNA market data:', processedData.map(d => ({
    submarket: d.submarket,
    revenue: d.strRevenue,
    rent: d.medianRent,
    multiple: d.multiple > 0 ? d.multiple.toFixed(2) : 'N/A'
  })));
  
  return processedData;
};
