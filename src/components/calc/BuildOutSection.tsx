
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calc';

interface BuildOutSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  cashToLaunch: number;
  parseNumericInput: (value: string) => number;
}

export const BuildOutSection: React.FC<BuildOutSectionProps> = ({
  data,
  updateData,
  cashToLaunch,
  parseNumericInput
}) => {
  const calculatedFurnishings = Math.round(data.squareFootage * data.furnishingsPSF);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Initial Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">First Month Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={data.firstMonthRent || ''}
                onChange={(e) => updateData({ firstMonthRent: parseNumericInput(e.target.value) })}
                placeholder="0"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Security Deposit</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={data.securityDeposit || ''}
                onChange={(e) => updateData({ securityDeposit: parseNumericInput(e.target.value) })}
                placeholder="0"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Miscellaneous</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={data.buildOutMiscellaneous || ''}
                onChange={(e) => updateData({ buildOutMiscellaneous: parseNumericInput(e.target.value) })}
                placeholder="0"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Furnishings Calculator */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
          <Label className="text-sm font-medium">Furnishings Calculator</Label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Square Feet</Label>
              <Input
                type="text"
                value={data.squareFootage || ''}
                onChange={(e) => updateData({ squareFootage: parseNumericInput(e.target.value) })}
                placeholder="0"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">$/Sq Ft</Label>
              <Input
                type="text"
                value={data.furnishingsPSF || ''}
                onChange={(e) => updateData({ furnishingsPSF: parseNumericInput(e.target.value) })}
                placeholder="8"
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-muted-foreground">Total Cost</span>
            <span className="text-sm font-medium">${calculatedFurnishings.toLocaleString()}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary">Cash to Launch</span>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-xl font-bold text-primary">
                {cashToLaunch.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
