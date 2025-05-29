
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap, BarChart3, MapPin, Calculator, DollarSign, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';
import { SubscriptionPricing } from './SubscriptionPricing';

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const { user, isSubscribed } = useAuth();

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // TODO: Implement actual payment processing
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10 mt-20">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-8">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Rentalizer
                </h1>
                <p className="text-lg text-cyan-300/80 font-medium mt-2">By Richie Matthews</p>
              </div>
            </div>
            <p className="text-3xl text-cyan-100 mb-12 max-w-4xl mx-auto leading-tight">
              The All-In-One AI System To Earn Rental Income—No Mortgage Needed
            </p>
          </div>

          <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardContent className="space-y-6 pt-6">
              {/* Features grid - 4 icons */}
              <div className="bg-gray-800/30 border border-cyan-500/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="text-cyan-300 font-medium">Market Intelligence</h5>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="text-purple-300 font-medium">Acquisitions Agent</h5>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="text-cyan-300 font-medium">Front Desk</h5>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calculator className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="text-blue-300 font-medium">Property Automations</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <LoginDialog 
                  trigger={
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 text-lg font-medium shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
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
              Welcome {user.email}! Choose your plan to get started.
            </p>
          </div>

          <SubscriptionPricing onUpgrade={handleUpgrade} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
