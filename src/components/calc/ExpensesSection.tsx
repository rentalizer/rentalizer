
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calc';

interface ExpensesSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  serviceFeeCalculated: number;
  monthlyExpenses: number;
  parseNumericInput: (value: string) => number;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({
  data,
  updateData,
  serviceFeeCalculated,
  monthlyExpenses,
  parseNumericInput
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5 text-primary" />
          Monthly Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={data.rent || ''}
                onChange={(e) => updateData({ rent: parseNumericInput(e.target.value) })}
                placeholder="0"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Service Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={serviceFeeCalculated}
                readOnly
                className="pl-10 bg-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Maintenance</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.maintenance || ''}
                  onChange={(e) => updateData({ maintenance: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Electricity</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.power || ''}
                  onChange={(e) => updateData({ power: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Water/Sewer</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.waterSewer || ''}
                  onChange={(e) => updateData({ waterSewer: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Internet</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.internet || ''}
                  onChange={(e) => updateData({ internet: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">License</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.taxLicense || ''}
                  onChange={(e) => updateData({ taxLicense: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Insurance</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.insurance || ''}
                  onChange={(e) => updateData({ insurance: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Software</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.software || ''}
                  onChange={(e) => updateData({ software: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Furnishing Rental</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={data.furnitureRental || ''}
                  onChange={(e) => updateData({ furnitureRental: parseNumericInput(e.target.value) })}
                  placeholder="0"
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center justify-between">
            <span className="font-medium text-destructive">Total Monthly Expenses</span>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-destructive" />
              <span className="text-xl font-bold text-destructive">
                {monthlyExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
