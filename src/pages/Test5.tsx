import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/MapView';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BarChart3, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Search,
  CheckCircle,
  Zap,
  Map,
  Building,
  Mail,
  Phone,
  User,
  Star,
  Send,
  MessageCircle,
  Calendar,
  Home,
  Settings
} from 'lucide-react';

const Test5 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    // Market Intelligence Steps
    {
      title: "Market Intelligence Overview",
      description: "AI-powered rental arbitrage market analysis",
      content: "Welcome to Market Intelligence - the most advanced rental arbitrage analysis tool available. Let's see how it works.",
      category: "market"
    },
    {
      title: "Enter Target City",
      description: "Search any US city for opportunities",
      content: "Simply enter any US city name. Our system works with hundreds of markets across the country.",
      category: "market"
    },
    {
      title: "Select Property Type",
      description: "Choose bedroom and bathroom configuration",
      content: "Customize your search by selecting 1-3 bedrooms and corresponding bathroom counts for precise market data.",
      category: "market"
    },
    {
      title: "Real-Time Data Analysis",
      description: "Processing live market data",
      content: "Our AI connects to multiple data sources including AirDNA for STR revenue and OpenAI for current rent prices.",
      category: "market"
    },
    {
      title: "Market Results",
      description: "Revenue multiples by neighborhood",
      content: "See detailed revenue-to-rent ratios for each submarket, identifying the most profitable opportunities.",
      category: "market"
    },
    {
      title: "Interactive Map View",
      description: "Visual heat map analysis",
      content: "Explore results through our interactive heat map showing revenue potential across all neighborhoods.",
      category: "market"
    },
    {
      title: "Export & Action",
      description: "Download data and make decisions",
      content: "Export selected markets to CSV and use our calculator to run detailed financial projections.",
      category: "market"
    },
    // Acquisition CRM Steps
    {
      title: "Acquisition CRM Overview",
      description: "AI-powered landlord outreach system",
      content: "Now let's see how our Acquisition CRM helps you contact landlords and close deals in your target markets.",
      category: "crm"
    },
    {
      title: "Property Discovery",
      description: "Find rental properties in target areas",
      content: "Search for available rental properties in the neighborhoods you've identified as profitable.",
      category: "crm"
    },
    {
      title: "Landlord Contact Info",
      description: "AI finds owner contact details",
      content: "Our AI automatically researches and finds landlord contact information including emails and phone numbers.",
      category: "crm"
    },
    {
      title: "Personalized Outreach",
      description: "AI-generated custom messages",
      content: "Generate personalized email templates that explain the rental arbitrage opportunity to each landlord.",
      category: "crm"
    },
    {
      title: "Campaign Management",
      description: "Track responses and follow-ups",
      content: "Monitor email open rates, responses, and schedule automatic follow-ups to maximize your conversion rate.",
      category: "crm"
    },
    // PMS Steps
    {
      title: "PMS Overview",
      description: "Complete property management system",
      content: "Finally, let's see how our PMS helps you manage all your properties once you've secured deals.",
      category: "pms"
    },
    {
      title: "Unified Dashboard",
      description: "All properties in one view",
      content: "See all your properties across Airbnb, VRBO, Booking.com and other platforms in a single dashboard.",
      category: "pms"
    },
    {
      title: "Guest Messaging",
      description: "Centralized communication hub",
      content: "Handle all guest messages from every platform in one inbox with smart automation and canned responses.",
      category: "pms"
    },
    {
      title: "Automated Responses",
      description: "AI-powered guest communication",
      content: "Set up automatic check-in instructions, house rules, and follow-up messages to save hours of manual work.",
      category: "pms"
    },
    {
      title: "Unified Calendar",
      description: "All bookings synchronized",
      content: "See check-ins, check-outs, and maintenance across all platforms in one calendar view.",
      category: "pms"
    }
  ];

  const mockResults = [
    { submarket: "Little Italy", strRevenue: 5200, medianRent: 2800, multiple: 1.86 },
    { submarket: "Gaslamp Quarter", strRevenue: 5800, medianRent: 3200, multiple: 1.81 },
    { submarket: "Hillcrest", strRevenue: 4900, medianRent: 2600, multiple: 1.88 },
    { submarket: "Mission Valley", strRevenue: 4600, medianRent: 2400, multiple: 1.92 },
    { submarket: "La Jolla", strRevenue: 7200, medianRent: 4200, multiple: 1.71 },
    { submarket: "Pacific Beach", strRevenue: 5500, medianRent: 3000, multiple: 1.83 }
  ];

  const mockProperties = [
    { address: "123 Main St, San Diego", rent: 2800, landlord: "John Smith", email: "john@example.com", phone: "(555) 123-4567", status: "contacted" },
    { address: "456 Ocean Ave, San Diego", rent: 3200, landlord: "Sarah Johnson", email: "sarah@realty.com", phone: "(555) 234-5678", status: "responded" },
    { address: "789 Harbor Dr, San Diego", rent: 2600, landlord: "Mike Chen", email: "mike@properties.com", phone: "(555) 345-6789", status: "interested" },
    { address: "321 Park Blvd, San Diego", rent: 2400, landlord: "Lisa Garcia", email: "lisa@mgmt.com", phone: "(555) 456-7890", status: "negotiating" }
  ];

  const mockPMSData = [
    { property: "Downtown Loft", platform: "Airbnb", status: "occupied", guest: "John Smith", message: "Hi! What time is check-in?", unread: true },
    { property: "Beach House", platform: "VRBO", status: "cleaning", guest: null, message: null, unread: false },
    { property: "Mountain Cabin", platform: "Booking.com", status: "available", guest: null, message: null, unread: false },
    { property: "City Apartment", platform: "Airbnb", status: "maintenance", guest: "Lisa Garcia", message: "Can I check in early?", unread: true }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (currentStep < steps.length - 1) {
              setCurrentStep(curr => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 1.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const currentCategory = steps[currentStep]?.category;
  const isMarketIntelligence = currentCategory === "market";
  const isAcquisitionCRM = currentCategory === "crm";
  const isPMS = currentCategory === "pms";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isMarketIntelligence && <BarChart3 className="h-12 w-12 text-cyan-400" />}
            {isAcquisitionCRM && <Building className="h-12 w-12 text-purple-400" />}
            {isPMS && <Home className="h-12 w-12 text-green-400" />}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isMarketIntelligence ? "Market Intelligence Demo" : 
               isAcquisitionCRM ? "Acquisition CRM Demo" : "PMS Demo"}
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            {isMarketIntelligence 
              ? "See how our AI finds the most profitable rental arbitrage opportunities"
              : isAcquisitionCRM
              ? "Watch how our AI helps you contact landlords and close deals"
              : "Experience our complete property management system"
            }
          </p>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={handlePlay}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'} Demo
            </Button>
            <Button onClick={handleReset} variant="outline" className="border-cyan-500/30 text-cyan-300">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep * 100 + progress) / steps.length}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-17 gap-1 mb-8">
          {steps.map((step, index) => (
            <Button
              key={index}
              onClick={() => handleStepClick(index)}
              variant={index === currentStep ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                index === currentStep 
                  ? step.category === "market" 
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white" 
                    : step.category === "crm"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  : "border-gray-600 text-gray-400 hover:text-white"
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Category Labels */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">Market Intelligence (Steps 1-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">Acquisition CRM (Steps 8-12)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">PMS (Steps 13-17)</span>
          </div>
        </div>

        {/* Main Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Current Step */}
          <Card className="bg-gray-900/80 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                isMarketIntelligence ? 'text-cyan-300' : 
                isAcquisitionCRM ? 'text-purple-300' : 'text-green-300'
              }`}>
                <Zap className="h-5 w-5" />
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">{steps[currentStep].description}</p>
              <p className="text-white text-lg leading-relaxed">{steps[currentStep].content}</p>
              
              {/* Step-specific visuals */}
              {currentStep === 1 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Search className="h-4 w-4" />
                    <span className="font-mono">San Diego</span>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="mt-6 space-y-3">
                  <div className="flex gap-2">
                    <Badge className="bg-blue-600">2 Bedrooms</Badge>
                    <Badge className="bg-purple-600">2 Bathrooms</Badge>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>AirDNA API Connected</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>OpenAI Rent Research Active</span>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-300 mb-2">
                    <Map className="h-4 w-4" />
                    <span className="font-semibold">Interactive Heat Map</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Click on any neighborhood circle to see detailed revenue data and investment potential.
                  </p>
                </div>
              )}

              {currentStep === 8 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Search className="h-4 w-4" />
                    <span className="font-mono">Little Italy, San Diego</span>
                  </div>
                </div>
              )}

              {currentStep === 9 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Email addresses found</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Phone numbers verified</span>
                  </div>
                </div>
              )}

              {currentStep === 10 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-purple-300 mb-2 font-semibold">Sample Email Template:</div>
                  <div className="text-gray-300 text-sm italic">
                    "Hi John, I'm interested in a long-term rental arrangement for your property at 123 Main St..."
                  </div>
                </div>
              )}

              {currentStep === 13 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300 mb-2">
                    <Home className="h-4 w-4" />
                    <span className="font-semibold">4 Properties Connected</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 text-sm">• 2 Airbnb properties</div>
                    <div className="text-gray-400 text-sm">• 1 VRBO property</div>
                    <div className="text-gray-400 text-sm">• 1 Booking.com property</div>
                  </div>
                </div>
              )}

              {currentStep === 14 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-green-300 mb-2 font-semibold">Unread Messages: 2</div>
                  <div className="text-gray-300 text-sm">
                    All guest communications from every platform appear in one unified inbox.
                  </div>
                </div>
              )}

              {currentStep === 15 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Check-in instructions automated</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>House rules sent automatically</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Follow-up messages scheduled</span>
                  </div>
                </div>
              )}

              {currentStep === 16 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Unified Calendar View</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    See all check-ins, check-outs, and cleaning schedules in one calendar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Mock Results */}
          <Card className="bg-gray-900/80 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className={`${
                isMarketIntelligence ? 'text-cyan-300' : 
                isAcquisitionCRM ? 'text-purple-300' : 'text-green-300'
              } flex items-center gap-2`}>
                {isMarketIntelligence ? <BarChart3 className="h-5 w-5" /> : 
                 isAcquisitionCRM ? <Building className="h-5 w-5" /> : <Home className="h-5 w-5" />}
                {isMarketIntelligence ? "Live Results Preview" : 
                 isAcquisitionCRM ? "CRM Dashboard" : "PMS Dashboard"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isMarketIntelligence ? (
                <>
                  {currentStep >= 4 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">San Diego Market Analysis</h3>
                        <Badge className="bg-green-600">2BR/2BA</Badge>
                      </div>
                      
                      {mockResults.slice(0, currentStep >= 5 ? 6 : 4).map((result, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{result.submarket}</div>
                              <div className="text-sm text-gray-400 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-green-400" />
                                  ${result.strRevenue.toLocaleString()} STR
                                </span>
                                <span>${result.medianRent.toLocaleString()} rent</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-cyan-400">{result.multiple.toFixed(2)}x</div>
                              <div className="text-xs text-gray-400">multiple</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {currentStep >= 6 && (
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                            Export to CSV
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>Results will appear after analysis starts...</p>
                    </div>
                  )}
                </>
              ) : isAcquisitionCRM ? (
                <>
                  {currentStep >= 8 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Property Outreach Campaign</h3>
                        <Badge className="bg-purple-600">Little Italy</Badge>
                      </div>
                      
                      {mockProperties.slice(0, Math.min(currentStep - 7, 4)).map((property, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{property.address}</div>
                            <Badge className={
                              property.status === 'contacted' ? 'bg-blue-600' :
                              property.status === 'responded' ? 'bg-yellow-600' :
                              property.status === 'interested' ? 'bg-green-600' :
                              'bg-purple-600'
                            }>
                              {property.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{property.landlord}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span>{property.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-3 w-3 text-green-400" />
                              <span>${property.rent.toLocaleString()}/month</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {currentStep >= 11 && (
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">75%</div>
                              <div className="text-xs text-gray-400">Open Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-400">25%</div>
                              <div className="text-xs text-gray-400">Response Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-400">3</div>
                              <div className="text-xs text-gray-400">Interested</div>
                            </div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                            <Send className="h-4 w-4 mr-2" />
                            Send Follow-up Campaign
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Building className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>CRM data will appear after starting outreach...</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {currentStep >= 12 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">Property Management Dashboard</h3>
                        <Badge className="bg-green-600">4 Properties</Badge>
                      </div>
                      
                      {mockPMSData.slice(0, Math.min(currentStep - 11, 4)).map((property, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-white">{property.property}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                property.platform === 'Airbnb' ? 'bg-red-600' :
                                property.platform === 'VRBO' ? 'bg-blue-600' :
                                'bg-purple-600'
                              }>
                                {property.platform}
                              </Badge>
                              <Badge className={
                                property.status === 'occupied' ? 'bg-green-600' :
                                property.status === 'cleaning' ? 'bg-yellow-600' :
                                property.status === 'available' ? 'bg-blue-600' :
                                'bg-red-600'
                              }>
                                {property.status}
                              </Badge>
                            </div>
                          </div>
                          {property.guest && (
                            <div className="text-sm text-gray-400 space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>Guest: {property.guest}</span>
                              </div>
                              {property.message && property.unread && (
                                <div className="flex items-center gap-2">
                                  <MessageCircle className="h-3 w-3 text-cyan-400" />
                                  <span className="text-cyan-300">New message: {property.message}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {currentStep >= 15 && (
                        <div className="mt-6 pt-4 border-t border-gray-700">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-400">100%</div>
                              <div className="text-xs text-gray-400">Automated</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-cyan-400">2</div>
                              <div className="text-xs text-gray-400">Unread Messages</div>
                            </div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure Automation
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Home className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>PMS data will appear after starting management...</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map View - Shows during step 5 and beyond for Market Intelligence */}
        {currentStep === 5 && (
          <Card className="bg-gray-900/80 border-cyan-500/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center gap-2">
                <Map className="h-5 w-5" />
                Interactive Market Heat Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  Click on any neighborhood marker to see detailed investment metrics
                </p>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-gray-800/50 border-green-500/30 text-green-300">
                    High Potential (1.8x+)
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300">
                    Good Potential (1.6x+)
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800/50 border-yellow-500/30 text-yellow-300">
                    Moderate Potential (1.4x+)
                  </Badge>
                </div>
              </div>
              <MapView results={mockResults} city="San Diego" />
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Complete End-to-End Rental Arbitrage Solution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Market Intelligence</h4>
                <p className="text-gray-300 text-sm">Find the most profitable markets with real-time data analysis</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Acquisition CRM</h4>
                <p className="text-gray-300 text-sm">Contact landlords efficiently with AI-powered outreach</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Property Management</h4>
                <p className="text-gray-300 text-sm">Manage all properties with automated guest communication</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test5;
