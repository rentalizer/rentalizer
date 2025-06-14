
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight, Filter } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  progress: number;
  joinedDate: string;
}

interface MinimalViewProps {
  student: Student;
}

const getActivities = (student: Student) => [
  {
    id: 1,
    title: 'Completed Advanced Market Analysis lesson',
    type: 'lesson',
    status: 'completed',
    timestamp: '2 hours ago',
    details: 'Module 2, Lesson 8 • 95% quiz score'
  },
  {
    id: 2,
    title: `Received feedback on ${student.name}'s Portfolio Analysis #3`,
    type: 'feedback',
    status: 'new',
    timestamp: '4 hours ago',
    details: 'Coach Sarah Johnson • View feedback'
  },
  {
    id: 3,
    title: 'Started Cash Flow Optimization module',
    type: 'lesson',
    status: 'in-progress',
    timestamp: '1 day ago',
    details: 'Module 3 • 45 minutes remaining'
  },
  {
    id: 4,
    title: 'Submitted Property Analysis Assignment',
    type: 'assignment',
    status: 'submitted',
    timestamp: '2 days ago',
    details: 'Assignment #4 • Under review'
  },
  {
    id: 5,
    title: 'Joined live Q&A session',
    type: 'live',
    status: 'attended',
    timestamp: '3 days ago',
    details: 'Expert Interview: Market Trends • 1h 30m'
  },
  {
    id: 6,
    title: 'Achieved milestone: Analysis Expert',
    type: 'achievement',
    status: 'earned',
    timestamp: '5 days ago',
    details: '3 consecutive quizzes with 95%+ score'
  }
];

const typeColors = {
  lesson: 'blue',
  feedback: 'green',
  assignment: 'purple',
  live: 'red',
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

export const MinimalView = ({ student }: MinimalViewProps) => {
  const [filter, setFilter] = useState('all');
  const activities = getActivities(student);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Clean Header */}
      <div className="flex items-center justify-between border-b border-slate-600/30 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Activity Log - {student.name}</h1>
          <p className="text-gray-400 mt-1">Track learning progress and achievements</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-green-500/30 text-green-400">
            {student.progress}% Complete
          </Badge>
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
            {student.level}
          </Badge>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex gap-1">
          {['all', 'lesson', 'assignment', 'feedback', 'achievement'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(type)}
              className={`capitalize text-xs ${
                filter === type 
                  ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' 
                  : 'text-gray-400 hover:text-gray-300'
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
              className="bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-700/30"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full bg-${typeColor}-400 flex-shrink-0`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white mb-1 leading-tight">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {activity.details}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs border-${typeColor}-500/30 text-${typeColor}-400`}
                          >
                            {activity.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <StatusIcon className={`h-5 w-5 text-${typeColor}-400`} />
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
          className="text-gray-400 hover:text-gray-300"
        >
          Load more activity
        </Button>
      </div>
    </div>
  );
};
