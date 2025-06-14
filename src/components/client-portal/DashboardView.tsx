
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Clock, Trophy, TrendingUp, Users } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  progress: number;
  joinedDate: string;
}

interface DashboardViewProps {
  student: Student;
}

export const DashboardView = ({ student }: DashboardViewProps) => {
  return (
    <div className="space-y-6">
      {/* Student Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full border-2 border-white" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-blue-100">{student.email}</p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                {student.level}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{student.progress}%</div>
              <div className="text-blue-100">Overall Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Modules Completed</p>
                <p className="text-2xl font-bold">12/20</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-2xl font-bold">45h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity for {student.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Completed Module 12: Advanced Strategies', time: '2 hours ago', type: 'completion' },
              { action: 'Downloaded lesson materials', time: '1 day ago', type: 'download' },
              { action: 'Participated in live Q&A session', time: '2 days ago', type: 'engagement' },
              { action: 'Submitted assignment #8', time: '3 days ago', type: 'submission' },
              { action: 'Earned Certificate: Foundation Level', time: '1 week ago', type: 'achievement' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    activity.type === 'completion' ? 'border-green-200 text-green-700' :
                    activity.type === 'achievement' ? 'border-yellow-200 text-yellow-700' :
                    activity.type === 'engagement' ? 'border-blue-200 text-blue-700' :
                    'border-gray-200 text-gray-700'
                  }
                >
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
