
import React from 'react';
import { CustomerChat } from '@/components/customer/CustomerChat';
import { KnowledgeBaseProvider } from '@/contexts/KnowledgeBaseContext';

const CustomerInterface = () => {
  return (
    <KnowledgeBaseProvider>
      <CustomerChat />
    </KnowledgeBaseProvider>
  );
};

export default CustomerInterface;
