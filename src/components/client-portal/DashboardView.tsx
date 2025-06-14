
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, BookOpen, Award, Clock, Users } from 'lucide-react';

export const DashboardView = () => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-300 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">68%</span>
                <Badge className="bg-blue-500/20 text-blue-300">On Track</Badge>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-sm text-gray-300">24 of 35 lessons completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-300 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">12 days</span>
                <Badge className="bg-green-500/20 text-green-300">🔥 Hot Streak</Badge>
              </div>
              <p className="text-sm text-gray-300">Your longest streak: 18 days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-300 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">8</span>
                <Badge className="bg-purple-500/20 text-purple-300">Level 3</Badge>
              </div>
              <p className="text-sm text-gray-300">2 more to unlock Level 4</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Completed Quiz', subject: 'Market Analysis Module', score: '95%', time: '2h ago', color: 'green' },
                { action: 'Watched Lesson', subject: 'Cash Flow Strategies', progress: '100%', time: '4h ago', color: 'blue' },
                { action: 'Submitted Assignment', subject: 'Property Analysis #3', status: 'Under Review', time: '1d ago', color: 'yellow' },
                { action: 'Joined Discussion', subject: 'Real Estate Trends Q4', replies: '12 replies', time: '2d ago', color: 'purple' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-600/30 hover:bg-slate-600/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium text-${activity.color}-400`}>
                      {activity.score || activity.progress || activity.status || activity.replies}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/30 border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Live Session', title: 'Q&A with Real Estate Expert', date: 'Today, 3:00 PM', color: 'red' },
                { type: 'Assignment Due', title: 'Portfolio Review #2', date: 'Tomorrow, 11:59 PM', color: 'orange' },
                { type: 'New Content', title: 'Module 4: Advanced Strategies', date: 'Dec 18, 2024', color: 'green' },
                { type: 'Group Call', title: 'Mastermind Session', date: 'Dec 20, 2024', color: 'blue' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-600/30">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-400 mt-2`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Performance vs. Cohort
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">Top 15%</p>
              <p className="text-sm text-gray-400">Overall Ranking</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">89%</p>
              <p className="text-sm text-gray-400">Average Quiz Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">47h</p>
              <p className="text-sm text-gray-400">Total Study Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
