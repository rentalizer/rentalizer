
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Home, Plus, Trash2 } from 'lucide-react';

interface MarketDataInputProps {
  title: string;
  description: string;
  placeholder: string;
  onDataChange: (data: Array<{submarket: string, revenue?: number, rent?: number}>) => void;
  icon: 'dollar-sign' | 'home';
}

export const MarketDataInput: React.FC<MarketDataInputProps> = ({
  title,
  description,
  placeholder,
  onDataChange,
  icon
}) => {
  const [rows, setRows] = useState([{ submarket: '', value: '' }]);

  const IconComponent = icon === 'dollar-sign' ? DollarSign : Home;

  const addRow = () => {
    setRows([...rows, { submarket: '', value: '' }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
      updateData(newRows);
    }
  };

  const updateRow = (index: number, field: 'submarket' | 'value', value: string) => {
    const newRows = rows.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    );
    setRows(newRows);
    updateData(newRows);
  };

  const updateData = (rowsData: Array<{submarket: string, value: string}>) => {
    const validData = rowsData
      .filter(row => row.submarket.trim() && row.value.trim())
      .map(row => ({
        submarket: row.submarket.trim(),
        ...(icon === 'dollar-sign' 
          ? { revenue: parseFloat(row.value) || 0 }
          : { rent: parseFloat(row.value) || 0 }
        )
      }));
    
    onDataChange(validData);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label className="text-sm font-medium">Submarket</Label>
                <Input
                  value={row.submarket}
                  onChange={(e) => updateRow(index, 'submarket', e.target.value)}
                  placeholder="Enter submarket name"
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium">{placeholder}</Label>
                <Input
                  type="number"
                  value={row.value}
                  onChange={(e) => updateRow(index, 'value', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeRow(index)}
                disabled={rows.length === 1}
                className="mb-0.5"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={addRow}
          className="w-full flex items-center gap-2 mt-4"
        >
          <Plus className="h-4 w-4" />
          Add Submarket
        </Button>
      </CardContent>
    </Card>
  );
};
