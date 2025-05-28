
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';

interface SubscriptionGateProps {
  children: React.ReactNode;
}

export const SubscriptionGate = ({ children }: SubscriptionGateProps) => {
  const { user, isSubscribed } = useAuth();

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
              <div className="relative">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 48 48" 
                  className="text-cyan-400"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(34, 211, 238)" />
                      <stop offset="50%" stopColor="rgb(96, 165, 250)" />
                      <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                    </linearGradient>
                  </defs>
                  
                  <rect x="8" y="20" width="8" height="20" fill="url(#logoGradient)" rx="1" />
                  <rect x="20" y="12" width="8" height="28" fill="url(#logoGradient)" rx="1" />
                  <rect x="32" y="16" width="8" height="24" fill="url(#logoGradient)" rx="1" />
                  
                  <path d="M6 8 L18 12 L30 6 L42 10" stroke="url(#logoGradient)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="6" cy="8" r="2" fill="rgb(34, 211, 238)" />
                  <circle cx="18" cy="12" r="2" fill="rgb(96, 165, 250)" />
                  <circle cx="30" cy="6" r="2" fill="rgb(168, 85, 247)" />
                  <circle cx="42" cy="10" r="2" fill="rgb(34, 211, 238)" />
                </svg>
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-lg animate-pulse"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                RENTALIZER.AI
              </h1>
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
                <h4 className="font-medium text-cyan-300 mb-2">What you get:</h4>
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
          <Card className="shadow-2xl border border-orange-500/20 bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl text-orange-300 flex items-center justify-center gap-2">
                <Crown className="h-8 w-8" />
                Subscription Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-xl text-gray-300">
                  Welcome {user.email}! Upgrade to access professional market analysis.
                </p>
                
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 text-lg font-medium"
                >
                  Upgrade to Professional
                </Button>
              </div>

              <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 p-4 rounded-lg border border-orange-500/30">
                <h4 className="font-medium text-orange-300 mb-2">Professional Features:</h4>
                <ul className="text-sm text-orange-200 space-y-1">
                  <li>• Live professional STR data from AirDNA</li>
                  <li>• AI-powered rental research</li>
                  <li>• Unlimited city analysis</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
