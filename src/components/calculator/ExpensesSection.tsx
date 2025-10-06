
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, DollarSign } from 'lucide-react';
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
  // Local state for input values to allow continuous typing
  const [localValues, setLocalValues] = useState({
    rent: data.rent && data.rent > 0 ? data.rent.toString() : '',
    maintenance: data.maintenance && data.maintenance > 0 ? data.maintenance.toString() : '',
    power: data.power && data.power > 0 ? data.power.toString() : '',
    waterSewer: data.waterSewer && data.waterSewer > 0 ? data.waterSewer.toString() : '',
    internet: data.internet && data.internet > 0 ? data.internet.toString() : '',
    taxLicense: data.taxLicense && data.taxLicense > 0 ? data.taxLicense.toString() : '',
    insurance: data.insurance && data.insurance > 0 ? data.insurance.toString() : '',
    software: data.software && data.software > 0 ? data.software.toString() : '',
    furnitureRental: data.furnitureRental && data.furnitureRental > 0 ? data.furnitureRental.toString() : ''
  });

  // Helper function to handle input changes
  const handleInputChange = (field: keyof typeof localValues, value: string) => {
    setLocalValues(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to handle input blur (when user finishes typing)
  const handleInputBlur = (field: keyof typeof localValues) => {
    const value = localValues[field];
    if (value === '') {
      updateData({ [field]: 0 });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        updateData({ [field]: Math.round(numValue) });
      }
    }
  };
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Receipt className="h-5 w-5 text-cyan-400" />
          Monthly Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.rent}
                onChange={(e) => handleInputChange('rent', e.target.value)}
                onBlur={() => handleInputBlur('rent')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Svc Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={serviceFeeCalculated > 0 ? serviceFeeCalculated : ''}
                readOnly
                className="pl-8 bg-gray-700/50 border-gray-600 text-gray-100 h-9 text-sm w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Maintenance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.maintenance}
                onChange={(e) => handleInputChange('maintenance', e.target.value)}
                onBlur={() => handleInputBlur('maintenance')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Power/Electricity</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.power}
                onChange={(e) => handleInputChange('power', e.target.value)}
                onBlur={() => handleInputBlur('power')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Water/Sewer</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.waterSewer}
                onChange={(e) => handleInputChange('waterSewer', e.target.value)}
                onBlur={() => handleInputBlur('waterSewer')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Internet</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.internet}
                onChange={(e) => handleInputChange('internet', e.target.value)}
                onBlur={() => handleInputBlur('internet')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">License</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.taxLicense}
                onChange={(e) => handleInputChange('taxLicense', e.target.value)}
                onBlur={() => handleInputBlur('taxLicense')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.insurance}
                onChange={(e) => handleInputChange('insurance', e.target.value)}
                onBlur={() => handleInputBlur('insurance')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Software</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.software}
                onChange={(e) => handleInputChange('software', e.target.value)}
                onBlur={() => handleInputBlur('software')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Furnishings Rental</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={localValues.furnitureRental}
                onChange={(e) => handleInputChange('furnitureRental', e.target.value)}
                onBlur={() => handleInputBlur('furnitureRental')}
                onWheel={(e) => e.preventDefault()}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-purple-300 font-medium">Total Monthly Expenses</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">
                {monthlyExpenses > 0 ? Math.round(monthlyExpenses).toLocaleString() : ''}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
