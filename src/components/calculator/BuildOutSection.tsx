
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface BuildOutSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  cashToLaunch: number;
}

export const BuildOutSection: React.FC<BuildOutSectionProps> = ({
  data,
  updateData,
  cashToLaunch
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Building2 className="h-5 w-5 text-cyan-400" />
          Build Out Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">First Month Rent</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.firstMonthRent === 0 ? '' : data.firstMonthRent}
              onChange={(e) => updateData({ firstMonthRent: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Security Deposit</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.securityDeposit === 0 ? '' : data.securityDeposit}
              onChange={(e) => updateData({ securityDeposit: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Furnishings Cost</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.furnishingsCost === 0 ? '' : data.furnishingsCost}
              onChange={(e) => updateData({ furnishingsCost: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-cyan-300 font-medium">Cash to Launch</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">
                {Math.round(cashToLaunch).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
