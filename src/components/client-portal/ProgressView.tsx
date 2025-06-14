
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock, Play, BookOpen, Target } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: 'Foundation & Market Basics',
    lessons: 8,
    completed: 8,
    status: 'completed',
    progress: 100,
    unlocked: true
  },
  {
    id: 2,
    title: 'Advanced Market Analysis',
    lessons: 10,
    completed: 7,
    status: 'in-progress',
    progress: 70,
    unlocked: true,
    currentLesson: 'Lesson 8: Comparative Market Analysis'
  },
  {
    id: 3,
    title: 'Cash Flow Optimization',
    lessons: 12,
    completed: 0,
    status: 'locked',
    progress: 0,
    unlocked: false,
    unlockRequirement: 'Complete Module 2'
  },
  {
    id: 4,
    title: 'Advanced Investment Strategies',
    lessons: 15,
    completed: 0,
    status: 'locked',
    progress: 0,
    unlocked: false,
    unlockRequirement: 'Complete Module 3'
  }
];

const learningPath = [
  { step: 1, title: 'Market Foundation', completed: true },
  { step: 2, title: 'Analysis Skills', completed: true },
  { step: 3, title: 'Investment Basics', completed: true },
  { step: 4, title: 'Advanced Analysis', completed: false, current: true },
  { step: 5, title: 'Cash Flow Mastery', completed: false },
  { step: 6, title: 'Portfolio Building', completed: false },
  { step: 7, title: 'Expert Strategies', completed: false }
];

export const ProgressView = () => {
  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Learning Journey</h2>
              <p className="text-gray-300">Real Estate Investment Mastery Program</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-400">68%</p>
              <p className="text-sm text-gray-400">Overall Progress</p>
            </div>
          </div>
          <Progress value={68} className="h-3 mb-2" />
          <p className="text-sm text-gray-300">24 of 35 lessons completed • Estimated completion: 3 weeks</p>
        </CardContent>
      </Card>

      {/* Learning Path Visualization */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6 overflow-x-auto pb-4">
            {learningPath.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center min-w-[120px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.current 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-600 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : step.current ? (
                    <Play className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>
                <p className={`text-xs text-center ${
                  step.completed || step.current ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                {step.current && (
                  <Badge className="mt-1 bg-blue-500/20 text-blue-300 text-xs">Current</Badge>
                )}
                {/* Connection line */}
                {index < learningPath.length - 1 && (
                  <div className={`absolute w-16 h-0.5 mt-6 ml-16 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className={`bg-slate-700/30 border-slate-600/50 ${
            module.status === 'locked' ? 'opacity-60' : ''
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {module.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : module.status === 'in-progress' ? (
                    <Play className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  Module {module.id}
                </CardTitle>
                <Badge variant={
                  module.status === 'completed' ? 'default' : 
                  module.status === 'in-progress' ? 'secondary' : 'outline'
                } className={
                  module.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  module.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }>
                  {module.status === 'completed' ? 'Completed' : 
                   module.status === 'in-progress' ? 'In Progress' : 'Locked'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-white mb-2">{module.title}</h3>
              
              {module.status !== 'locked' ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      {module.completed} of {module.lessons} lessons
                    </span>
                    <span className="text-sm font-medium text-cyan-400">
                      {module.progress}%
                    </span>
                  </div>
                  <Progress value={module.progress} className="h-2 mb-3" />
                  
                  {module.currentLesson && (
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <BookOpen className="h-4 w-4" />
                      <span>Next: {module.currentLesson}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">{module.unlockRequirement}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements & Milestones */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-300">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Fast Learner', description: 'Completed 5 lessons in one day', icon: '⚡', earned: true },
              { title: 'Analysis Expert', description: 'Scored 95%+ on 3 consecutive quizzes', icon: '🎯', earned: true },
              { title: 'Consistent Student', description: 'Maintained 10-day study streak', icon: '🔥', earned: true },
              { title: 'Module Master', description: 'Complete Module 3 with 90%+ average', icon: '🏆', earned: false },
              { title: 'Portfolio Pro', description: 'Submit 5 property analyses', icon: '📊', earned: false },
              { title: 'Community Leader', description: 'Help 10 fellow students', icon: '🤝', earned: false }
            ].map((achievement, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                achievement.earned 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-gray-500/10 border-gray-500/30'
              }`}>
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
