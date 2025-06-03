import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ArrowRight, LogIn, MapPin, Building, DollarSign, Users, TrendingUp, Calculator, Search, Home, Brain, Target, MessageSquare, Calendar, Star } from 'lucide-react';
import { LoginDialog } from '@/components/LoginDialog';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Test4 = () => {
  const navigate = useNavigate();

  const handleBookDemo = () => {
    console.log('Book Demo button clicked - opening Calendly popup');
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/richies-schedule/scale'
      });
    }
  };

  const testimonials = [
    {
      name: "Bishoi Mikhail",
      text: "Rentalizer has everything that you need in one program to get you set up and to be able to have a successful Airbnb business. Rentalizer helped me acquire 3 properties within 1 month of starting the program, each with only $200 deposits and 8 weeks free rent."
    },
    {
      name: "Bobby Han",
      text: "If you are thinking about getting into the short term rental business, Rentalizer's blueprint and all the templates available is definitely something that gives more confidence moving forward. If you have any question whether to join Rentalizer's program, I think you'll find it very beneficial."
    },
    {
      name: "Shante Davis",
      text: "Rentalizer's program is amazing. Rentalizer helped us close the largest apartment company in our area. We now have 6 properties. I recommend the mentorship. You won't be disappointed."
    },
    {
      name: "Maria Sallie Forte-Charette",
      text: "Thank you so much Rentalizer for sharing your knowledge and always promptly answering any questions, which helped me to close three new properties! I learned so much from our training and coaching."
    },
    {
      name: "Elena Ashley",
      text: "Rentalizer's program has meant the difference in my business from just being a hobby to moving it into an actual business."
    },
    {
      name: "Liz Garcia",
      text: "I just closed my first deal, thanks to Rentalizer's program!"
    },
    {
      name: "Marcus Thompson",
      text: "The AI market analysis tool is incredible. It helped me identify profitable markets I never would have considered before. I'm now managing 4 successful properties."
    },
    {
      name: "Sarah Chen",
      text: "Rentalizer's CRM made all the difference in my outreach. I went from getting ignored to closing deals within weeks. The templates and automation saved me hours every day."
    },
    {
      name: "David Rodriguez",
      text: "The community support is unmatched. Whenever I had questions, there was always someone ready to help. I've learned as much from other members as I have from the training materials."
    },
    {
      name: "Jessica Williams",
      text: "I was skeptical at first, but Rentalizer delivered on every promise. The profit calculator alone has saved me from making costly mistakes. Now I have 5 profitable properties."
    },
    {
      name: "Michael Johnson",
      text: "The mentorship and coaching calls were game-changers. Having access to experts who've been there before made the learning curve so much smoother. Highly recommend."
    },
    {
      name: "Amanda Foster",
      text: "Rentalizer turned my side hustle into a full-time income. The systematic approach and tools provided everything I needed to scale confidently. Best investment I've made."
    }
  ];

  const textMessages = [
    {
      id: 1,
      sender: "Bishoi",
      message: "Just signed 3 lease! Got them to give me 8 weeks concession on all 3 units :)\n1 bedrooms were $1280 each\n2 bedroom $2032\n\nParking is free and there is no car maximum per unit\n\nAll rooms are on the same floor and on the top floor of the building\n\nGot a 3X5 storage unit on the same floor as the rooms for $40 per month\n\nGarbage is a daily valet service included in the rent",
      image: "/lovable-uploads/e5dcd8f4-2858-4789-9448-f876221dedec.png"
    },
    {
      id: 2,
      sender: "Bishoi Mikhail",
      message: "Happy New Year to you too and your family! Rental Arbitrage is still going strong 💪. We have secured another 3 units in Nashville now that we are setting up this month :) Hopefully these ones do well as well! We will be at a total of 8 units :) How's it going on your end?",
      image: "/lovable-uploads/3ff6b265-2add-4f8e-9f58-2ffe760dc9a6.png"
    },
    {
      id: 3,
      sender: "Charlie & Britt",
      message: "@Britt Stewart was absolutely relentless. We have two leases officially signed, insured and now she is schedule furniture delivery and executing her shopping list\n\nUnits going live tonight using the generic photos. Will update after we have professional photos",
      image: "/lovable-uploads/0d9f9b9f-0e87-44b9-9fcd-070f6385b0b3.png"
    },
    {
      id: 4,
      sender: "Erica Williams",
      message: "Locked in My First Airbnb Deal 2 Units!\n\nI'm excited to share that I've officially secured my first corporate housing deal and it's TWO units! This journey has been full of learning, challenges, and breakthroughs, and I couldn't have done it without the mentorship and support of this community.\n\nA huge thank you to Richie for his guidance and for sharing the blueprint to make this possible. To anyone still working toward their first deal keep pushing! The right opportunity is out there, and when it comes, you'll be ready to take action. 🥳\n\nThis is just the beginning! Lets keep building and scaling together. #CorporateHousing #AirbnbJourney #FirstDeal #KeepGoing",
      image: "/lovable-uploads/fcf74d36-487a-4dca-bb60-87c5b306b7e0.png"
    },
    {
      id: 5,
      sender: "Mahmoud",
      message: "I signed the lease yesterday. I'm going today to pick up the keys",
      image: "/lovable-uploads/858e220e-58b7-4df0-a31b-5672f102d711.png"
    },
    {
      id: 6,
      sender: "Ngozi Iroezi",
      message: "Good news. I just talked to him again and got $1000 off first month's rent!\n\nI learned from you!",
      image: "/lovable-uploads/96681e6c-5660-4a76-b92b-93925842d15d.png"
    }
  ];

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Custom CSS for sequential flash animation */}
      <style>{`
        @keyframes flash-sequence {
          0%, 20% { 
            opacity: 1; 
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(168, 85, 247, 0.6);
          }
          25%, 100% { 
            opacity: 0.7; 
            transform: scale(1);
            box-shadow: 0 0 10px rgba(6, 182, 212, 0.3), 0 0 20px rgba(168, 85, 247, 0.2);
          }
        }
        
        .flash-feature-1 {
          animation: flash-sequence 8s infinite;
          animation-delay: 0s;
        }
        
        .flash-feature-2 {
          animation: flash-sequence 8s infinite;
          animation-delay: 2s;
        }
        
        .flash-feature-3 {
          animation: flash-sequence 8s infinite;
          animation-delay: 4s;
        }
        
        .flash-feature-4 {
          animation: flash-sequence 8s infinite;
          animation-delay: 6s;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-20 w-full border-b border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-cyan-400 neon-text" />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <LoginDialog 
                trigger={
                  <Button 
                    variant="outline"
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                }
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Main Content */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-16 w-16 text-cyan-400 neon-text" />
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h1>
            </div>
            <p className="text-lg text-white font-medium mb-8">By Richie Matthews</p>
            
            {/* Updated Tagline - two lines on desktop with larger text */}
            <div className="mb-12 px-4">
              <p className="text-2xl md:text-3xl lg:text-4xl text-white max-w-5xl mx-auto leading-relaxed font-semibold">
                AI-Powered Rental Arbitrage System, CRM, And Community<br className="hidden lg:block" />
                <span className="lg:block">—Everything You Need To Succeed</span>
              </p>
            </div>

            {/* Single Button Layout */}
            <div className="flex justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleBookDemo}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold min-w-[200px]"
              >
                <Calendar className="h-6 w-6 mr-3" />
                Book Demo
              </Button>
            </div>
          </div>

          {/* Animated Features Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1: Market Intelligence */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center flash-feature-1 transition-all duration-300">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <CardTitle className="text-xl font-bold text-cyan-300">Market Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The First-Of-Its-Kind AI Tool To Find The Best Rental Arbitrage Markets
                    </p>
                    <div className="mt-4 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 2: Acquisition CRM & Calculator */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center flash-feature-2 transition-all duration-300">
                        <Calculator className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-300">Acquisition CRM & Calculator</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Property Outreach, Close Deals, Profit Calculator, Manage Relationships
                    </p>
                    <div className="mt-4 flex justify-center space-x-1">
                      <div className="w-8 h-1 bg-purple-400 rounded animate-pulse"></div>
                      <div className="w-6 h-1 bg-cyan-400 rounded animate-pulse delay-200"></div>
                      <div className="w-10 h-1 bg-purple-300 rounded animate-pulse delay-400"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 3: PMS */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center flash-feature-3 transition-all duration-300">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <CardTitle className="text-xl font-bold text-cyan-300">PMS</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Streamline Property Management And Automate Operations
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-2 bg-cyan-400/50 rounded animate-pulse`} style={{animationDelay: `${i * 100}ms`}}></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature 4: Community */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 h-full group-hover:scale-105">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center flash-feature-4 transition-all duration-300">
                        <MessageSquare className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-300">Community</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Join Our Network Of Rental Arbitrage Entrepreneurs
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full border-2 border-slate-800 animate-pulse`} style={{animationDelay: `${i * 150}ms`}}></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Connecting Lines Animation */}
            <div className="hidden lg:block relative mt-8">
              <div className="absolute top-0 left-0 w-full h-px">
                <div className="absolute left-1/4 top-0 w-1/4 h-px bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-transparent animate-pulse"></div>
                <div className="absolute left-2/4 top-0 w-1/4 h-px bg-gradient-to-r from-purple-400/50 via-cyan-400/50 to-transparent animate-pulse delay-500"></div>
                <div className="absolute left-3/4 top-0 w-1/4 h-px bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-transparent animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              RENTALIZER.AI Combines AI POWERED Market Analysis, Deal Sourcing, And Automation Tools With A Built-In CRM And A Thriving Community—Everything You Need To Launch And Scale Your Rental Arbitrage Business.
            </p>
          </div>

          {/* Testimonials Section */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 whitespace-nowrap">
                Real Users Who've Unlocked Rental Income With Rentalizer
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <Card className="relative bg-slate-800/80 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full group-hover:scale-105">
                    <CardContent className="p-6">
                      {/* Testimonial Text */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 text-center italic">
                        "{testimonial.text}"
                      </p>

                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Author */}
                      <div className="text-center">
                        <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text Messages Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Real Messages From Our Successful Students
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            See the actual conversations and updates we receive from students who are building their rental arbitrage businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {textMessages.map((msg) => (
            <div key={msg.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="relative bg-slate-800/90 backdrop-blur-lg border border-green-500/30 hover:border-green-400/60 transition-all duration-500 h-full group-hover:scale-105">
                <CardContent className="p-6">
                  {/* Message Image */}
                  <div className="mb-6 rounded-lg overflow-hidden bg-slate-700/50 border border-slate-600/50">
                    <img 
                      src={msg.image} 
                      alt={`Message from ${msg.sender}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Sender Name */}
                  <div className="text-center">
                    <h4 className="text-green-300 font-semibold text-lg mb-2">{msg.sender}</h4>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-green-400 text-green-400" />
                      ))}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                    <p className="text-gray-300 text-sm leading-relaxed italic line-clamp-4">
                      "{msg.message.substring(0, 150)}..."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            These are just a few of the many success stories from our community. Ready to start your own journey?
          </p>
          <Button 
            size="lg"
            onClick={handleBookDemo}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-12 py-6 text-xl font-semibold"
          >
            <Calendar className="h-6 w-6 mr-3" />
            Book Your Demo Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer showLinks={false} />
    </div>
  );
};

export default Test4;
