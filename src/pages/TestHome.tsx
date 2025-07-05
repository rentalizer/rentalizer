import React, { useState } from 'react';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { WelcomeSection } from '@/components/WelcomeSection';
import { TestFeatureGrid } from '@/components/TestFeatureGrid';
import { MarketIntelligenceDemo } from '@/components/MarketIntelligenceDemo';
import { AcquisitionsCRMDemo } from '@/components/AcquisitionsCRMDemo';
import { PMSDemo } from '@/components/PMSDemo';
import { CommunityDemo } from '@/components/CommunityDemo';

const TestHome = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFeatureClick = (feature: string) => {
    setActiveDemo(feature);
    setCurrentStep(1);
  };

  const handleCloseDemo = () => {
    setActiveDemo(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <TopNavBar />

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <WelcomeSection />
          
          {!activeDemo ? (
            <TestFeatureGrid onFeatureClick={handleFeatureClick} />
          ) : (
            <div className="space-y-6">
              {/* Back to Features Button */}
              <div className="text-center">
                <button
                  onClick={handleCloseDemo}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  ← Back to Features
                </button>
              </div>

              {/* Demo Content */}
              {activeDemo === 'market' && (
                <MarketIntelligenceDemo 
                  currentStep={currentStep} 
                  isRunning={true}
                  onStepChange={setCurrentStep}
                />
              )}
              
              {activeDemo === 'acquisition' && (
                <AcquisitionsCRMDemo 
                  currentStep={currentStep + 3} // Start from step 4 in the overall flow
                  isRunning={true}
                />
              )}
              
              {activeDemo === 'pms' && (
                <PMSDemo 
                  currentStep={currentStep + 11} // Start from step 12 in the overall flow
                  isRunning={true}
                />
              )}
              
              {activeDemo === 'community' && (
                <CommunityDemo 
                  currentStep={17}
                  isRunning={true}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TestHome;