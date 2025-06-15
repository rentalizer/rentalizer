import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User } from 'lucide-react';
import { TimelineView } from '@/components/client-portal/TimelineView';
import { DashboardView } from '@/components/client-portal/DashboardView';
import { ProgressView } from '@/components/client-portal/ProgressView';
import { MinimalView } from '@/components/client-portal/MinimalView';

const students = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: 'SJ',
    level: 'Advanced',
    progress: 68,
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    avatar: 'MC',
    level: 'Intermediate',
    progress: 45,
    joinedDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    avatar: 'ER',
    level: 'Beginner',
    progress: 25,
    joinedDate: '2024-03-10'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    avatar: 'DK',
    level: 'Advanced',
    progress: 82,
    joinedDate: '2024-01-08'
  },
  {
    id: '5',
    name: 'Jessica Williams',
    email: 'jessica.williams@email.com',
    avatar: 'JW',
    level: 'Intermediate',
    progress: 58,
    joinedDate: '2024-02-05'
  },
  {
    id: '6',
    name: 'Lindsay Sherman',
    email: 'dutchess0085@gmail.com',
    avatar: 'LS',
    level: 'Advanced',
    progress: 92,
    joinedDate: '2024-08-01'
  }
];

const ClientPortalLog = () => {
  const [selectedStudent, setSelectedStudent] = useState(students[5]); // Default to Lindsay Sherman

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Client Portal Activity Log</h1>
            <p className="text-gray-300 mt-1">Design variations for high-ticket info product platforms</p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-cyan-400" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Select Student
                  </label>
                  <Select value={selectedStudent.id} onValueChange={(value) => {
                    const student = students.find(s => s.id === value);
                    if (student) setSelectedStudent(student);
                  }}>
                    <SelectTrigger className="w-full max-w-md bg-slate-700/50 border-slate-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-gray-100 focus:bg-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-gray-400">{student.email} • {student.level}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Current Progress</div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedStudent.progress}%</div>
                  <div className="text-xs text-gray-500">{selectedStudent.level} Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <p className="text-gray-400">Inspired by platforms like Kajabi and Teachable - chronological activity feed for {selectedStudent.name}</p>
              </CardHeader>
              <CardContent>
                <TimelineView student={selectedStudent} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 2: Dashboard-Style Overview</CardTitle>
                <p className="text-gray-400">Inspired by MasterClass and Coursera - metrics-driven approach for {selectedStudent.name}</p>
              </CardHeader>
              <CardContent>
                <DashboardView student={selectedStudent} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 3: Progress-Focused Journey</CardTitle>
                <p className="text-gray-400">Inspired by Thinkific and LearnDash - learning path visualization for {selectedStudent.name}</p>
              </CardHeader>
              <CardContent>
                <ProgressView student={selectedStudent} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="minimal">
            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Design 4: Minimal Clean Interface</CardTitle>
                <p className="text-gray-400">Inspired by Notion and Linear - clean, distraction-free design for {selectedStudent.name}</p>
              </CardHeader>
              <CardContent>
                <MinimalView student={selectedStudent} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientPortalLog;
