
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';

export const HospitableHero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
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
  );
};
