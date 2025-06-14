import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Smartphone, Calendar, TrendingUp, Users, Activity, Download, Star, User } from 'lucide-react';
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

const clients = [
  { 
    id: '1', 
    name: 'Ramakrishna Gummadi', 
    email: 'rkr.gummadi@gmail.com',
    plan: 'Monthly Subscription',
    monthlyRevenue: 9,
    joinedDate: '2025-04-13',
    daysSinceSignup: 62, // April 13 to June 14, 2025
    status: 'Active'
  }
];

const ClientPortalLogApp = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedClient, setSelectedClient] = useState('1');

  const currentClient = clients.find(client => client.id === selectedClient);

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
              <div className="text-lg font-semibold text-white">RentalizerCalc</div>
              <div className="text-sm text-gray-400">v2.1.4 • iOS & Android</div>
            </div>
          </div>
        </div>

        {/* Client and Time Range Selectors */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Client Selector */}
                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-purple-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Select Client
                      </label>
                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger className="w-64 bg-slate-700/50 border-slate-600/50 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600 z-50">
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id} className="text-gray-100 focus:bg-slate-700">
                              <div className="flex flex-col">
                                <span className="font-medium">{client.name}</span>
                                <span className="text-xs text-gray-400">{client.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Time Range Selector */}
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
                        <SelectContent className="bg-slate-800 border-slate-600 z-50">
                          {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value} className="text-gray-100 focus:bg-slate-700">
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Client Info */}
              {currentClient && (
                <div className="mt-4 pt-4 border-t border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className="text-sm">Viewing data for:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{currentClient.name}</span>
                        <span className="text-sm text-gray-400">({currentClient.email})</span>
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          {currentClient.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Joined:</span>
                        <span className="ml-1 text-white">April 13, 2025</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Plan:</span>
                        <span className="ml-1 text-white">$9/month</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Days Active:</span>
                        <span className="ml-1 text-white">{currentClient.daysSinceSignup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
