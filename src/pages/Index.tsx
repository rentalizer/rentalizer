
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
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
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
            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  <MapPin className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  <Calculator className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                  Acquisition CRM & Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Property Outreach, Close Deals, Profit Calculator, Manage Relationships
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  <Building className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                  PMS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Streamline Property Management And Automate Operations
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-lg hover:border-purple-400/40 transition-all duration-300 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-lg">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-400 text-sm mb-4">
                  Join Our Network Of Rental Arbitrage Entrepreneurs
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
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
                    available is definitely something that gives you great confidence moving forward. If you have any question 
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
