
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface NetProfitMockup2Props {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const NetProfitMockup2: React.FC<NetProfitMockup2Props> = ({
  monthlyRevenue,
  netProfitMonthly,
  paybackMonths,
  cashOnCashReturn
}) => {
  const formatPaybackPeriod = (months: number | null) => {
    if (months === null || months <= 0) return 'N/A';
    
    if (months < 12) {
      return `${months.toFixed(1)} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths < 1) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths.toFixed(0)}m`;
      }
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-white text-lg text-center">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mockup 2: Grid Layout with Large Numbers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
            <DollarSign className="h-5 w-5 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-400">
              ${(monthlyRevenue / 1000).toFixed(1)}k
            </div>
            <Label className="text-blue-300 text-xs">Revenue</Label>
          </div>
          
          <div className="text-center p-3 bg-green-600/10 rounded-lg border border-green-500/20">
            <div className={`text-2xl font-bold ${netProfitMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${(Math.abs(netProfitMonthly) / 1000).toFixed(1)}k
            </div>
            <Label className="text-green-300 text-xs">Profit</Label>
          </div>
          
          <div className="text-center p-3 bg-cyan-600/10 rounded-lg border border-cyan-500/20">
            <Calendar className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-cyan-400">
              {formatPaybackPeriod(paybackMonths)}
            </div>
            <Label className="text-cyan-300 text-xs">Payback</Label>
          </div>
          
          <div className="text-center p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
            <Percent className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <div className={`text-2xl font-bold ${cashOnCashReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              {cashOnCashReturn}%
            </div>
            <Label className="text-purple-300 text-xs">CoC Return</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
