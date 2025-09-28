import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalculatorIcon, ArrowLeft, DollarSign, Home, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CompsSection } from '@/components/calc/CompsSection';
import { BuildOutSection } from '@/components/calc/BuildOutSection';
import { ExpensesSection } from '@/components/calc/ExpensesSection';
import { NetProfitSection } from '@/components/calc/NetProfitSection';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

export interface CalculatorData {
  // Comps
  address: string;
  bedrooms: number;
  bathrooms: number;
  averageComparable: number;
  
  // Build Out
  firstMonthRent: number;
  securityDeposit: number;
  furnishingsCost: number;
  buildOutMiscellaneous: number;
  
  // Expenses
  rent: number;
  serviceFees: number;
  maintenance: number;
  power: number;
  waterSewer: number;
  internet: number;
  taxLicense: number;
  insurance: number;
  software: number;
  miscellaneous: number;
  furnitureRental: number;
  
  // Furnishings Calculator
  squareFootage: number;
  furnishingsPSF: number;
}

const Calc = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login?redirect=/calc');
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const initialData: CalculatorData = {
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    averageComparable: 0,
    firstMonthRent: 0,
    securityDeposit: 0,
    furnishingsCost: 0,
    buildOutMiscellaneous: 0,
    rent: 0,
    serviceFees: 0,
    maintenance: 0,
    power: 0,
    waterSewer: 0,
    internet: 0,
    taxLicense: 0,
    insurance: 0,
    software: 0,
    miscellaneous: 0,
    furnitureRental: 0,
    squareFootage: 0,
    furnishingsPSF: 8,
  };
  
  const [data, setData] = useState<CalculatorData>(initialData);

  // Calculate derived values
  const cashToLaunch = Math.round(data.firstMonthRent + data.securityDeposit + data.buildOutMiscellaneous + data.furnishingsCost);
  const serviceFeeCalculated = Math.round(data.rent * 0.029);
  const monthlyExpenses = Math.round(data.rent + serviceFeeCalculated + data.maintenance + data.power + 
                         data.waterSewer + data.internet + data.taxLicense + data.insurance + 
                         data.software + data.furnitureRental);
  const monthlyRevenue = Math.round(data.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  
  const paybackMonths = (cashToLaunch > 0 && netProfitMonthly > 0) 
    ? cashToLaunch / netProfitMonthly
    : null;
    
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  // Helper function to parse and validate numeric input
  const parseNumericInput = (value: string): number => {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(Math.abs(num));
  };

  const updateData = (updates: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const clearAllData = () => {
    setData(initialData);
    toast({
      title: "Calculator Reset",
      description: "All data has been cleared successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAllData}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Calculator
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <CalculatorIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">STR Calculator</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Analyze Short-Term Rental Property Profitability
            </p>
          </div>
        </div>

        {/* Calculator Sections */}
        <div className="space-y-8">
          {/* Input Sections Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BuildOutSection 
              data={data} 
              updateData={updateData} 
              cashToLaunch={cashToLaunch}
              parseNumericInput={parseNumericInput}
            />
            
            <ExpensesSection 
              data={data} 
              updateData={updateData} 
              serviceFeeCalculated={serviceFeeCalculated}
              monthlyExpenses={monthlyExpenses}
              parseNumericInput={parseNumericInput}
            />
            
            <CompsSection 
              data={data} 
              updateData={updateData}
              parseNumericInput={parseNumericInput}
            />
          </div>

          {/* Results Section */}
          <div className="max-w-2xl mx-auto">
            <NetProfitSection 
              monthlyRevenue={monthlyRevenue}
              netProfitMonthly={netProfitMonthly}
              paybackMonths={paybackMonths}
              cashOnCashReturn={cashOnCashReturn}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Calc;
