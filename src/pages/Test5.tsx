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
  Map
} from 'lucide-react';

const Test5 = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: "Market Intelligence Overview",
      description: "AI-powered rental arbitrage market analysis",
      content: "Welcome to Market Intelligence - the most advanced rental arbitrage analysis tool available. Let's see how it works."
    },
    {
      title: "Enter Target City",
      description: "Search any US city for opportunities",
      content: "Simply enter any US city name. Our system works with hundreds of markets across the country."
    },
    {
      title: "Select Property Type",
      description: "Choose bedroom and bathroom configuration",
      content: "Customize your search by selecting 1-3 bedrooms and corresponding bathroom counts for precise market data."
    },
    {
      title: "Real-Time Data Analysis",
      description: "Processing live market data",
      content: "Our AI connects to multiple data sources including AirDNA for STR revenue and OpenAI for current rent prices."
    },
    {
      title: "Market Results",
      description: "Revenue multiples by neighborhood",
      content: "See detailed revenue-to-rent ratios for each submarket, identifying the most profitable opportunities."
    },
    {
      title: "Interactive Map View",
      description: "Visual heat map analysis",
      content: "Explore results through our interactive heat map showing revenue potential across all neighborhoods."
    },
    {
      title: "Export & Action",
      description: "Download data and make decisions",
      content: "Export selected markets to CSV and use our calculator to run detailed financial projections."
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-12 w-12 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Market Intelligence Demo
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            See how our AI finds the most profitable rental arbitrage opportunities
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
        <div className="grid grid-cols-7 gap-2 mb-8">
          {steps.map((step, index) => (
            <Button
              key={index}
              onClick={() => handleStepClick(index)}
              variant={index === currentStep ? "default" : "outline"}
              size="sm"
              className={`text-xs ${
                index === currentStep 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "border-gray-600 text-gray-400 hover:text-white"
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Main Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Current Step */}
          <Card className="bg-gray-900/80 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center gap-2">
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
            </CardContent>
          </Card>

          {/* Right: Mock Results */}
          <Card className="bg-gray-900/80 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-300 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Live Results Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map View - Shows during step 5 and beyond */}
        {currentStep >= 5 && (
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
              Why Market Intelligence Gives You The Edge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Real-Time Data</h4>
                <p className="text-gray-300 text-sm">Live API connections to AirDNA and current rental markets</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Visual Analysis</h4>
                <p className="text-gray-300 text-sm">Interactive heat maps show profit potential at a glance</p>
              </div>
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">Market Coverage</h4>
                <p className="text-gray-300 text-sm">Analyze any US city with neighborhood-level precision</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test5;
