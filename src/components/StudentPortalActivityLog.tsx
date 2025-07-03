import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CheckCircle, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityEntry {
  id: string;
  type: 'module' | 'assignment' | 'feedback' | 'achievement';
  title: string;
  description: string;
  date: string;
  serverID: string;
  pdfFile: string;
  completed: boolean;
  score?: string;
}

const mockActivityData: ActivityEntry[] = [
  // Tiffany Worthy - Arbitrage Accelerator Program
  {
    id: 'tw1',
    type: 'achievement',
    title: 'Arbitrage Accelerator Program',
    description: 'Successfully enrolled and payment confirmed',
    date: '2025-05-21',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Arbitrage Accelerator Welcome Package.pdf',
    completed: true
  },
  {
    id: 'tw2',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Introduction video watched',
    date: '2025-05-21',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Arbitrage Basics Guide.pdf',
    completed: true
  },
  {
    id: 'tw3',
    type: 'assignment',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Market research worksheet submitted',
    date: '2025-05-21',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Market Research Template.pdf',
    completed: true
  },
  
  // Lindsay Sherman - Original entries
  {
    id: '1',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Final assessment completed',
    date: '2024-09-28',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Automation Templates & Scaling Checklist.pdf',
    completed: true
  },
  {
    id: '2',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: '98% completion score',
    date: '2024-09-27',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Housekeeper Hiring Guide.pdf',
    completed: true
  },
  {
    id: '3',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Practical exercise submitted',
    date: '2024-09-26',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'VA Hiring & Training Manual.pdf',
    completed: true
  },
  {
    id: '4',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Case study analysis',
    date: '2024-09-25',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Remote Hosting Strategies.pdf',
    completed: true
  },
  {
    id: '5',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Strategy workshop attended',
    date: '2024-09-24',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Mid-Term Rental Strategy Guide.pdf',
    completed: true
  },
  {
    id: '6',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Optimization checklist completed',
    date: '2024-09-23',
    serverID: 'srv-eu-west-1-prod-801',
    pdfFile: 'Property Optimization Checklist.pdf',
    completed: true
  },
  {
    id: '7',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Photography portfolio submitted',
    date: '2024-09-22',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'Design & Photography Guide.pdf',
    completed: true
  },
  {
    id: '8',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Business expansion plan created',
    date: '2024-09-20',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Growth Planning Template.pdf',
    completed: true
  },
  {
    id: '9',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Negotiation strategies mastered',
    date: '2024-09-19',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'Rent Concessions Negotiation Guide.pdf',
    completed: true
  },
  {
    id: '10',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Application process optimized',
    date: '2024-09-18',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Rental Application Checklist.pdf',
    completed: true
  }
];

const mockStudents = [
  { id: '1', name: 'Lindsay Sherman', email: 'dutchess0085@gmail.com', progress: 100 },
  { id: '2', name: 'Tiffany Worthy', email: 'tiffany1990worthy@yahoo.com', progress: 15 },
  { id: '3', name: 'Alex Johnson', email: 'alex.johnson@email.com', progress: 85 },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', progress: 72 },
  { id: '5', name: 'Mike Davis', email: 'mike.davis@email.com', progress: 90 },
];

export const StudentPortalActivityLog = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [activeFilter, setActiveFilter] = useState('All Activity');
  
  const currentStudent = mockStudents.find(s => s.id === selectedStudent) || mockStudents[0];
  
  const filterTabs = ['All Activity', 'Module', 'Assignment', 'Feedback', 'Achievement'];
  
  const filteredActivities = mockActivityData.filter(activity => {
    // Filter by student - only show Tiffany's activities when she's selected
    if (selectedStudent === '2' && !activity.id.startsWith('tw')) return false;
    if (selectedStudent !== '2' && activity.id.startsWith('tw')) return false;
    
    // Filter by activity type
    if (activeFilter === 'All Activity') return true;
    return activity.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Student Portal Activity Log</h1>
        </div>

        {/* Student Selection */}
        <Card className="bg-slate-800/50 border-gray-700/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-300 text-sm mb-2">Select Student</p>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-80 bg-slate-700/50 border-gray-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-700">
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-white hover:bg-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-gray-400">{student.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-300 text-sm mb-1">Current Progress</p>
                <div className="text-3xl font-bold text-white">{currentStudent.progress}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info Bar */}
        <Card className="bg-slate-800/50 border-gray-700/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-medium">{currentStudent.name}</div>
                  <div className="text-gray-400 text-sm">({currentStudent.email})</div>
                </div>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                  Active
                </Badge>
              </div>
              
              <div className="text-right text-sm">
                <div className="text-gray-400">Started: <span className="text-white">{selectedStudent === '2' ? '2025-05-21' : '2024-08-01'}</span></div>
                <div className="text-gray-400">Progress: <span className="text-white">{currentStudent.progress}%</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-gray-400" />
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeFilter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(tab)}
              className={activeFilter === tab 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Activity Log */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-medium">{activity.title}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-300">{activity.description}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className={
                          activity.type === 'achievement' ? "border-purple-500/30 text-purple-300 bg-purple-500/10" :
                          activity.type === 'assignment' ? "border-orange-500/30 text-orange-300 bg-orange-500/10" :
                          activity.type === 'feedback' ? "border-green-500/30 text-green-300 bg-green-500/10" :
                          "border-blue-500/30 text-blue-300 bg-blue-500/10"
                        }>
                          {activity.type}
                        </Badge>
                        <span className="text-gray-400">{activity.date}</span>
                        <span className="text-gray-500">Server ID:</span>
                        <span className="text-gray-400 font-mono text-xs">{activity.serverID}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">{activity.pdfFile}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};