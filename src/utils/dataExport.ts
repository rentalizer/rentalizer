
interface ExportData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const exportToCSV = (data: ExportData[], filename: string = 'market-analysis') => {
  // Generate 12 months of data for each submarket with realistic seasonal variations
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Seasonal multipliers based on typical STR patterns (higher in summer/holidays)
  const seasonalMultipliers = [
    0.85, // January - lower after holidays
    0.80, // February - lowest month
    0.90, // March - spring pickup
    0.95, // April - spring continues
    1.05, // May - good weather starts
    1.20, // June - peak summer begins
    1.25, // July - peak summer
    1.22, // August - still peak
    1.10, // September - good weather continues
    1.00, // October - baseline
    0.95, // November - cooling down
    1.15  // December - holiday boost
  ];
  
  const currentYear = new Date().getFullYear();
  
  // Create expanded data with seasonal variations
  const expandedData: Array<{
    year: number;
    submarket: string;
    month: string;
    actualRevenue: number;
    revenuePlus25: number;
    medianRent: number;
    multiple: number;
  }> = [];
  
  data.forEach(submarketData => {
    months.forEach((month, monthIndex) => {
      // Apply seasonal variation to the base STR revenue
      const seasonalMultiplier = seasonalMultipliers[monthIndex];
      const monthlyRevenue = Math.round(submarketData.strRevenue * seasonalMultiplier);
      
      // Add 25% to the seasonal revenue
      const revenuePlus25 = Math.round(monthlyRevenue * 1.25);
      
      // Calculate multiple based on revenue + 25%
      const monthlyMultiple = revenuePlus25 / submarketData.medianRent;
      
      expandedData.push({
        year: currentYear,
        submarket: submarketData.submarket,
        month,
        actualRevenue: monthlyRevenue,
        revenuePlus25: revenuePlus25,
        medianRent: submarketData.medianRent,
        multiple: monthlyMultiple
      });
    });
  });
  
  // Create CSV headers
  const headers = ['Year', 'Submarket', 'Month', 'STR Revenue', 'Revenue + 25%', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...expandedData.map(row => [
      row.year,
      `"${row.submarket}"`,
      `"${row.month}"`,
      row.actualRevenue,
      row.revenuePlus25,
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
