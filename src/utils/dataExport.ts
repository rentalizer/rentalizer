
interface ExportData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const exportToCSV = (data: ExportData[], filename: string = 'market-analysis') => {
  console.log('exportToCSV called with data:', data); // Debug log
  console.log('Number of rows to export:', data.length); // Debug log
  
  // Create CSV headers
  const headers = ['Submarket', 'STR Revenue', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  // Convert data to CSV format - use the exact raw data passed in
  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      console.log('Processing row:', row); // Debug log for each row
      return [
        `"${row.submarket}"`,
        row.strRevenue,
        row.medianRent,
        row.multiple.toFixed(2)
      ].join(',');
    })
  ].join('\n');
  
  console.log('Final CSV content:', csvContent); // Debug log
  
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
