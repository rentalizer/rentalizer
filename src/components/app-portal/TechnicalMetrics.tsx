
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Zap, AlertTriangle, Download, Smartphone } from 'lucide-react';

interface TechnicalMetricsProps {
  timeRange: string;
}

const performanceData = [
  { date: 'Dec 7', loadTime: 1.2, crashes: 3, rating: 4.6 },
  { date: 'Dec 8', loadTime: 1.1, crashes: 2, rating: 4.7 },
  { date: 'Dec 9', loadTime: 1.3, crashes: 4, rating: 4.6 },
  { date: 'Dec 10', loadTime: 1.0, crashes: 1, rating: 4.8 },
  { date: 'Dec 11', loadTime: 1.2, crashes: 2, rating: 4.7 },
  { date: 'Dec 12', loadTime: 0.9, crashes: 1, rating: 4.8 },
  { date: 'Dec 13', loadTime: 1.1, crashes: 2, rating: 4.7 }
];

const crashReports = [
  { type: 'Memory Leak', count: 12, severity: 'high' },
  { type: 'Network Timeout', count: 8, severity: 'medium' },
  { type: 'UI Thread Block', count: 5, severity: 'high' },
  { type: 'Invalid State', count: 3, severity: 'low' },
  { type: 'Permission Error', count: 2, severity: 'medium' }
];

export const TechnicalMetrics = ({ timeRange }: TechnicalMetricsProps) => {
  return (
    <div className="space-y-6">
      {/* Technical KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-700/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Load Time</p>
                <p className="text-2xl font-bold text-yellow-400">1.1s</p>
                <p className="text-xs text-green-400">-0.2s vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm text-gray-400">Crash Rate</p>
                <p className="text-2xl font-bold text-red-400">0.08%</p>
                <p className="text-xs text-green-400">-0.02% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">API Success Rate</p>
                <p className="text-2xl font-bold text-blue-400">99.7%</p>
                <p className="text-xs text-green-400">+0.1% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">App Store Rating</p>
                <p className="text-2xl font-bold text-green-400">4.7</p>
                <p className="text-xs text-green-400">+0.1 vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">App Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Line type="monotone" dataKey="loadTime" stroke="#f59e0b" strokeWidth={3} name="Load Time (s)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Daily Crashes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
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
                <Bar dataKey="crashes" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device & Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 text-lg">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { platform: 'iOS', version: 'iOS 17+', users: 1456, percentage: 62 },
                { platform: 'Android', version: 'Android 12+', users: 885, percentage: 38 }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{item.platform}</h4>
                      <p className="text-sm text-gray-400">{item.version}</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300">
                      {item.users} users
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{item.percentage}% of user base</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
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
            <CardTitle className="text-cyan-300 text-lg">Crash Reports by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crashReports.map((crash, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-600/30">
                  <div className="flex-1">
                    <span className="text-white font-medium">{crash.type}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          crash.severity === 'high' ? 'border-red-500/30 text-red-400' :
                          crash.severity === 'medium' ? 'border-orange-500/30 text-orange-400' :
                          'border-green-500/30 text-green-400'
                        }`}
                      >
                        {crash.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white">{crash.count}</span>
                    <p className="text-xs text-gray-400">occurrences</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 text-lg">System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">API Performance</h4>
              {[
                { endpoint: 'Property Calculator API', latency: '234ms', status: 'healthy' },
                { endpoint: 'Market Data API', latency: '156ms', status: 'healthy' },
                { endpoint: 'User Authentication', latency: '89ms', status: 'healthy' },
                { endpoint: 'Report Generation', latency: '1.2s', status: 'warning' }
              ].map((api, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-600/30">
                  <span className="text-gray-300 text-sm">{api.endpoint}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{api.latency}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      api.status === 'healthy' ? 'bg-green-400' : 'bg-orange-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">Error Rates</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">4xx Errors</span>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                      0.3%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Client-side errors</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">5xx Errors</span>
                    <Badge variant="outline" className="border-red-500/30 text-red-400">
                      0.1%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Server-side errors</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Timeout Errors</span>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      0.05%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Request timeouts</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-medium">App Store Health</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Review Score</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      4.7/5
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Based on 342 reviews</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Download Rank</span>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      #23
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Finance category</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-600/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Update Adoption</span>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      78%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">v2.1.4 adoption rate</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
