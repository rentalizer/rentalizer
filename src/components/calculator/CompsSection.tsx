
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Plus, X } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({
  data,
  updateData
}) => {
  const [propertyValues, setPropertyValues] = useState<number[]>([]);

  const addPropertyValue = () => {
    setPropertyValues([...propertyValues, 0]);
  };

  const removePropertyValue = (index: number) => {
    const newValues = propertyValues.filter((_, i) => i !== index);
    setPropertyValues(newValues);
    updateAverageComparable(newValues);
  };

  const updatePropertyValue = (index: number, value: number) => {
    const newValues = [...propertyValues];
    newValues[index] = value;
    setPropertyValues(newValues);
    updateAverageComparable(newValues);
  };

  const updateAverageComparable = (values: number[]) => {
    const validValues = values.filter(v => v > 0);
    const average = validValues.length > 0 ? Math.round(validValues.reduce((sum, val) => sum + val, 0) / validValues.length) : 0;
    updateData({ averageComparable: average });
  };

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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200">Property Values</Label>
            <Button
              onClick={addPropertyValue}
              size="sm"
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {propertyValues.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={value || ''}
                  onChange={(e) => updatePropertyValue(index, Math.round(parseFloat(e.target.value)) || 0)}
                  placeholder="Enter property value"
                  className="pl-10 bg-gray-800/50 border-gray-600 text-gray-100"
                />
              </div>
              <Button
                onClick={() => removePropertyValue(index)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {propertyValues.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-4">
              Click "Add" to start adding property values
            </div>
          )}
        </div>

        {propertyValues.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <Label className="text-cyan-300 font-medium">Average Comparable</Label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-cyan-400" />
                <span className="text-lg font-bold text-cyan-400">
                  {data.averageComparable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
