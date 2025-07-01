
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator as CalculatorIcon, 
  DollarSign, 
  Home, 
  TrendingUp, 
  Building,
  Download,
  Loader2
} from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { AdminEditMode } from '@/components/AdminEditMode';
import { AccessGate } from '@/components/AccessGate';
import { exportCalculatorToCSV } from '@/utils/calculatorExport';

export interface CalculatorData {
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
  furnishingsCost: number;
  
  // Furnishings Calculator
  furnishingsPSF: number;
}

const Calculator = () => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const initialData: CalculatorData = {
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 850,
    averageComparable: 0,
    rent: 0,
    serviceFees: 0,
    maintenance: 0,
    power: 0,
    waterSewer: 0,
    internet: 0,
    taxLicense: 0,
    insurance: 0,
    software: 0,
    furnitureRental: 0,
    firstMonthRent: 0,
    securityDeposit: 0,
    miscellaneous: 0,
    furnishingsCost: 0,
    furnishingsPSF: 8,
  };

  const [data, setData] = useState<CalculatorData>(initialData);

  // Calculate derived values
  const serviceFeeCalculated = Math.round(data.averageComparable * 0.029);
  const monthlyExpenses = Math.round(data.rent + serviceFeeCalculated + data.maintenance + data.power + 
                         data.waterSewer + data.internet + data.taxLicense + data.insurance + 
                         data.software + data.furnitureRental);
  const calculatedFurnishings = Math.round(data.squareFootage * (data.furnishingsPSF || 8));
  const cashToLaunch = Math.round(data.firstMonthRent + data.securityDeposit + data.miscellaneous + calculatedFurnishings);
  const monthlyRevenue = Math.round(data.averageComparable);
  const netProfitMonthly = Math.round(monthlyRevenue - monthlyExpenses);
  const paybackMonths = (cashToLaunch > 0 && netProfitMonthly > 0) 
    ? cashToLaunch / netProfitMonthly 
    : null;
  const cashOnCashReturn = cashToLaunch > 0 ? Math.round((netProfitMonthly * 12 / cashToLaunch) * 100) : 0;

  const updateData = (updates: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const calculatedValues = {
        cashToLaunch,
        monthlyExpenses,
        monthlyRevenue,
        netProfitMonthly,
        paybackMonths,
        cashOnCashReturn,
        calculatedFurnishings,
      };
      exportCalculatorToCSV(data, calculatedValues, 'calculator_data');
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccessGate
      requiredAccess="essentials"
      moduleName="Profit Calculator"
      moduleDescription="Calculate your rental arbitrage profits with our advanced calculator tool."
      moduleIcon={<CalculatorIcon className="h-8 w-8 text-cyan-400" />}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TopNavBar />
        <AdminEditMode onEditModeChange={(isEditing) => setEditMode(isEditing)} />

        <div className="container mx-auto p-4">
          <Card className="bg-slate-800/90 backdrop-blur-lg border border-gray-700/50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <CalculatorIcon className="h-6 w-6 text-cyan-400" />
                Rental Arbitrage Calculator
              </CardTitle>
              <Button 
                variant="outline" 
                className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                onClick={handleExport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export to CSV</span>
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="propertyAddress" className="text-gray-300">
                    Property Address
                  </Label>
                  <Input
                    id="propertyAddress"
                    placeholder="123 Main St, Anytown"
                    value={data.address}
                    onChange={(e) => updateData({ address: e.target.value })}
                    disabled={!editMode}
                    className="bg-slate-700/50 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="rent" className="text-gray-300">
                    Monthly Rent
                  </Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="Enter monthly rent"
                    value={data.rent}
                    onChange={(e) => updateData({ rent: parseFloat(e.target.value) || 0 })}
                    disabled={!editMode}
                    className="bg-slate-700/50 border-gray-600 text-gray-100"
                  />
                </div>

                {/* Simple display sections for now */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-300 mb-1">Monthly Revenue</div>
                      <div className="text-2xl font-bold text-cyan-400">${monthlyRevenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-300 mb-1">Monthly Expenses</div>
                      <div className="text-2xl font-bold text-purple-400">${monthlyExpenses.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-300 mb-1">Net Profit</div>
                      <div className={`text-2xl font-bold ${netProfitMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.abs(netProfitMonthly).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-300 mb-1">Cash to Launch</div>
                      <div className="text-2xl font-bold text-yellow-400">${cashToLaunch.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </AccessGate>
  );
};

export default Calculator;
