import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, ArrowLeft, MapPin, Calculator, User, DollarSign, CheckCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const Demo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Market Intelligence",
      description: "Find the best rental arbitrage markets with AI-powered analysis",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop"
    },
    {
      icon: Calculator,
      title: "ROI Calculator",
      description: "Assess property profitability and return on investment instantly",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      icon: User,
      title: "Acquisitions Agent",
      description: "AI agent to contact landlords and close deals automatically",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"
    },
    {
      icon: DollarSign,
      title: "Property Management",
      description: "Automated front desk operations and guest communications",
      thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"
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
      quote: "In my first month, I made $4,800 in profit. By month 3, I was consistently making $8,000+ per month. The system works if you follow it.",
      author: "Marcus Johnson",
      title: "Former Corporate Manager"
    },
    {
      quote: "I went from zero real estate knowledge to $12,000/month in rental arbitrage within 6 months. The training gave me everything I needed.",
      author: "Sarah Chen",
      title: "Teacher Turned Entrepreneur"
    },
    {
      quote: "Started with $5,000 and now I'm pulling in $15,000/month from 8 properties. This completely changed my family's financial future.",
      author: "David Rodriguez",
      title: "Former Restaurant Worker"
    },
    {
      quote: "I replaced my $75,000 salary in 10 months. Now I'm making $18,000/month and have complete time freedom.",
      author: "Jennifer Kim",
      title: "Ex-Marketing Director"
    },
    {
      quote: "The market analysis tools helped me find profitable markets nobody else was targeting. I'm now earning $9,500/month consistently.",
      author: "Robert Thompson",
      title: "Retired Veteran"
    },
    {
      quote: "From struggling to pay bills to earning $22,000/month. Rental arbitrage gave me the financial freedom I never thought was possible.",
      author: "Maria Santos",
      title: "Single Mother"
    },
    {
      quote: "The automation systems save me 25+ hours per week. I focus on growth while earning $14,000/month mostly passively.",
      author: "Alex Parker",
      title: "Working Dad"
    },
    {
      quote: "I scaled from 1 to 15 properties in 18 months using the exact strategies taught. The systematic approach is everything.",
      author: "Lisa Washington",
      title: "Former Nurse"
    },
    {
      quote: "Started in college and now I'm earning $11,200/month while traveling. This business model changed my entire life trajectory.",
      author: "Tyler Brooks",
      title: "Recent Graduate"
    },
    {
      quote: "The ROI calculator helped me avoid costly mistakes and focus only on profitable deals. Now consistently earning $16,500/month.",
      author: "Christine Lee",
      title: "Former Accountant"
    },
    {
      quote: "From zero experience to $13,800/month in 14 months. The step-by-step training made what seemed impossible, achievable.",
      author: "James Wilson",
      title: "Former Sales Rep"
    },
    {
      quote: "I thought rental arbitrage was too good to be true until I started making $10,600/month. Now I'm a believer and helping others do the same.",
      author: "Amanda Foster",
      title: "Former Retail Manager"
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

          {/* Features Overview with Thumbnails */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8">What You'll See in the Demo</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg hover:border-cyan-400/40 transition-all duration-300 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={feature.thumbnail} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent"></div>
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-cyan-400" />
                    </div>
                  </div>
                  
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-cyan-300 text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
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
              
              {/* Testimonials Carousel with Autoplay - Centered */}
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Success Stories
                </h3>
                <div className="w-full max-w-md">
                  <Carousel 
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 4000,
                      }),
                    ]}
                  >
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
