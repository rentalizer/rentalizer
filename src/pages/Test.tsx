
import React from 'react';
import { ThinAnimatedBanner } from '@/components/draft/ThinAnimatedBanner';

const Test = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Test the thin animated banner here */}
      <ThinAnimatedBanner />
      
      {/* Some content below to see how it looks */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-300 mb-6">
            Test Page - Thin Animated Banner Draft
          </h1>
          <p className="text-gray-400">
            This is a test page to preview the thin animated banner at the top.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Test;
