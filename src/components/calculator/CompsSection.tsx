
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
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
          <Label className="text-gray-200 text-center block text-sm">Property Address</Label>
          <Input
            type="text"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Enter property address"
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bedrooms</Label>
            <Input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => updateData({ bedrooms: parseInt(e.target.value) || 0 })}
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bathrooms</Label>
            <Input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => updateData({ bathrooms: parseInt(e.target.value) || 0 })}
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200 text-sm">Property Values</Label>
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 text-white h-7 px-3 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="text-gray-400 text-sm text-center py-4">
            Click "Add" to start adding property values
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Avg Monthly Revenue</Label>
          <Input
            type="number"
            value={data.averageComparable || ''}
            onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
            placeholder="0"
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center"
          />
        </div>
      </CardContent>
    </Card>
  );
};
