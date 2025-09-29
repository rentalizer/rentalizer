
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface NetProfitSectionProps {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number | null;
  cashOnCashReturn: number;
}

export const NetProfitSection: React.FC<NetProfitSectionProps> = ({
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
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}y ${remainingMonths.toFixed(1)}m`;
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
      <CardContent className="space-y-6">
        {/* Average Comparable Property */}
        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Monthly Revenue</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {Math.round(monthlyRevenue).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Monthly Profit */}
        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-purple-300 font-medium">Net Monthly Profit</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-400" />
              <span className={`text-2xl font-bold ${netProfitMonthly >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                {netProfitMonthly >= 0 ? '' : '-'}{Math.abs(netProfitMonthly).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payback Period */}
        <div className="p-4 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-lg border border-teal-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-teal-300 font-medium">Payback Period</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-400" />
              <span className="text-2xl font-bold text-teal-400">
                {formatPaybackPeriod(paybackMonths)}
              </span>
            </div>
          </div>
        </div>

        {/* Cash on Cash Return */}
        <div className="p-4 bg-gradient-to-r from-slate-600/20 to-gray-600/20 rounded-lg border border-slate-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300 font-medium">Cash on Cash Return</Label>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-slate-400" />
              <span className="text-2xl font-bold text-slate-400">
                {cashOnCashReturn}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
