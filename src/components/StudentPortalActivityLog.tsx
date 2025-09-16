import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CheckCircle, Download, Filter, BookOpen, Trophy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityEntry {
  id: string;
  type: 'module' | 'assignment' | 'quiz' | 'achievement';
  title: string;
  description: string;
  date: string;
  material: string;
  completed: boolean;
  score?: string;
  duration?: string;
}

const mockActivityData: ActivityEntry[] = [
  // Accelerator Program Activities - Takeisha Moore
  {
    id: 'tm1',
    type: 'achievement',
    title: 'Accelerator Program Access Granted',
    description: 'Successfully purchased and enrolled in Accelerator (presale $2,500)',
    date: '2025-06-18',
    material: 'Program Access Confirmation.pdf',
    completed: true,
    duration: '5 min'
  },
  {
    id: 'tm2',
    type: 'module',
    title: 'Accelerator Orientation',
    description: 'Completed program introduction and setup',
    date: '2025-06-18',
    material: 'Accelerator Welcome Kit.pdf',
    completed: true,
    duration: '30 min'
  },
  {
    id: 'tm3',
    type: 'module',
    title: 'Advanced Market Analysis',
    description: 'Mastered professional market evaluation techniques',
    date: '2025-06-20',
    material: 'Advanced Market Analysis Toolkit.pdf',
    completed: true,
    duration: '4 hours'
  },
  {
    id: 'tm4',
    type: 'module',
    title: 'Property Acquisition Masterclass',
    description: 'Learned advanced negotiation and acquisition strategies',
    date: '2025-06-22',
    material: 'Acquisition Masterclass Materials.pdf',
    completed: true,
    duration: '6 hours'
  },
  {
    id: 'tm5',
    type: 'assignment',
    title: 'Live Deal Analysis',
    description: 'Analyzed real properties with mentor guidance',
    date: '2025-06-25',
    material: 'Live Deal Analysis Report.pdf',
    completed: true,
    score: '97%'
  },
  {
    id: 'tm6',
    type: 'module',
    title: 'Scaling Your Business',
    description: 'Advanced strategies for business growth',
    date: '2025-06-28',
    material: 'Business Scaling Blueprint.pdf',
    completed: true,
    duration: '5 hours'
  },
  {
    id: 'tm7',
    type: 'quiz',
    title: 'Accelerator Mastery Assessment',
    description: 'Comprehensive evaluation of advanced concepts',
    date: '2025-07-01',
    material: 'Mastery Assessment Results.pdf',
    completed: true,
    score: '94%'
  },

  // Student Learning Activities - Vinod Kumar
  {
    id: 'vk1',
    type: 'achievement',
    title: 'Welcome to Rentalizer Academy',
    description: 'Successfully enrolled in Accelerator Pro Program',
    date: '2025-06-19',
    material: 'Welcome Package.pdf',
    completed: true,
    duration: '15 min'
  },
  {
    id: 'vk2',
    type: 'module',
    title: 'Module 1: Foundation Strategies',
    description: 'Completed all lessons and video content',
    date: '2025-06-20',
    material: 'Foundation Strategies Guide.pdf',
    completed: true,
    duration: '2.5 hours'
  },
  {
    id: 'vk3',
    type: 'module',
    title: 'Module 2: Market Analysis Techniques',
    description: 'Finished market research fundamentals',
    date: '2025-06-22',
    material: 'Market Analysis Workbook.pdf',
    completed: true,
    duration: '3 hours'
  },
  {
    id: 'vk4',
    type: 'assignment',
    title: 'Market Research Assignment',
    description: 'Submitted local market analysis report',
    date: '2025-06-24',
    material: 'Assignment Submission.pdf',
    completed: true,
    score: '95%'
  },
  {
    id: 'vk5',
    type: 'quiz',
    title: 'Foundation Knowledge Quiz',
    description: 'Passed comprehensive knowledge assessment',
    date: '2025-06-25',
    material: 'Quiz Results.pdf',
    completed: true,
    score: '88%'
  },
  {
    id: 'vk6',
    type: 'module',
    title: 'Module 3: Property Acquisition',
    description: 'Completed property finding strategies',
    date: '2025-06-28',
    material: 'Property Acquisition Guide.pdf',
    completed: true,
    duration: '4 hours'
  },
  {
    id: 'vk7',
    type: 'achievement',
    title: 'First Month Milestone',
    description: 'Completed first month of accelerator program',
    date: '2025-07-01',
    material: 'Milestone Certificate.pdf',
    completed: true
  },

  // Default student activities
  {
    id: '1',
    type: 'module',
    title: 'Module 1: Getting Started',
    description: 'Introduction to rental arbitrage fundamentals',
    date: '2024-08-01',
    material: 'Getting Started Guide.pdf',
    completed: true,
    duration: '1.5 hours'
  },
  {
    id: '2',
    type: 'module',
    title: 'Module 2: Market Research',
    description: 'Learn to identify profitable markets',
    date: '2024-08-15',
    material: 'Market Research Toolkit.pdf',
    completed: true,
    duration: '2 hours'
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Market Analysis Project',
    description: 'Analyze your local rental market',
    date: '2024-08-20',
    material: 'Project Submission.pdf',
    completed: true,
    score: '92%'
  },
  {
    id: '4',
    type: 'quiz',
    title: 'Foundation Quiz',
    description: 'Test your understanding of basics',
    date: '2024-08-25',
    material: 'Quiz Report.pdf',
    completed: true,
    score: '85%'
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Foundation Complete',
    description: 'Successfully mastered the fundamentals',
    date: '2024-09-01',
    material: 'Achievement Badge.pdf',
    completed: true
  }
];

const mockStudents = [
  { id: '1', name: 'Lindsay Sherman', email: 'dutchess0085@gmail.com', progress: 100 },
  { id: '2', name: 'Takeisha Moore', email: 'takeisha.moore@metrobrokers.com', progress: 100 },
  { id: '3', name: 'Tiffany Worthy', email: 'tiffany1990worthy@yahoo.com', progress: 100 },
  { id: '4', name: 'Pavlos Michaels', email: 'pavlos.michaels4@gmail.com', progress: 100 },
  { id: '5', name: 'Alex Johnson', email: 'alex.johnson@email.com', progress: 100 },
  { id: '6', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', progress: 100 },
  { id: '7', name: 'Mike Davis', email: 'mike.davis@email.com', progress: 100 },
  { id: '8', name: 'Sanyo Mathew', email: 'sanyo.6677@gmail.com', progress: 100 },
  { id: '9', name: 'Vinod Kumar', email: 'vinodkhatri@hotmail.com', progress: 100 },
  { id: '10', name: 'Mary Fofanah', email: 'maryfofanah18@gmail.com', progress: 100 },
];

export const StudentPortalActivityLog = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [activeFilter, setActiveFilter] = useState('All Activity');
  
  const currentStudent = mockStudents.find(s => s.id === selectedStudent) || mockStudents[0];
  
  const filterTabs = ['All Activity', 'Module', 'Assignment', 'Quiz', 'Achievement'];
  
  const filteredActivities = mockActivityData.filter(activity => {
    // Filter by student - show specific activities for each student
    if (selectedStudent === '2' && !activity.id.startsWith('tm')) return false; // Takeisha Moore - Accelerator
    if (selectedStudent === '9' && !activity.id.startsWith('vk')) return false; // Vinod Kumar
    if (!['2', '9'].includes(selectedStudent) && (activity.id.startsWith('tm') || activity.id.startsWith('vk'))) return false;
    
    // Filter by activity type
    if (activeFilter === 'All Activity') return true;
    return activity.type.toLowerCase() === activeFilter.toLowerCase();
  }).sort((a, b) => {
    // Sort by date: newest first (descending order)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
          <h1 className="text-2xl font-bold text-white">Student Learning Log</h1>
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
                <p className="text-gray-300 text-sm mb-1">Course Progress</p>
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
                <div className="text-gray-400">Started: <span className="text-white">{selectedStudent === '2' ? '2025-06-18' : selectedStudent === '9' ? '2025-06-19' : '2024-08-01'}</span></div>
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
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }
            >
              {tab === 'Module' && <BookOpen className="h-3 w-3 mr-1" />}
              {tab === 'Achievement' && <Trophy className="h-3 w-3 mr-1" />}
              {tab === 'Assignment' && <FileText className="h-3 w-3 mr-1" />}
              {tab === 'Quiz' && <FileText className="h-3 w-3 mr-1" />}
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
                          activity.type === 'quiz' ? "border-green-500/30 text-green-300 bg-green-500/10" :
                          "border-blue-500/30 text-blue-300 bg-blue-500/10"
                        }>
                          {activity.type}
                        </Badge>
                        <span className="text-gray-400">{activity.date}</span>
                        {activity.score && (
                          <>
                            <span className="text-gray-500">Score:</span>
                            <span className="text-green-400 font-medium">{activity.score}</span>
                          </>
                        )}
                        {activity.duration && (
                          <>
                            <span className="text-gray-500">Duration:</span>
                            <span className="text-gray-400 text-xs">{activity.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400">{activity.material}</span>
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