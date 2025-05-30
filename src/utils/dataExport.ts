
interface ExportData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const exportToCSV = (data: ExportData[], filename: string = 'market-analysis') => {
  // Create CSV headers - simplified to actual useful data
  const headers = ['Year', 'Submarket', 'STR Revenue', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  const currentYear = new Date().getFullYear();
  
  // Convert data to CSV format - one row per submarket with actual data
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      currentYear,
      `"${row.submarket}"`,
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
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
