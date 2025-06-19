import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  MessageCircle,
  Home,
  Settings,
  Bell,
  Link,
  Star,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  Crown,
  Zap,
  MapPin,
  Calculator
} from 'lucide-react';

interface PMSDemoProps {
  currentStep: number;
  isRunning: boolean;
}

export const PMSDemo = ({ currentStep, isRunning }: PMSDemoProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Change tabs based on the current step
  useEffect(() => {
    if (isRunning && currentStep >= 12 && currentStep <= 18) {
      const tabSequence = {
        12: 'dashboard',  // Listing Creation
        13: 'calendar',   // Calendar Sync  
        14: 'messages',   // Guest Messaging
        15: 'automation', // Check-in Automation
        16: 'platforms',  // Performance Tracking
        17: 'platforms',  // Performance Analytics
        18: 'pricing'     // Pricing Plans
      };
      
      const newTab = tabSequence[currentStep];
      if (newTab) {
        setActiveTab(newTab);
      }
    }
  }, [currentStep, isRunning]);

  // Mock data for demo
  const properties = [
    { id: 1, name: "Downtown Loft", platform: "Airbnb", status: "occupied", revenue: 3200, rating: 4.9 },
    { id: 2, name: "Beach House", platform: "VRBO", status: "available", revenue: 4100, rating: 4.8 },
    { id: 3, name: "Mountain Cabin", platform: "Booking.com", status: "cleaning", revenue: 2800, rating: 4.7 }
  ];

  const messages = [
    { guest: "John Smith", platform: "Airbnb", message: "Check-in instructions needed", priority: "high", time: "2 min ago" },
    { guest: "Sarah Johnson", platform: "VRBO", message: "Thank you for the great stay!", priority: "low", time: "1 hr ago" },
    { guest: "Mike Chen", platform: "Airbnb", message: "WiFi password issue", priority: "high", time: "5 min ago" }
  ];

  const analytics = {
    totalRevenue: 18200,
    occupancyRate: 85,
    avgRating: 4.8,
    totalBookings: 47
  };

  const getStepTitle = () => {
    const titles = {
      12: "Multi-Platform Listing Creation",
      13: "Unified Calendar Management", 
      14: "Automated Guest Messaging",
      15: "Smart Check-in Automation",
      16: "Performance Analytics Dashboard",
      17: "Revenue & Performance Analytics",
      18: "Subscription Plans & Pricing"
    };
    return titles[currentStep] || "Property Management System";
  };

  const getTabColor = (tab) => {
    if (tab === activeTab) {
      return "data-[state=active]:bg-cyan-600 bg-cyan-600 text-white";
    }
    return "data-[state=active]:bg-cyan-600";
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Home className="h-6 w-6 text-purple-400" />
          {getStepTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-700/50">
            <TabsTrigger value="dashboard" className={getTabColor('dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className={getTabColor('calendar')}>
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="messages" className={getTabColor('messages')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="automation" className={getTabColor('automation')}>
              <Settings className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="platforms" className={getTabColor('platforms')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="pricing" className={getTabColor('pricing')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-cyan-500/20 text-center">
                <DollarSign className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">${analytics.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Monthly Revenue</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20 text-center">
                <Home className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{properties.length}</div>
                <div className="text-sm text-gray-400">Active Properties</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/20 text-center">
                <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.occupancyRate}%</div>
                <div className="text-sm text-gray-400">Occupancy Rate</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-orange-500/20 text-center">
                <Star className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{analytics.avgRating}</div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-3">Properties Overview</h4>
              <div className="space-y-2">
                {properties.map((property) => (
                  <div key={property.id} className="flex justify-between items-center text-sm">
                    <span className="text-white">{property.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300">{property.platform}</Badge>
                      <span className="text-cyan-400">${property.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-3">Unified Calendar View</h4>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-gray-400 font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }, (_, i) => (
                  <div key={i} className="h-16 p-1 border border-gray-600 rounded text-xs">
                    <div className="text-gray-300 mb-1">{i + 1}</div>
                    {i === 2 && <div className="bg-cyan-600/20 text-cyan-300 p-1 rounded">Check-in</div>}
                    {i === 7 && <div className="bg-purple-600/20 text-purple-300 p-1 rounded">Check-out</div>}
                    {i === 10 && <div className="bg-blue-600/20 text-blue-300 p-1 rounded">Cleaning</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">
              ✓ Airbnb, VRBO, and Booking.com calendars synchronized
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center justify-between">
                Guest Messages
                <Badge className="bg-red-600">{messages.filter(m => m.priority === 'high').length} urgent</Badge>
              </h4>
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{message.guest}</span>
                        <Badge className="bg-blue-500/20 text-blue-300">{message.platform}</Badge>
                        <Badge className={`${
                          message.priority === 'high' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {message.priority}
                        </Badge>
                      </div>
                      <span className="text-gray-400 text-sm">{message.time}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">
              ✓ Auto-response active • Average response time: 3 minutes
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-3">Automated Workflows</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Welcome Message</div>
                      <div className="text-gray-400 text-sm">Sent immediately after booking</div>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Check-in Instructions</div>
                      <div className="text-gray-400 text-sm">Sent 24 hours before arrival</div>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <div>
                      <div className="text-white font-medium">Check-out Reminder</div>
                      <div className="text-gray-400 text-sm">Sent morning of departure</div>
                    </div>
                  </div>
                  <Badge className="bg-cyan-500/20 text-cyan-300">Active</Badge>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 text-sm">
              ✓ 3 active automations • 98% guest satisfaction rate
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="platforms" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Airbnb</h3>
                  <Badge className="bg-cyan-600">Connected</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-white">$8,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bookings</span>
                    <span className="text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rating</span>
                    <span className="text-white">4.9 ⭐</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">VRBO</h3>
                  <Badge className="bg-cyan-600">Connected</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-white">$6,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bookings</span>
                    <span className="text-white">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rating</span>
                    <span className="text-white">4.8 ⭐</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Booking.com</h3>
                  <Badge className="bg-cyan-600">Connected</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-white">$3,600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bookings</span>
                    <span className="text-white">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rating</span>
                    <span className="text-white">4.7 ⭐</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-3">Performance Insights</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Best performing platform:</span>
                  <span className="text-white">Airbnb (46% revenue)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Highest ADR:</span>
                  <span className="text-white">VRBO ($413/night)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total bookings this month:</span>
                  <span className="text-white">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Revenue growth:</span>
                  <span className="text-cyan-400">+18.5%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* New Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-8 text-white">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <BarChart3 className="h-8 w-8 text-cyan-400" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    RENTALIZER
                  </h2>
                </div>
                <p className="text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
                <h3 className="text-2xl font-bold text-white mb-4">Choose Your Plan</h3>
                <p className="text-gray-300 text-lg">
                  Start Your Rental Arbitrage Journey With Our AI-Powered System
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-800/50 p-1 rounded-lg flex">
                  <button className="px-6 py-3 rounded-md bg-cyan-600 text-white font-medium">
                    Monthly
                  </button>
                  <button className="px-6 py-3 rounded-md text-gray-400 font-medium relative">
                    Yearly
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                      Save 50%
                    </Badge>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Market Insights + Calculator Plan */}
                <div className="bg-slate-800/60 border-2 border-cyan-500/40 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Zap className="h-6 w-6 text-cyan-400" />
                      <h4 className="text-xl font-bold text-cyan-300">Market Insights + Calculator</h4>
                    </div>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">$1,950</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400">Perfect for getting started</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {[
                      'Market Intelligence Tool',
                      'Property Calculator', 
                      'Live Airbnb Revenue Data',
                      'ROI & Cash Flow Analysis'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg font-medium text-lg">
                    Get Started
                  </Button>
                </div>

                {/* All-In-One System Plan */}
                <div className="bg-slate-800/60 border-2 border-purple-500/40 rounded-xl p-6 relative">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full">
                    Most Popular
                  </Badge>
                  
                  <div className="text-center mb-6 mt-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Crown className="h-6 w-6 text-purple-400" />
                      <h4 className="text-xl font-bold text-purple-300">All-In-One System</h4>
                    </div>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">$2,950</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400">Complete rental arbitrage solution</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="text-cyan-300 font-medium text-sm mb-3">Everything in Market Insights + Calculator, plus:</div>
                    {[
                      'Acquisitions Agent',
                      'Front Desk Management',
                      'AI-Powered Outreach',
                      'Automated Guest Management',
                      'Priority Support'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg font-medium text-lg">
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Social Proof */}
              <div className="text-center mt-8 p-6 bg-slate-800/30 rounded-lg border border-gray-600/30">
                <div className="flex justify-center items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-300 ml-2 font-medium">4.9/5 Average Rating</span>
                </div>
                <h4 className="text-xl font-bold text-cyan-300">
                  Join 2,000+ Successful Rental Arbitrage Investors
                </h4>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
