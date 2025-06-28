
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const TopNavBar = () => {
  return (
    <div className="w-full bg-slate-700/90 backdrop-blur-lg border-b border-gray-500/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          {/* Centered Logo */}
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-cyan-400" style={{
              filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 36px rgba(6, 182, 212, 0.5))'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
