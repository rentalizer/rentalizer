
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
  
  // Create expanded data without seasonal variations
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
    months.forEach((month) => {
      // Use the actual STR revenue from the market analysis as-is
      const actualMonthlyRevenue = submarketData.strRevenue;
      
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
        medianRent: submarketData.medianRent,
        multiple: monthlyMultiple
      });
    });
  });
  
  // Create CSV headers - removed "Total" column
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
