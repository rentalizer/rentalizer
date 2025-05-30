
interface StrData {
  submarket: string;
  revenue: number;
}

interface RentData {
  submarket: string;
  rent: number;
}

interface MarketResult {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const calculateMarketMetrics = (
  strData: StrData[],
  rentData: RentData[]
): MarketResult[] => {
  const results: MarketResult[] = [];

  // Create a map of rent data for quick lookup
  const rentMap = new Map(
    rentData.map(item => [item.submarket.toLowerCase().trim(), item.rent])
  );

  // Process each STR data point with REAL data processing
  strData.forEach(strItem => {
    const submarketKey = strItem.submarket.toLowerCase().trim();
    const rent = rentMap.get(submarketKey);

    if (rent && rent > 0) {
      // Use actual revenue from RapidAPI subscription without artificial inflation
      const actualRevenue = strItem.revenue;
      const multiple = actualRevenue / rent;

      // Include markets with realistic multiples from REAL data
      if (multiple >= 1.5) { // More realistic threshold for real data
        results.push({
          submarket: strItem.submarket,
          strRevenue: Math.round(actualRevenue),
          medianRent: rent,
          multiple: multiple
        });
      }
    }
  });

  // Sort by revenue-to-rent multiple (highest first)
  return results.sort((a, b) => b.multiple - a.multiple);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatMultiple = (multiple: number): string => {
  return `${multiple.toFixed(2)}x`;
};
