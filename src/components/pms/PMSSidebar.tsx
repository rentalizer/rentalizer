
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  Calendar, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Zap,
  Link
} from 'lucide-react';

interface PMSSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const PMSSidebar = ({ activeView, setActiveView }: PMSSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'platforms', label: 'Platforms', icon: Link },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
          Menu
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
