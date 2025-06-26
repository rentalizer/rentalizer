
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';

interface NetProfitSectionProps {
  monthlyRevenue: number;
  netProfitMonthly: number;
  paybackMonths: number;
  cashOnCashReturn: number;
}

export const NetProfitSection: React.FC<NetProfitSectionProps> = ({
  monthlyRevenue,
  netProfitMonthly,
  paybackMonths,
  cashOnCashReturn
}) => {
  const isProfit = netProfitMonthly > 0;
  const profitColor = isProfit ? 'text-cyan-400' : 'text-blue-400';
  const profitBgColor = isProfit ? 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30' : 'from-blue-600/20 to-slate-600/20 border-blue-500/30';
  
  // Convert payback from months to weeks
  const paybackWeeks = paybackMonths * 4.33; // Average weeks per month

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <TrendingUp className="h-5 w-5 text-cyan-400" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Monthly Revenue */}
        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium text-sm">Monthly Revenue</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span className="text-lg font-bold text-blue-400">
                ${Math.round(monthlyRevenue).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-3 bg-gradient-to-r ${profitBgColor} rounded-lg border`}>
          <div className="flex items-center justify-between">
            <Label className={`${profitColor} font-medium text-sm`}>Monthly Profit</Label>
            <div className="flex items-center gap-2">
              <DollarSign className={`h-4 w-4 ${profitColor}`} />
              <span className={`text-lg font-bold ${profitColor}`}>
                ${Math.round(Math.abs(netProfitMonthly)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payback Period in Weeks */}
        <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-cyan-300 font-medium text-sm">Payback Weeks</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span className="text-lg font-bold text-cyan-400">
                {paybackWeeks > 0 && isFinite(paybackWeeks) ? Math.round(paybackWeeks) : '∞'}
              </span>
            </div>
          </div>
        </div>

        {/* Cash on Cash Return */}
        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium text-sm">Cash on Cash Return</Label>
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-400" />
              <span className="text-lg font-bold text-blue-400">
                {isFinite(cashOnCashReturn) ? Math.round(cashOnCashReturn) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
