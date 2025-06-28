
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
        <div className="space-y-2">
          <Label className="text-blue-300 text-center block text-sm flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3" />
            Monthly Revenue Estimate
          </Label>
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-400">
              ${monthlyRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-green-300 text-center block text-sm">Net Monthly Profit</Label>
          <div className="text-center">
            <span className={`text-2xl font-bold ${netProfitMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${Math.abs(netProfitMonthly).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-300 text-center block text-sm flex items-center justify-center gap-1">
            <Calendar className="h-3 w-3" />
            Payback Period
          </Label>
          <div className="text-center">
            <span className="text-xl font-bold text-cyan-400">
              {formatPaybackPeriod(paybackMonths)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-purple-300 text-center block text-sm flex items-center justify-center gap-1">
            <Percent className="h-3 w-3" />
            Cash on Cash Return
          </Label>
          <div className="text-center">
            <span className={`text-xl font-bold ${cashOnCashReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              {cashOnCashReturn}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
