
import React from 'react';
import { ContentManager as ContentManagerComponent } from '@/components/ContentManager';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

const ContentManager = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavBar />
      <main className="flex-1 py-8">
        <ContentManagerComponent />
      </main>
      <Footer />
    </div>
  );
};

export default ContentManager;
