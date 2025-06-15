
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              RentalizerCalc Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Individual client activity tracking and payment history</p>
          </div>
          <div className="flex items-center gap-4">
            <Smartphone className="h-8 w-8 text-purple-500" />
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-800">RentalizerCalc</div>
              <div className="text-sm text-slate-500">v2.1.4</div>
            </div>
          </div>
        </div>

        {/* Client Selector Card */}
        <div className="mb-8">
          <Card className="bg-white/70 border-slate-200/50 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-cyan-500" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Client
                  </label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="w-full max-w-md bg-white border-slate-300 text-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 z-50">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id} className="text-slate-800 focus:bg-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-slate-500">{client.email} • {client.plan}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Current Progress</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                    100%
                  </div>
                  <div className="text-xs text-slate-500">Advanced Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Clean Header */}
          <div className="flex items-center justify-between border-b border-slate-300/50 pb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Activity Log - {currentClient?.name}</h2>
              <p className="text-slate-600 mt-1">Started learning: {currentClient?.joinedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-600 bg-cyan-50">
                100% Complete
              </Badge>
              <Badge variant="outline" className="border-purple-400/50 text-purple-600 bg-purple-50">
                Advanced
              </Badge>
            </div>
          </div>

          {/* Client Activity Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 border border-slate-200">
              <TabsTrigger value="activity" className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
                <Activity className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                Payment History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="bg-white/70 border-slate-200/50 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-cyan-600 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Client Activity Log - {timeRanges.find(r => r.value === selectedTimeRange)?.label}
                  </CardTitle>
                  <p className="text-slate-600">Logins, searches, calculations, downloads, and market analysis activities</p>
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
              <Card className="bg-white/70 border-slate-200/50 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Payment History & Billing
                  </CardTitle>
                  <p className="text-slate-600">Stripe payment logs, subscription events, and billing history</p>
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
