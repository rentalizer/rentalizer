import React from 'react';
import { AccessGate } from '@/components/AccessGate';
import { Listings } from './Listings';

const ListingsGate = () => {
  // Check if we're in Lovable environment
  const isLovableEnv = window.location.hostname.includes('lovableproject.com') || 
                       window.location.search.includes('__lovable_token') ||
                       window.location.hostname === 'localhost';

  // If in Lovable environment, bypass authentication
  if (isLovableEnv) {
    return <Listings />;
  }

  return (
    <AccessGate title="Property Listings" subtitle="Access your listings management">
      <Listings />
    </AccessGate>
  );
};

export default ListingsGate;