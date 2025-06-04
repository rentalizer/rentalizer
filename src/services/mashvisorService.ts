
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

  // Handle the revenue-stats endpoint response
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    
    // Check if we have rental income data
    if (content.rental_income) {
      const rentalIncome = content.rental_income;
      
      // Create revenue statistics breakdown
      const revenueStats = [
        {
          name: 'Top 5% Properties',
          revenue: rentalIncome.percentile_95 || 0,
          percentile: '95th percentile'
        },
        {
          name: 'Top 10% Properties', 
          revenue: rentalIncome.percentile_90 || 0,
          percentile: '90th percentile'
        },
        {
          name: 'Top 20% Properties',
          revenue: rentalIncome.percentile_80 || 0,
          percentile: '80th percentile'
        },
        {
          name: 'Median Performance',
          revenue: rentalIncome.median || 0,
          percentile: '50th percentile'
        },
        {
          name: 'Bottom 20% Properties',
          revenue: rentalIncome.percentile_20 || 0,
          percentile: '20th percentile'
        }
      ];

      // Estimate rent based on common STR multiple (typically 2-4x rent)
      // Using conservative 2.5x multiple for estimation
      const estimatedMultiple = 2.5;
      
      revenueStats.forEach((stat) => {
        if (stat.revenue > 0) {
          const estimatedRent = Math.round(stat.revenue / estimatedMultiple);
          
          processedData.push({
            submarket: `${stat.name} (${stat.percentile})`,
            strRevenue: Math.round(stat.revenue),
            medianRent: estimatedRent,
            multiple: estimatedMultiple
          });
        }
      });

      // Add market overview with actual data
      if (rentalIncome.avg > 0) {
        const avgRent = Math.round(rentalIncome.avg / estimatedMultiple);
        processedData.unshift({
          submarket: `Market Average (${content.count || 0} properties analyzed)`,
          strRevenue: Math.round(rentalIncome.avg),
          medianRent: avgRent,
          multiple: estimatedMultiple
        });
      }
    }
    
    // If we still have no data, show informative message
    if (processedData.length === 0) {
      processedData.push({
        submarket: 'Revenue data available but no rent comparisons found',
        strRevenue: content.rental_income?.median || 0,
        medianRent: 0,
        multiple: 0
      });
    }
  }

  // If no valid data found, create an informative message
  if (processedData.length === 0) {
    processedData.push({
      submarket: 'No market data available for this location',
      strRevenue: 0,
      medianRent: 0,
      multiple: 0
    });
  }

  // Sort by STR revenue (highest first) since we have that data
  processedData.sort((a, b) => {
    if (a.strRevenue === 0 && b.strRevenue === 0) return 0;
    if (a.strRevenue === 0) return 1;
    if (b.strRevenue === 0) return -1;
    return b.strRevenue - a.strRevenue;
  });

  return processedData;
};
