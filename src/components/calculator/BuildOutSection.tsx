
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Calculator } from 'lucide-react';
import { CalculatorData } from '@/pages/Community';
import { parseNumericInput, formatInputValue } from '@/utils/inputHelpers';

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
  // Local state for form inputs
  const [localData, setLocalData] = useState({
    firstMonthRent: data.firstMonthRent,
    securityDeposit: data.securityDeposit,
    miscellaneous: data.miscellaneous,
    squareFootage: data.squareFootage,
    furnishingsPSF: data.furnishingsPSF || 8,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalData({
      firstMonthRent: data.firstMonthRent,
      securityDeposit: data.securityDeposit,
      miscellaneous: data.miscellaneous,
      squareFootage: data.squareFootage,
      furnishingsPSF: data.furnishingsPSF || 8,
    });
  }, [data]);

  const calculatedFurnishings = Math.round(localData.squareFootage * localData.furnishingsPSF);
  const localCashToLaunch = Math.round(localData.firstMonthRent + localData.securityDeposit + localData.miscellaneous + calculatedFurnishings);

  const handleCalculate = () => {
    updateData({
      firstMonthRent: localData.firstMonthRent,
      securityDeposit: localData.securityDeposit,
      miscellaneous: localData.miscellaneous,
      squareFootage: localData.squareFootage,
      furnishingsPSF: localData.furnishingsPSF,
    });
  };

  const updateLocalData = (field: string, value: number) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-xl font-semibold">
          <Building2 className="h-6 w-6 text-emerald-400" />
          Startup Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Basic Startup Costs */}
        <div className="space-y-3">
          <div className="space-y-3">
            <Label className="text-gray-300 text-sm font-medium">First Month Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={formatInputValue(localData.firstMonthRent)}
                onChange={(e) => updateLocalData('firstMonthRent', parseNumericInput(e.target.value))}
                placeholder="2500"
                className="pl-9 bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-emerald-400/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300 text-sm font-medium">Security Deposit</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={formatInputValue(localData.securityDeposit)}
                onChange={(e) => updateLocalData('securityDeposit', parseNumericInput(e.target.value))}
                placeholder="2500"
                className="pl-9 bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-emerald-400/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300 text-sm font-medium">Miscellaneous Costs</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={formatInputValue(localData.miscellaneous)}
                onChange={(e) => updateLocalData('miscellaneous', parseNumericInput(e.target.value))}
                placeholder="500"
                className="pl-9 bg-gray-800/60 border-gray-600/50 text-white h-11 text-base focus:border-emerald-400/50"
              />
            </div>
          </div>
        </div>

        {/* Furnishings Options */}
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-600/30">
          <Label className="text-gray-300 text-sm font-medium mb-4 block">Furnishings Calculator</Label>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Square Footage</Label>
                <Input
                  type="text"
                  value={formatInputValue(localData.squareFootage)}
                  onChange={(e) => updateLocalData('squareFootage', parseNumericInput(e.target.value))}
                  placeholder="1200"
                  className="bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Cost per Sq Ft</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                  <Input
                    type="text"
                    value={formatInputValue(localData.furnishingsPSF)}
                    onChange={(e) => updateLocalData('furnishingsPSF', parseNumericInput(e.target.value) || 8)}
                    placeholder="8"
                    className="pl-6 bg-gray-800/60 border-gray-600/50 text-white h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="text-center py-2">
              <span className="text-emerald-400 text-lg font-semibold">
                Furnishings Cost: ${calculatedFurnishings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCalculate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Costs
          </Button>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-lg p-4 border border-emerald-500/30">
          <div className="text-center">
            <Label className="text-emerald-300 text-sm font-medium block mb-2">Total Cash to Launch</Label>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-emerald-400" />
              <span className="text-3xl font-bold text-emerald-400">
                {localCashToLaunch.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
