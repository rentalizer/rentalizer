
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calc';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  parseNumericInput: (value: string) => number;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  data,
  updateData,
  parseNumericInput
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Property Address</Label>
            <Input
              type="text"
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="Enter property address"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bedrooms</Label>
              <Input
                type="text"
                value={data.bedrooms || ''}
                onChange={(e) => updateData({ bedrooms: parseNumericInput(e.target.value) })}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Bathrooms</Label>
              <Input
                type="text"
                value={data.bathrooms || ''}
                onChange={(e) => updateData({ bathrooms: parseNumericInput(e.target.value) })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Monthly Revenue Estimate</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={data.averageComparable || ''}
                onChange={(e) => updateData({ averageComparable: parseNumericInput(e.target.value) })}
                placeholder="Enter estimated monthly revenue"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on comparable STR properties in your area
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
