
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, BookOpen, CheckCircle, MessageCircle, Star, TrendingUp } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    type: 'lesson_completed',
    title: 'Completed "Advanced Market Analysis Strategies"',
    description: 'Finished lesson 3 of Module 2 with 95% quiz score',
    timestamp: '2 hours ago',
    icon: CheckCircle,
    color: 'bg-green-500',
    points: '+50 XP'
  },
  {
    id: 2,
    type: 'comment',
    title: 'Received coach feedback',
    description: 'Sarah Johnson replied to your portfolio submission',
    timestamp: '4 hours ago',
    icon: MessageCircle,
    color: 'bg-blue-500',
    points: null
  },
  {
    id: 3,
    type: 'milestone',
    title: 'Milestone Achievement: Property Analysis Pro',
    description: 'Completed 10 successful property analyses',
    timestamp: '1 day ago',
    icon: Star,
    color: 'bg-yellow-500',
    points: '+200 XP'
  },
  {
    id: 4,
    type: 'lesson_started',
    title: 'Started "Cash Flow Optimization"',
    description: 'Began Module 3 - Estimated completion: 45 minutes',
    timestamp: '2 days ago',
    icon: BookOpen,
    color: 'bg-purple-500',
    points: null
  },
  {
    id: 5,
    type: 'performance',
    title: 'Weekly Performance Report',
    description: 'You\'re in the top 15% of students this week!',
    timestamp: '3 days ago',
    icon: TrendingUp,
    color: 'bg-cyan-500',
    points: '+100 XP'
  }
];

export const TimelineView = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-700/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Lessons Completed</p>
                <p className="text-2xl font-bold text-green-400">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-blue-400">47h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-yellow-400">2,840</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-purple-400">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500"></div>
        
        <div className="space-y-6">
          {timelineData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="relative flex items-start gap-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.color} relative z-10`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                
                <Card className="flex-1 bg-slate-700/30 border-slate-600/50 hover:border-cyan-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          {item.points && (
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                              {item.points}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {item.timestamp}
                        </div>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-600 text-xs">
                          {item.type === 'comment' ? 'SJ' : 'ME'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
