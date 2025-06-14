
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Lock, Play, Award } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  progress: number;
  joinedDate: string;
}

interface ProgressViewProps {
  student: Student;
}

export const ProgressView = ({ student }: ProgressViewProps) => {
  const modules = [
    { id: 1, title: 'Foundation Principles', status: 'completed', progress: 100, lessons: 8 },
    { id: 2, title: 'Market Analysis Basics', status: 'completed', progress: 100, lessons: 6 },
    { id: 3, title: 'Financial Modeling', status: 'completed', progress: 100, lessons: 10 },
    { id: 4, title: 'Risk Assessment', status: 'in-progress', progress: 75, lessons: 8 },
    { id: 5, title: 'Advanced Strategies', status: 'in-progress', progress: 25, lessons: 12 },
    { id: 6, title: 'Portfolio Management', status: 'locked', progress: 0, lessons: 9 },
    { id: 7, title: 'Expert Techniques', status: 'locked', progress: 0, lessons: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{student.name}'s Learning Journey</h2>
              <p className="text-emerald-100 mt-1">Track your progress through the program</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{student.progress}%</div>
              <div className="text-emerald-100">Complete</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={student.progress} className="h-3 bg-emerald-400/20" />
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Course Modules</CardTitle>
          <p className="text-gray-600">Your progress through each learning module</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {module.status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {module.status === 'in-progress' && <Play className="h-6 w-6 text-blue-500" />}
                    {module.status === 'locked' && <Lock className="h-6 w-6 text-gray-400" />}
                    <div>
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-gray-500">{module.lessons} lessons</p>
                    </div>
                  </div>
                  <Badge 
                    variant={module.status === 'completed' ? 'default' : 'secondary'}
                    className={
                      module.status === 'completed' ? 'bg-green-100 text-green-800' :
                      module.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }
                  >
                    {module.status === 'completed' ? 'Completed' :
                     module.status === 'in-progress' ? 'In Progress' :
                     'Locked'}
                  </Badge>
                </div>
                <Progress value={module.progress} className="h-2" />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{module.progress}% complete</span>
                  {module.status === 'completed' && <span>✓ Certificate earned</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements & Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Foundation Graduate', date: '2 weeks ago', icon: '🎓' },
              { title: 'Market Analysis Expert', date: '1 week ago', icon: '📊' },
              { title: 'Financial Modeling Pro', date: '3 days ago', icon: '💰' }
            ].map((achievement, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
