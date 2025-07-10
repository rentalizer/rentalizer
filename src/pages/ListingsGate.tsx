import React from 'react';
import { AccessGate } from '@/components/AccessGate';
import { Listings } from './Listings';

const ListingsGate = () => {
  return (
    <AccessGate title="Property Listings" subtitle="Access your listings management">
      <Listings />
    </AccessGate>
  );
};

export default ListingsGate;