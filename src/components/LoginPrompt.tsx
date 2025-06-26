
import React from 'react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { LoginDialog } from '@/components/LoginDialog';
import { WelcomeSection } from '@/components/WelcomeSection';

export const LoginPrompt = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <WelcomeSection />
          
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Login Required</h2>
            <p className="text-gray-300 mb-6">
              Please log in to access your Rentalizer dashboard.
            </p>
            <LoginDialog trigger={
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white">
                Login
              </Button>
            } />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
