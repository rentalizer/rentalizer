import { CalculatorData } from '@/pages/Calculator';

interface CalculatorExportData {
  // Property Information
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  
  // Revenue & Expenses
  averageComparable: number;
  rent: number;
  serviceFees: number;
  maintenance: number;
  power: number;
  waterSewer: number;
  internet: number;
  taxLicense: number;
  insurance: number;
  software: number;
  furnitureRental: number;
  
  // Build Out Costs
  firstMonthRent: number;
  securityDeposit: number;
  miscellaneous: number;
  calculatedFurnishings: number;
  
  // Analysis Results
  cashToLaunch: number;
  monthlyExpenses: number;
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const exportCalculatorToCSV = (
  data: CalculatorData,
  calculatedValues: {
    cashToLaunch: number;
    monthlyExpenses: number;
    monthlyRevenue: number;
    netProfitMonthly: number;
    paybackMonths: number | null;
    cashOnCashReturn: number;
    calculatedFurnishings: number;
  },
  filename: string = 'RentalizerCalc-Analysis'
) => {
  console.log('=== CALCULATOR CSV EXPORT DEBUG START ===');
  console.log('Exporting calculator data:', data);
  console.log('Calculated values:', calculatedValues);
  
  // Create export data structure
  const exportData: CalculatorExportData = {
    // Property Information
    address: data.address,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    squareFootage: data.squareFootage,
    
    // Revenue & Expenses
    averageComparable: data.averageComparable,
    rent: data.rent,
    serviceFees: data.serviceFees,
    maintenance: data.maintenance,
    power: data.power,
    waterSewer: data.waterSewer,
    internet: data.internet,
    taxLicense: data.taxLicense,
    insurance: data.insurance,
    software: data.software,
    furnitureRental: data.furnitureRental,
    
    // Build Out Costs
    firstMonthRent: data.firstMonthRent,
    securityDeposit: data.securityDeposit,
    miscellaneous: data.miscellaneous,
    calculatedFurnishings: calculatedValues.calculatedFurnishings,
    
    // Analysis Results
    cashToLaunch: calculatedValues.cashToLaunch,
    monthlyExpenses: calculatedValues.monthlyExpenses,
    monthlyRevenue: calculatedValues.monthlyRevenue,
    netProfitMonthly: calculatedValues.netProfitMonthly,
    paybackMonths: calculatedValues.paybackMonths,
    cashOnCashReturn: calculatedValues.cashOnCashReturn,
  };
  
  // Create CSV structure with categories
  const csvRows = [
    // Headers
    ['Category', 'Item', 'Value'],
    
    // Property Information
    ['Property Information', 'Address', `"${exportData.address}"`],
    ['Property Information', 'Bedrooms', exportData.bedrooms.toString()],
    ['Property Information', 'Bathrooms', exportData.bathrooms.toString()],
    ['Property Information', 'Square Footage', exportData.squareFootage.toString()],
    ['', '', ''], // Empty row for spacing
    
    // Revenue
    ['Revenue', 'Average Comparable (Monthly)', exportData.averageComparable.toString()],
    ['', '', ''], // Empty row for spacing
    
    // Monthly Expenses
    ['Monthly Expenses', 'Rent', exportData.rent.toString()],
    ['Monthly Expenses', 'Service Fees (2.9%)', exportData.serviceFees.toString()],
    ['Monthly Expenses', 'Maintenance', exportData.maintenance.toString()],
    ['Monthly Expenses', 'Power', exportData.power.toString()],
    ['Monthly Expenses', 'Water/Sewer', exportData.waterSewer.toString()],
    ['Monthly Expenses', 'Internet', exportData.internet.toString()],
    ['Monthly Expenses', 'Tax/License', exportData.taxLicense.toString()],
    ['Monthly Expenses', 'Insurance', exportData.insurance.toString()],
    ['Monthly Expenses', 'Software', exportData.software.toString()],
    ['Monthly Expenses', 'Furniture Rental', exportData.furnitureRental.toString()],
    ['', '', ''], // Empty row for spacing
    
    // Build Out Costs
    ['Build Out Costs', 'First Month Rent', exportData.firstMonthRent.toString()],
    ['Build Out Costs', 'Security Deposit', exportData.securityDeposit.toString()],
    ['Build Out Costs', 'Miscellaneous', exportData.miscellaneous.toString()],
    ['Build Out Costs', 'Calculated Furnishings', exportData.calculatedFurnishings.toString()],
    ['', '', ''], // Empty row for spacing
    
    // Analysis Results
    ['Analysis Results', 'Total Cash to Launch', exportData.cashToLaunch.toString()],
    ['Analysis Results', 'Total Monthly Expenses', exportData.monthlyExpenses.toString()],
    ['Analysis Results', 'Monthly Revenue', exportData.monthlyRevenue.toString()],
    ['Analysis Results', 'Net Monthly Profit', exportData.netProfitMonthly.toString()],
    ['Analysis Results', 'Payback Period (Months)', exportData.paybackMonths?.toFixed(1) || 'N/A'],
    ['Analysis Results', 'Cash on Cash Return (%)', exportData.cashOnCashReturn.toString()],
  ];
  
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  
  console.log('Final CSV content:');
  console.log(csvContent);
  console.log('=== CALCULATOR CSV EXPORT DEBUG END ===');
  
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

// Keep the existing exportToExcel function for compatibility
export const exportToExcel = exportCalculatorToCSV;
