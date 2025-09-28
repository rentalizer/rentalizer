
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Community';
import { parseNumericInput, formatInputValue } from '@/utils/inputHelpers';

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
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-xl font-semibold">
          <Receipt className="h-6 w-6 text-red-400" />
          Monthly Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Expenses */}
        <div className="space-y-3">
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">Monthly Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={formatInputValue(data.rent)}
                onChange={(e) => updateData({ rent: parseNumericInput(e.target.value) })}
                placeholder="2500"
                className="pl-9 bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-red-400/50"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">Service Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={serviceFeeCalculated.toString()}
                readOnly
                className="pl-9 bg-gray-700/50 border-gray-600/50 text-gray-300 h-11 text-base cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Automatically calculated from rent</p>
          </div>
        </div>

        {/* Utilities & Operating Costs */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
          <Label className="text-gray-300 text-sm font-medium mb-3 block">Utilities & Operations</Label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Maintenance</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.maintenance)}
                  onChange={(e) => updateData({ maintenance: parseNumericInput(e.target.value) })}
                  placeholder="150"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Electricity</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.power)}
                  onChange={(e) => updateData({ power: parseNumericInput(e.target.value) })}
                  placeholder="100"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Water/Sewer</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.waterSewer)}
                  onChange={(e) => updateData({ waterSewer: parseNumericInput(e.target.value) })}
                  placeholder="50"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Internet</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.internet)}
                  onChange={(e) => updateData({ internet: parseNumericInput(e.target.value) })}
                  placeholder="80"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">License</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.taxLicense)}
                  onChange={(e) => updateData({ taxLicense: parseNumericInput(e.target.value) })}
                  placeholder="25"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Insurance</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.insurance)}
                  onChange={(e) => updateData({ insurance: parseNumericInput(e.target.value) })}
                  placeholder="75"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Software</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.software)}
                  onChange={(e) => updateData({ software: parseNumericInput(e.target.value) })}
                  placeholder="30"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs mb-2 block">Furniture Rental</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={formatInputValue(data.furnitureRental)}
                  onChange={(e) => updateData({ furnitureRental: parseNumericInput(e.target.value) })}
                  placeholder="200"
                  className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-lg p-4 border border-red-500/30">
          <div className="text-center">
            <Label className="text-red-300 text-sm font-medium block mb-2">Total Monthly Expenses</Label>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-red-400" />
              <span className="text-3xl font-bold text-red-400">
                {Math.round(monthlyExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
