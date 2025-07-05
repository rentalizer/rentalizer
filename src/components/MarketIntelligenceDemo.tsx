import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapView } from '@/components/MapView';
import { ResultsTable } from '@/components/ResultsTable';
import { 
  Search, 
  BarChart3, 
  MapPin,
  Table2,
  Map,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';

interface MarketIntelligenceDemoProps {
  currentStep: number;
  isRunning: boolean;
  onStepChange: (step: number) => void;
}

export const MarketIntelligenceDemo = ({ currentStep, isRunning, onStepChange }: MarketIntelligenceDemoProps) => {
  const [autoPlay, setAutoPlay] = useState(false);

  // Mock data for market analysis
  const mockMarketData = [
    { submarket: "Hillcrest", strRevenue: 7076, medianRent: 3800, multiple: 1.86 },
    { submarket: "Little Italy", strRevenue: 7948, medianRent: 4500, multiple: 1.77 },
    { submarket: "Gaslamp Quarter", strRevenue: 7415, medianRent: 4200, multiple: 1.77 },
    { submarket: "Mission Valley", strRevenue: 0, medianRent: 3500, multiple: 0 },
    { submarket: "La Jolla", strRevenue: 0, medianRent: 4800, multiple: 0 },
    { submarket: "Pacific Beach", strRevenue: 0, medianRent: 4000, multiple: 0 }
  ];

  const steps = [
    { id: 1, title: "Market Research", description: "AI analyzes rental markets", icon: Search },
    { id: 2, title: "Market Scoring", description: "Evaluates profitability metrics", icon: BarChart3 },
    { id: 3, title: "Location Analysis", description: "Identifies best neighborhoods", icon: MapPin }
  ];

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        onStepChange(currentStep >= 3 ? 1 : currentStep + 1);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [autoPlay, currentStep, onStepChange]);

  const handlePlayPause = () => {
    setAutoPlay(!autoPlay);
  };

  const handleStepClick = (stepId: number) => {
    setAutoPlay(false);
    onStepChange(stepId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            Market Intelligence Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              onClick={handlePlayPause}
              className={`px-6 py-2 ${autoPlay ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            >
              {autoPlay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {autoPlay ? 'Pause Demo' : 'Auto Play Demo'}
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  onClick={() => handleStepClick(step.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-cyan-500 text-white' 
                      : 'bg-slate-700 text-gray-400'
                  } ${currentStep === step.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className={`h-4 w-4 mx-2 ${currentStep > step.id ? 'text-cyan-400' : 'text-gray-600'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-gray-300">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Market Research Input */}
        {currentStep === 1 && (
          <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center text-xl text-cyan-300 flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Market Research Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="target-city" className="text-sm font-medium text-gray-300">
                    Enter Target City
                  </Label>
                  <Input
                    id="target-city"
                    value="San Diego"
                    readOnly
                    className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100 focus:border-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Bedrooms</Label>
                    <Select value="2" disabled>
                      <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                        <SelectValue placeholder="2 Bedrooms" />
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-300">Bathrooms</Label>
                    <Select value="2" disabled>
                      <SelectTrigger className="mt-1 border-cyan-500/30 bg-gray-800/50 text-gray-100">
                        <SelectValue placeholder="2 Bathrooms" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Market
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Market Scoring Results */}
        {currentStep === 2 && (
          <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center text-xl text-cyan-300 flex items-center justify-center gap-2">
                <Table2 className="h-5 w-5" />
                Market Scoring Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-hidden">
                <ResultsTable 
                  results={mockMarketData} 
                  city="San Diego" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location Analysis Map */}
        {currentStep === 3 && (
          <Card className="bg-slate-800/50 border-cyan-500/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center text-xl text-cyan-300 flex items-center justify-center gap-2">
                <Map className="h-5 w-5" />
                Location Analysis - San Diego, CA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView results={mockMarketData} city="San Diego, CA" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};