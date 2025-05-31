
import React from 'react';
import { Box } from 'lucide-react';

const Test3 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo with cube to the left of text */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Cube Logo */}
          <div className="relative">
            <Box className="h-16 w-16 text-cyan-400 neon-text transform rotate-12" strokeWidth={1.5} />
            {/* Additional cube lines for 3D effect */}
            <div className="absolute inset-0">
              <Box className="h-16 w-16 text-blue-400/60 neon-text transform -rotate-6 translate-x-1 translate-y-1" strokeWidth={1} />
            </div>
          </div>
          
          {/* Company Name */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
              RENTALIZER
            </h1>
            <p className="text-cyan-300/80 text-lg font-light tracking-widest mt-2">
              .AI
            </p>
          </div>
        </div>

        {/* Test content */}
        <p className="text-gray-400 text-lg">
          Logo Design Test Page
        </p>
      </div>
    </div>
  );
};

export default Test3;
