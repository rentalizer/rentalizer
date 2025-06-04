
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
  
  // Handle the lookup endpoint response - REAL DATA PROCESSING
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    console.log('📊 Content structure:', {
      median_rental_income: content.median_rental_income,
      adjusted_rental_income: content.adjusted_rental_income,
      median_night_rate: content.median_night_rate,
      median_occupancy_rate: content.median_occupancy_rate,
      city: content.market?.city || content.city
    });
    
    const cityName = content.market?.city || content.city || 'Unknown City';
    
    // Extract actual revenue data from the lookup response
    if (content.median_rental_income || content.adjusted_rental_income) {
      const monthlyRevenue = content.adjusted_rental_income || content.median_rental_income || 0;
      const nightRate = content.median_night_rate || 0;
      const occupancyRate = content.median_occupancy_rate || 0;
      
      // Calculate annual revenue from monthly
      const annualRevenue = Math.round(monthlyRevenue * 12);
      
      // Generate performance scenarios based on occupancy variations
      const performanceScenarios = [
        {
          name: 'High Performance (80% occupancy)',
          revenue: Math.round(annualRevenue * 1.2), // 20% above median
          occupancy: 80
        },
        {
          name: 'Above Average (70% occupancy)', 
          revenue: Math.round(annualRevenue * 1.1), // 10% above median
          occupancy: 70
        },
        {
          name: 'Market Average',
          revenue: annualRevenue,
          occupancy: occupancyRate || 55
        },
        {
          name: 'Below Average (45% occupancy)',
          revenue: Math.round(annualRevenue * 0.85), // 15% below median
          occupancy: 45
        },
        {
          name: 'Low Performance (35% occupancy)',
          revenue: Math.round(annualRevenue * 0.7), // 30% below median
          occupancy: 35
        }
      ];

      // Estimate traditional rent (STR typically 2-3x traditional rent)
      const estimatedMonthlyRent = Math.round(monthlyRevenue / 2.2); // Conservative 2.2x multiple
      
      performanceScenarios.forEach(scenario => {
        if (scenario.revenue > 0) {
          const multiple = estimatedMonthlyRent > 0 ? scenario.revenue / (estimatedMonthlyRent * 12) : 0;
          
          processedData.push({
            submarket: `${cityName} - ${scenario.name}`,
            strRevenue: scenario.revenue,
            medianRent: estimatedMonthlyRent * 12, // Annual rent for comparison
            multiple: multiple
          });
        }
      });

      // Add detailed breakdown if we have night rate data
      if (nightRate > 0) {
        const estimatedAnnualFromNightRate = Math.round(nightRate * 365 * (occupancyRate / 100));
        const rentFromNightRate = Math.round(estimatedAnnualFromNightRate / (12 * 2.2));
        const multipleFromNightRate = rentFromNightRate > 0 ? estimatedAnnualFromNightRate / (rentFromNightRate * 12) : 0;
        
        processedData.push({
          submarket: `${cityName} - Night Rate Analysis ($${nightRate}/night)`,
          strRevenue: estimatedAnnualFromNightRate,
          medianRent: rentFromNightRate * 12,
          multiple: multipleFromNightRate
        });
      }
    }
  }

  // Handle fallback data structure (when API is down)
  else if (marketData && marketData.data && marketData.data.fallback) {
    console.log('🔄 Processing fallback data');
    const comps = marketData.data.comps || [];
    
    comps.forEach((comp: any) => {
      const address = comp.address || 'Unknown Area';
      const monthlyStrRevenue = comp.airbnb_revenue || 0;
      const monthlyRent = comp.long_term_rent || 0;
      
      // Convert to annual figures for consistency
      const annualStrRevenue = monthlyStrRevenue * 12;
      const annualRent = monthlyRent * 12;
      const multiple = annualRent > 0 ? annualStrRevenue / annualRent : 0;
      
      processedData.push({
        submarket: address,
        strRevenue: annualStrRevenue,
        medianRent: annualRent,
        multiple: multiple
      });
    });
  }

  // If no valid data found, return informative message
  if (processedData.length === 0) {
    console.log('❌ No valid data found in API response');
    processedData.push({
      submarket: 'No market data available - API returned no revenue statistics',
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
