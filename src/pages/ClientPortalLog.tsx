
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TimelineView } from '@/components/client-portal/TimelineView';
import { DashboardView } from '@/components/client-portal/DashboardView';
import { ProgressView } from '@/components/client-portal/ProgressView';
import { MinimalView } from '@/components/client-portal/MinimalView';

const ClientPortalLog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Client Portal Activity Log</h1>
            <p className="text-gray-300 mt-1">Design variations for high-ticket info product platforms</p>
          </div>
        </div>

        {/* Design Variations */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              Timeline View
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              Dashboard Style
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              Progress Focused
            </TabsTrigger>
            <TabsTrigger value="minimal" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              Minimal Clean
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 1: Timeline-Based Activity Log</CardTitle>
                <p className="text-gray-400">Inspired by platforms like Kajabi and Teachable - chronological activity feed</p>
              </CardHeader>
              <CardContent>
                <TimelineView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 2: Dashboard-Style Overview</CardTitle>
                <p className="text-gray-400">Inspired by MasterClass and Coursera - metrics-driven approach</p>
              </CardHeader>
              <CardContent>
                <DashboardView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 3: Progress-Focused Journey</CardTitle>
                <p className="text-gray-400">Inspired by Thinkific and LearnDash - learning path visualization</p>
              </CardHeader>
              <CardContent>
                <ProgressView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="minimal">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 4: Minimal Clean Interface</CardTitle>
                <p className="text-gray-400">Inspired by Notion and Linear - clean, distraction-free design</p>
              </CardHeader>
              <CardContent>
                <MinimalView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortalLog;
