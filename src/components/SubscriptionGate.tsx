
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap, BarChart3 } from 'lucide-react';
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
          </div>

          <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl text-cyan-300 flex items-center justify-center gap-2">
                <Lock className="h-8 w-8" />
                Professional Access Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xl text-gray-300">
                  Sign in or create an account to access professional STR market analysis
                </p>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300">
                    <Crown className="h-3 w-3 mr-1" />
                    Live Market Data
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    AI Analysis
                  </Badge>
                  <Badge variant="outline" className="bg-gray-800/50 border-blue-500/30 text-blue-300">
                    Professional Tools
                  </Badge>
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

              <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 p-4 rounded-lg border border-gray-600/30">
                <h4 className="font-medium text-cyan-300 mb-2">Save weeks or months of research:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Professional STR revenue data for any US city</li>
                  <li>• AI-powered rental market research</li>
                  <li>• Revenue-to-rent multiple calculations</li>
                  <li>• Export capabilities for your analysis</li>
                </ul>
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
