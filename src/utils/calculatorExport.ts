import { CalculatorData } from '@/pages/Calculator';

export const exportToExcel = async (data: any, filename: string) => {
  // Simple CSV export function
  const csvContent = `Property Address,${data.propertyAddress}
Monthly Rent,${data.rent}
Comps Count,${data.comps.length}
Expenses Count,${data.expenses.length}
Furnishings Count,${data.furnishings.length}
BuildOut Count,${data.buildOut.length}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};