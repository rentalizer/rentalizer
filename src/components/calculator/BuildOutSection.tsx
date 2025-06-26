
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hammer, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface BuildOutSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  cashToLaunch: number;
}

export const BuildOutSection: React.FC<BuildOutSectionProps> = ({ data, updateData, cashToLaunch }) => {
  const calculatedFurnishings = data.squareFootage * 8; // Fixed at $8 PSF

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Hammer className="h-5 w-5 text-cyan-400" />
          Build Out Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">First Month's Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.firstMonthRent || ''}
                onChange={(e) => updateData({ firstMonthRent: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Security Deposit</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.securityDeposit || ''}
                onChange={(e) => updateData({ securityDeposit: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Furnishings Calculator */}
        <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-gray-600/50">
          <Label className="text-cyan-300 font-medium">Furnishings Calculator</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-200 text-sm">Property Size ($8 PSF)</Label>
              <Input
                type="number"
                value={data.squareFootage || ''}
                onChange={(e) => updateData({ squareFootage: parseFloat(e.target.value) || 0 })}
                placeholder=""
                className="bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-200 text-sm">Furnishings Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={data.furnishingsCost || ''}
                  onChange={(e) => updateData({ furnishingsCost: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-600/20 rounded border border-cyan-500/30">
            <div className="text-cyan-300 font-medium text-sm">Calculated Cost</div>
            <div className="text-cyan-400 font-bold text-lg">
              ${calculatedFurnishings.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Cash to Launch Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-cyan-300 font-medium">Cash to Launch</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">
                ${cashToLaunch.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
