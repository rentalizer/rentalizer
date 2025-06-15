
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Smartphone, Calendar, TrendingUp, Users, Activity, Download, Star, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClientActivityLog } from '@/components/app-portal/ClientActivityLog';
import { ClientPaymentHistory } from '@/components/app-portal/ClientPaymentHistory';

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
    daysSinceSignup: 62,
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Ifeanyi Okoye', 
    email: 'ifeanyionline92@yahoo.com',
    plan: 'Monthly Subscription',
    monthlyRevenue: 9,
    joinedDate: '2025-02-14',
    daysSinceSignup: 120,
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Lindsay Sherman', 
    email: 'dutchess0085@gmail.com',
    plan: 'Accelerator Pro',
    monthlyRevenue: 2000,
    joinedDate: '2024-08-01',
    daysSinceSignup: 318,
    status: 'Active'
  }
];

const ClientPortalLogApp = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedClient, setSelectedClient] = useState('3'); // Default to Lindsay Sherman

  const currentClient = clients.find(client => client.id === selectedClient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              RentalizerCalc Analytics Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1">Individual client activity tracking and payment history</p>
          </div>
          <div className="flex items-center gap-4">
            <Smartphone className="h-6 w-6 text-white" />
            <div className="text-right">
              <div className="text-lg font-semibold text-white">RentalizerCalc</div>
              <div className="text-xs text-slate-400">v2.1.4</div>
            </div>
          </div>
        </div>

        {/* Client and Time Period Selectors */}
        <div className="mb-6">
          <Card className="bg-purple-800/30 border-purple-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Selector */}
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-slate-300" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-200 mb-2 block">
                      Select Client
                    </label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="w-full bg-purple-700/40 border-purple-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-700">
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id} className="text-slate-100 focus:bg-purple-700">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-slate-400">{client.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time Period Selector */}
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-slate-300" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-200 mb-2 block">
                      Time Period
                    </label>
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger className="w-full bg-purple-700/40 border-purple-600/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-800 border-purple-700">
                        {timeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value} className="text-slate-100 focus:bg-purple-700">
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Info Bar */}
        <div className="mb-6">
          <Card className="bg-purple-800/20 border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-slate-300">Viewing data for:</span>
                  <span className="font-semibold text-white">{currentClient?.name}</span>
                  <span className="text-slate-400">({currentClient?.email})</span>
                  <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-slate-400">Subscribed: </span>
                    <span className="text-white">7/31/2024</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Plan: </span>
                    <span className="text-white">${currentClient?.monthlyRevenue.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Days Active: </span>
                    <span className="text-white">318</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Client Activity Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-purple-800/40 border border-purple-700/50">
              <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white text-slate-300">
                <Activity className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white text-slate-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Payment History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="bg-purple-800/20 border-purple-700/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Client Activity Log - {timeRanges.find(r => r.value === selectedTimeRange)?.label}
                  </CardTitle>
                  <p className="text-slate-300">Logins, searches, calculations, downloads, and market analysis activities</p>
                </CardHeader>
                <CardContent>
                  <ClientActivityLog 
                    clientId={selectedClient} 
                    timeRange={selectedTimeRange}
                    client={currentClient}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="bg-purple-800/20 border-purple-700/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Payment History & Billing
                  </CardTitle>
                  <p className="text-slate-300">Stripe payment logs, subscription events, and billing history</p>
                </CardHeader>
                <CardContent>
                  <ClientPaymentHistory 
                    clientId={selectedClient} 
                    timeRange={selectedTimeRange}
                    client={currentClient}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalLogApp;
