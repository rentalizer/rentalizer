import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalculatorIcon, ArrowLeft, DollarSign, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CompsSection } from '@/components/calculator/CompsSection';
import { BuildOutSection } from '@/components/calculator/BuildOutSection';
import { ExpensesSection } from '@/components/calculator/ExpensesSection';
import { NetProfitSection } from '@/components/calculator/NetProfitSection';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { WelcomeSection } from '@/components/WelcomeSection';

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

const Calculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [data, setData] = useState<CalculatorData>({
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    averageComparable: 4250,
    firstMonthRent: 0,
    securityDeposit: 0,
    furnishingsCost: 0,
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
  });

  // Calculate derived values - all rounded to whole numbers
  const cashToLaunch = Math.round(data.firstMonthRent + data.securityDeposit + data.furnishingsCost);
  const serviceFeeCalculated = Math.round(data.averageComparable * 0.029); // 2.9%
  const monthlyExpenses = Math.round(data.rent + serviceFeeCalculated + data.maintenance + data.power + 
                         data.waterSewer + data.internet + data.taxLicense + data.insurance + 
                         data.software + data.miscellaneous + data.furnitureRental);
  const monthlyRevenue = Math.round(data.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  const paybackMonths = cashToLaunch > 0 ? Math.round(cashToLaunch / netProfitMonthly) : 0;
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  // Update service fees when average comparable changes
  useEffect(() => {
    setData(prev => ({
      ...prev,
      serviceFees: Math.round(prev.averageComparable * 0.029)
    }));
  }, [data.averageComparable]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <CalculatorIcon className="h-10 w-10 text-cyan-400" />
            RentalizerCalc
          </h1>
          <p className="text-xl text-gray-300">
            Calculate STR Property Profitability & ROI
          </p>
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

export default Calculator;
