
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Smartphone, Calendar, TrendingUp, Users, Activity, Download, Star } from 'lucide-react';
import { AppUsageOverview } from '@/components/app-portal/AppUsageOverview';
import { UserEngagementView } from '@/components/app-portal/UserEngagementView';
import { RevenueAnalytics } from '@/components/app-portal/RevenueAnalytics';
import { TechnicalMetrics } from '@/components/app-portal/TechnicalMetrics';

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' }
];

const ClientPortalLogApp = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">App Store Analytics Dashboard</h1>
            <p className="text-gray-300 mt-1">Monthly subscription app performance metrics and user activity</p>
          </div>
          <div className="flex items-center gap-4">
            <Smartphone className="h-8 w-8 text-purple-400" />
            <div className="text-right">
              <div className="text-lg font-semibold text-white">PropertyCalc Pro</div>
              <div className="text-sm text-gray-400">v2.1.4 • iOS & Android</div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Time Period
                    </label>
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {timeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value} className="text-gray-100 focus:bg-slate-700">
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">$12,847</div>
                    <div className="text-xs text-gray-400">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">2,341</div>
                    <div className="text-xs text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">4.7</div>
                    <div className="text-xs text-gray-400">App Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">89.2%</div>
                    <div className="text-xs text-gray-400">Retention</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <Activity className="h-4 w-4 mr-2" />
              Usage Overview
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <Users className="h-4 w-4 mr-2" />
              User Engagement
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Revenue Analytics
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <Download className="h-4 w-4 mr-2" />
              Technical Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  App Usage Overview - {timeRanges.find(r => r.value === selectedTimeRange)?.label}
                </CardTitle>
                <p className="text-gray-400">Daily active users, session data, and feature usage analytics</p>
              </CardHeader>
              <CardContent>
                <AppUsageOverview timeRange={selectedTimeRange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Engagement Analytics
                </CardTitle>
                <p className="text-gray-400">User behavior patterns, retention rates, and engagement metrics</p>
              </CardHeader>
              <CardContent>
                <UserEngagementView timeRange={selectedTimeRange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue & Subscription Analytics
                </CardTitle>
                <p className="text-gray-400">Monthly recurring revenue, churn analysis, and subscription metrics</p>
              </CardHeader>
              <CardContent>
                <RevenueAnalytics timeRange={selectedTimeRange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Technical Performance Metrics
                </CardTitle>
                <p className="text-gray-400">App performance, crash reports, and technical analytics</p>
              </CardHeader>
              <CardContent>
                <TechnicalMetrics timeRange={selectedTimeRange} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortalLogApp;
