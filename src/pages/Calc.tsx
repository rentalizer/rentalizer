
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-cyan-300 text-xl">Loading...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
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

  // Calculate derived values - all rounded to whole numbers except paybackMonths
  const cashToLaunch = Math.round(data.firstMonthRent + data.securityDeposit + data.buildOutMiscellaneous + data.furnishingsCost);
  const serviceFeeCalculated = Math.round(data.rent * 0.029); // 2.9% of rent, not average comparable
  const monthlyExpenses = Math.round(data.rent + serviceFeeCalculated + data.maintenance + data.power + 
                         data.waterSewer + data.internet + data.taxLicense + data.insurance + 
                         data.software + data.furnitureRental);
  const monthlyRevenue = Math.round(data.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  
  // Payback months calculation with decimals
  const paybackMonths = (cashToLaunch > 0 && netProfitMonthly > 0) 
    ? cashToLaunch / netProfitMonthly  // Keep as decimal for precision
    : null;
    
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  // Update service fees when rent changes
  useEffect(() => {
    setData(prev => ({
      ...prev,
      serviceFees: Math.round(prev.rent * 0.029)
    }));
  }, [data.rent]);

  const updateData = (updates: Partial<CalculatorData>) => {
    // Round all numerical values to remove decimals
    const roundedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = Math.round(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    setData(prev => ({ ...prev, ...roundedUpdates }));
  };

  const clearAllData = () => {
    setData(initialData);
    toast({
      title: "Calculator Cleared",
      description: "All data has been reset. You can start over with a fresh calculation.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-6 bg-slate-700/90 backdrop-blur-lg rounded-lg p-8 border border-gray-500/50">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CalculatorIcon className="h-10 w-10 text-cyan-400" />
            RentalizerCalc
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Calculate STR Property Profitability & ROI
          </p>
          
          {/* Clear All button centered below subtitle */}
          <Button
            variant="outline"
            onClick={clearAllData}
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Calculator Input Sections - 4x1 Grid Layout */}
        <div className="grid lg:grid-cols-4 gap-6 max-w-full mx-auto mb-8">
          {/* 1st - Build Out Costs */}
          <BuildOutSection data={data} updateData={updateData} cashToLaunch={cashToLaunch} />
          
          {/* 2nd - Expenses */}
          <ExpensesSection 
            data={data} 
            updateData={updateData} 
            serviceFeeCalculated={serviceFeeCalculated}
            monthlyExpenses={monthlyExpenses}
          />
          
          {/* 3rd - Property Comps */}
          <CompsSection data={data} updateData={updateData} />

          {/* 4th - Analysis Results */}
          <NetProfitSection 
            monthlyRevenue={monthlyRevenue}
            netProfitMonthly={netProfitMonthly}
            paybackMonths={paybackMonths}
            cashOnCashReturn={cashOnCashReturn}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Calc;
