
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, ArrowLeft, MapPin, Calculator, User, DollarSign, CheckCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Demo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Market Intelligence",
      description: "Find the best rental arbitrage markets with AI-powered analysis"
    },
    {
      icon: Calculator,
      title: "ROI Calculator",
      description: "Assess property profitability and return on investment instantly"
    },
    {
      icon: User,
      title: "Acquisitions Agent",
      description: "AI agent to contact landlords and close deals automatically"
    },
    {
      icon: DollarSign,
      title: "Property Management",
      description: "Automated front desk operations and guest communications"
    }
  ];

  const benefits = [
    "No mortgage required - start with rental arbitrage",
    "AI-powered market analysis and deal sourcing",
    "Automated guest communication and management",
    "Proven ROI calculation and profit optimization",
    "24/7 property management automation"
  ];

  const testimonials = [
    {
      quote: "I went from zero to $8,000/month in rental income within 4 months using rental arbitrage. The key was finding the right markets and landlords.",
      author: "Sarah M.",
      title: "Real Estate Entrepreneur"
    },
    {
      quote: "Rental arbitrage completely changed my life. I'm now earning $12,000/month from 6 properties without owning any of them.",
      author: "Michael R.",
      title: "Former Software Engineer"
    },
    {
      quote: "Started with just $3,000 and now I'm making $15,000/month. The automation tools made all the difference in scaling.",
      author: "Jessica L.",
      title: "Stay-at-Home Mom"
    },
    {
      quote: "I replaced my corporate salary in 8 months. Now earning $18,000/month with 10 rental arbitrage units across 3 cities.",
      author: "David K.",
      title: "Former Marketing Director"
    },
    {
      quote: "The market analysis helped me identify untapped opportunities. I'm now earning $6,500/month from just 3 properties.",
      author: "Amanda T.",
      title: "Teacher Turned Entrepreneur"
    },
    {
      quote: "Rental arbitrage gave me financial freedom. I went from struggling to pay bills to earning $22,000/month consistently.",
      author: "Robert C.",
      title: "Former Retail Manager"
    },
    {
      quote: "The automated systems saved me 20+ hours per week. Now I focus on growth while earning $14,000/month passively.",
      author: "Lisa P.",
      title: "Working Mother"
    },
    {
      quote: "I scaled from 1 to 12 properties in 18 months. The key was systemizing everything from day one.",
      author: "James W.",
      title: "Former Accountant"
    },
    {
      quote: "Rental arbitrage allowed me to quit my 9-5 and travel while earning $9,500/month from anywhere in the world.",
      author: "Emily D.",
      title: "Digital Nomad"
    },
    {
      quote: "Started during college and now earning $7,200/month. This business model changed my entire future trajectory.",
      author: "Tyler N.",
      title: "College Graduate"
    },
    {
      quote: "The ROI calculator helped me avoid bad deals and focus on winners. Now consistently earning $16,000/month.",
      author: "Maria G.",
      title: "Former Nurse"
    },
    {
      quote: "From zero real estate experience to $11,000/month in 10 months. The training and tools made it possible.",
      author: "Chris H.",
      title: "Former Sales Rep"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-8 text-cyan-300 hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER DEMO
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
            <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Book A Personalized Demo To See How Rentalizer Can Help You Earn Rental Income Without A Mortgage
            </p>
          </div>

          {/* Features Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8">What You'll See in the Demo</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-cyan-500/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <CardTitle className="text-cyan-300 text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-cyan-300 mb-6">Why Choose Rentalizer?</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Testimonials Carousel */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Success Stories
                </h3>
                <Carousel className="w-full max-w-md mx-auto">
                  <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                      <CarouselItem key={index}>
                        <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-lg">
                          <CardContent className="p-6">
                            <blockquote className="text-slate-300 italic mb-4 text-sm leading-relaxed">
                              "{testimonial.quote}"
                            </blockquote>
                            <div className="text-right">
                              <p className="text-cyan-400 font-medium text-sm">{testimonial.author}</p>
                              <p className="text-slate-500 text-xs">{testimonial.title}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
            </div>
          </div>

          {/* Demo Booking Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-cyan-300 flex items-center justify-center gap-3">
                  <Calendar className="h-8 w-8" />
                  Schedule Your Personalized Demo
                </CardTitle>
                <p className="text-slate-400 mt-2">
                  Book a 30-minute call to see Rentalizer in action and learn how it can work for your situation
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[700px] w-full">
                  <iframe
                    src="https://calendly.com/richies-schedule/scale"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Schedule Demo Call"
                    className="rounded-b-lg"
                    onLoad={() => console.log('Calendly iframe loaded successfully')}
                    onError={(e) => console.error('Calendly iframe error:', e)}
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
