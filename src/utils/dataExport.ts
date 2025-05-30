
interface ExportData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export const exportToCSV = (data: ExportData[], filename: string = 'market-analysis') => {
  console.log('=== CSV EXPORT DEBUG START ===');
  console.log('exportToCSV called with data:', data);
  console.log('Number of rows to export:', data.length);
  console.log('First row data:', data[0]);
  console.log('All rows:', JSON.stringify(data, null, 2));
  
  if (!data || data.length === 0) {
    console.error('No data provided to export function');
    return;
  }
  
  // Create CSV headers
  const headers = ['Submarket', 'STR Revenue', 'Median Rent', 'Revenue-to-Rent Multiple'];
  
  // Convert data to CSV format - use the exact raw data passed in
  const csvRows = data.map(row => {
    console.log('Processing row for CSV:', row);
    return [
      `"${row.submarket}"`,
      row.strRevenue,
      row.medianRent,
      row.multiple.toFixed(2)
    ].join(',');
  });
  
  const csvContent = [headers.join(','), ...csvRows].join('\n');
  
  console.log('Final CSV content:');
  console.log(csvContent);
  console.log('=== CSV EXPORT DEBUG END ===');
  
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
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};
