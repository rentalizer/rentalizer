
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
  const calculatedFurnishings = Math.round(data.squareFootage * data.furnishingsPSF);

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Building2 className="h-5 w-5 text-cyan-400" />
          Cash To Launch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-xs">First Mo</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.firstMonthRent || ''}
                onChange={(e) => updateData({ firstMonthRent: Math.round(parseFloat(e.target.value)) || 0 })}
                className="pl-6 bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-xs">Deposit</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.securityDeposit || ''}
                onChange={(e) => updateData({ securityDeposit: Math.round(parseFloat(e.target.value)) || 0 })}
                className="pl-6 bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-xs">Misc</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.miscellaneous || ''}
                onChange={(e) => updateData({ miscellaneous: Math.round(parseFloat(e.target.value)) || 0 })}
                className="pl-6 bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* Buy Furnishings Section */}
        <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-600/50">
          <Label className="text-gray-200 text-center block mb-3">Buy Furnishings</Label>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Square Footage</Label>
              <Input
                type="number"
                value={data.squareFootage || ''}
                onChange={(e) => updateData({ squareFootage: Math.round(parseFloat(e.target.value)) || 0 })}
                className="bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Price per Sq Ft</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                <Input
                  type="number"
                  value={data.furnishingsPSF || ''}
                  onChange={(e) => updateData({ furnishingsPSF: Math.round(parseFloat(e.target.value)) || 0 })}
                  className="pl-6 bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <Label className="text-gray-300">Furnishings Cost</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              <span className="text-lg font-bold text-cyan-400">
                {calculatedFurnishings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-3">
          <span className="text-gray-300">or</span>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Rent Furnishings</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
            <Input
              type="number"
              value={data.furnitureRental || ''}
              onChange={(e) => updateData({ furnitureRental: Math.round(parseFloat(e.target.value)) || 0 })}
              className="pl-6 bg-gray-800/50 border-gray-600 text-gray-100 h-8 text-sm w-full"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-cyan-300 font-medium">Build Out Costs</Label>
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
