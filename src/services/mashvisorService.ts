
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
  
  // Handle the lookup endpoint response - REAL DATA PROCESSING
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    console.log('📊 Content structure:', {
      median_rental_income: content.median_rental_income,
      adjusted_rental_income: content.adjusted_rental_income,
      median_night_rate: content.median_night_rate,
      median_occupancy_rate: content.median_occupancy_rate,
      state: content.market?.state || content.state
    });
    
    const stateName = content.market?.state || content.state || 'Unknown State';
    
    // Extract actual revenue data from the lookup response
    if (content.median_rental_income || content.adjusted_rental_income) {
      const monthlyRevenue = content.adjusted_rental_income || content.median_rental_income || 0;
      const nightRate = content.median_night_rate || 0;
      const occupancyRate = content.median_occupancy_rate || 0;
      
      // Calculate annual revenue from monthly
      const annualRevenue = Math.round(monthlyRevenue * 12);
      
      // Estimate traditional rent (STR typically 2-3x traditional rent)
      const estimatedMonthlyRent = Math.round(monthlyRevenue / 2.5); // Conservative 2.5x multiple
      
      // Add main state data point
      if (annualRevenue > 0) {
        const multiple = estimatedMonthlyRent > 0 ? annualRevenue / (estimatedMonthlyRent * 12) : 0;
        
        processedData.push({
          submarket: `${stateName} State Average`,
          strRevenue: annualRevenue,
          medianRent: estimatedMonthlyRent * 12, // Annual rent for comparison
          multiple: multiple
        });
      }

      // Add night rate analysis if available
      if (nightRate > 0) {
        const estimatedAnnualFromNightRate = Math.round(nightRate * 365 * (occupancyRate / 100 || 0.6));
        const rentFromNightRate = Math.round(estimatedAnnualFromNightRate / (12 * 2.5));
        const multipleFromNightRate = rentFromNightRate > 0 ? estimatedAnnualFromNightRate / (rentFromNightRate * 12) : 0;
        
        if (estimatedAnnualFromNightRate > 0) {
          processedData.push({
            submarket: `${stateName} - Based on $${nightRate}/night at ${occupancyRate}% occupancy`,
            strRevenue: estimatedAnnualFromNightRate,
            medianRent: rentFromNightRate * 12,
            multiple: multipleFromNightRate
          });
        }
      }
    }
  }

  // Handle fallback data structure (when API is down) - NO FAKE MARKET AREAS
  else if (marketData && marketData.data && marketData.data.fallback) {
    console.log('🔄 API unavailable - no market data to display');
    
    processedData.push({
      submarket: 'Mashvisor API temporarily unavailable',
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // If no valid data found, return informative message
  if (processedData.length === 0) {
    console.log('❌ No valid data found in API response');
    processedData.push({
      submarket: 'No market data available for this state',
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
    multiple: d.multiple.toFixed(2)
  })));
  
  return processedData;
};
