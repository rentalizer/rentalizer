
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DollarSign, CreditCard, TrendingUp, UserX } from 'lucide-react';

interface RevenueAnalyticsProps {
  timeRange: string;
}

const monthlyRevenue = [
  { month: 'Jun', revenue: 8420, subscriptions: 145, churn: 12 },
  { month: 'Jul', revenue: 9680, subscriptions: 167, churn: 8 },
  { month: 'Aug', revenue: 11250, subscriptions: 192, churn: 15 },
  { month: 'Sep', revenue: 10890, subscriptions: 186, churn: 11 },
  { month: 'Oct', revenue: 12150, subscriptions: 208, churn: 9 },
  { month: 'Nov', revenue: 12847, subscriptions: 223, churn: 14 }
];

export const RevenueAnalytics = ({ timeRange }: RevenueAnalyticsProps) => {
  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-400">$12,847</p>
                <p className="text-xs text-green-400">+8.7% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-blue-400">223</p>
                <p className="text-xs text-green-400">+15 new this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">ARPU</p>
                <p className="text-2xl font-bold text-purple-400">$57.61</p>
                <p className="text-xs text-red-400">-2.1% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-gray-400">Churn Rate</p>
                <p className="text-2xl font-bold text-red-400">6.3%</p>
                <p className="text-xs text-green-400">-1.2% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Subscription Growth vs Churn</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="subscriptions" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans & Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Subscription Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { plan: 'Pro Monthly', price: '$19.99', users: 142, revenue: '$2,838', percentage: 64 },
                { plan: 'Pro Annual', price: '$199.99', users: 68, revenue: '$13,599', percentage: 30 },
                { plan: 'Enterprise', price: '$49.99', users: 13, revenue: '$650', percentage: 6 }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{item.plan}</h4>
                      <p className="text-sm text-gray-400">{item.price}/month</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300">
                      {item.revenue}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{item.users} subscribers</span>
                    <span className="text-sm text-gray-300">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Payment Method Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-3">Payment Methods</h4>
                <div className="space-y-3">
                  {[
                    { method: 'Credit Card', percentage: 78, color: '#3b82f6' },
                    { method: 'PayPal', percentage: 15, color: '#10b981' },
                    { method: 'Apple Pay', percentage: 5, color: '#8b5cf6' },
                    { method: 'Google Pay', percentage: 2, color: '#f59e0b' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.method}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-600 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${item.percentage}%`, 
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-8">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Revenue Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-600/30">
                    <span className="text-gray-300">Failed Payments</span>
                    <Badge variant="outline" className="border-red-500/30 text-red-400">
                      2.3%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-600/30">
                    <span className="text-gray-300">Dunning Success Rate</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      67%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-600/30">
                    <span className="text-gray-300">Refund Rate</span>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                      1.8%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
