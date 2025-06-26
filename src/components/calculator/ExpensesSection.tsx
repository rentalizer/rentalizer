
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Receipt, DollarSign, Wand2, Zap } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface ExpensesSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  serviceFeeCalculated: number;
  monthlyExpenses: number;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  data,
  updateData,
  serviceFeeCalculated,
  monthlyExpenses
}) => {
  const autoFillExpenses = () => {
    const averageExpenses = {
      rent: Math.round(data.averageComparable * 0.65), // 65% of revenue
      maintenance: 150,
      power: 120,
      waterSewer: 80,
      internet: 75,
      taxLicense: 45,
      insurance: 85,
      software: 50,
      miscellaneous: 100,
      furnitureRental: 200
    };
    
    updateData(averageExpenses);
  };

  const autoCalculate = () => {
    // Auto calculation logic - you can customize this
    const autoCalculatedExpenses = {
      rent: Math.round(data.averageComparable * 0.60), // 60% of revenue
      maintenance: 175,
      power: 140,
      waterSewer: 90,
      internet: 85,
      taxLicense: 50,
      insurance: 95,
      software: 65,
      miscellaneous: 125,
      furnitureRental: 250
    };
    
    updateData(autoCalculatedExpenses);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-white text-lg">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-cyan-400" />
            Monthly Expenses
          </div>
          <div className="flex gap-2">
            <Button
              onClick={autoFillExpenses}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1 h-7"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Auto-Fill
            </Button>
            <Button
              onClick={autoCalculate}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
            >
              <Zap className="h-3 w-3 mr-1" />
              Auto
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.rent || ''}
                onChange={(e) => updateData({ rent: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Svc Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={serviceFeeCalculated}
                readOnly
                className="pl-10 bg-gray-700/50 border-gray-600 text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Maintenance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.maintenance || ''}
                onChange={(e) => updateData({ maintenance: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Power/Electricity</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.power || ''}
                onChange={(e) => updateData({ power: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Water/Sewer</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.waterSewer || ''}
                onChange={(e) => updateData({ waterSewer: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Internet</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.internet || ''}
                onChange={(e) => updateData({ internet: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">License</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.taxLicense || ''}
                onChange={(e) => updateData({ taxLicense: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.insurance || ''}
                onChange={(e) => updateData({ insurance: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Software</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.software || ''}
                onChange={(e) => updateData({ software: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Miscellaneous</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.miscellaneous || ''}
                onChange={(e) => updateData({ miscellaneous: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">P Furniture Rental</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.furnitureRental || ''}
                onChange={(e) => updateData({ furnitureRental: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Total Monthly Expenses</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(monthlyExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
