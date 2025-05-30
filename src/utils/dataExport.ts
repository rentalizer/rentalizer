
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
    strRevenue: number;
    medianRent: number;
    multiple: number;
  }> = [];
  
  data.forEach(submarketData => {
    // Base annual calculation: add 25% to monthly revenue then multiply by 12
    const baseAnnualRevenue = submarketData.strRevenue * 1.25 * 12;
    
    // Calculate base monthly earnings (divide annual by 12)
    const baseMonthlyEarnings = baseAnnualRevenue / 12;
    
    months.forEach((month) => {
      // Apply seasonal variation to monthly revenue
      const monthlyFactor = monthlyFactors[month];
      const adjustedMonthlyRevenue = Math.round(baseMonthlyEarnings * monthlyFactor);
      
      // Rent stays consistent month-to-month
      const monthlyMultiple = adjustedMonthlyRevenue / submarketData.medianRent;
      
      expandedData.push({
        year: currentYear,
        submarket: submarketData.submarket,
        month,
        strRevenue: adjustedMonthlyRevenue,
        medianRent: submarketData.medianRent,
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
