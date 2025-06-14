
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Heart, Repeat, Share2, MessageSquare } from 'lucide-react';

interface UserEngagementViewProps {
  timeRange: string;
}

const retentionData = [
  { day: 'Day 1', retention: 85 },
  { day: 'Day 7', retention: 42 },
  { day: 'Day 14', retention: 28 },
  { day: 'Day 30', retention: 18 }
];

const userSegments = [
  { name: 'Power Users', value: 15, color: '#10b981' },
  { name: 'Regular Users', value: 45, color: '#3b82f6' },
  { name: 'Casual Users', value: 30, color: '#f59e0b' },
  { name: 'At Risk', value: 10, color: '#ef4444' }
];

export const UserEngagementView = ({ timeRange }: UserEngagementViewProps) => {
  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 border-pink-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              <div>
                <p className="text-sm text-gray-400">User Satisfaction</p>
                <p className="text-2xl font-bold text-pink-400">4.7/5</p>
                <p className="text-xs text-green-400">+0.2 vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">30-Day Retention</p>
                <p className="text-2xl font-bold text-blue-400">89.2%</p>
                <p className="text-xs text-green-400">+3.1% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Shares/Referrals</p>
                <p className="text-2xl font-bold text-purple-400">342</p>
                <p className="text-xs text-green-400">+18% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Support Tickets</p>
                <p className="text-2xl font-bold text-orange-400">23</p>
                <p className="text-xs text-red-400">+5 vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Chart and User Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">User Retention Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="retention" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">User Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {userSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <span className="text-gray-300 text-sm">{segment.name}</span>
                  </div>
                  <span className="text-white font-medium">{segment.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Behavior Analysis */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 text-lg">User Behavior Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Top User Actions</h4>
              {[
                { action: 'Run Property Calculator', count: '12,450', percentage: 89 },
                { action: 'Save Property', count: '8,230', percentage: 76 },
                { action: 'Generate Report', count: '5,680', percentage: 64 },
                { action: 'Share Results', count: '3,420', percentage: 42 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.action}</span>
                    <span className="text-white">{item.count}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Engagement Trends</h4>
              <div className="space-y-3">
                {[
                  { metric: 'Daily Session Frequency', value: '2.3x', trend: 'up', description: 'Users open app 2.3 times per day on average' },
                  { metric: 'Feature Discovery Rate', value: '67%', trend: 'up', description: 'Users discover new features within first week' },
                  { metric: 'Time to First Value', value: '1.2 min', trend: 'down', description: 'Time to complete first calculation' },
                  { metric: 'Churn Risk Score', value: '12%', trend: 'down', description: 'Users showing signs of disengagement' }
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-slate-600/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{item.metric}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.trend === 'up' ? 'border-green-500/30 text-green-400' : 'border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {item.value}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
