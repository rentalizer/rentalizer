
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, DollarSign, Home, MapPin, Star, Filter } from 'lucide-react';

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
  const [mapView, setMapView] = useState<'satellite' | 'street'>('satellite');

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
    <div className="w-full h-[700px] relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {/* Map Background */}
      <div className={`absolute inset-0 ${mapView === 'satellite' 
        ? 'bg-gradient-to-br from-green-200 via-blue-100 to-green-300' 
        : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200'
      }`}>
        {/* Simulated map elements */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 800 700">
            {/* Coastline/waterways */}
            <path d="M0 400 Q200 350 400 380 Q600 410 800 390" 
                  stroke="rgb(59, 130, 246)" strokeWidth="4" fill="none" opacity="0.4" />
            <path d="M100 500 Q300 480 500 500 Q700 520 800 510" 
                  stroke="rgb(59, 130, 246)" strokeWidth="3" fill="none" opacity="0.3" />
            
            {/* Roads/highways */}
            <line x1="0" y1="250" x2="800" y2="270" stroke="rgb(107, 114, 128)" strokeWidth="2" opacity="0.3" />
            <line x1="0" y1="450" x2="800" y2="430" stroke="rgb(107, 114, 128)" strokeWidth="2" opacity="0.3" />
            <line x1="250" y1="0" x2="230" y2="700" stroke="rgb(107, 114, 128)" strokeWidth="2" opacity="0.3" />
            <line x1="550" y1="0" x2="570" y2="700" stroke="rgb(107, 114, 128)" strokeWidth="2" opacity="0.3" />
            
            {/* Area boundaries */}
            <circle cx="350" cy="300" r="100" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="1" opacity="0.2" />
            <circle cx="550" cy="400" r="80" fill="none" stroke="rgb(156, 163, 175)" strokeWidth="1" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {city}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{results.length} Submarkets</span>
                  <span>•</span>
                  <span>Revenue Potential Analysis</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
            <CardContent className="p-3">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  onClick={() => setMapView('satellite')}
                  className="text-xs"
                >
                  Satellite
                </Button>
                <Button
                  size="sm"
                  variant={mapView === 'street' ? 'default' : 'outline'}
                  onClick={() => setMapView('street')}
                  className="text-xs"
                >
                  Street
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
            <CardContent className="p-3">
              <Button size="sm" variant="outline" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="absolute top-20 left-4 z-20">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Market Performance</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{results.length}</div>
                  <div className="text-xs text-gray-600">Submarkets</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    ${Math.round(results.reduce((sum, r) => sum + r.strRevenue, 0) / results.length / 1000)}K
                  </div>
                  <div className="text-xs text-gray-600">Avg Revenue</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {(results.reduce((sum, r) => sum + r.multiple, 0) / results.length).toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-600">Avg Multiple</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute top-20 right-4 z-20">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Revenue Potential</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Excellent (3.0x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">Very Good (2.5x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">Good (2.0x+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submarket Markers */}
      {results.map((submarket, index) => {
        const position = getSubmarketPosition(index);
        
        return (
          <div
            key={submarket.submarket}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ top: position.top, left: position.left }}
            onClick={() => setSelectedSubmarket(submarket)}
          >
            <div className="relative group">
              {/* Marker */}
              <div className={`w-8 h-8 rounded-full ${getScoreColor(submarket.multiple)} 
                             flex items-center justify-center text-white font-bold text-xs
                             shadow-lg border-2 border-white hover:scale-125 transition-transform
                             ${selectedSubmarket?.submarket === submarket.submarket ? 'ring-2 ring-gray-900 scale-125' : ''}`}>
                <Star className="h-3 w-3" />
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  <div className="font-medium">{submarket.submarket}</div>
                  <div className="text-gray-300">${submarket.strRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected Submarket Details */}
      {selectedSubmarket && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-white/98 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full ${getScoreColor(selectedSubmarket.multiple)} 
                                   flex items-center justify-center text-white text-xs`}>
                      <Star className="h-3 w-3" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedSubmarket.submarket}</h4>
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                      {getScoreLabel(selectedSubmarket.multiple)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{city} Submarket</p>
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

              <div className="grid grid-cols-4 gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">STR Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedSubmarket.strRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Annual (Top 25%)</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Home className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Median Rent</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${selectedSubmarket.medianRent.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Monthly (2BR/2BA)</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Multiple</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedSubmarket.multiple.toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-500">Revenue/Rent Ratio</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Score</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(selectedSubmarket.multiple * 10)}
                  </div>
                  <div className="text-xs text-gray-500">Investment Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📊 Market Analysis</span>
                  <span>🏠 2BR/2BA Focus</span>
                  <span>📈 Top 25% Performance</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-300">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
