
import React from 'react';
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
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Receipt className="h-5 w-5 text-cyan-400" />
          Monthly Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.rent || ''}
                onChange={(e) => updateData({ rent: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Svc Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={serviceFeeCalculated}
                readOnly
                className="pl-8 bg-gray-700/50 border-gray-600 text-gray-300 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Maintenance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.maintenance || ''}
                onChange={(e) => updateData({ maintenance: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Power/Electricity</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.power || ''}
                onChange={(e) => updateData({ power: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Water/Sewer</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.waterSewer || ''}
                onChange={(e) => updateData({ waterSewer: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Internet</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.internet || ''}
                onChange={(e) => updateData({ internet: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">License</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.taxLicense || ''}
                onChange={(e) => updateData({ taxLicense: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.insurance || ''}
                onChange={(e) => updateData({ insurance: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Software</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.software || ''}
                onChange={(e) => updateData({ software: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Miscellaneous</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.miscellaneous || ''}
                onChange={(e) => updateData({ miscellaneous: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Furniture Rental</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.furnitureRental || ''}
                onChange={(e) => updateData({ furnitureRental: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder=""
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
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
