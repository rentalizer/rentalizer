
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Calculator, Building, Users, Target, Calendar, Star } from 'lucide-react';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1929 0%, #1e3a5f 50%, #0a1929 100%)' }}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-cyan-400" />
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
          Login
        </Button>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-12 w-12 text-cyan-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            RENTALIZER
          </h1>
        </div>
        
        <p className="text-slate-300 mb-8">By Richie Matthews</p>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 max-w-4xl leading-tight">
          All-in-One AI Platform to Launch and Scale a Rental Arbitrage Business
        </h2>
        
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg mb-16">
          <Calendar className="mr-2 h-4 w-4" />
          Book Demo
        </Button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mb-16">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Market Intelligence</h3>
              <p className="text-sm text-slate-300 mb-4">
                The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Acquisition CRM & Calculator</h3>
              <p className="text-sm text-slate-300 mb-4">
                Property Outreach, Close Deals, Profit Calculator, Manage Relationships
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-8 h-1 rounded-full bg-purple-400"></div>
                <div className="w-8 h-1 rounded-full bg-blue-400"></div>
                <div className="w-8 h-1 rounded-full bg-cyan-400"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">PMS</h3>
              <p className="text-sm text-slate-300 mb-4">
                Streamline Property Management And Automate Operations
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-12 h-1 rounded-full bg-cyan-400"></div>
                <div className="w-8 h-1 rounded-full bg-blue-400"></div>
                <div className="w-16 h-1 rounded-full bg-purple-400"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Community</h3>
              <p className="text-sm text-slate-300 mb-4">
                Join Our Network Of Rental Arbitrage Entrepreneurs
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <p className="text-slate-300 max-w-4xl text-center mb-16 leading-relaxed">
          RENTALIZER.AI Combines AI POWERED Market Analysis, Deal Sourcing, And Automation Tools With A 
          Built-In CRM And A Thriving Community—Everything You Need To Launch And Scale Your Rental 
          Arbitrage Business.
        </p>

        {/* Testimonials Section */}
        <div className="w-full max-w-7xl">
          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-12">
            Real Users Who've Unlocked Rental Income With Rentalizer
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm">
                  "Rentalizer has everything that you need in one program to get you set up and to be able to have a successful Airbnb business. Rentalizer helped me acquire 5 properties within 1 month of starting the program, each with only $200 deposits and 3 weeks free rent."
                </p>
                <p className="font-semibold text-white">Bishoi Mikhail</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm">
                  "If you are thinking about getting into the short term rental business, Rentalizer's blueprint and all the templates available is definitely something that gives more confidence moving forward. If you have any question whether to join Rentalizer's program, I think you'll find it very beneficial."
                </p>
                <p className="font-semibold text-white">Bobby Han</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-sm">
                  "Rentalizer's program is amazing. Rentalizer helped us close the largest apartment company in our area. We now have 6 properties. I recommend the mentorship. You won't be disappointed."
                </p>
                <p className="font-semibold text-white">Shante Davis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer showLinks={false} />
    </div>
  );
};

export default Index;
