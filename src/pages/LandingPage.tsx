import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home, Brain, Target, MessageSquare, Calendar, Star, X, Video, FileText, Bot } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { MarketIntelligenceDemo } from '@/components/MarketIntelligenceDemo';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';
import { GroupDiscussions } from '@/components/community/GroupDiscussions';
import { VideoLibrary } from '@/components/community/VideoLibrary';
import { CommunityCalendar } from '@/components/community/CommunityCalendar';
import { MessageThreads } from '@/components/community/MessageThreads';
import { DocumentsLibrary } from '@/components/community/DocumentsLibrary';

const LandingPage = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Auto-progression through demo steps
  useEffect(() => {
    if (activeDemo) {
      const stepRanges = {
        'market': { start: 1, end: 3, duration: 3000 },
        'acquisition': { start: 4, end: 11, duration: 2500 },
        'pms': { start: 12, end: 16, duration: 2000 },
        'community': { start: 17, end: 17, duration: 5000 }
      };

      const config = stepRanges[activeDemo];
      if (config) {
        const timer = setInterval(() => {
          setCurrentStep(prevStep => {
            if (prevStep >= config.end) {
              return config.start; // Loop back to start
            }
            return prevStep + 1;
          });
        }, config.duration);

        return () => clearInterval(timer);
      }
    }
  }, [activeDemo]);

  // Static text content from the actual landing page
  const texts = {
    mainTitle: 'RENTALIZER',
    byLine: '',
    tagline: 'All-In-One Platform To Launch, Automate, & Scale Rental Income—Powered By AI',
    description: 'RENTALIZER Combines AI Powered Market Analysis, Deal Sourcing, Property Management Software, And Automation Tools With A Built-In CRM And Thriving Community—Everything You Need To Launch, Automate, And Scale Rental Arbitrage Income',
    buttonText: 'Book Demo',
    feature1Title: 'Market Intelligence',
    feature1Description: 'The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets',
    feature2Title: 'Acquisition CRM & Calculator',
    feature2Description: 'Property Outreach, Close Deals, Profit Calculator, Manage Relationships',
    feature3Title: 'PMS',
    feature3Description: 'Streamline Property Management And Automate Operations',
    feature4Title: 'Community',
    feature4Description: 'Join Our Network Of Rental Arbitrage Entrepreneurs'
  };

  const handleFeatureClick = (feature: string) => {
    setActiveDemo(feature);
    // Reset to appropriate starting step for each demo
    if (feature === 'market') {
      setCurrentStep(1);
    } else if (feature === 'acquisition') {
      setCurrentStep(4);
    } else if (feature === 'pms') {
      setCurrentStep(12);
    } else if (feature === 'community') {
      setCurrentStep(17);
    }
  };

  const handleCloseDemo = () => {
    setActiveDemo(null);
    setCurrentStep(1);
  };

  const handleBookDemo = () => {
    console.log('Book Demo button clicked - opening Calendly popup');
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    }
  };

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 w-full border-b border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-cyan-400 neon-text" />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <LoginDialog 
                trigger={
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 px-6 py-3"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                }
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
              <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {texts.mainTitle}
              </div>
            </div>
            
            <div className="text-lg text-white font-medium mb-8">
              {texts.byLine}
            </div>
            
            {/* Updated Tagline */}
            <div className="mb-12 px-4">
              <div className="text-lg md:text-xl lg:text-2xl text-white max-w-5xl mx-auto leading-relaxed font-semibold">
                All-In-One Platform To Launch, Automate, & Scale Rental Income—<br />
                Powered By AI
              </div>
            </div>

          </div>

          {/* Animated Features Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1: Training Hub */}
              <div className="group relative" onClick={() => handleFeatureClick('community')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Training Hub
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Live Training, Video & Document Library, Tools, Resources, Community
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full border-2 border-slate-800 animate-pulse`} style={{animationDelay: `${i * 150}ms`}}></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 2: Market Intelligence */}
              <div className="group relative" onClick={() => handleFeatureClick('market')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      Market Intelligence
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                    </div>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3: Acquisition Agent */}
              <div className="group relative" onClick={() => handleFeatureClick('acquisition')}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Calculator className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      Acquisition Agent
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Outreach, Close Deals, Calculate Profit, Robust CRM
                    </div>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-8 h-1 bg-purple-400 rounded animate-pulse"></div>
                      <div className="w-6 h-1 bg-cyan-400 rounded animate-pulse delay-200"></div>
                      <div className="w-10 h-1 bg-purple-300 rounded animate-pulse delay-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 4: Property Management */}
              <div className="group relative" onClick={() => handleFeatureClick('pms')}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center transition-all duration-300">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      Property Management
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      Automate Property Management, Operations & Cash Flow
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-2 bg-cyan-400/50 rounded animate-pulse`} style={{animationDelay: `${i * 100}ms`}}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center mb-16">
            <div className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {texts.description}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Some Recent Users Who've Unlocked Rental Income With RENTALIZER
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Christopher Lee", text: "The market intelligence feature is a game-changer. It showed me exactly which neighborhoods to target and which to avoid. I closed 2 deals in my first month using their data." },
                { name: "Rachel Martinez", text: "Rentalizer's automation tools handle all my guest communications seamlessly. I can manage 8 properties without feeling overwhelmed. The time savings are incredible." },
                { name: "Kevin Park", text: "The profit calculator helped me negotiate better deals with landlords. I can show them exact projections and close deals faster. My conversion rate has tripled." },
                { name: "Nicole Turner", text: "I love how everything is integrated in one platform. From finding properties to managing guests, Rentalizer handles it all. No more juggling multiple tools." },
                { name: "Brandon Walsh", text: "The AI email templates are amazing. They helped me reach out to hundreds of landlords with personalized messages. I'm now managing 12 properties across 3 cities." },
                { name: "Samantha Brooks", text: "Rentalizer's training program is comprehensive and easy to follow. Even as a complete beginner, I was able to close my first deal within 6 weeks." },
                { name: "Anthony Rivera", text: "The community forum is incredibly valuable. I've connected with other investors and learned strategies I never would have discovered on my own." },
                { name: "Lisa Thompson", text: "The platform's analytics help me track performance across all my properties. I can see which markets are most profitable and adjust my strategy accordingly." },
                { name: "Ryan Murphy", text: "Rentalizer's support team is outstanding. They respond quickly and always provide helpful solutions. It's like having a personal consultant available 24/7." },
                { name: "Jennifer Adams", text: "The deal sourcing feature is incredible. It finds properties I would never have discovered on my own. I've expanded to 3 new markets using their recommendations." },
                { name: "Daniel Kim", text: "The automated messaging system has transformed my guest experience. Happy guests leave better reviews, which leads to more bookings. My occupancy rate is now 85%." },
                { name: "Michelle Garcia", text: "Rentalizer helped me transition from traditional real estate to rental arbitrage. The learning curve was smooth, and I'm now earning more than I ever did with buy-and-hold properties." },
                { name: "Bishoi Mikhail", text: "Rentalizer has everything that you need in one program to get you set up and to be able to have a successful Airbnb business. Rentalizer helped me acquire 3 properties within 1 month of starting the program, each with only $200 deposits and 8 weeks free rent." },
                { name: "Bobby Han", text: "If you are thinking about getting into the short term rental business, Rentalizer's blueprint and all the templates available is definitely something that gives more confidence moving forward. If you have any question whether to join Rentalizer's program, I think you'll find it very beneficial." },
                { name: "Shante Davis", text: "Rentalizer's program is amazing. Rentalizer helped us close the largest apartment company in our area. We now have 6 properties. I recommend the mentorship. You won't be disappointed." },
                { name: "Maria Sallie Forte-Charette", text: "Thank you so much Rentalizer for sharing your knowledge and always promptly answering any questions, which helped me to close three new properties! I learned so much from our training and coaching." },
                { name: "Elena Ashley", text: "Rentalizer's program has meant the difference in my business from just being a hobby to moving it into an actual business." },
                { name: "Liz Garcia", text: "I just closed my first deal, thanks to Rentalizer's program!" },
                { name: "Marcus Thompson", text: "The AI market analysis tool is incredible. It helped me identify profitable markets I never would have considered before. I'm now managing 4 successful properties." },
                { name: "Sarah Chen", text: "Rentalizer's CRM made all the difference in my outreach. I went from getting ignored to closing deals within weeks. The templates and automation saved me hours every day." },
                { name: "David Rodriguez", text: "The community support is unmatched. Whenever I had questions, there was always someone ready to help. I've learned as much from other members as I have from the training materials." },
                { name: "Jessica Williams", text: "I was skeptical at first, but Rentalizer delivered on every promise. The profit calculator alone has saved me from making costly mistakes. Now I have 5 profitable properties." },
                { name: "Michael Johnson", text: "The mentorship and coaching calls were game-changers. Having access to experts who've been there before made the learning curve so much smoother. Highly recommend." },
                { name: "Amanda Foster", text: "Rentalizer turned my side hustle into a full-time income. The systematic approach and tools provided everything I needed to scale confidently. Best investment I've made." }
              ].map((testimonial, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105">
                    <CardContent className="p-6">
                      {/* Testimonial Text */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 text-center italic">
                        "{testimonial.text}"
                      </p>

                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Author */}
                      <div className="text-center">
                        <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <Dialog open={!!activeDemo} onOpenChange={() => handleCloseDemo()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {activeDemo === 'market' && 'Market Intelligence Demo'}
              {activeDemo === 'acquisition' && 'Acquisition CRM Demo'}
              {activeDemo === 'pms' && 'Property Management Demo'}
              {activeDemo === 'community' && 'Community Demo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Demo Content */}
            {activeDemo === 'market' && (
              <MarketIntelligenceDemo 
                currentStep={currentStep} 
                isRunning={true}
                onStepChange={setCurrentStep}
              />
            )}
            
            {activeDemo === 'acquisition' && (
              <AcquisitionsCRMDemo 
                currentStep={currentStep}
                isRunning={true}
              />
            )}
            
            {activeDemo === 'pms' && (
              <PMSDemo 
                currentStep={currentStep}
                isRunning={true}
              />
            )}
            
            {activeDemo === 'community' && (
              <div className="space-y-6">
                {/* Community Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Users className="h-8 w-8 text-cyan-400" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Training & Community Hub Demo
                    </h1>
                  </div>
                  <p className="text-gray-300 mb-4">Preview of what members get access to</p>
                </div>

                {/* Demo Navigation Tabs */}
                <Tabs defaultValue="discussions" className="w-full">
                  <TabsList className="flex w-full bg-slate-800/50 border border-cyan-500/20 justify-evenly h-14 p-2">
                    <TabsTrigger value="discussions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <Users className="h-4 w-4 mr-2" />
                      Discussions
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar
                    </TabsTrigger>
                    <TabsTrigger value="training" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <Video className="h-4 w-4 mr-2" />
                      Training
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="calculator" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculator
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <FileText className="h-4 w-4 mr-2" />
                      Business Docs
                    </TabsTrigger>
                    <TabsTrigger value="askrichie" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
                      <Bot className="h-4 w-4 mr-2" />
                      Ask Richie
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="discussions" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Community Discussions</h3>
                            <p className="text-gray-300 text-sm">Connect with 500+ rental arbitrage entrepreneurs</p>
                          </div>
                          
                          {/* Mock Discussion Posts */}
                          {[
                            { title: "Just closed my 5th property in Miami!", author: "Sarah M.", replies: 23, category: "Success Stories" },
                            { title: "Best negotiation tactics for rent reductions?", author: "Mike R.", replies: 45, category: "Q&A" },
                            { title: "Market Analysis: Austin vs Phoenix 2024", author: "David L.", replies: 67, category: "Market Intelligence" },
                            { title: "Automation setup that saved me 20hrs/week", author: "Lisa K.", replies: 89, category: "Tips & Tricks" }
                          ].map((post, index) => (
                            <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-cyan-300 font-medium text-sm">{post.title}</h4>
                                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">{post.category}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>by {post.author}</span>
                                <span>{post.replies} replies</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="calendar" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">Live Events & Coaching</h3>
                          <p className="text-gray-300 text-sm">Weekly group calls, workshops, and 1-on-1 sessions</p>
                        </div>
                        
                        <div className="space-y-3">
                          {[
                            { title: "Weekly Group Coaching Call", time: "Mon 8PM EST", type: "Recurring" },
                            { title: "Market Analysis Workshop", time: "Wed 7PM EST", type: "Workshop" },
                            { title: "Q&A with Richie", time: "Fri 6PM EST", type: "Live Session" },
                            { title: "Guest Expert: Legal Strategies", time: "Sat 2PM EST", type: "Special Event" }
                          ].map((event, index) => (
                            <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-cyan-300 font-medium text-sm">{event.title}</h4>
                                  <p className="text-gray-400 text-xs">{event.time}</p>
                                </div>
                                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">{event.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="training" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">Training Library</h3>
                          <p className="text-gray-300 text-sm">50+ hours of step-by-step training content</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { title: "Module 1: Market Research Fundamentals", duration: "45 min", progress: 100 },
                            { title: "Module 2: Property Sourcing Strategies", duration: "62 min", progress: 75 },
                            { title: "Module 3: Negotiation Masterclass", duration: "38 min", progress: 50 },
                            { title: "Module 4: Automation & Systems", duration: "71 min", progress: 25 },
                            { title: "Module 5: Scaling Your Portfolio", duration: "55 min", progress: 0 },
                            { title: "Bonus: Legal & Tax Strategies", duration: "29 min", progress: 0 }
                          ].map((module, index) => (
                            <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                              <div className="flex items-center gap-3 mb-2">
                                <Video className="h-4 w-4 text-cyan-400" />
                                <div className="flex-1">
                                  <h4 className="text-cyan-300 font-medium text-sm">{module.title}</h4>
                                  <p className="text-gray-400 text-xs">{module.duration}</p>
                                </div>
                              </div>
                              <div className="w-full bg-slate-600 rounded-full h-1">
                                <div className="bg-cyan-400 h-1 rounded-full" style={{ width: `${module.progress}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">Member Chat</h3>
                          <p className="text-gray-300 text-sm">Real-time conversations with fellow entrepreneurs</p>
                        </div>
                        
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {[
                            { name: "Alex K.", message: "Just got approved for my 3rd property! The scripts from Module 2 work perfectly 🎉", time: "2 min ago" },
                            { name: "Maria S.", message: "Anyone know good property managers in Dallas area?", time: "5 min ago" },
                            { name: "James L.", message: "That automation tool Richie mentioned saved me 15 hours this week", time: "8 min ago" },
                            { name: "Sophie R.", message: "New member here! Excited to start my rental arbitrage journey", time: "12 min ago" },
                            { name: "Tom W.", message: "Market analysis for Phoenix looks incredible right now", time: "15 min ago" }
                          ].map((chat, index) => (
                            <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-cyan-300 font-medium text-sm">{chat.name}</span>
                                <span className="text-xs text-gray-500">{chat.time}</span>
                              </div>
                              <p className="text-gray-300 text-sm">{chat.message}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="calculator" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">Advanced Rental Calculator Demo</h3>
                          <p className="text-gray-300 text-sm">Interactive calculator for rental arbitrage profitability analysis</p>
                        </div>
                        
                        {/* Calculator Interface Demo */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          {/* Property Comps Section */}
                          <Card className="bg-slate-700/50 border-slate-600/30">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-center gap-2 text-white text-sm">
                                <div className="h-4 w-4 bg-cyan-400 rounded"></div>
                                Property Comps
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                              <div>
                                <p className="text-gray-300 mb-1">Address</p>
                                <div className="bg-slate-600/50 rounded px-2 py-1 text-gray-200">123 Miami Beach Ave</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-gray-300 mb-1">Bedrooms</p>
                                  <div className="bg-slate-600/50 rounded px-2 py-1 text-gray-200 text-center">2</div>
                                </div>
                                <div>
                                  <p className="text-gray-300 mb-1">Bathrooms</p>
                                  <div className="bg-slate-600/50 rounded px-2 py-1 text-gray-200 text-center">2</div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded p-2 border border-blue-500/30">
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-300 text-xs">Avg Monthly Revenue</span>
                                  <span className="text-blue-400 font-bold">$3,250</span>
                                </div>
                                <div className="text-xs text-blue-300/70 mt-1">Based on 5 comparables</div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Build Out Section */}
                          <Card className="bg-slate-700/50 border-slate-600/30">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-center gap-2 text-white text-sm">
                                <div className="h-4 w-4 bg-purple-400 rounded"></div>
                                Initial Investment
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-300">First Month's Rent</span>
                                <span className="text-white">$2,200</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Security Deposit</span>
                                <span className="text-white">$2,200</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Furnishings</span>
                                <span className="text-white">$8,500</span>
                              </div>
                              <div className="border-t border-slate-600 pt-2 mt-3">
                                <div className="flex justify-between font-bold">
                                  <span className="text-purple-300">Total Investment</span>
                                  <span className="text-purple-400">$12,900</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Monthly Expenses Section */}
                          <Card className="bg-slate-700/50 border-slate-600/30">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-center gap-2 text-white text-sm">
                                <div className="h-4 w-4 bg-red-400 rounded"></div>
                                Monthly Expenses
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Rent</span>
                                <span className="text-white">$2,200</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Service Fees</span>
                                <span className="text-white">$450</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Utilities</span>
                                <span className="text-white">$280</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Insurance</span>
                                <span className="text-white">$150</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Other</span>
                                <span className="text-white">$220</span>
                              </div>
                              <div className="border-t border-slate-600 pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                  <span className="text-red-300">Total Expenses</span>
                                  <span className="text-red-400">$3,300</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Profit Analysis Section */}
                          <Card className="bg-slate-700/50 border-slate-600/30">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-center gap-2 text-white text-sm">
                                <div className="h-4 w-4 bg-green-400 rounded"></div>
                                Profitability
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Monthly Revenue</span>
                                <span className="text-cyan-400">$3,250</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Monthly Expenses</span>
                                <span className="text-red-400">-$3,300</span>
                              </div>
                              <div className="border-t border-slate-600 pt-2">
                                <div className="flex justify-between font-bold text-sm">
                                  <span className="text-green-300">Net Monthly Profit</span>
                                  <span className="text-green-400">-$50</span>
                                </div>
                              </div>
                              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded p-2 border border-green-500/30 mt-3">
                                <div className="text-center">
                                  <div className="text-green-300 text-xs">ROI</div>
                                  <div className="text-green-400 font-bold text-sm">-0.5%</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Analysis Summary */}
                        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                          <h4 className="text-white font-semibold mb-3 text-center">Deal Analysis Summary</h4>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-gray-300">Break-Even Timeline</div>
                              <div className="text-yellow-400 font-bold">Never (Loss)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-300">Annual Cash Flow</div>
                              <div className="text-red-400 font-bold">-$600</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-300">Recommendation</div>
                              <div className="text-red-400 font-bold">❌ Pass</div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
                            <p className="text-red-300 text-xs text-center">
                              <strong>Analysis:</strong> This property shows negative cash flow. Consider negotiating lower rent or finding properties with higher revenue potential.
                            </p>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-6 text-center">
                          <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                            Access Full Calculator (Members Only)
                          </Button>
                          <p className="text-gray-400 text-xs mt-2">
                            Full version includes market data integration, advanced analytics, and export features
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="docs" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">Business Documents Library</h3>
                          <p className="text-gray-300 text-sm">Ready-to-use templates and legal documents</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { name: "Lease Agreement Template", type: "PDF", category: "Legal" },
                            { name: "Property Outreach Scripts", type: "DOC", category: "Communication" },
                            { name: "Guest Welcome Guide", type: "PDF", category: "Operations" },
                            { name: "Expense Tracking Spreadsheet", type: "XLS", category: "Finance" },
                            { name: "Market Analysis Framework", type: "PDF", category: "Strategy" },
                            { name: "Landlord Negotiation Scripts", type: "DOC", category: "Communication" }
                          ].map((doc, index) => (
                            <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-cyan-400" />
                                <div className="flex-1">
                                  <h4 className="text-cyan-300 font-medium text-sm">{doc.name}</h4>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-xs">{doc.type}</span>
                                    <span className="text-purple-400 text-xs">{doc.category}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="askrichie" className="mt-6">
                    <Card className="bg-slate-800/50 border-cyan-500/20">
                      <CardContent className="p-8 text-center">
                        <Bot className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">Ask Richie AI Assistant</h3>
                        <p className="text-gray-300 mb-6">
                          Get instant answers to your rental investment questions from our AI assistant trained on Richie's expertise.
                        </p>
                        <div className="space-y-4">
                          <div className="text-left bg-slate-700/50 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-2">Sample questions members ask:</p>
                            <ul className="text-cyan-300 space-y-1 text-sm">
                              <li>• "What's the best market for rental arbitrage in 2024?"</li>
                              <li>• "How do I negotiate lower rent with landlords?"</li>
                              <li>• "What occupancy rate should I expect in Miami?"</li>
                              <li>• "How to automate guest communication?"</li>
                            </ul>
                          </div>
                          <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                            Chat with Richie AI (Members Only)
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer showLinks={false} />
    </div>
  );
};

export default LandingPage;