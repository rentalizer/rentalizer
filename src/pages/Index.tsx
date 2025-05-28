import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MapPin, DollarSign, TrendingUp, Calculator, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ApartmentCube } from '@/components/ApartmentCube';
import { MarketDataInput } from '@/components/MarketDataInput';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { LoginDialog } from '@/components/LoginDialog';
import { SubscriptionPricing } from '@/components/SubscriptionPricing';
import { ContactChat } from '@/components/ContactChat';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

const Index = () => {
  const { user, signOut, isSubscribed } = useAuth();
  const [submarketData, setSubmarketData] = useState<SubmarketData[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // Handle upgrade logic here
  };

  // Show subscription gate for non-subscribed users
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-5 mb-6">
                <BarChart3 className="h-16 w-16 text-cyan-400" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-lg text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
              <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
                The All-In-One AI System To Earn Rental Income—No Mortgage Needed
              </p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <LoginDialog />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <MapPin className="h-5 w-5" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Get comprehensive market data for rental arbitrage opportunities across the US.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <TrendingUp className="h-5 w-5" />
                    Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Advanced algorithms calculate potential returns and risk scores for informed decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-300">
                    <Calculator className="h-5 w-5" />
                    ROI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Built-in calculator to model your specific investment scenarios and projections.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Pricing */}
            <SubscriptionPricing onUpgrade={handleUpgrade} />
          </div>
        </div>

        {/* Chat and Footer */}
        <ContactChat />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Futuristic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Header - simplified since we have the top nav */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-5 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-6">By Richie Matthews</p>
            <p className="text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              The All-In-One AI System To Earn Rental Income—No Mortgage Needed
            </p>
          </div>

          {/* Market Data Input - placeholder for now */}
          <div className="mb-8">
            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                <p className="text-cyan-300">Market data input will go here</p>
              </CardContent>
            </Card>
          </div>

          {/* Results - placeholder for now */}
          {submarketData.length > 0 && (
            <div>
              {showMap ? (
                <MapView results={submarketData} city={cityName} />
              ) : (
                <ResultsTable results={submarketData} city={cityName} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat and Footer */}
      <ContactChat />
      <Footer />
    </div>
  );
};

export default Index;
