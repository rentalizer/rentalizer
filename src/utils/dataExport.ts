
interface ExportData {
  submarket: string;
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
  
  // Monthly variation factors for STR revenue (typical seasonal patterns)
  const monthlyFactors: { [key: string]: number } = {
    'January': 0.85,    // Post-holiday low
    'February': 0.88,   // Winter low
    'March': 0.95,      // Spring pickup
    'April': 1.02,      // Spring increase
    'May': 1.08,        // Peak season starts
    'June': 1.15,       // Summer peak
    'July': 1.20,       // Peak summer
    'August': 1.18,     // Late summer peak
    'September': 1.05,  // Fall shoulder
    'October': 0.98,    // Fall decrease
    'November': 0.92,   // Pre-holiday low
    'December': 1.12    // Holiday boost
  };
  
  const currentYear = new Date().getFullYear();
  
  // Create expanded data with monthly variations
  const expandedData: Array<{
    year: number;
    submarket: string;
    month: string;
    actualRevenue: number;
    revenuePlus25: number;
    total: number;
    medianRent: number;
    multiple: number;
  }> = [];
  
  data.forEach(submarketData => {
    months.forEach((month) => {
      // Apply seasonal variation to get actual monthly revenue
      const monthlyFactor = monthlyFactors[month];
      const actualMonthlyRevenue = Math.round(submarketData.strRevenue * monthlyFactor);
      
      // Add 25% to the actual revenue
      const revenuePlus25 = Math.round(actualMonthlyRevenue * 1.25);
      
      // Calculate multiple based on revenue + 25%
      const monthlyMultiple = revenuePlus25 / submarketData.medianRent;
      
      expandedData.push({
        year: currentYear,
        submarket: submarketData.submarket,
        month,
        actualRevenue: actualMonthlyRevenue,
        revenuePlus25: revenuePlus25,
        total: revenuePlus25, // The total is the revenue + 25%
        medianRent: submarketData.medianRent,
        multiple: monthlyMultiple
      });
    });
  });
  
  // Create CSV headers
  const headers = ['Year', 'Submarket', 'Month', 'STR Revenue', 'Revenue + 25%', 'Total', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','),
    ...expandedData.map(row => [
      row.year,
      `"${row.submarket}"`,
      `"${row.month}"`,
      row.actualRevenue,
      row.revenuePlus25,
      row.total,
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
