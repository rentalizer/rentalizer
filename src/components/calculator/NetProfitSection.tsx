
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
  const profitColor = isProfit ? 'text-green-400' : 'text-red-400';
  const profitBgColor = isProfit ? 'from-green-600/20 to-emerald-600/20 border-green-500/30' : 'from-red-600/20 to-pink-600/20 border-red-500/30';

  return (
    <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-green-400" />
          4. Net Profit Analysis
        </CardTitle>
        <p className="text-sm text-gray-300">
          Calculate monthly profit and return on investment
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Revenue */}
        <div className="p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-blue-300 font-medium">Monthly Revenue</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <span className="text-xl font-bold text-blue-400">
                ${monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-4 bg-gradient-to-r ${profitBgColor} rounded-lg border`}>
          <div className="flex items-center justify-between mb-2">
            <Label className={`${profitColor} font-medium`}>Net Profit (Monthly)</Label>
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${profitColor}`} />
              <span className={`text-2xl font-bold ${profitColor}`}>
                ${Math.abs(netProfitMonthly).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className={`${profitColor} font-medium`}>Net Profit (Annual)</Label>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${profitColor}`}>
                ${Math.abs(netProfitMonthly * 12).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payback Period */}
        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-purple-300 font-medium">Payback in Months</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="text-xl font-bold text-purple-400">
                {paybackMonths > 0 && isFinite(paybackMonths) ? paybackMonths.toFixed(1) : '∞'}
              </span>
            </div>
          </div>
        </div>

        {/* Cash on Cash Return */}
        <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-yellow-300 font-medium">Cash on Cash Return</Label>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">
                {isFinite(cashOnCashReturn) ? cashOnCashReturn.toFixed(2) : '0.00'}%
              </span>
            </div>
          </div>
        </div>

        {/* Profit Status Indicator */}
        <div className={`p-4 rounded-lg border-2 ${isProfit ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
          <div className="text-center">
            <div className={`text-lg font-semibold ${profitColor} mb-1`}>
              {isProfit ? '✅ Profitable Investment' : '❌ Unprofitable Investment'}
            </div>
            <div className="text-sm text-gray-300">
              {isProfit 
                ? `This property generates $${netProfitMonthly.toLocaleString()} monthly profit`
                : `This property loses $${Math.abs(netProfitMonthly).toLocaleString()} monthly`
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
