import React from 'react';
import { MapPin, Building, Headphones, Users } from 'lucide-react';
import { TestFeatureCard } from '@/components/TestFeatureCard';

interface TestFeatureGridProps {
  onFeatureClick: (feature: string) => void;
}

export const TestFeatureGrid = ({ onFeatureClick }: TestFeatureGridProps) => {
  const features = [
    {
      icon: MapPin,
      title: "Market Intelligence",
      description: "Find The Best Rental Arbitrage Markets",
      buttonText: "See Demo",
      feature: "market"
    },
    {
      icon: Building,
      title: "Acquisition CRM",
      description: "Contact Landlords & Close Deals",
      buttonText: "See Demo",
      feature: "acquisition"
    },
    {
      icon: Headphones,
      title: "Front Desk",
      description: "Property Management & Automations",
      buttonText: "See Demo",
      feature: "pms"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect With Other Rental Arbitrage Investors",
      buttonText: "See Demo",
      feature: "community"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8 mb-8">
      {features.map((feature) => (
        <TestFeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          buttonText={feature.buttonText}
          onClick={() => onFeatureClick(feature.feature)}
        />
      ))}
    </div>
  );
};