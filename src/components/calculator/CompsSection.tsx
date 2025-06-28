
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  data,
  updateData
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Property Comps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Property Address</Label>
          <Input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Enter property address"
            className="bg-gray-800/50 border-gray-600 text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Bedrooms</Label>
          <Input
            type="number"
            value={data.bedrooms || ''}
            onChange={(e) => updateData({ bedrooms: Math.round(parseFloat(e.target.value)) || 0 })}
            placeholder="2"
            className="bg-gray-800/50 border-gray-600 text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Bathrooms</Label>
          <Input
            type="number"
            value={data.bathrooms || ''}
            onChange={(e) => updateData({ bathrooms: Math.round(parseFloat(e.target.value)) || 0 })}
            placeholder="2"
            className="bg-gray-800/50 border-gray-600 text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Add Property Values</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.averageComparable || ''}
              onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block">Average Comparable Revenue</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              value={data.averageComparable || ''}
              onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
