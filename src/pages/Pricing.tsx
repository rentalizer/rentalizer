
import React from 'react';
import { SubscriptionPricing } from '@/components/SubscriptionPricing';
import { BarChart3 } from 'lucide-react';
import { Footer } from '@/components/Footer';

const Pricing = () => {
  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // This will redirect to login if not authenticated
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10 mt-20">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <BarChart3 className="h-12 w-12 text-cyan-400" />
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                Rentalizer
              </h1>
              <p className="text-lg text-cyan-300/80 font-medium">By Richie Matthews</p>
            </div>
          </div>
          <p className="text-xl text-gray-300">
            Choose your plan to unlock your rental income potential.
          </p>
        </div>

        <SubscriptionPricing onUpgrade={handleUpgrade} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
