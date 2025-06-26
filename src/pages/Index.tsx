
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MapPin, Building, Users, Calculator, Calendar, Star, Play } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">hospitable</div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
                Product
              </div>
              <div className="flex items-center text-gray-700 hover:text-blue-600 font-medium cursor-pointer">
                Resources
              </div>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Pricing
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                Log in
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start free trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Automate your
                  <span className="text-blue-600"> short-term rental</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The all-in-one platform that automates messaging, pricing, and operations
                  for Airbnb and vacation rental hosts.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.8/5 from 1,000+ reviews</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start free trial
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch demo
                </Button>
              </div>

              {/* Social Proof */}
              <p className="text-sm text-gray-500">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=500&h=300&fit=crop" 
                    alt="Dashboard Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
                <div className="text-sm font-semibold text-green-600">+23% Revenue</div>
                <div className="text-xs text-gray-500">This month</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
                <div className="text-sm font-semibold text-blue-600">Auto-messaging</div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to automate your rental
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From guest messaging to pricing optimization, Hospitable handles it all so you can focus on growing your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-gray-900 text-xl">
                  Guest Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Automated messaging that feels personal. Handle check-ins, questions, and reviews effortlessly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-gray-900 text-xl">
                  Dynamic Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Maximize revenue with AI-powered pricing that adjusts based on demand, events, and competition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-gray-900 text-xl">
                  Multi-Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Manage all your listings across Airbnb, Vrbo, Booking.com and more from one dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by thousands of hosts
            </h2>
            <p className="text-xl text-gray-600">
              See how Hospitable is helping hosts automate and grow their rental business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Hospitable has saved me 10+ hours per week. The automated messaging is incredible and my guests love the experience."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">12 properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The pricing optimization alone has increased my revenue by 23%. I can't imagine managing my rentals without it."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Mike Chen</p>
                    <p className="text-sm text-gray-500">8 properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, a platform that actually works. Setup was easy and the support team is amazing. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
                    <p className="text-sm text-gray-500">5 properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to automate your rental business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of hosts who are saving time and making more money with Hospitable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start free trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch demo
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer showLinks={false} />
    </div>
  );
};

export default Index;
