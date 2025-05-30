
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
  
  const currentYear = new Date().getFullYear();
  
  // Create expanded data with consistent monthly calculations
  const expandedData: Array<{
    year: number;
    submarket: string;
    month: string;
    strRevenue: number;
    medianRent: number;
    multiple: number;
  }> = [];
  
  data.forEach(submarketData => {
    // Calculate annual revenue (add 25% to monthly revenue then multiply by 12)
    const annualRevenue = submarketData.strRevenue * 1.25 * 12;
    
    // Calculate gross monthly earnings (divide annual by 12)
    const grossMonthlyEarnings = Math.round(annualRevenue / 12);
    
    months.forEach((month) => {
      const monthlyMultiple = grossMonthlyEarnings / submarketData.medianRent;
      
      expandedData.push({
        year: currentYear,
        submarket: submarketData.submarket,
        month,
        strRevenue: grossMonthlyEarnings,
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
