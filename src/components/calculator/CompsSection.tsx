
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Home, DollarSign, Plus, X } from 'lucide-react';
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
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <Home className="h-5 w-5 text-cyan-400" />
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
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bedrooms</Label>
            <Input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => updateData({ bedrooms: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bathrooms</Label>
            <Input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => updateData({ bathrooms: Math.round(parseFloat(e.target.value)) || 0 })}
              placeholder=""
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Comparable Properties</Label>
          <Button
            variant="outline"
            className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400 h-9 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-2">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                value={data.averageComparable || ''}
                onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
                placeholder="Enter value"
                className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Average Comparable Property</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(data.averageComparable).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
