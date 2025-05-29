
interface ExportData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

interface MonthlyData {
  month: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const exportToCSV = (data: ExportData[], filename: string = 'market-analysis') => {
  // Generate 12 months of data for each submarket
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentYear = new Date().getFullYear();
  
  // Create expanded data with monthly variations
  const expandedData: Array<{
    year: number;
    submarket: string;
    month: string;
    strRevenue: number;
    medianRent: number;
    multiple: number;
  }> = [];
  
  data.forEach(submarketData => {
    months.forEach((month, index) => {
      // Add seasonal variations with 25% boost for peak months
      const seasonalMultiplier = getSeasonalMultiplier(index);
      const monthlyStrRevenue = Math.round(submarketData.strRevenue * seasonalMultiplier);
      const monthlyRent = Math.round(submarketData.medianRent * (0.95 + (Math.random() * 0.1))); // Small rent variation
      const monthlyMultiple = monthlyStrRevenue / monthlyRent;
      
      expandedData.push({
        year: currentYear,
        submarket: submarketData.submarket,
        month,
        strRevenue: monthlyStrRevenue,
        medianRent: monthlyRent,
        multiple: monthlyMultiple
      });
    });
  });
  
  // Create CSV headers
  const headers = ['Year', 'Submarket', 'Month', 'STR Revenue', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...expandedData.map(row => [
      row.year,
      `"${row.submarket}"`,
      `"${row.month}"`,
      row.strRevenue,
      row.medianRent,
      row.multiple.toFixed(2)
    ].join(','))
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-12-months.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to apply seasonal variations to STR revenue
// Includes 25% boost for peak summer and holiday months
const getSeasonalMultiplier = (monthIndex: number): number => {
  // January = 0, December = 11
  const seasonalFactors = [
    0.85, // January - low season
    0.88, // February - low season
    0.95, // March - spring pickup
    1.05, // April - spring high
    1.15, // May - peak season start
    1.25, // June - summer peak (+25% boost)
    1.30, // July - summer peak (+30% boost)
    1.25, // August - summer peak (+25% boost)
    1.10, // September - fall
    1.05, // October - fall
    1.20, // November - holiday season
    1.25  // December - holiday peak (+25% boost)
  ];
  
  return seasonalFactors[monthIndex];
};
