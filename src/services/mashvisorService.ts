
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
  
  // Handle the lookup endpoint response with revenue statistics
  if (marketData && marketData.data && marketData.data.content) {
    const content = marketData.data.content;
    
    // Extract rental income statistics
    if (content.rental_income) {
      const rentalIncome = content.rental_income;
      const cityName = content.city || 'City';
      
      // Create performance tiers based on percentiles
      const performanceTiers = [
        {
          tier: 'Top 5% Performers',
          revenue: Math.round(rentalIncome.percentile_95 || 0),
          percentile: 95
        },
        {
          tier: 'Top 10% Performers', 
          revenue: Math.round(rentalIncome.percentile_90 || 0),
          percentile: 90
        },
        {
          tier: 'Top 20% Performers',
          revenue: Math.round(rentalIncome.percentile_80 || 0),
          percentile: 80
        },
        {
          tier: 'Median Performance',
          revenue: Math.round(rentalIncome.median || 0),
          percentile: 50
        },
        {
          tier: 'Bottom 20% Performance',
          revenue: Math.round(rentalIncome.percentile_20 || 0),
          percentile: 20
        },
        {
          tier: 'Bottom 10% Performance',
          revenue: Math.round(rentalIncome.percentile_10 || 0),
          percentile: 10
        }
      ];

      // Calculate estimated rent based on typical market ratios
      // STR properties typically rent for 1.5-3x traditional rent
      const avgMultiple = 2.2; // Conservative estimate
      
      performanceTiers.forEach(tier => {
        if (tier.revenue > 0) {
          const estimatedRent = Math.round(tier.revenue / avgMultiple);
          const actualMultiple = estimatedRent > 0 ? tier.revenue / estimatedRent : 0;
          
          processedData.push({
            submarket: `${cityName} - ${tier.tier}`,
            strRevenue: tier.revenue,
            medianRent: estimatedRent,
            multiple: actualMultiple
          });
        }
      });

      // Add average performance if available
      if (rentalIncome.avg) {
        const avgRevenue = Math.round(rentalIncome.avg);
        const estimatedRent = Math.round(avgRevenue / avgMultiple);
        const actualMultiple = estimatedRent > 0 ? avgRevenue / estimatedRent : 0;
        
        processedData.push({
          submarket: `${cityName} - Average Performance`,
          strRevenue: avgRevenue,
          medianRent: estimatedRent,
          multiple: actualMultiple
        });
      }
    }
  }

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

  // Sort by STR revenue (highest first)
  processedData.sort((a, b) => b.strRevenue - a.strRevenue);

  console.log('✅ Processed market data:', processedData);
  return processedData;
};
