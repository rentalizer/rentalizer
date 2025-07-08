import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Video,
  Calendar,
  Calculator,
  Bot,
  Settings,
  Pin,
  Heart,
  Reply,
  Image,
  VideoIcon,
  Paperclip,
  AtSign,
  Plus,
  Clock,
  MapPin,
  Play,
  Download,
  Star,
  ChevronRight
} from 'lucide-react';

interface TrainingHubDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const TrainingHubDemo = ({ currentStep, isRunning }: TrainingHubDemoProps) => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [demoStep, setDemoStep] = useState(0);

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'ask-richie', label: 'Ask Richie', icon: Bot },
    { id: 'members', label: 'Members', icon: Users },
  ];

  // Automatic demo progression
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDemoStep((prev) => {
        const nextStep = (prev + 1) % tabs.length;
        setActiveTab(tabs[nextStep].id);
        return nextStep;
      });
    }, 4000); // Change tabs every 4 seconds

    return () => clearInterval(interval);
  }, [isRunning, tabs.length]);

  // Reset when component mounts
  useEffect(() => {
    setActiveTab('discussions');
    setDemoStep(0);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            Training & Community Hub
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <Settings className="h-4 w-4" />
              Manage Richie's Knowledge Base
            </div>
            {isRunning && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Auto Demo Running</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-4 mt-4 border-b border-slate-700 pb-2 overflow-x-auto">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isNext = index === (demoStep + 1) % tabs.length && isRunning;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 scale-105'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-slate-700/50'
                } ${isNext ? 'ring-2 ring-yellow-400/50 animate-pulse' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <ChevronRight className="h-3 w-3 text-cyan-400 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                {/* New Post Area */}
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                        RM
                      </div>
                      <Input placeholder="Title" className="bg-slate-800 border-slate-600 text-white" />
                    </div>
                    <Textarea 
                      placeholder="Write something..." 
                      className="bg-slate-800 border-slate-600 text-white mb-4 min-h-24"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-cyan-300 transition-colors">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-cyan-300 transition-colors">
                          <Image className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-cyan-300 transition-colors">
                          <VideoIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-cyan-300 transition-colors">
                          <AtSign className="h-4 w-4" />
                        </button>
                      </div>
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Notification */}
                <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">Property Acquisitions</span>
                      <span className="text-gray-300">Is Happening In 2 Days</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Discussion Posts */}
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        RM
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-white font-medium">Richie Matthews (Admin)</span>
                          </div>
                          <span className="text-gray-400 text-sm">• 1d ago</span>
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                            Pinned
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Welcome aboard!</h3>
                        <p className="text-gray-300 mb-4">
                          We're excited to have you join our community of rental entrepreneurs. Whether you're brand new or already 
                          hosting, you're in the right place to level up your rental arbitrage game...
                          <button className="text-cyan-400 hover:text-cyan-300 ml-1">Read more</button>
                        </p>
                        <div className="flex items-center gap-6 text-gray-400">
                          <button className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>0</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
                            <Reply className="h-4 w-4" />
                            <span>0</span>
                          </button>
                          <span className="text-sm">Last comment 1d ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Course Library
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-white">Foundation Course</span>
                        <Badge className="bg-green-500/20 text-green-300">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-white">Market Research</span>
                        <Badge className="bg-blue-500/20 text-blue-300">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-white">Property Analysis</span>
                        <Badge className="bg-gray-500/20 text-gray-300">Locked</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-purple-300 flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Video Training
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <Play className="h-4 w-4 text-cyan-400" />
                        <span className="text-white flex-1">Getting Started Guide</span>
                        <span className="text-gray-400 text-sm">12:34</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <Play className="h-4 w-4 text-cyan-400" />
                        <span className="text-white flex-1">Market Selection Tips</span>
                        <span className="text-gray-400 text-sm">18:45</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                        <Play className="h-4 w-4 text-cyan-400" />
                        <span className="text-white flex-1">Deal Analysis Deep Dive</span>
                        <span className="text-gray-400 text-sm">25:12</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-orange-300 flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Resources & Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <Download className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-white text-sm">Lease Template</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <Download className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-white text-sm">Email Scripts</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <Download className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-white text-sm">Market Analysis</div>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                        <Download className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                        <div className="text-white text-sm">Legal Guide</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'calculator' && (
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Rental Arbitrage Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-white text-sm mb-2 block">Monthly Rent</label>
                        <Input placeholder="$2,500" className="bg-slate-800 border-slate-600 text-white text-xs" />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Estimated Income</label>
                        <Input placeholder="$4,200" className="bg-slate-800 border-slate-600 text-white text-xs" />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Monthly Expenses</label>
                        <Input placeholder="$800" className="bg-slate-800 border-slate-600 text-white text-xs" />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Furnishing Costs</label>
                        <Input placeholder="$5,678" className="bg-slate-800 border-slate-600 text-white text-xs" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-white text-sm mb-1">Projected Monthly Profit</div>
                        <div className="text-2xl font-bold text-green-400">$900</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-white text-sm mb-1">ROI</div>
                        <div className="text-2xl font-bold text-cyan-400">36%</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-white text-sm mb-1">Break-even Time</div>
                        <div className="text-2xl font-bold text-purple-400">2.8 months</div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-white text-sm mb-1">Cash on Cash Return</div>
                        <div className="text-2xl font-bold text-blue-400">42%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'calendar' && (
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      December 2024
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-400">
                        &lt;
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-400">
                        &gt;
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="mb-6">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-gray-400 text-sm font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {/* Week 1 */}
                      <div className="p-2 text-center text-gray-600 text-sm">1</div>
                      <div className="p-2 text-center text-gray-600 text-sm">2</div>
                      <div className="p-2 text-center text-gray-600 text-sm">3</div>
                      <div className="p-2 text-center text-gray-600 text-sm">4</div>
                      <div className="p-2 text-center text-gray-600 text-sm">5</div>
                      <div className="p-2 text-center text-gray-600 text-sm">6</div>
                      <div className="p-2 text-center text-gray-600 text-sm">7</div>
                      
                      {/* Week 2 */}
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">8</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">9</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">10</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">11</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">12</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded relative">
                        13
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
                      </div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">14</div>
                      
                      {/* Week 3 */}
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded relative">
                        15
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
                      </div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">16</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">17</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded relative">
                        18
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"></div>
                      </div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">19</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded relative">
                        20
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">21</div>
                      
                      {/* Week 4 */}
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">22</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded relative">
                        23
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
                      </div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">24</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">25</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">26</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">27</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">28</div>
                      
                      {/* Week 5 */}
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">29</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">30</div>
                      <div className="p-2 text-center text-white text-sm bg-slate-800/50 rounded">31</div>
                      <div className="p-2 text-center text-gray-600 text-sm">1</div>
                      <div className="p-2 text-center text-gray-600 text-sm">2</div>
                      <div className="p-2 text-center text-gray-600 text-sm">3</div>
                      <div className="p-2 text-center text-gray-600 text-sm">4</div>
                    </div>
                  </div>
                  
                  {/* Upcoming Events List */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium mb-3">Upcoming Events</h4>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border-l-4 border-cyan-400">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-cyan-400 font-bold text-lg">13</div>
                        <div className="text-gray-400 text-xs">Dec</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Weekly Coaching Call</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          7:00 PM EST
                        </div>
                      </div>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">Join</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border-l-4 border-purple-400">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-purple-400 font-bold text-lg">15</div>
                        <div className="text-gray-400 text-xs">Dec</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Property Acquisitions Workshop</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          6:00 PM EST
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-purple-400 text-purple-300">Register</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border-l-4 border-orange-400">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-orange-400 font-bold text-lg">18</div>
                        <div className="text-gray-400 text-xs">Dec</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Market Analysis Deep Dive</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          8:00 PM EST
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-400 text-orange-300">RSVP</Button>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border-l-4 border-green-400">
                      <div className="text-center min-w-[3rem]">
                        <div className="text-green-400 font-bold text-lg">20</div>
                        <div className="text-gray-400 text-xs">Dec</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Success Stories Panel</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          7:30 PM EST
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-green-400 text-green-300">Join</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'ask-richie' && (
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Ask Richie - AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-cyan-500/20 rounded-lg p-3 mb-2">
                            <p className="text-white text-sm">
                              Hi! I'm Richie, your AI assistant. I can help you with rental arbitrage questions, market analysis, deal evaluation, and more. What would you like to know?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          U
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 flex-1">
                          <p className="text-white text-sm">What are the best markets for rental arbitrage in 2025?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-cyan-500/20 rounded-lg p-3 flex-1">
                          <p className="text-white text-sm">
                            Based on current market data, the top rental arbitrage markets for 2025 include Austin TX, Nashville TN, Denver CO, and Miami FL. These markets show strong demand, favorable regulations, and excellent profit margins. Would you like specific data on any of these markets?
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Input 
                        placeholder="Ask me anything about rental arbitrage..." 
                        className="flex-1 bg-slate-800 border-slate-600 text-white"
                      />
                      <Button className="bg-cyan-600 hover:bg-cyan-700">Send</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'members' && (
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            RM
                          </div>
                          <div>
                            <div className="text-white font-medium">Richie Matthews</div>
                            <div className="text-xs text-gray-400">Admin • Online</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Founder & Mentor - $2M+ in rental revenue
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                            SC
                          </div>
                          <div>
                            <div className="text-white font-medium">Sarah Chen</div>
                            <div className="text-xs text-gray-400">Member • 2h ago</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Top performer - 12 active properties
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            MR
                          </div>
                          <div>
                            <div className="text-white font-medium">Mike Rodriguez</div>
                            <div className="text-xs text-gray-400">Member • 1d ago</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Rising star - 6 properties, $15k/month
                        </div>
                      </div>
                      
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                            AT
                          </div>
                          <div>
                            <div className="text-white font-medium">Alex Thompson</div>
                            <div className="text-xs text-gray-400">Member • 3d ago</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Market leader - Austin, TX specialist
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-600 pt-4">
                      <div className="text-center">
                        <Button variant="outline" className="border-cyan-500 text-cyan-300">
                          View All 181 Members
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Members</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300">181</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Online Now</span>
                  <Badge className="bg-green-500/20 text-green-300">2</Badge>
                </div>
                <div className="border-t border-slate-600 pt-3">
                  <div className="text-sm text-gray-400 mb-2">Online Members:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm">richie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm">Richie Matthews</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-600 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Admins</span>
                    <Badge className="bg-red-500/20 text-red-300">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry News */}
            <Card className="bg-slate-700/30 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-300">Industry News Feed</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-white font-medium text-sm mb-1">
                    Short-Term Rental Demand Surges 25% in Q4 2024
                  </div>
                  <div className="text-gray-400 text-xs mb-2">
                    New data shows unprecedented growth in short-term rental bookings across major markets, driven by...
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>AirDNA</span>
                    <span>•</span>
                    <span>about 23 hours ago</span>
                    <span>•</span>
                    <span>0</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-white font-medium text-sm mb-1">
                    New AI-Powered Guest Communication Features Released
                  </div>
                  <div className="text-gray-400 text-xs mb-2">
                    Revolutionary AI tools now help hosts respond to guest inquiries in real-time...
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Hospitable</span>
                    <span>•</span>
                    <span>1 day ago</span>
                    <span>•</span>
                    <span>0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};