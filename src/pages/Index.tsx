
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, DollarSign, TrendingUp, Calculator, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from '@/components/LoginDialog';
import { SubscriptionPricing } from '@/components/SubscriptionPricing';
import { Footer } from '@/components/Footer';
import { TopNavBar } from '@/components/TopNavBar';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, isSubscribed } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = (promoCode?: string) => {
    console.log('Upgrade requested with promo code:', promoCode);
    // Handle upgrade logic here
  };

  // Show subscription gate for non-subscribed users
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Top Navigation Bar for authenticated users */}
        {user && <TopNavBar />}

        {/* Futuristic background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl animate-pulse delay-500"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-32 right-20 w-4 h-4 bg-purple-500/30 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-40 right-40 w-3 h-3 bg-green-500/40 rotate-45 animate-bounce delay-700"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-4 py-12">
            {/* Main Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-5 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-cyan-400/30 flex items-center justify-center bg-slate-800/50 backdrop-blur-lg">
                    <BarChart3 className="h-10 w-10 text-cyan-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  RENTALIZER
                </h1>
              </div>
              <p className="text-xl text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
              <p className="text-3xl text-cyan-100 mb-12 max-w-4xl mx-auto leading-tight">
                The All-In-One AI System To Earn Rental Income—No Mortgage Needed
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                <LoginDialog />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <Card 
                className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate('/market-analysis')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <MapPin className="h-8 w-8 text-cyan-400" />
                  </div>
                  <CardTitle className="text-cyan-300 text-xl">
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">
                    Get comprehensive market data for rental arbitrage opportunities across the US.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-900/50 border-blue-500/20 backdrop-blur-lg hover:border-blue-400/40 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate('/calculator')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Calculator className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-300 text-xl">
                    Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">
                    Built-in calculator to model your specific investment scenarios and projections.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <User className="h-8 w-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-purple-300 text-xl">
                    Acquisitions Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">
                    Contact landlords with preloaded scripts in smart sequences based on landlord responses. Handles follow-ups and basic qualification.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <DollarSign className="h-8 w-8 text-cyan-400" />
                  </div>
                  <CardTitle className="text-cyan-300 text-xl">
                    Front Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-400">
                    Property Management & Automations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Subscription Pricing */}
            <SubscriptionPricing onUpgrade={handleUpgrade} />

            {/* 4 Main Action Buttons - Moved to Bottom */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mt-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                onClick={() => navigate('/market-analysis')}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Market Intelligence
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                onClick={() => navigate('/calculator')}
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculator
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <User className="h-5 w-5 mr-2" />
                Acquisitions Agent
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Front Desk
              </Button>
            </div>
          </div>
        </div>

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
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <Card 
              className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate('/market-analysis')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <MapPin className="h-8 w-8 text-cyan-400" />
                </div>
                <CardTitle className="text-cyan-300 text-xl">
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Get comprehensive market data for rental arbitrage opportunities across the US.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-900/50 border-blue-500/20 backdrop-blur-lg hover:border-blue-400/40 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate('/calculator')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Calculator className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-blue-300 text-xl">
                  Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Built-in calculator to model your specific investment scenarios and projections.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-purple-300 text-xl">
                  Acquisitions Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Contact landlords with preloaded scripts in smart sequences based on landlord responses. Handles follow-ups and basic qualification.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <DollarSign className="h-8 w-8 text-cyan-400" />
                </div>
                <CardTitle className="text-cyan-300 text-xl">
                  Front Desk
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400">
                  Property Management & Automations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 4 Main Action Buttons - Moved to Bottom */}
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mt-16">
            <Button
              onClick={() => navigate('/market-analysis')}
              size="lg"
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Market Intelligence
            </Button>
            <Button
              onClick={() => navigate('/calculator')}
              size="lg"
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculator
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <User className="h-5 w-5 mr-2" />
              Acquisitions Agent
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 text-white px-6 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Front Desk
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
