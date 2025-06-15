
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
    title: 'Completed Module 2, Lesson 4: Advanced Market Analysis',
    type: 'module',
    status: 'completed',
    timestamp: '2 hours ago',
    date: '2024-12-13',
    details: 'Market Analysis Module • 95% quiz score'
  },
  {
    id: 2,
    title: `Received feedback on ${student.name}'s Portfolio Analysis #3`,
    type: 'feedback',
    status: 'new',
    timestamp: '4 hours ago',
    date: '2024-12-13',
    details: 'Mentor Richie Matthews • View feedback'
  },
  {
    id: 3,
    title: 'Started Module 3, Lesson 1: Cash Flow Optimization',
    type: 'module',
    status: 'in-progress',
    timestamp: '1 day ago',
    date: '2024-12-12',
    details: 'Property Acquisition Module • 45 minutes remaining'
  },
  {
    id: 4,
    title: 'Submitted Property Analysis Assignment',
    type: 'assignment',
    status: 'submitted',
    timestamp: '2 days ago',
    date: '2024-12-11',
    details: 'Assignment #4 • Under review'
  },
  {
    id: 5,
    title: 'Joined live Q&A session',
    type: 'live',
    status: 'attended',
    timestamp: '3 days ago',
    date: '2024-12-10',
    details: 'Expert Interview: Market Trends • 1h 30m'
  },
  {
    id: 6,
    title: 'Achieved milestone: Analysis Expert',
    type: 'achievement',
    status: 'earned',
    timestamp: '5 days ago',
    date: '2024-12-08',
    details: '3 consecutive quizzes with 95%+ score'
  },
  {
    id: 7,
    title: 'Completed Module 1, Lesson 4: Real Estate Investment Fundamentals',
    type: 'module',
    status: 'completed',
    timestamp: '1 week ago',
    date: '2024-12-06',
    details: 'Foundation Module • 98% final exam score'
  },
  {
    id: 8,
    title: 'Started Real Estate Investment Course',
    type: 'module',
    status: 'completed',
    timestamp: '4 months ago',
    date: '2024-08-01',
    details: 'Welcome to the program! • Course enrollment'
  }
];

const typeColors = {
  module: 'blue',
  feedback: 'cyan',
  assignment: 'purple',
  live: 'orange',
  achievement: 'yellow'
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
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">Student Portal Activity Log</h1>
            <p className="text-slate-400 mt-1">Track learning progress and activity for high-ticket clients</p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-cyan-400" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Select Student
                  </label>
                  <Select value={selectedStudent.id} onValueChange={(value) => {
                    const student = students.find(s => s.id === value);
                    if (student) setSelectedStudent(student);
                  }}>
                    <SelectTrigger className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 z-50">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-slate-100 focus:bg-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-slate-400">{student.email} • {student.level}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Current Progress</div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedStudent.progress}%</div>
                  <div className="text-xs text-slate-500">{selectedStudent.level} Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Clean Header */}
          <div className="flex items-center justify-between border-b border-slate-600/30 pb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Activity Log - {selectedStudent.name}</h2>
              <p className="text-slate-400 mt-1">Started learning: {selectedStudent.joinedDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                {selectedStudent.progress}% Complete
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                {selectedStudent.level}
              </Badge>
            </div>
          </div>

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
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700' 
                      : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
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
                  className="bg-slate-900/30 border-slate-800 hover:border-slate-700 transition-all duration-200 hover:bg-slate-800/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        typeColor === 'blue' ? 'bg-cyan-400' :
                        typeColor === 'cyan' ? 'bg-cyan-400' :
                        typeColor === 'purple' ? 'bg-purple-400' :
                        typeColor === 'orange' ? 'bg-orange-400' :
                        typeColor === 'yellow' ? 'bg-yellow-400' :
                        'bg-cyan-400'
                      } flex-shrink-0`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white mb-1 leading-tight">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-slate-400 mb-2">
                              {activity.details}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  typeColor === 'blue' ? 'border-cyan-500/30 text-cyan-400' :
                                  typeColor === 'cyan' ? 'border-cyan-500/30 text-cyan-400' :
                                  typeColor === 'purple' ? 'border-purple-500/30 text-purple-400' :
                                  typeColor === 'orange' ? 'border-orange-500/30 text-orange-400' :
                                  typeColor === 'yellow' ? 'border-yellow-500/30 text-yellow-400' :
                                  'border-cyan-500/30 text-cyan-400'
                                }`}
                              >
                                {activity.type}
                              </Badge>
                              <span className="text-xs text-slate-500">{activity.timestamp}</span>
                              <span className="text-xs text-slate-600">•</span>
                              <span className="text-xs text-slate-500">{activity.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <StatusIcon className={`h-5 w-5 ${
                              typeColor === 'blue' ? 'text-cyan-400' :
                              typeColor === 'cyan' ? 'text-cyan-400' :
                              typeColor === 'purple' ? 'text-purple-400' :
                              typeColor === 'orange' ? 'text-orange-400' :
                              typeColor === 'yellow' ? 'text-yellow-400' :
                              'text-cyan-400'
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
              className="text-slate-400 hover:text-slate-300 hover:bg-slate-800"
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
