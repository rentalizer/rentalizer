
import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

interface CompProperty {
  name: string;
  price: number;
}

interface MapViewCompsProps {
  comps: CompProperty[];
  address: string;
}

export const MapViewComps: React.FC<MapViewCompsProps> = ({ comps, address }) => {
  // Generate positions for comparable properties around the main address
  const getCompPosition = (index: number) => {
    const positions = [
      { top: '30%', left: '40%' },
      { top: '50%', left: '60%' },
      { top: '25%', left: '70%' },
      { top: '65%', left: '45%' },
    ];
    return positions[index % positions.length];
  };

  // Main property position (center)
  const mainPosition = { top: '45%', left: '50%' };

  return (
    <div className="w-full h-[400px] relative bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
        <svg className="w-full h-full opacity-30" viewBox="0 0 400 400">
          {/* Simulated streets */}
          <line x1="0" y1="150" x2="400" y2="160" stroke="rgb(156, 163, 175)" strokeWidth="2" />
          <line x1="0" y1="250" x2="400" y2="240" stroke="rgb(156, 163, 175)" strokeWidth="2" />
          <line x1="150" y1="0" x2="140" y2="400" stroke="rgb(156, 163, 175)" strokeWidth="2" />
          <line x1="280" y1="0" x2="290" y2="400" stroke="rgb(156, 163, 175)" strokeWidth="2" />
          
          {/* Simulated blocks */}
          <rect x="50" y="50" width="80" height="60" fill="rgba(75, 85, 99, 0.3)" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" />
          <rect x="200" y="80" width="70" height="50" fill="rgba(75, 85, 99, 0.3)" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" />
          <rect x="100" y="200" width="90" height="70" fill="rgba(75, 85, 99, 0.3)" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" />
          <rect x="250" y="220" width="80" height="60" fill="rgba(75, 85, 99, 0.3)" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" />
        </svg>
      </div>

      {/* Main property marker */}
      <div
        className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: mainPosition.top, left: mainPosition.left }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2 bg-red-600 px-3 py-1 rounded-md border-2 border-white shadow-lg">
            <span className="font-bold text-xs text-white">Your Property</span>
          </div>
          <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Comparable property markers */}
      {comps.map((comp, index) => {
        const position = getCompPosition(index);
        return (
          <div
            key={index}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ top: position.top, left: position.left }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-2 bg-cyan-600 px-2 py-1 rounded-md border-2 border-white shadow-lg">
                <span className="font-bold text-xs text-white truncate max-w-[100px]">
                  {comp.name}
                </span>
              </div>
              <div className="w-6 h-6 bg-cyan-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                <div className="bg-black text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap border-2 border-white shadow-xl">
                  <div className="font-bold text-white">{comp.name}</div>
                  <div className="text-cyan-400 font-semibold flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {comp.price.toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <h4 className="font-medium text-white mb-2 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
            <span className="text-gray-300">Your Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-600 border border-white"></div>
            <span className="text-gray-300">Comparables</span>
          </div>
        </div>
      </div>

      {/* Map info */}
      <div className="absolute bottom-4 left-4 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
        <div className="text-sm text-white">
          <div className="font-medium">Search Area</div>
          <div className="text-gray-300 text-xs mt-1">{address}</div>
          <div className="text-cyan-400 text-xs mt-1">{comps.length} comparables found</div>
        </div>
      </div>
    </div>
  );
};
