
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, Building, Users, Calculator, Calendar } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Icons */}
        <div className="absolute top-20 left-16 opacity-20">
          <MapPin className="h-8 w-8 text-cyan-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        </div>
        <div className="absolute top-32 right-20 opacity-20">
          <Building className="h-6 w-6 text-purple-400 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-40 left-20 opacity-20">
          <Calculator className="h-7 w-7 text-blue-400 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        </div>
        <div className="absolute bottom-60 right-16 opacity-20">
          <Users className="h-5 w-5 text-green-400 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-40 left-1/4 w-3 h-3 bg-cyan-400/30 rotate-45 animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-4 h-4 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-80 left-1/3 w-2 h-2 bg-blue-400/30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-80 right-1/4 w-5 h-5 bg-green-400/20 rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Floating Lines */}
        <div className="absolute top-48 left-32 w-16 h-0.5 bg-gradient-to-r from-cyan-400/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-72 right-32 w-12 h-0.5 bg-gradient-to-l from-purple-400/20 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-96 right-48 w-20 h-0.5 bg-gradient-to-r from-blue-400/20 to-transparent animate-pulse" style={{ animationDelay: '0.8s' }}></div>

        {/* Additional floating elements */}
        <div className="absolute top-24 left-1/2 w-1 h-1 bg-cyan-300/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-purple-300/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-72 right-1/5 w-1 h-1 bg-blue-300/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Top Login Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-700/80 border-cyan-500/50 text-cyan-300 hover:bg-slate-600/80"
        >
          Login
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400" style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))' }} />
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
            
            <h2 className="text-2xl md:text-3xl text-white mb-8 font-semibold">
              Start Your Rental Arbitrage Journey With Our AI-Powered System
            </h2>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-4 text-lg mb-16"
              onClick={() => navigate('/demo')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Demo
            </Button>
          </div>

          {/* Features Grid - 4 cards */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-cyan-300 text-lg font-semibold">
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-cyan-300 text-lg font-semibold">
                  Acquisition CRM & Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Property Outreach, Close Deals, Profit Calculator, Manage Relationships
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-cyan-300 text-lg font-semibold">
                  PMS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Streamline Property Management And Automate Operations
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-6 h-1 rounded-full bg-cyan-400"></div>
                  <div className="w-6 h-1 rounded-full bg-cyan-400"></div>
                  <div className="w-6 h-1 rounded-full bg-cyan-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-cyan-300 text-lg font-semibold">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Join Our Network Of Rental Arbitrage Entrepreneurs
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description Section */}
          <div className="text-center mb-16">
            <p className="text-white text-lg max-w-4xl mx-auto leading-relaxed">
              RENTALIZER.AI Combines AI Powered Market Analysis, Deal Sourcing, And Automation Tools With A 
              Built-In CRM And A Thriving Community—Everything You Need To Launch And Scale Your Rental 
              Arbitrage Business
            </p>
          </div>

          {/* Testimonials Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold mb-12">
              Real Users Who've Unlocked Rental Income With Rentalizer
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-300 text-sm mb-4 italic">
                    "Rentalizer has everything that you need in one program to get you set up and to be able to have a successful 
                    Airbnb business. Rentalizer helped me acquire 5 properties within 1 month of starting the program, each with only 
                    $200 deposits and 3 weeks free rent."
                  </p>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-cyan-300 font-semibold">Bishol Mikhail</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-300 text-sm mb-4 italic">
                    "If you are thinking about getting into the short term rental business, Rentalizer's blueprint and all the templates 
                    available is definitely something that gives great confidence moving forward. If you have any question 
                    whether to join Rentalizer's program, I think you'll find it very beneficial."
                  </p>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-cyan-300 font-semibold">Bobby Han</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-300 text-sm mb-4 italic">
                    "Rentalizer's program is amazing. Rentalizer helped us close the largest apartment company in our area. We now 
                    have 6 properties. I recommend the mentorship. You won't be disappointed."
                  </p>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
                    ))}
                  </div>
                  <p className="text-cyan-300 font-semibold">Shante Davis</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
