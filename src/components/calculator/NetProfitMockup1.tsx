
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent, ArrowUp, ArrowDown } from 'lucide-react';

interface NetProfitMockup1Props {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const NetProfitMockup1: React.FC<NetProfitMockup1Props> = ({
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
      <CardContent className="space-y-3">
        {/* Mockup 1: Horizontal Cards with Icons */}
        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <Label className="text-blue-300 text-sm font-medium">Monthly Revenue</Label>
            </div>
            <span className="text-lg font-bold text-blue-400">
              ${monthlyRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {netProfitMonthly >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-400" />
              )}
              <Label className="text-green-300 text-sm font-medium">Net Profit</Label>
            </div>
            <span className={`text-lg font-bold ${netProfitMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${Math.abs(netProfitMonthly).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <Label className="text-cyan-300 text-sm font-medium">Payback</Label>
            </div>
            <span className="text-lg font-bold text-cyan-400">
              {formatPaybackPeriod(paybackMonths)}
            </span>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-purple-400" />
              <Label className="text-purple-300 text-sm font-medium">CoC Return</Label>
            </div>
            <span className={`text-lg font-bold ${cashOnCashReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              {cashOnCashReturn}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
