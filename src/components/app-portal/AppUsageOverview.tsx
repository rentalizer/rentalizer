
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Clock, MousePointer, Smartphone } from 'lucide-react';

interface AppUsageOverviewProps {
  timeRange: string;
}

const dailyActiveUsers = [
  { date: 'Dec 7', users: 1840, sessions: 3240, avgSession: 12.4 },
  { date: 'Dec 8', users: 1920, sessions: 3380, avgSession: 13.1 },
  { date: 'Dec 9', users: 2100, sessions: 3680, avgSession: 11.8 },
  { date: 'Dec 10', users: 2050, sessions: 3590, avgSession: 12.9 },
  { date: 'Dec 11', users: 2180, sessions: 3820, avgSession: 13.7 },
  { date: 'Dec 12', users: 2340, sessions: 4100, avgSession: 14.2 },
  { date: 'Dec 13', users: 2280, sessions: 3980, avgSession: 13.5 }
];

const featureUsage = [
  { feature: 'Calculator', usage: 89, color: '#3b82f6' },
  { feature: 'Property Search', usage: 76, color: '#10b981' },
  { feature: 'Market Analysis', usage: 64, color: '#f59e0b' },
  { feature: 'Saved Properties', usage: 58, color: '#8b5cf6' },
  { feature: 'Reports Export', usage: 42, color: '#ef4444' },
  { feature: 'Notifications', usage: 34, color: '#06b6d4' }
];

export const AppUsageOverview = ({ timeRange }: AppUsageOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Daily Active Users</p>
                <p className="text-2xl font-bold text-blue-400">2,341</p>
                <p className="text-xs text-green-400">+12.5% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-green-400">26,790</p>
                <p className="text-xs text-green-400">+8.3% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Session</p>
                <p className="text-2xl font-bold text-purple-400">13.2m</p>
                <p className="text-xs text-green-400">+2.1% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">App Opens</p>
                <p className="text-2xl font-bold text-orange-400">34,250</p>
                <p className="text-xs text-green-400">+15.7% vs last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Daily Active Users Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Session Duration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="avgSession" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Feature Usage */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 text-lg">Feature Usage Analytics</CardTitle>
          <p className="text-gray-400 text-sm">Percentage of users who used each feature in the selected period</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureUsage.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: feature.color }}
                  ></div>
                  <span className="text-white font-medium">{feature.feature}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-600 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${feature.usage}%`, 
                        backgroundColor: feature.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-sm w-12 text-right">{feature.usage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 text-lg">Real-time Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New user registration', details: 'john.doe@email.com', time: '2 min ago', type: 'signup' },
              { action: 'Property calculation completed', details: '123 Main St, Austin TX', time: '5 min ago', type: 'calculation' },
              { action: 'Premium subscription activated', details: 'sarah.wilson@email.com', time: '8 min ago', type: 'subscription' },
              { action: 'Market report generated', details: 'Dallas Metro Area', time: '12 min ago', type: 'report' },
              { action: 'App crash reported', details: 'iOS 17.2, iPhone 14 Pro', time: '15 min ago', type: 'error' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-600/30 hover:bg-slate-600/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.details}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.type === 'signup' ? 'border-green-500/30 text-green-400' :
                      activity.type === 'calculation' ? 'border-blue-500/30 text-blue-400' :
                      activity.type === 'subscription' ? 'border-purple-500/30 text-purple-400' :
                      activity.type === 'report' ? 'border-orange-500/30 text-orange-400' :
                      'border-red-500/30 text-red-400'
                    }`}
                  >
                    {activity.type}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
