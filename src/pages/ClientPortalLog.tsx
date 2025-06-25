import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Filter, CheckCircle, Clock, ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
    progress: 100,
    joinedDate: '2024-08-01'
  },
  {
    id: '7',
    name: 'Thomas Mausser',
    email: 'thomasmausser228@gmail.com',
    avatar: 'TM',
    level: 'Accelerator Pro',
    progress: 15,
    joinedDate: '2025-05-23'
  }
];

const getActivities = (student: any) => {
  if (student.id === '7') {
    // Thomas Mausser's activity - all on May 23, 2025 after 2:50 PM PST signup
    return [
      {
        id: 0,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Started • Added on May 23, 2025 at 02:50 PM PST',
        serverId: 'srv-us-west-1-admin-001',
        documentDownloaded: 'Account Created',
        downloadProgress: 100
      },
      {
        id: 1,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Welcome to Accelerator Pro! • Course enrollment confirmed at 2:50 PM PST',
        serverId: 'srv-us-west-1-prod-001',
        documentDownloaded: 'Accelerator Pro Welcome Package.pdf',
        downloadProgress: 100
      },
      {
        id: 2,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'First Login • Logged in immediately after purchase at 2:52 PM PST',
        serverId: 'srv-us-west-1-prod-001',
        documentDownloaded: 'Account Setup Guide.pdf',
        downloadProgress: 100
      },
      {
        id: 3,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Complete Video Library Access • 2:55 PM PST',
        serverId: 'srv-us-west-1-prod-002',
        documentDownloaded: 'Video Library Index.pdf',
        downloadProgress: 100
      },
      {
        id: 4,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Module 1 - Business Formation Videos • 2:57 PM PST',
        serverId: 'srv-us-west-1-prod-002',
        documentDownloaded: 'Module 1 Business Formation Videos.zip',
        downloadProgress: 100
      },
      {
        id: 5,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Module 2 - Market Selection Videos • 3:02 PM PST',
        serverId: 'srv-us-west-1-prod-002',
        documentDownloaded: 'Module 2 Market Selection Videos.zip',
        downloadProgress: 100
      },
      {
        id: 6,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Module 3 - Property Acquisition Videos • 3:08 PM PST',
        serverId: 'srv-us-west-1-prod-002',
        documentDownloaded: 'Module 3 Property Acquisition Videos.zip',
        downloadProgress: 100
      },
      {
        id: 7,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Module 4 - Property Management Videos • 3:15 PM PST',
        serverId: 'srv-us-west-1-prod-002',
        documentDownloaded: 'Module 4 Property Management Videos.zip',
        downloadProgress: 100
      },
      {
        id: 8,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Accessed: RentalizerCalc Software • First software usage at 3:22 PM PST',
        serverId: 'srv-us-west-1-calc-001',
        documentDownloaded: 'RentalizerCalc User Manual.pdf',
        downloadProgress: 67
      },
      {
        id: 9,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Q1 2025 Market Analysis Report • 3:28 PM PST',
        serverId: 'srv-us-west-1-reports-001',
        documentDownloaded: 'Q1 2025 Market Analysis Report.pdf',
        downloadProgress: 100
      },
      {
        id: 10,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: National Rental Market Trends Report • 3:32 PM PST',
        serverId: 'srv-us-west-1-reports-001',
        documentDownloaded: 'National Rental Market Trends 2025.pdf',
        downloadProgress: 100
      },
      {
        id: 11,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Short-Term Rental Performance Metrics • 3:38 PM PST',
        serverId: 'srv-us-west-1-reports-002',
        documentDownloaded: 'STR Performance Metrics May 2025.pdf',
        downloadProgress: 100
      },
      {
        id: 12,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Legal Compliance Checklist • 3:45 PM PST',
        serverId: 'srv-us-west-1-prod-003',
        documentDownloaded: 'STR Legal Compliance Checklist.pdf',
        downloadProgress: 100
      },
      {
        id: 13,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Property Analysis Templates • 3:52 PM PST',
        serverId: 'srv-us-west-1-prod-003',
        documentDownloaded: 'Property Analysis Templates.xlsx',
        downloadProgress: 100
      },
      {
        id: 14,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Automation & Scaling Guide • 4:05 PM PST',
        serverId: 'srv-us-west-1-prod-003',
        documentDownloaded: 'Automation & Scaling Guide.pdf',
        downloadProgress: 100
      },
      {
        id: 15,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Guest Communication Templates • 4:12 PM PST',
        serverId: 'srv-us-west-1-prod-004',
        documentDownloaded: 'Guest Communication Templates.docx',
        downloadProgress: 100
      },
      {
        id: 16,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Financial Modeling Spreadsheets • 4:18 PM PST',
        serverId: 'srv-us-west-1-prod-004',
        documentDownloaded: 'Financial Modeling Spreadsheets.xlsx',
        downloadProgress: 100
      },
      {
        id: 17,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Market Research Tools & Resources • 4:25 PM PST',
        serverId: 'srv-us-west-1-reports-003',
        documentDownloaded: 'Market Research Tools & Resources.pdf',
        downloadProgress: 100
      },
      {
        id: 18,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Second Software Session • Advanced calculator usage at 4:35 PM PST',
        serverId: 'srv-us-west-1-calc-002',
        documentDownloaded: 'Advanced Calculator Features Guide.pdf',
        downloadProgress: 100
      },
      {
        id: 19,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Complete Resource Library • 4:45 PM PST',
        serverId: 'srv-us-west-1-prod-005',
        documentDownloaded: 'Complete Resource Library Index.pdf',
        downloadProgress: 100
      },
      {
        id: 20,
        type: 'module',
        status: 'completed',
        date: '2025-05-23',
        details: 'Downloaded: Bonus Materials & Case Studies • 4:58 PM PST',
        serverId: 'srv-us-west-1-prod-005',
        documentDownloaded: 'Bonus Materials & Case Studies.zip',
        downloadProgress: 59
      }
    ];
  }

  return [
    {
      id: 1,
      type: 'module',
      status: 'completed',
      date: '2024-09-28',
      details: 'Module 4: Manage Properties • Final assessment completed',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Automation Templates & Scaling Checklist.pdf',
      downloadProgress: 100
    },
    {
      id: 2,
      type: 'module',
      status: 'completed',
      date: '2024-09-27',
      details: 'Module 4: Manage Properties • 98% completion score',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Housekeeper Hiring Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 3,
      type: 'module',
      status: 'completed',
      date: '2024-09-26',
      details: 'Module 4: Manage Properties • Practical exercise submitted',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'VA Hiring & Training Manual.pdf',
      downloadProgress: 100
    },
    {
      id: 4,
      type: 'module',
      status: 'completed',
      date: '2024-09-25',
      details: 'Module 4: Manage Properties • Case study analysis',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Remote Hosting Strategies.pdf',
      downloadProgress: 100
    },
    {
      id: 5,
      type: 'module',
      status: 'completed',
      date: '2024-09-24',
      details: 'Module 4: Manage Properties • Strategy workshop attended',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Mid-Term Rental Strategy Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 6,
      type: 'module',
      status: 'completed',
      date: '2024-09-23',
      details: 'Module 4: Manage Properties • Optimization checklist completed',
      serverId: 'srv-eu-west-1-prod-001',
      documentDownloaded: 'Property Optimization Checklist.pdf',
      downloadProgress: 100
    },
    {
      id: 7,
      type: 'module',
      status: 'completed',
      date: '2024-09-22',
      details: 'Module 4: Manage Properties • Photography portfolio submitted',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'Design & Photography Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 8,
      type: 'module',
      status: 'completed',
      date: '2024-09-21',
      details: 'Module introduction and overview completed',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Module 4 Overview & Roadmap.pdf',
      downloadProgress: 100
    },
    {
      id: 9,
      type: 'module',
      status: 'completed',
      date: '2024-09-20',
      details: 'Module 3: Acquire Properties • Business expansion plan created',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Growth Planning Template.pdf',
      downloadProgress: 100
    },
    {
      id: 10,
      type: 'module',
      status: 'completed',
      date: '2024-09-19',
      details: 'Module 3: Acquire Properties • Negotiation strategies mastered',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'Rent Concessions Negotiation Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 11,
      type: 'module',
      status: 'completed',
      date: '2024-09-18',
      details: 'Module 3: Acquire Properties • Application process optimized',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Rental Application Checklist.pdf',
      downloadProgress: 100
    },
    {
      id: 12,
      type: 'module',
      status: 'completed',
      date: '2024-09-13',
      details: 'Module 3: Acquire Properties • Advanced acquisition strategies',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Advanced Acquisition Strategies.pdf',
      downloadProgress: 100
    },
    {
      id: 13,
      type: 'module',
      status: 'completed',
      date: '2024-09-10',
      details: 'Module 3: Acquire Properties • Basic acquisition fundamentals',
      serverId: 'srv-eu-west-1-prod-001',
      documentDownloaded: 'Property Acquisition Fundamentals.pdf',
      downloadProgress: 100
    },
    {
      id: 14,
      type: 'module',
      status: 'completed',
      date: '2024-09-07',
      details: 'Module 3: Acquire Properties • Overview and strategy session',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'Property Acquisition Overview.pdf',
      downloadProgress: 100
    },
    {
      id: 15,
      type: 'module',
      status: 'completed',
      date: '2024-09-02',
      details: 'Module introduction completed with 95% score',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Module 3 Introduction Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 16,
      type: 'module',
      status: 'completed',
      date: '2024-08-28',
      details: 'Module 2: Select Markets • Competitive landscape analysis',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Competitor Analysis Toolkit.pdf',
      downloadProgress: 100
    },
    {
      id: 17,
      type: 'module',
      status: 'completed',
      date: '2024-08-23',
      details: 'Module 2: Select Markets • Legal compliance workshop',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'STR Legal Compliance Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 18,
      type: 'module',
      status: 'completed',
      date: '2024-08-18',
      details: 'Module 2: Select Markets • Financial modeling exercise',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Cash Flow Analysis Template.pdf',
      downloadProgress: 100
    },
    {
      id: 19,
      type: 'module',
      status: 'completed',
      date: '2024-08-13',
      details: 'Module 2: Select Markets • Initial market analysis',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Market Research Methodology.pdf',
      downloadProgress: 100
    },
    {
      id: 20,
      type: 'module',
      status: 'completed',
      date: '2024-08-07',
      details: 'Module overview and market selection fundamentals',
      serverId: 'srv-eu-west-1-prod-001',
      documentDownloaded: 'Module 2 Market Selection Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 21,
      type: 'module',
      status: 'completed',
      date: '2024-08-05',
      details: 'Module 1: Business Formation • Website launched successfully',
      serverId: 'srv-us-central-1-prod-002',
      documentDownloaded: 'DIY Website Development Kit.pdf',
      downloadProgress: 100
    },
    {
      id: 22,
      type: 'module',
      status: 'completed',
      date: '2024-08-03',
      details: 'Module 1: Business Formation • Legal entity established',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Business Formation Legal Guide.pdf',
      downloadProgress: 100
    },
    {
      id: 23,
      type: 'module',
      status: 'completed',
      date: '2024-08-02',
      details: 'Course introduction and business fundamentals',
      serverId: 'srv-us-west-2-prod-003',
      documentDownloaded: 'Module 1 Business Fundamentals.pdf',
      downloadProgress: 100
    },
    {
      id: 24,
      type: 'module',
      status: 'completed',
      date: '2024-08-01',
      details: 'Welcome to the program! • Course enrollment confirmed',
      serverId: 'srv-us-east-1-prod-001',
      documentDownloaded: 'Course Welcome Package.pdf',
      downloadProgress: 100
    }
  ];
};

const typeColors = {
  module: 'blue',
  feedback: 'purple',
  assignment: 'indigo',
  live: 'blue',
  achievement: 'purple'
};

const statusIcons = {
  completed: CheckCircle,
  new: ArrowRight,
  'in-progress': Clock,
  submitted: CheckCircle,
  attended: CheckCircle,
  earned: CheckCircle
};

const ClientPortalLog = () => {
  const [selectedStudent, setSelectedStudent] = useState(students[6]); // Default to Thomas Mausser
  const [filter, setFilter] = useState('all');
  
  const activities = getActivities(selectedStudent);
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container max-w-4xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-100 hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-100">
              Student Portal Activity Log
            </h1>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-6">
          <Card className="bg-slate-800/60 border-slate-600 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-slate-400" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-200 mb-2 block">
                    Select Student
                  </label>
                  <Select value={selectedStudent.id} onValueChange={(value) => {
                    const student = students.find(s => s.id === value);
                    if (student) setSelectedStudent(student);
                  }}>
                    <SelectTrigger className="w-full max-w-md bg-slate-700 border-slate-600 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-slate-100 focus:bg-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-slate-400">{student.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Current Progress</div>
                  <div className="text-2xl font-bold text-slate-100">
                    {selectedStudent.progress}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Info Bar */}
        <div className="mb-6">
          <Card className="bg-slate-700/40 border-slate-600 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{selectedStudent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">({selectedStudent.email})</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-300 bg-blue-900/30">
                      {selectedStudent.id === '7' ? 'Accelerator Pro' : 'Active'}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Started:</span>
                    <span className="text-slate-200">{selectedStudent.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Progress:</span>
                    <span className="text-slate-200">{selectedStudent.progress}%</span>
                  </div>
                  {selectedStudent.id === '7' && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Revenue:</span>
                      <span className="text-green-300">$5,000.00</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-slate-400" />
            <div className="flex gap-1">
              {['all', 'module', 'assignment', 'feedback', 'achievement'].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className={`capitalize text-xs ${
                    filter === type 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                  }`}
                >
                  {type === 'all' ? 'All Activity' : type}
                </Button>
              ))}
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-2">
            {filteredActivities.map((activity, index) => {
              const StatusIcon = statusIcons[activity.status];
              const typeColor = typeColors[activity.type];
              
              return (
                <Card 
                  key={activity.id} 
                  className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-all duration-200 hover:bg-slate-800/70 backdrop-blur-sm shadow-lg"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        typeColor === 'blue' ? 'bg-blue-500' :
                        typeColor === 'purple' ? 'bg-purple-500' :
                        'bg-blue-500'
                      } flex-shrink-0`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <p className="text-sm text-slate-300 flex-1">
                                {activity.details}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Check className="h-4 w-4 text-green-400" />
                                <span className="text-slate-300">{activity.documentDownloaded}</span>
                              </div>
                            </div>
                            
                            {/* Download Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400">Download Progress:</span>
                                <span className="text-xs text-green-400 font-medium">{activity.downloadProgress}%</span>
                              </div>
                              <Progress 
                                value={activity.downloadProgress} 
                                className="h-2 bg-slate-700"
                              />
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  typeColor === 'blue' ? 'border-blue-500 text-blue-300 bg-blue-900/30' :
                                  typeColor === 'purple' ? 'border-purple-500 text-purple-300 bg-purple-900/30' :
                                  'border-blue-500 text-blue-300 bg-blue-900/30'
                                }`}
                              >
                                {activity.type}
                              </Badge>
                              <span className="text-xs text-slate-400">{activity.date}</span>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-200 font-mono">Server ID#: </span>
                              <span className="text-xs text-slate-100 font-mono font-medium">{activity.serverId}</span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <StatusIcon className={`h-5 w-5 ${
                              typeColor === 'blue' ? 'text-blue-400' :
                              typeColor === 'purple' ? 'text-purple-400' :
                              'text-blue-400'
                            }`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center pt-6">
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700"
            >
              Load more activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalLog;
