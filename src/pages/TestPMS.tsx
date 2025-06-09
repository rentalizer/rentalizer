
import React from 'react';
import { HospitableNavbar } from '@/components/hospitable/HospitableNavbar';
import { HospitableHero } from '@/components/hospitable/HospitableHero';
import { HospitableFeatures } from '@/components/hospitable/HospitableFeatures';
import { HospitablePricing } from '@/components/hospitable/HospitablePricing';
import { HospitableFooter } from '@/components/hospitable/HospitableFooter';

const TestPMS = () => {
  return (
    <div className="min-h-screen bg-white">
      <HospitableNavbar />
      <HospitableHero />
      <HospitableFeatures />
      <HospitablePricing />
      <HospitableFooter />
    </div>
  );
};

export default TestPMS;
