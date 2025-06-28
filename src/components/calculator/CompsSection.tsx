
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, X, DollarSign } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';

interface CompsSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
}

export const CompsSection: React.FC<CompsSectionProps> = ({ data, updateData }) => {
  const [propertyValues, setPropertyValues] = useState<number[]>([]);

  const addPropertyValue = () => {
    setPropertyValues(prev => [...prev, 0]);
  };

  const removePropertyValue = (index: number) => {
    const newValues = propertyValues.filter((_, i) => i !== index);
    setPropertyValues(newValues);
    
    // Update average when removing values
    const average = newValues.length > 0 ? Math.round(newValues.reduce((sum, val) => sum + val, 0) / newValues.length) : 0;
    updateData({ averageComparable: average });
  };

  const updatePropertyValue = (index: number, value: number) => {
    const newValues = [...propertyValues];
    newValues[index] = value;
    setPropertyValues(newValues);
    
    // Calculate and update average
    const average = newValues.length > 0 ? Math.round(newValues.reduce((sum, val) => sum + val, 0) / newValues.length) : 0;
    updateData({ averageComparable: average });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
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
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bedrooms</Label>
            <Input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => updateData({ bedrooms: parseInt(e.target.value) || 0 })}
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200 text-center block text-sm">Bathrooms</Label>
            <Input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => updateData({ bathrooms: parseInt(e.target.value) || 0 })}
              className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center w-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200 text-sm">Property Values</Label>
            <Button
              size="sm"
              onClick={addPropertyValue}
              className="bg-cyan-600 hover:bg-cyan-700 text-white h-7 px-3 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          {propertyValues.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              Click "Add" to start adding property values
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {propertyValues.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={value || ''}
                      onChange={(e) => updatePropertyValue(index, Math.round(parseFloat(e.target.value)) || 0)}
                      placeholder="Enter value"
                      className="pl-8 bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePropertyValue(index)}
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 text-center block text-sm">Avg Monthly Revenue</Label>
          <Input
            type="number"
            value={data.averageComparable || ''}
            onChange={(e) => updateData({ averageComparable: Math.round(parseFloat(e.target.value)) || 0 })}
            placeholder="0"
            className="bg-gray-800/50 border-gray-600 text-gray-100 h-9 text-sm text-center w-full"
            readOnly={propertyValues.length > 0}
          />
          {propertyValues.length > 0 && (
            <p className="text-xs text-gray-400 text-center">
              Auto-calculated from property values above
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
