import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Filter, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  }
];

const getActivities = (student: any) => [
  {
    id: 1,
    title: 'Completed Automations & Scaling Module',
    type: 'module',
    status: 'completed',
    timestamp: '2 hours ago',
    date: '2024-12-16',
    details: 'Module 4: Manage Properties • Final assessment completed',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 2,
    title: 'Completed Hiring Your Housekeepers Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '5 hours ago',
    date: '2024-12-15',
    details: 'Module 4: Manage Properties • 98% completion score',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 3,
    title: 'Completed Hiring Your Virtual Assistants Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 day ago',
    date: '2024-12-14',
    details: 'Module 4: Manage Properties • Practical exercise submitted',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 4,
    title: 'Completed Hosting Remotely Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '2 days ago',
    date: '2024-12-13',
    details: 'Module 4: Manage Properties • Case study analysis',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 5,
    title: 'Completed Mid Term Rentals Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '3 days ago',
    date: '2024-12-12',
    details: 'Module 4: Manage Properties • Strategy workshop attended',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 6,
    title: 'Completed Property Optimization To Stay Booked Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '4 days ago',
    date: '2024-12-11',
    details: 'Module 4: Manage Properties • Optimization checklist completed',
    serverId: 'srv-eu-west-1-prod-001'
  },
  {
    id: 7,
    title: 'Completed Property Listing: Budgeting, Design & Photography Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '5 days ago',
    date: '2024-12-10',
    details: 'Module 4: Manage Properties • Photography portfolio submitted',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 8,
    title: 'Started Module 4: Manage Properties',
    type: 'module',
    status: 'completed',
    timestamp: '1 week ago',
    date: '2024-12-09',
    details: 'Module introduction and overview completed',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 9,
    title: 'Completed Growth Planning Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 week ago',
    date: '2024-12-08',
    details: 'Module 3: Acquire Properties • Business expansion plan created',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 10,
    title: 'Completed Rent Concessions Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 week ago',
    date: '2024-12-07',
    details: 'Module 3: Acquire Properties • Negotiation strategies mastered',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 11,
    title: 'Completed Rental Applications Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 week ago',
    date: '2024-12-06',
    details: 'Module 3: Acquire Properties • Application process optimized',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 12,
    title: 'Completed Property Acquisition II Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '2 weeks ago',
    date: '2024-12-01',
    details: 'Module 3: Acquire Properties • Advanced acquisition strategies',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 13,
    title: 'Completed Acquisitions I Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '2 weeks ago',
    date: '2024-11-28',
    details: 'Module 3: Acquire Properties • Basic acquisition fundamentals',
    serverId: 'srv-eu-west-1-prod-001'
  },
  {
    id: 14,
    title: 'Completed Property Acquisitions Overview',
    type: 'module',
    status: 'completed',
    timestamp: '2 weeks ago',
    date: '2024-11-25',
    details: 'Module 3: Acquire Properties • Overview and strategy session',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 15,
    title: 'Started Module 3: Acquire Properties',
    type: 'module',
    status: 'completed',
    timestamp: '3 weeks ago',
    date: '2024-11-20',
    details: 'Module introduction completed with 95% score',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 16,
    title: 'Completed Competitor Analysis Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '3 weeks ago',
    date: '2024-11-15',
    details: 'Module 2: Select Markets • Competitive landscape analysis',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 17,
    title: 'Completed STR Ordinances Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '4 weeks ago',
    date: '2024-11-10',
    details: 'Module 2: Select Markets • Legal compliance workshop',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 18,
    title: 'Completed Cash Flow Analysis Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 month ago',
    date: '2024-11-05',
    details: 'Module 2: Select Markets • Financial modeling exercise',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 19,
    title: 'Completed Market Research Step 1 Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '1 month ago',
    date: '2024-10-30',
    details: 'Module 2: Select Markets • Initial market analysis',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 20,
    title: 'Started Module 2: Select Markets',
    type: 'module',
    status: 'completed',
    timestamp: '5 weeks ago',
    date: '2024-10-25',
    details: 'Module overview and market selection fundamentals',
    serverId: 'srv-eu-west-1-prod-001'
  },
  {
    id: 21,
    title: 'Completed DIY Website Development Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '6 weeks ago',
    date: '2024-10-15',
    details: 'Module 1: Business Formation • Website launched successfully',
    serverId: 'srv-us-central-1-prod-002'
  },
  {
    id: 22,
    title: 'Completed Business Formation Lesson',
    type: 'module',
    status: 'completed',
    timestamp: '7 weeks ago',
    date: '2024-10-05',
    details: 'Module 1: Business Formation • Legal entity established',
    serverId: 'srv-us-east-1-prod-001'
  },
  {
    id: 23,
    title: 'Started Module 1: Business Formation',
    type: 'module',
    status: 'completed',
    timestamp: '2 months ago',
    date: '2024-09-20',
    details: 'Course introduction and business fundamentals',
    serverId: 'srv-us-west-2-prod-003'
  },
  {
    id: 24,
    title: 'Enrolled in Real Estate Investment Course',
    type: 'module',
    status: 'completed',
    timestamp: '4 months ago',
    date: '2024-08-01',
    details: 'Welcome to the program! • Course enrollment confirmed',
    serverId: 'srv-us-east-1-prod-001'
  }
];

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
  const [selectedStudent, setSelectedStudent] = useState(students[5]); // Default to Lindsay Sherman
  const [filter, setFilter] = useState('all');
  
  const activities = getActivities(selectedStudent);
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">
              Student Portal Activity Log
            </h1>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-6">
          <Card className="bg-white/80 border-slate-200 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-slate-500" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Student
                  </label>
                  <Select value={selectedStudent.id} onValueChange={(value) => {
                    const student = students.find(s => s.id === value);
                    if (student) setSelectedStudent(student);
                  }}>
                    <SelectTrigger className="w-full max-w-md bg-white border-slate-300 text-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-slate-800 focus:bg-blue-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-slate-500">{student.email} • {student.level}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Current Progress</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {selectedStudent.progress}%
                  </div>
                  <div className="text-xs text-slate-500">{selectedStudent.level} Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Info Bar */}
        <div className="mb-6">
          <Card className="bg-blue-50/50 border-blue-200/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">Viewing data for:</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.name}</span>
                  <span className="text-slate-500">({selectedStudent.email})</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-slate-500">Started: </span>
                    <span className="text-slate-800">{selectedStudent.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Progress: </span>
                    <span className="text-slate-800">{selectedStudent.progress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Level: </span>
                    <span className="text-slate-800">{selectedStudent.level}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-slate-500" />
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
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {type === 'all' ? 'All Activity' : type}
                </Button>
              ))}
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {filteredActivities.map((activity, index) => {
              const StatusIcon = statusIcons[activity.status];
              const typeColor = typeColors[activity.type];
              
              return (
                <Card 
                  key={activity.id} 
                  className="bg-white/70 border-slate-200 hover:border-slate-300 transition-all duration-200 hover:bg-white/90 backdrop-blur-sm shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        typeColor === 'blue' ? 'bg-blue-500' :
                        typeColor === 'purple' ? 'bg-purple-500' :
                        typeColor === 'indigo' ? 'bg-indigo-500' :
                        'bg-blue-500'
                      } flex-shrink-0`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-800 mb-1 leading-tight">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">
                              {activity.details}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  typeColor === 'blue' ? 'border-blue-300 text-blue-700 bg-blue-50' :
                                  typeColor === 'purple' ? 'border-purple-300 text-purple-700 bg-purple-50' :
                                  typeColor === 'indigo' ? 'border-indigo-300 text-indigo-700 bg-indigo-50' :
                                  'border-blue-300 text-blue-700 bg-blue-50'
                                }`}
                              >
                                {activity.type}
                              </Badge>
                              <span className="text-xs text-slate-500">{activity.timestamp}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">{activity.date}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-400 font-mono">{activity.serverId}</span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <StatusIcon className={`h-5 w-5 ${
                              typeColor === 'blue' ? 'text-blue-500' :
                              typeColor === 'purple' ? 'text-purple-500' :
                              typeColor === 'indigo' ? 'text-indigo-500' :
                              'text-blue-500'
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
              className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
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
