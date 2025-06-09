
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, DollarSign, Calendar, BarChart3, Shield, Zap } from 'lucide-react';

export const HospitableFeatures = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Automated Messaging',
      description: 'AI-powered guest communication that handles inquiries, bookings, and check-ins automatically.',
    },
    {
      icon: DollarSign,
      title: 'Dynamic Pricing',
      description: 'Optimize your rates with market-based pricing that adapts to demand, seasonality, and competition.',
    },
    {
      icon: Calendar,
      title: 'Channel Management',
      description: 'Sync your listings across Airbnb, Booking.com, VRBO, and 20+ other platforms.',
    },
    {
      icon: BarChart3,
      title: 'Revenue Analytics',
      description: 'Track performance with detailed insights on bookings, revenue, and guest satisfaction.',
    },
    {
      icon: Shield,
      title: 'Guest Screening',
      description: 'Advanced screening tools to identify and prevent problematic guests before they book.',
    },
    {
      icon: Zap,
      title: 'Task Automation',
      description: 'Automate cleaning schedules, maintenance requests, and property inspections.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to scale your rental business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From automated guest communication to dynamic pricing, 
            Hospitable provides all the tools successful hosts need in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join 50,000+ hosts who trust Hospitable
            </h3>
            <p className="text-gray-600 mb-6">
              Start automating your rental business today with our 14-day free trial.
            </p>
            <div className="flex justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                Get started for free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
