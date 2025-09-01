import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CheckCircle, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityEntry {
  id: string;
  type: 'module' | 'assignment' | 'feedback' | 'achievement';
  title: string;
  description: string;
  date: string;
  serverID: string;
  pdfFile: string;
  completed: boolean;
  score?: string;
}

const mockActivityData: ActivityEntry[] = [
  // Vinod Kumar - Accelerator Pro Program
  {
    id: 'vk1',
    type: 'module',
    title: 'Accelerator Pro: Payment Processing',
    description: 'Payment of $1,000.00 USD successfully processed',
    date: '2025-07-19',
    serverID: 'srv-billing-system-001',
    pdfFile: 'Payment Confirmation Receipt.pdf',
    completed: true
  },
  {
    id: 'vk2',
    type: 'module',
    title: 'Accelerator Pro: Account Setup Complete',
    description: 'Student account successfully created and activated',
    date: '2025-07-19',
    serverID: 'srv-us-west-1-prod-810',
    pdfFile: 'Account Setup Confirmation.pdf',
    completed: true
  },
  {
    id: 'vk3',
    type: 'module',
    title: 'Module 1: Foundation Strategies',
    description: 'Content download: 100% complete',
    date: '2025-07-20',
    serverID: 'srv-content-delivery-005',
    pdfFile: 'Foundation Strategies.pdf',
    completed: true
  },
  {
    id: 'vk4',
    type: 'module',
    title: 'Module 2: Market Analysis Techniques',
    description: 'Content download: 100% complete',
    date: '2025-07-22',
    serverID: 'srv-content-delivery-005',
    pdfFile: 'Market Analysis Techniques.pdf',
    completed: true
  },
  {
    id: 'vk5',
    type: 'module',
    title: 'Module 3: Advanced Investment Strategies',
    description: 'Content download: 100% complete',
    date: '2025-07-25',
    serverID: 'srv-content-delivery-005',
    pdfFile: 'Advanced Investment Strategies.pdf',
    completed: true
  },
  
  // Sanyo 6677 - Accelerator Pro Program
  {
    id: 'sy3',
    type: 'module',
    title: 'Accelerator Pro: Portfolio Analysis',
    description: 'Multi-property portfolio framework completed',
    date: '2025-08-02',
    serverID: 'srv-us-central-2-prod-811',
    pdfFile: 'Portfolio Analysis Framework.pdf',
    completed: true
  },
  {
    id: 'sy4',
    type: 'module',
    title: 'Accelerator Pro: Market Intelligence',
    description: 'Advanced market research techniques mastered',
    date: '2025-07-30',
    serverID: 'srv-us-east-2-prod-812',
    pdfFile: 'Market Intelligence Guide.pdf',
    completed: true
  },
  {
    id: 'sy5',
    type: 'module',
    title: 'Accelerator Pro: Investment Strategies',
    description: 'ROI optimization strategies completed',
    date: '2025-07-28',
    serverID: 'srv-us-west-1-prod-810',
    pdfFile: 'Investment Strategy Optimization.pdf',
    completed: true
  },
  {
    id: 'sy6',
    type: 'module',
    title: 'Accelerator Pro: Data Analytics',
    description: 'Advanced analytics dashboard setup completed',
    date: '2025-07-25',
    serverID: 'srv-us-central-2-prod-811',
    pdfFile: 'Analytics Dashboard Setup Guide.pdf',
    completed: true
  },
  {
    id: 'sy7',
    type: 'achievement',
    title: 'Accelerator Pro: Module 1 Completion',
    description: 'Fundamentals certification earned with 87% score',
    date: '2025-07-22',
    serverID: 'srv-us-east-2-prod-812',
    pdfFile: 'Module 1 Completion Certificate.pdf',
    completed: true
  },
  {
    id: 'sy8',
    type: 'module',
    title: 'Accelerator Pro: Property Evaluation',
    description: 'Property evaluation framework completed',
    date: '2025-07-18',
    serverID: 'srv-us-west-1-prod-810',
    pdfFile: 'Property Evaluation Methods.pdf',
    completed: true
  },
  {
    id: 'sy9',
    type: 'module',
    title: 'Accelerator Pro: Market Research',
    description: 'Market research methodology workshop attended',
    date: '2025-07-15',
    serverID: 'srv-us-central-2-prod-811',
    pdfFile: 'Market Research Methodology.pdf',
    completed: true
  },
  {
    id: 'sy10',
    type: 'module',
    title: 'Accelerator Pro: Financial Modeling',
    description: 'Financial modeling basics completed',
    date: '2025-07-12',
    serverID: 'srv-us-east-2-prod-812',
    pdfFile: 'Financial Modeling Basics.pdf',
    completed: true
  },
  {
    id: 'sy11',
    type: 'module',
    title: 'Accelerator Pro: Payment Processing',
    description: 'First payment of $2,000.00 USD successfully processed',
    date: '2025-08-04',
    serverID: 'srv-billing-system-001',
    pdfFile: 'Payment Confirmation Receipt.pdf',
    completed: true
  },
  {
    id: 'sy12',
    type: 'achievement',
    title: 'Accelerator Pro Program',
    description: 'Successfully enrolled and payment plan setup (2 monthly payments of $2,000.00 USD)',
    date: '2025-07-04',
    serverID: 'srv-us-west-1-prod-810',
    pdfFile: 'Accelerator Pro Welcome Package.pdf',
    completed: true
  },

  // Tiffany Worthy - Arbitrage Accelerator Program
  {
    id: 'tw1',
    type: 'module',
    title: 'Module 4: Advanced Arbitrage Strategies',
    description: 'Final assessment completed with 94% score',
    date: '2025-07-02',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Advanced Arbitrage Mastery Checklist.pdf',
    completed: true
  },
  {
    id: 'tw2',
    type: 'module',
    title: 'Module 4: Advanced Arbitrage Strategies',
    description: 'Risk management strategies implemented',
    date: '2025-07-01',
    serverID: 'srv-us-central-2-prod-806',
    pdfFile: 'Risk Management Implementation Guide.pdf',
    completed: true
  },
  {
    id: 'tw3',
    type: 'module',
    title: 'Module 4: Advanced Arbitrage Strategies',
    description: 'Risk management workshop attended',
    date: '2025-06-30',
    serverID: 'srv-us-east-2-prod-804',
    pdfFile: 'Risk Management Strategies Guide.pdf',
    completed: true
  },
  {
    id: 'tw4',
    type: 'module',
    title: 'Module 3: Market Analysis Techniques',
    description: 'Advanced analysis methods completed',
    date: '2025-06-28',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Advanced Analysis Methods Guide.pdf',
    completed: true
  },
  {
    id: 'tw5',
    type: 'module',
    title: 'Module 3: Market Analysis Techniques',
    description: 'Competitive analysis case study completed',
    date: '2025-06-25',
    serverID: 'srv-us-central-2-prod-806',
    pdfFile: 'Competitive Analysis Framework.pdf',
    completed: true
  },
  {
    id: 'tw6',
    type: 'module',
    title: 'Module 3: Market Analysis Techniques',
    description: 'Data visualization techniques mastered',
    date: '2025-06-22',
    serverID: 'srv-us-east-2-prod-804',
    pdfFile: 'Data Visualization Mastery Guide.pdf',
    completed: true
  },
  {
    id: 'tw7',
    type: 'module',
    title: 'Module 2: Property Sourcing Automation',
    description: 'Automation scripts deployment successful',
    date: '2025-06-18',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Automation Scripts Package.pdf',
    completed: true
  },
  {
    id: 'tw8',
    type: 'module',
    title: 'Module 2: Property Sourcing Automation',
    description: 'API integration workshop completed',
    date: '2025-06-15',
    serverID: 'srv-us-central-2-prod-806',
    pdfFile: 'API Integration Manual.pdf',
    completed: true
  },
  {
    id: 'tw9',
    type: 'achievement',
    title: 'Module 2: Property Sourcing Automation',
    description: 'Certification earned with distinction',
    date: '2025-06-12',
    serverID: 'srv-us-east-2-prod-804',
    pdfFile: 'Automation Certification.pdf',
    completed: true
  },
  {
    id: 'tw10',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Financial modeling techniques completed',
    date: '2025-06-08',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Financial Modeling Mastery Guide.pdf',
    completed: true
  },
  {
    id: 'tw11',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Legal compliance training completed',
    date: '2025-06-05',
    serverID: 'srv-us-central-2-prod-806',
    pdfFile: 'Legal Compliance Guide.pdf',
    completed: true
  },
  {
    id: 'tw12',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Market research methodology mastered',
    date: '2025-05-28',
    serverID: 'srv-us-east-2-prod-804',
    pdfFile: 'Market Research Methodology.pdf',
    completed: true
  },
  {
    id: 'tw13',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Market research techniques completed',
    date: '2025-05-25',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Market Research Mastery Guide.pdf',
    completed: true
  },
  {
    id: 'tw14',
    type: 'module',
    title: 'Module 1: Arbitrage Fundamentals',
    description: 'Introduction video watched and quiz passed',
    date: '2025-05-22',
    serverID: 'srv-us-central-2-prod-806',
    pdfFile: 'Arbitrage Basics Guide.pdf',
    completed: true
  },
  {
    id: 'tw15',
    type: 'achievement',
    title: 'Arbitrage Accelerator Program',
    description: 'Successfully enrolled and payment confirmed',
    date: '2025-05-21',
    serverID: 'srv-us-west-1-prod-805',
    pdfFile: 'Arbitrage Accelerator Welcome Package.pdf',
    completed: true
  },
  
  // Pavlos Michaels - Accelerator Pro Program
  {
    id: 'pm1',
    type: 'module',
    title: 'Accelerator Pro: Advanced Real Estate Analytics',
    description: 'Market analysis dashboard mastery completed with 96% score',
    date: '2025-08-22',
    serverID: 'srv-us-west-1-prod-807',
    pdfFile: 'Advanced Analytics Mastery Guide.pdf',
    completed: true
  },
  {
    id: 'pm2',
    type: 'module',
    title: 'Accelerator Pro: Property Investment Strategies',
    description: 'ROI optimization workshop completed',
    date: '2025-08-20',
    serverID: 'srv-us-central-2-prod-808',
    pdfFile: 'ROI Optimization Strategies.pdf',
    completed: true
  },
  {
    id: 'pm3',
    type: 'module',
    title: 'Accelerator Pro: Market Intelligence Systems',
    description: 'Automated reporting system configured',
    date: '2025-08-18',
    serverID: 'srv-us-east-2-prod-809',
    pdfFile: 'Market Intelligence Setup Guide.pdf',
    completed: true
  },
  {
    id: 'pm4',
    type: 'module',
    title: 'Accelerator Pro: Portfolio Management',
    description: 'Multi-property portfolio analysis completed',
    date: '2025-08-15',
    serverID: 'srv-us-west-1-prod-807',
    pdfFile: 'Portfolio Management Strategies.pdf',
    completed: true
  },
  {
    id: 'pm5',
    type: 'achievement',
    title: 'Accelerator Pro: Data Integration Mastery',
    description: 'API integration certification earned',
    date: '2025-08-12',
    serverID: 'srv-us-central-2-prod-808',
    pdfFile: 'Data Integration Certification.pdf',
    completed: true
  },
  {
    id: 'pm7',
    type: 'module',
    title: 'Accelerator Pro: Machine Learning Applications',
    description: 'Predictive analytics model training completed',
    date: '2025-08-08',
    serverID: 'srv-us-west-1-prod-807',
    pdfFile: 'ML Applications in Real Estate.pdf',
    completed: true
  },
  {
    id: 'pm10',
    type: 'module',
    title: 'Accelerator Pro: Competitive Intelligence',
    description: 'Market competitor analysis framework mastered',
    date: '2025-07-28',
    serverID: 'srv-us-west-1-prod-807',
    pdfFile: 'Competitive Intelligence Guide.pdf',
    completed: true
  },
  {
    id: 'pm11',
    type: 'module',
    title: 'Accelerator Pro: Investment Optimization',
    description: 'Portfolio optimization algorithms configured',
    date: '2025-07-25',
    serverID: 'srv-us-central-2-prod-808',
    pdfFile: 'Investment Optimization Manual.pdf',
    completed: true
  },
  {
    id: 'pm12',
    type: 'module',
    title: 'Accelerator Pro: Data Visualization Mastery',
    description: 'Advanced dashboard creation completed',
    date: '2025-07-22',
    serverID: 'srv-us-east-2-prod-809',
    pdfFile: 'Data Visualization Pro Guide.pdf',
    completed: true
  },
  {
    id: 'pm13',
    type: 'module',
    title: 'Accelerator Pro: Automation Systems',
    description: 'Workflow automation setup completed',
    date: '2025-07-18',
    serverID: 'srv-us-west-1-prod-807',
    pdfFile: 'Automation Systems Manual.pdf',
    completed: true
  },
  {
    id: 'pm14',
    type: 'achievement',
    title: 'Accelerator Pro Program',
    description: 'Successfully enrolled and payment confirmed ($1,000.00 USD)',
    date: '2025-07-12',
    serverID: 'srv-us-central-2-prod-808',
    pdfFile: 'Accelerator Pro Welcome Package.pdf',
    completed: true
  },
  
  // Lindsay Sherman - Original entries
  {
    id: '1',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Final assessment completed',
    date: '2024-09-28',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Automation Templates & Scaling Checklist.pdf',
    completed: true
  },
  {
    id: '2',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: '98% completion score',
    date: '2024-09-27',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Housekeeper Hiring Guide.pdf',
    completed: true
  },
  {
    id: '3',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Practical exercise submitted',
    date: '2024-09-26',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'VA Hiring & Training Manual.pdf',
    completed: true
  },
  {
    id: '4',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Case study analysis',
    date: '2024-09-25',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Remote Hosting Strategies.pdf',
    completed: true
  },
  {
    id: '5',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Strategy workshop attended',
    date: '2024-09-24',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Mid-Term Rental Strategy Guide.pdf',
    completed: true
  },
  {
    id: '6',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Optimization checklist completed',
    date: '2024-09-23',
    serverID: 'srv-eu-west-1-prod-801',
    pdfFile: 'Property Optimization Checklist.pdf',
    completed: true
  },
  {
    id: '7',
    type: 'module',
    title: 'Module 4: Manage Properties',
    description: 'Photography portfolio submitted',
    date: '2024-09-22',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'Design & Photography Guide.pdf',
    completed: true
  },
  {
    id: '8',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Business expansion plan created',
    date: '2024-09-20',
    serverID: 'srv-us-west-2-prod-803',
    pdfFile: 'Growth Planning Template.pdf',
    completed: true
  },
  {
    id: '9',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Negotiation strategies mastered',
    date: '2024-09-19',
    serverID: 'srv-us-central-1-prod-802',
    pdfFile: 'Rent Concessions Negotiation Guide.pdf',
    completed: true
  },
  {
    id: '10',
    type: 'module',
    title: 'Module 3: Acquire Properties',
    description: 'Application process optimized',
    date: '2024-09-18',
    serverID: 'srv-us-east-1-prod-801',
    pdfFile: 'Rental Application Checklist.pdf',
    completed: true
  }
];

const mockStudents = [
  { id: '1', name: 'Lindsay Sherman', email: 'dutchess0085@gmail.com', progress: 100 },
  { id: '2', name: 'Tiffany Worthy', email: 'tiffany1990worthy@yahoo.com', progress: 100 },
  { id: '3', name: 'Pavlos Michaels', email: 'pavlos.michaels4@gmail.com', progress: 100 },
  { id: '4', name: 'Alex Johnson', email: 'alex.johnson@email.com', progress: 100 },
  { id: '5', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', progress: 100 },
  { id: '6', name: 'Mike Davis', email: 'mike.davis@email.com', progress: 100 },
  { id: '7', name: 'Sanyo Mathew', email: 'sanyo.6677@gmail.com', progress: 100 },
  { id: '8', name: 'Vinod Kumar', email: 'vinodkhatri@hotmail.com', progress: 100 },
];

export const StudentPortalActivityLog = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('1');
  const [activeFilter, setActiveFilter] = useState('All Activity');
  
  const currentStudent = mockStudents.find(s => s.id === selectedStudent) || mockStudents[0];
  
  const filterTabs = ['All Activity', 'Module', 'Achievement'];
  
  const filteredActivities = mockActivityData.filter(activity => {
    // Filter by student
    if (selectedStudent === '2' && !activity.id.startsWith('tw')) return false;
    if (selectedStudent === '3' && !activity.id.startsWith('pm')) return false;
    if (selectedStudent === '7' && !activity.id.startsWith('sy')) return false;
    if (selectedStudent === '8' && !activity.id.startsWith('vk')) return false;
    if (!['2', '3', '7', '8'].includes(selectedStudent) && (activity.id.startsWith('tw') || activity.id.startsWith('pm') || activity.id.startsWith('sy') || activity.id.startsWith('vk'))) return false;
    
    // Filter by activity type
    if (activeFilter === 'All Activity') return true;
    return activity.type.toLowerCase() === activeFilter.toLowerCase();
  }).sort((a, b) => {
    // Sort by date: oldest first (ascending order)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
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
          <h1 className="text-2xl font-bold text-white">Server Activity Log</h1>
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
                <p className="text-gray-300 text-sm mb-1">Content Download Progress</p>
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
                <div className="text-gray-400">Started: <span className="text-white">{selectedStudent === '2' ? '2025-05-21' : selectedStudent === '3' ? '2025-07-12' : selectedStudent === '7' ? '2025-07-04' : '2024-08-01'}</span></div>
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
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
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
                          "border-blue-500/30 text-blue-300 bg-blue-500/10"
                        }>
                          {activity.type}
                        </Badge>
                        <span className="text-gray-400">{activity.date}</span>
                        <span className="text-gray-500">Server ID:</span>
                        <span className="text-gray-400 font-mono text-xs">{activity.serverID}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400">{activity.pdfFile}</span>
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