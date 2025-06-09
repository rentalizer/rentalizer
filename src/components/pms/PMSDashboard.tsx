
import React, { useState } from 'react';
import { PMSNavbar } from './PMSNavbar';
import { PMSSidebar } from './PMSSidebar';
import { DashboardOverview } from './DashboardOverview';
import { PropertyManagement } from './PropertyManagement';
import { CalendarView } from './CalendarView';
import { MessagingCenter } from './MessagingCenter';
import { AutomationCenter } from './AutomationCenter';
import { PlatformIntegrations } from './PlatformIntegrations';

export const PMSDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'properties':
        return <PropertyManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'messages':
        return <MessagingCenter />;
      case 'automation':
        return <AutomationCenter />;
      case 'platforms':
        return <PlatformIntegrations />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <PMSSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PMSNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
