
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, DollarSign, Home, MapPin, Star, Filter, Layers, Search } from 'lucide-react';

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
  const [showHeatmap, setShowHeatmap] = useState(true);

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

  // Generate more realistic coordinates for demonstration
  const getSubmarketPosition = (index: number) => {
    const positions = [
      { top: '25%', left: '30%' },
      { top: '40%', left: '45%' },
      { top: '20%', left: '65%' },
      { top: '55%', left: '35%' },
      { top: '30%', left: '75%' },
      { top: '65%', left: '50%' },
      { top: '45%', left: '20%' },
      { top: '70%', left: '70%' },
      { top: '35%', left: '55%' },
      { top: '60%', left: '25%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="w-full h-[700px] relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      {/* Map Background */}
      <div className={`absolute inset-0 ${mapView === 'satellite' 
        ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900' 
        : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200'
      }`}>
        {/* Simulated map elements */}
        <div className="absolute inset-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 800 700">
            {/* Coastline/waterways */}
            <path d="M0 400 Q200 350 400 380 Q600 410 800 390" 
                  stroke={mapView === 'satellite' ? 'rgb(59, 130, 246)' : 'rgb(147, 197, 253)'} 
                  strokeWidth="6" fill="none" opacity="0.6" />
            <path d="M100 500 Q300 480 500 500 Q700 520 800 510" 
                  stroke={mapView === 'satellite' ? 'rgb(59, 130, 246)' : 'rgb(147, 197, 253)'} 
                  strokeWidth="4" fill="none" opacity="0.5" />
            
            {/* Roads/highways */}
            <line x1="0" y1="250" x2="800" y2="270" 
                  stroke={mapView === 'satellite' ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'} 
                  strokeWidth="3" opacity="0.4" />
            <line x1="0" y1="450" x2="800" y2="430" 
                  stroke={mapView === 'satellite' ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'} 
                  strokeWidth="3" opacity="0.4" />
            <line x1="250" y1="0" x2="230" y2="700" 
                  stroke={mapView === 'satellite' ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'} 
                  strokeWidth="3" opacity="0.4" />
            <line x1="550" y1="0" x2="570" y2="700" 
                  stroke={mapView === 'satellite' ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)'} 
                  strokeWidth="3" opacity="0.4" />
            
            {/* Area boundaries */}
            {showHeatmap && (
              <>
                <circle cx="350" cy="300" r="80" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="2" />
                <circle cx="550" cy="400" r="60" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="2" />
                <circle cx="200" cy="500" r="70" fill="rgba(234, 179, 8, 0.2)" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="2" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  {city}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                  <span>{results.length} Submarkets</span>
                  <span>•</span>
                  <span>Revenue Potential Analysis</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Card className="bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-700">
            <CardContent className="p-3">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  onClick={() => setMapView('satellite')}
                  className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Layers className="h-3 w-3 mr-1" />
                  Satellite
                </Button>
                <Button
                  size="sm"
                  variant={mapView === 'street' ? 'default' : 'outline'}
                  onClick={() => setMapView('street')}
                  className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Search className="h-3 w-3 mr-1" />
                  Street
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-700">
            <CardContent className="p-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                <Filter className="h-3 w-3 mr-1" />
                {showHeatmap ? 'Hide' : 'Show'} Heatmap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="absolute top-20 left-4 z-20">
        <Card className="bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-300">Market Performance</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-white">{results.length}</div>
                  <div className="text-xs text-gray-400">Submarkets</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">
                    ${(results.reduce((sum, r) => sum + r.strRevenue, 0) / results.length).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Avg Revenue</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-400">
                    {(results.reduce((sum, r) => sum + r.multiple, 0) / results.length).toFixed(2)}x
                  </div>
                  <div className="text-xs text-gray-400">Avg Multiple</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute top-20 right-4 z-20">
        <Card className="bg-gray-900/95 backdrop-blur-sm shadow-xl border border-gray-700">
          <CardContent className="p-4">
            <h4 className="font-medium text-white mb-3 text-sm">Revenue Potential</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Excellent (3.0x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Very Good (2.5x+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">Good (2.0x+)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SUBMARKET MARKERS WITH BRIGHT WHITE TEXT */}
      {results.map((submarket, index) => {
        const position = getSubmarketPosition(index);
        
        return (
          <div
            key={submarket.submarket}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ top: position.top, left: position.left }}
            onClick={() => setSelectedSubmarket(submarket)}
          >
            <div className="relative group flex flex-col items-center">
              {/* SUBMARKET NAME - BRIGHT WHITE TEXT WITH DARK SOLID BACKGROUND */}
              <div className="mb-2 text-center bg-black/90 px-3 py-1 rounded-md border-2 border-white shadow-2xl backdrop-blur-sm">
                <span 
                  className="font-bold text-sm tracking-wide select-none text-white"
                  style={{ 
                    color: '#FFFFFF !important',
                    textShadow: '0 0 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,1)',
                    fontWeight: '800',
                    fontSize: '13px'
                  }}
                >
                  {submarket.submarket}
                </span>
              </div>

              {/* MULTIPLE NUMBER CIRCLE */}
              <div className={`w-20 h-20 rounded-full ${getScoreColor(submarket.multiple)} 
                             flex items-center justify-center shadow-2xl border-4 border-white 
                             hover:scale-110 transition-all duration-200
                             ${selectedSubmarket?.submarket === submarket.submarket ? 'ring-4 ring-cyan-400 scale-110' : ''}`}
                   style={{ 
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 0 2px white'
                   }}>
                <span 
                  className="font-black text-xl tracking-tight select-none text-white" 
                  style={{ 
                    color: '#FFFFFF !important',
                    textShadow: '0 0 8px rgba(0,0,0,1), 3px 3px 6px rgba(0,0,0,1)',
                    fontSize: '16px',
                    fontWeight: '900'
                  }}
                >
                  {submarket.multiple.toFixed(2)}
                </span>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                <div className="bg-black/95 text-white text-sm rounded-lg px-4 py-3 whitespace-nowrap border-2 border-white shadow-2xl backdrop-blur-sm">
                  <div className="font-bold text-white text-base">{submarket.submarket}</div>
                  <div className="text-green-400 font-semibold">${submarket.strRevenue.toLocaleString()}</div>
                  <div className="text-cyan-400 font-semibold">{submarket.multiple.toFixed(2)}x multiple</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected Submarket Details */}
      {selectedSubmarket && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-gray-900/98 backdrop-blur-sm shadow-2xl border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full ${getScoreColor(selectedSubmarket.multiple)} 
                                   flex items-center justify-center text-white text-base font-black border-2 border-white`}
                         style={{ 
                           textShadow: '2px 2px 4px rgba(0,0,0,1)',
                           color: '#ffffff !important'
                         }}>
                      {selectedSubmarket.multiple.toFixed(2)}
                    </div>
                    <h4 className="text-xl font-semibold text-white">{selectedSubmarket.submarket}</h4>
                    <Badge variant="outline" className="bg-cyan-950 border-cyan-500 text-cyan-300">
                      {getScoreLabel(selectedSubmarket.multiple)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{city} Submarket</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmarket(null)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-300">STR Revenue</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    ${selectedSubmarket.strRevenue}
                  </div>
                  <div className="text-xs text-gray-500">Annual (Top 25%)</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Home className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Median Rent</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    ${selectedSubmarket.medianRent}
                  </div>
                  <div className="text-xs text-gray-500">Monthly (2BR/2BA)</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">Multiple</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedSubmarket.multiple.toFixed(4)}x
                  </div>
                  <div className="text-xs text-gray-500">Revenue/Rent Ratio</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-gray-300">Score</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    {(selectedSubmarket.multiple * 10).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Investment Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>📊 Market Analysis</span>
                  <span>🏠 2BR/2BA Focus</span>
                  <span>📈 Top 25% Performance</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
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
