
import { supabase } from '@/integrations/supabase/client';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const fetchRealMarketData = async (city: string, propertyType: string, bathrooms: string) => {
  try {
    console.log(`🚀 Calling AirDNA API for ${city}`);
    
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

    console.log('✅ AirDNA API response:', data);
    
    return data;
  } catch (error) {
    console.error('❌ AirDNA API error:', error);
    throw error;
  }
};

export const processMarketData = (marketData: any): SubmarketData[] => {
  const processedData: SubmarketData[] = [];
  
  console.log('🔍 Processing AirDNA market data:', marketData);
  
  // Handle successful API response with market data
  if (marketData && marketData.success && marketData.data) {
    const responseData = marketData.data;
    
    // Handle AirDNA properties data structure
    const properties = responseData.properties || [];
    
    console.log('📊 Processing AirDNA properties:', properties);
    
    // Process properties data from AirDNA
    if (Array.isArray(properties) && properties.length > 0) {
      // Group properties by neighborhood/area and calculate averages
      const neighborhoodData = new Map();
      
      properties.forEach((property: any) => {
        const neighborhood = property.neighborhood || property.district || property.area || 'Unknown Area';
        const revenue = property.revenue || property.annual_revenue || property.monthly_revenue * 12 || 0;
        const occupancy = property.occupancy_rate || property.occupancy || 0.75; // default 75%
        const adr = property.adr || property.average_daily_rate || 0;
        
        // Calculate annualized revenue if needed
        let annualRevenue = revenue;
        if (adr > 0 && occupancy > 0) {
          annualRevenue = adr * 365 * (occupancy / 100);
        }
        
        if (!neighborhoodData.has(neighborhood)) {
          neighborhoodData.set(neighborhood, {
            revenues: [],
            count: 0
          });
        }
        
        const data = neighborhoodData.get(neighborhood);
        if (annualRevenue > 0) {
          data.revenues.push(annualRevenue);
          data.count++;
        }
      });
      
      // Calculate averages for each neighborhood
      neighborhoodData.forEach((data, neighborhood) => {
        if (data.revenues.length > 0) {
          const avgRevenue = data.revenues.reduce((sum: number, rev: number) => sum + rev, 0) / data.revenues.length;
          
          // Estimate rent (typically 60-80% of STR revenue for similar properties)
          const estimatedRent = avgRevenue * 0.7;
          const multiple = estimatedRent > 0 ? avgRevenue / estimatedRent : 0;
          
          processedData.push({
            submarket: `${neighborhood}, ${responseData.city}`,
            strRevenue: Math.round(avgRevenue),
            medianRent: Math.round(estimatedRent),
            multiple: multiple
          });
        }
      });
    }
  }
  
  // Handle API failure or no data
  if (processedData.length === 0) {
    console.log('❌ No valid market data found from AirDNA');
    
    const city = marketData?.data?.city || 'Unknown City';
    const message = marketData?.data?.message || marketData?.data?.error || 'No market data available';
    
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
