
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, DollarSign, Home, Users } from 'lucide-react';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

interface MapViewProps {
  results: SubmarketData[];
  city: string;
}

export const MapView: React.FC<MapViewProps> = ({ results, city }) => {
  const [selectedSubmarket, setSelectedSubmarket] = useState<SubmarketData | null>(null);

  const getScoreColor = (multiple: number) => {
    if (multiple >= 3.0) return 'bg-green-500';
    if (multiple >= 2.5) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getScoreLabel = (multiple: number) => {
    if (multiple >= 3.0) return 'Excellent';
    if (multiple >= 2.5) return 'Very Good';
    return 'Good';
  };

  // Generate mock coordinates for demonstration
  const getSubmarketPosition = (index: number) => {
    const positions = [
      { top: '20%', left: '25%' },
      { top: '35%', left: '40%' },
      { top: '15%', left: '60%' },
      { top: '45%', left: '30%' },
      { top: '25%', left: '70%' },
      { top: '55%', left: '45%' },
      { top: '40%', left: '15%' },
      { top: '60%', left: '65%' },
      { top: '30%', left: '50%' },
      { top: '50%', left: '20%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden border border-gray-200">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200">
        {/* Simulated map elements */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Rivers/waterways */}
            <path d="M100 300 Q200 250 300 280 Q400 320 500 300 Q600 280 700 290" 
                  stroke="rgb(59, 130, 246)" strokeWidth="3" fill="none" opacity="0.3" />
            <path d="M150 400 Q250 380 350 400 Q450 420 550 400" 
                  stroke="rgb(59, 130, 246)" strokeWidth="2" fill="none" opacity="0.2" />
            
            {/* Roads */}
            <line x1="0" y1="200" x2="800" y2="220" stroke="rgb(107, 114, 128)" strokeWidth="1" opacity="0.2" />
            <line x1="0" y1="400" x2="800" y2="380" stroke="rgb(107, 114, 128)" strokeWidth="1" opacity="0.2" />
            <line x1="200" y1="0" x2="180" y2="600" stroke="rgb(107, 114, 128)" strokeWidth="1" opacity="0.2" />
            <line x1="500" y1="0" x2="520" y2="600" stroke="rgb(107, 114, 128)" strokeWidth="1" opacity="0.2" />
            
            {/* Area boundaries */}
            <circle cx="300" cy="250" r="80" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="1" opacity="0.1" />
            <circle cx="500" cy="350" r="60" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="1" opacity="0.1" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Market Overview: {city}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{results.length}</span> Submarkets
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">
                    ${Math.round(results.reduce((sum, r) => sum + r.strRevenue, 0) / results.length).toLocaleString()}
                  </span> Avg Revenue
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">
                    {(results.reduce((sum, r) => sum + r.multiple, 0) / results.length).toFixed(1)}x
                  </span> Avg Multiple
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-300">Revenue Potential</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Submarket Markers */}
      {results.map((submarket, index) => {
        const position = getSubmarketPosition(index);
        const score = Math.round(submarket.multiple * 10);
        
        return (
          <div
            key={submarket.submarket}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ top: position.top, left: position.left }}
            onClick={() => setSelectedSubmarket(submarket)}
          >
            <div className="relative group">
              {/* Score Circle */}
              <div className={`w-12 h-12 rounded-full ${getScoreColor(submarket.multiple)} 
                             flex items-center justify-center text-white font-bold text-sm
                             shadow-lg border-2 border-white hover:scale-110 transition-transform`}>
                {score}
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  <div className="font-medium">{submarket.submarket}</div>
                  <div className="text-gray-300">${submarket.strRevenue.toLocaleString()} revenue</div>
                  <div className="text-gray-300">{submarket.multiple.toFixed(1)}x multiple</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected Submarket Details */}
      {selectedSubmarket && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full ${getScoreColor(selectedSubmarket.multiple)} 
                                   flex items-center justify-center text-white font-bold text-sm`}>
                      {Math.round(selectedSubmarket.multiple * 10)}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedSubmarket.submarket}</h4>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      {getScoreLabel(selectedSubmarket.multiple)}
                    </Badge>
                  </div>
                  <p className="text-gray-600">Sarasota</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmarket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Revenue Potential</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedSubmarket.strRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Over the last 12 months</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Median Rent</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${selectedSubmarket.medianRent.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">2BR/2BA Monthly</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Revenue Multiple</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedSubmarket.multiple.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500">STR vs Rent Ratio</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>🏠 23 Submarkets</span>
                  <span>📊 1.8K STR Listings</span>
                  <span>🏘️ 10.1K For Sale Properties</span>
                </div>
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-20 right-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Revenue Potential</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Excellent (3.0x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">Very Good (2.5x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">Good (2.0x+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
