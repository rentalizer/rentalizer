import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare,
  Calendar,
  Video,
  Calculator,
  Bot,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Activity,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Download,
  Eye,
  ThumbsUp,
  Star,
  ChevronRight
} from 'lucide-react';
import { useMemberCount } from '@/hooks/useMemberCount';

interface TrainingHubDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const TrainingHubDemo = ({ currentStep, isRunning }: TrainingHubDemoProps) => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [demoStep, setDemoStep] = useState(0);
  const { memberCount, loading } = useMemberCount();

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'videos', label: 'Training', icon: Video },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'askrichie', label: 'AI Richie', icon: Bot },
  ];

  const discussions = [
    {
      id: 1,
      title: "Best practices for landlord negotiations in 2024",
      author: "Sarah Mitchell",
      avatar: "/lovable-uploads/avatar-1.jpg",
      category: "Negotiations",
      replies: 23,
      likes: 45,
      time: "2 hours ago",
      isHot: true
    },
    {
      id: 2,
      title: "Market analysis: Top 10 cities for rental arbitrage",
      author: "Mike Johnson",
      avatar: "/lovable-uploads/avatar-2.jpg",
      category: "Market Research",
      replies: 18,
      likes: 67,
      time: "4 hours ago",
      isPinned: true
    },
    {
      id: 3,
      title: "Legal compliance checklist - Updated for Q4",
      author: "Legal Team",
      avatar: "/lovable-uploads/avatar-3.jpg",
      category: "Legal",
      replies: 12,
      likes: 34,
      time: "1 day ago",
      isOfficial: true
    }
  ];

  const discussionCategoryStyles: Record<string, string> = {
    Negotiations: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    "Market Research": "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    Legal: "border-sky-500/40 bg-sky-500/10 text-sky-300"
  };

  const videos = [
    {
      id: 1,
      title: "Master Class: Advanced Negotiation Strategies",
      instructor: "Richie Norton",
      duration: "45 min",
      views: "1.2k",
      rating: 4.9,
      thumbnail: "/lovable-uploads/video-thumb-1.jpg",
      category: "Negotiations",
      isNew: true
    },
    {
      id: 2,
      title: "Market Research Deep Dive: Finding Gold Mines",
      instructor: "Sarah Chen",
      duration: "32 min",
      views: "890",
      rating: 4.8,
      thumbnail: "/lovable-uploads/video-thumb-2.jpg",
      category: "Research"
    },
    {
      id: 3,
      title: "Legal Framework: Staying Compliant in 2024",
      instructor: "Attorney James Hill",
      duration: "28 min",
      views: "756",
      rating: 4.7,
      thumbnail: "/lovable-uploads/video-thumb-3.jpg",
      category: "Legal"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Weekly Strategy Session",
      time: "Today, 3:00 PM EST",
      attendees: 45,
      type: "live"
    },
    {
      id: 2,
      title: "Market Analysis Workshop",
      time: "Tomorrow, 2:00 PM EST",
      attendees: 32,
      type: "workshop"
    },
    {
      id: 3,
      title: "Q&A with Richie Norton",
      time: "Friday, 4:00 PM EST",
      attendees: 78,
      type: "qa"
    }
  ];

  const stats = [
    { label: "Active Members", value: loading ? "..." : memberCount.toLocaleString(), change: "+12%" },
    { label: "Properties Analyzed", value: "15,678", change: "+8%" },
    { label: "Success Stories", value: "892", change: "+15%" },
    { label: "Training Hours", value: "4,521", change: "+22%" }
  ];

  const stepHighlights = {
    0: "hero-section",
    1: "navigation-tabs", 
    2: "discussions-feed",
    3: "video-library",
    4: "community-sidebar",
    5: "calculator-preview"
  };

  useEffect(() => {
    if (isRunning && currentStep !== demoStep) {
      const timer = setTimeout(() => {
        setDemoStep(currentStep);
        
        // Auto-navigate tabs based on demo step
        switch(currentStep) {
          case 2:
            setActiveTab('discussions');
            break;
          case 3:
            setActiveTab('videos');
            break;
          case 4:
            setActiveTab('calculator');
            break;
          case 5:
            setActiveTab('askrichie');
            break;
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, isRunning, demoStep]);

  return (
    <Card className="w-full max-w-7xl mx-auto overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/20 shadow-2xl">
      {/* Hero Section */}
      <CardHeader 
        className={`text-center px-4 py-8 border-b border-cyan-500/20 transition-all duration-500 sm:py-12 ${
          stepHighlights[demoStep] === 'hero-section' ? 'ring-2 ring-cyan-400 bg-cyan-500/5' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="hidden h-12 w-12 text-cyan-400 sm:block" />
          <CardTitle className="text-3xl font-bold sm:text-5xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Training Dashboard
          </CardTitle>
        </div>
        <p className="text-base text-gray-300 sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Your complete rental arbitrage education hub with live training, community discussions, 
          AI mentorship, and powerful tools to accelerate your success.
        </p>
        
        <div className="mt-8 grid grid-cols-2 gap-4 justify-items-center sm:flex sm:justify-center sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-gray-300 sm:min-w-0">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-green-400">{stat.change}</div>
            </div>
          ))}
        </div>
      </CardHeader>

      {/* Navigation Tabs */}
      <div 
        className={`transition-all duration-500 ${
          stepHighlights[demoStep] === 'navigation-tabs' ? 'ring-2 ring-cyan-400 bg-cyan-500/5' : ''
        }`}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="!flex !h-auto w-full flex-wrap justify-center gap-2 bg-slate-800/50 border-b border-cyan-500/20 rounded-none px-2 py-3 max-[360px]:flex-col sm:flex-nowrap sm:justify-evenly sm:gap-0 sm:px-2 sm:py-2 sm:h-16">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm sm:w-auto sm:flex-1 sm:rounded-none sm:px-2 sm:py-0 sm:h-12 sm:text-base"
              >
                <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-col lg:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6">
              {/* Discussions Tab */}
              <TabsContent value="discussions" className="mt-0">
                <div 
                  className={`transition-all duration-500 ${
                    stepHighlights[demoStep] === 'discussions-feed' ? 'ring-2 ring-cyan-400 bg-cyan-500/5 p-4 rounded-lg' : ''
                  }`}
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-2xl font-bold text-white">Community Discussions</h3>
                    <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
                      <Button variant="outline" size="sm" className="h-10 flex-1 border-cyan-500/30 text-cyan-400 sm:h-auto sm:flex-none">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm" className="h-10 flex-1 bg-cyan-600 hover:bg-cyan-500 sm:h-auto sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        New Discussion
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <Card key={discussion.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/30 transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {discussion.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {discussion.isPinned && (
                                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                                    Pinned
                                  </Badge>
                                )}
                                {discussion.isHot && (
                                  <Badge variant="secondary" className="bg-red-500/20 text-red-300 text-xs">
                                    🔥 Hot
                                  </Badge>
                                )}
                                {discussion.isOfficial && (
                                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                                    Official
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${discussionCategoryStyles[discussion.category] ?? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"}`}
                                >
                                  {discussion.category}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-white mb-2 hover:text-cyan-300 cursor-pointer">
                                {discussion.title}
                              </h4>
                              <div className="flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:gap-4">
                                  <span>by {discussion.author}</span>
                                  <span>{discussion.time}</span>
                                </div>
                                <div className="flex flex-wrap items-center justify-start gap-4 sm:flex-nowrap sm:justify-end">
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{discussion.replies}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{discussion.likes}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="mt-0">
                <div 
                  className={`transition-all duration-500 ${
                    stepHighlights[demoStep] === 'video-library' ? 'ring-2 ring-cyan-400 bg-cyan-500/5 p-4 rounded-lg' : ''
                  }`}
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-2xl font-bold text-white">Training Library</h3>
                    <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
                      <Button variant="outline" size="sm" className="h-10 flex-1 border-cyan-500/30 text-cyan-400 sm:h-auto sm:flex-none">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <Card key={video.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/30 transition-all duration-200 group">
                        <div className="relative">
                          <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-lg flex items-center justify-center">
                            <Play className="h-12 w-12 text-cyan-400 group-hover:scale-110 transition-transform" />
                          </div>
                          {video.isNew && (
                            <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                              New
                            </Badge>
                          )}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {video.category}
                          </Badge>
                          <h4 className="font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-sm text-gray-400 mb-3">by {video.instructor}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{video.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>{video.rating}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Calculator Tab */}
              <TabsContent value="calculator" className="mt-0">
                <div 
                  className={`transition-all duration-500 ${
                    stepHighlights[demoStep] === 'calculator-preview' ? 'ring-2 ring-cyan-400 bg-cyan-500/5 p-4 rounded-lg' : ''
                  }`}
                >
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Rental Calculator</h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                      Analyze potential deals with our comprehensive calculator. Input property details, 
                      calculate ROI, and make data-driven investment decisions.
                    </p>
                    <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500">
                      Launch Calculator
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* AI Richie Tab */}
              <TabsContent value="askrichie" className="mt-0">
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">AI Richie Assistant</h3>
                  <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Get instant answers from your AI mentor trained on thousands of hours of 
                    rental arbitrage content and real-world experience.
                  </p>
                  <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500">
                    Start Chatting
                  </Button>
                </div>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div 
              className={`hidden transition-all duration-500 lg:flex lg:w-80 lg:flex-col lg:border-l lg:border-slate-700 lg:p-6 lg:space-y-6 ${
                stepHighlights[demoStep] === 'community-sidebar' ? 'lg:ring-2 lg:ring-cyan-400 lg:bg-cyan-500/5' : ''
              }`}
            >
              {/* Community Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Members</span>
                    <Badge className="bg-cyan-500/20 text-cyan-300">
                      {loading ? '...' : memberCount}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Online Now</span>
                    <Badge className="bg-green-500/20 text-green-300">42</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Discussions</span>
                    <Badge className="bg-blue-500/20 text-blue-300">28</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">New This Week</span>
                    <Badge className="bg-purple-500/20 text-purple-300">15</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium text-white text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{event.attendees} attending</span>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:text-white">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-gray-300 hover:text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};
