import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Receipt, DollarSign, Search, Loader2 } from 'lucide-react';
import { CalculatorData } from '@/pages/Calculator';
import { fetchMarketExpenses } from '@/services/expenseService';
import { useToast } from '@/hooks/use-toast';
import { DatePickerPopover } from './DatePickerPopover';

interface ExpensesSectionProps {
  data: CalculatorData;
  updateData: (updates: Partial<CalculatorData>) => void;
  serviceFeeCalculated: number;
  monthlyExpenses: number;
}

export const ExpensesSection: React.FC<ExpensesSectionProps> = ({ 
  data, 
  updateData, 
  serviceFeeCalculated, 
  monthlyExpenses 
}) => {
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const { toast } = useToast();

  const fetchAutoExpenses = async () => {
    if (!data.address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to search for local expenses.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingExpenses(true);
    console.log('🔍 Fetching market expenses for:', data.address);
    
    try {
      const openaiApiKey = localStorage.getItem('openai_api_key');
      
      if (!openaiApiKey) {
        toast({
          title: "API Key Required",
          description: "Please set your OpenAI API key in the settings to use auto-expense lookup.",
          variant: "destructive",
        });
        return;
      }
      
      const expenses = await fetchMarketExpenses(data.address, openaiApiKey);
      
      updateData({
        power: expenses.power,
        internet: expenses.internet,
        taxLicense: expenses.license
      });
      
      toast({
        title: "Expenses Updated",
        description: `Updated local expenses for ${data.address}`,
      });
      
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Lookup Failed",
        description: "Unable to fetch local expenses. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log('Selected date:', date);
      // Here you can add any logic based on the selected date
      fetchAutoExpenses();
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Receipt className="h-4 w-4 text-cyan-400" />
              Monthly Expenses
            </CardTitle>
          </div>
          <DatePickerPopover
            onDateSelect={handleDateSelect}
            trigger={
              <Button
                disabled={isLoadingExpenses || !data.address.trim()}
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
              >
                {isLoadingExpenses ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-3 w-3 mr-1" />
                    Auto-Fill
                  </>
                )}
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Rent</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.rent || ''}
                onChange={(e) => updateData({ rent: parseFloat(e.target.value) || 0 })}
                placeholder="1975"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Service Fees (2.9%)</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={Math.round(serviceFeeCalculated)}
                readOnly
                className="pl-7 h-8 text-sm bg-gray-700/50 border-gray-600 text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Maintenance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.maintenance || ''}
                onChange={(e) => updateData({ maintenance: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Power/Electricity</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.power || ''}
                onChange={(e) => updateData({ power: parseFloat(e.target.value) || 0 })}
                placeholder="190"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Water/Sewer</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.waterSewer || ''}
                onChange={(e) => updateData({ waterSewer: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Internet</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.internet || ''}
                onChange={(e) => updateData({ internet: parseFloat(e.target.value) || 0 })}
                placeholder="70"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">License</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.taxLicense || ''}
                onChange={(e) => updateData({ taxLicense: parseFloat(e.target.value) || 0 })}
                placeholder="29"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.insurance || ''}
                onChange={(e) => updateData({ insurance: parseFloat(e.target.value) || 0 })}
                placeholder="15"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Software</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.software || ''}
                onChange={(e) => updateData({ software: parseFloat(e.target.value) || 0 })}
                placeholder="70"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Miscellaneous</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.miscellaneous || ''}
                onChange={(e) => updateData({ miscellaneous: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-200 text-xs">Furniture Rental</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
              <Input
                type="number"
                value={data.furnitureRental || ''}
                onChange={(e) => updateData({ furnitureRental: parseFloat(e.target.value) || 0 })}
                placeholder="750"
                className="pl-7 h-8 text-sm bg-gray-800/50 border-gray-600 text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-blue-600/20 to-slate-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium text-sm">Total Monthly Expenses</Label>
            <span className="text-xl font-bold text-blue-400">
              ${monthlyExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
