
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sofa, DollarSign, Calculator as CalculatorIcon } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface FurnishingsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  calculatedFurnishings: number;
}

export const FurnishingsSection: React.FC<FurnishingsSectionProps> = ({ 
  data, 
  updateData, 
  calculatedFurnishings 
}) => {
  const applyCalculatedFurnishings = () => {
    updateData({ furnishingsCost: calculatedFurnishings });
  };

  const applyMonthlyFurnitureRental = () => {
    updateData({ furnitureRental: data.monthlyFurnitureRental });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sofa className="h-5 w-5 text-cyan-400" />
          Furnishings Calculator
        </CardTitle>
        <p className="text-sm text-gray-300">
          Calculate furnishing costs based on property square footage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Square Footage</Label>
            <Input
              type="number"
              value={data.squareFootage || ''}
              onChange={(e) => updateData({ squareFootage: parseFloat(e.target.value) || 0 })}
              placeholder="850"
              className="bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Price per Sq Ft</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.furnishingsPSF || ''}
                onChange={(e) => updateData({ furnishingsPSF: parseFloat(e.target.value) || 0 })}
                placeholder="8"
                className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Monthly Furniture Rental Field */}
        <div className="space-y-2">
          <Label className="text-gray-200">Monthly Furniture Rental (Optional)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.monthlyFurnitureRental || ''}
              onChange={(e) => updateData({ monthlyFurnitureRental: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
          {data.monthlyFurnitureRental > 0 && (
            <Button 
              onClick={applyMonthlyFurnitureRental}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Apply to Monthly Expenses
            </Button>
          )}
        </div>

        {/* Furnishing Tiers */}
        <div className="space-y-2">
          <Label className="text-gray-200">Furnishing Quality Tiers</Label>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-3 bg-gray-800/30 rounded text-center">
              <div className="text-gray-300">Low ($6)</div>
              <div className="text-cyan-400 font-medium">
                ${(data.squareFootage * 6).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded text-center">
              <div className="text-gray-300">Medium ($7)</div>
              <div className="text-cyan-400 font-medium">
                ${(data.squareFootage * 7).toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded text-center">
              <div className="text-gray-300">High ($8)</div>
              <div className="text-cyan-400 font-medium">
                ${(data.squareFootage * 8).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-cyan-300 font-medium">Calculated Furnishings Cost</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">
                ${calculatedFurnishings.toLocaleString()}
              </span>
            </div>
          </div>
          <Button 
            onClick={applyCalculatedFurnishings}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <CalculatorIcon className="h-4 w-4 mr-2" />
            Apply to Build Out Costs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
