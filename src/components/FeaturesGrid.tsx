
import React from 'react';
import { MapPin, Building, Users, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '@/components/FeatureCard';

export const FeaturesGrid = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: "Market Intelligence",
      description: "Find The Best Rental Arbitrage Markets",
      buttonText: "Market Intelligence",
      path: "/markets"
    },
    {
      icon: Building,
      title: "Acquisition CRM",
      description: "Contact Landlords & Close Deals",
      buttonText: "Acquisition CRM",
      path: "/properties"
    },
    {
      icon: Headphones,
      title: "Front Desk",
      description: "Property Management & Automations",
      buttonText: "Front Desk",
      path: "/front-desk"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect With Other Rental Arbitrage Investors",
      buttonText: "Community",
      path: "/community"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8 mb-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          buttonText={feature.buttonText}
          onClick={() => navigate(feature.path)}
        />
      ))}
    </div>
  );
};
