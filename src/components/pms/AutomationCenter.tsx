import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Settings, Zap, Clock, MessageSquare, DollarSign } from 'lucide-react';

export const AutomationCenter = () => {
  const automations = [
    {
      id: 1,
      name: 'Welcome Message',
      description: 'Send welcome message immediately after booking confirmation',
      type: 'messaging',
      active: true,
      triggers: 'Booking confirmed',
      platforms: ['Airbnb', 'VRBO', 'Booking.com']
    },
    {
      id: 2,
      name: 'Check-in Instructions',
      description: 'Send check-in details 24 hours before arrival',
      type: 'messaging',
      active: true,
      triggers: '24h before check-in',
      platforms: ['All platforms']
    },
    {
      id: 3,
      name: 'Review Request',
      description: 'Request review 2 days after checkout',
      type: 'messaging',
      active: false,
      triggers: '2 days after checkout',
      platforms: ['Airbnb', 'VRBO']
    },
    {
      id: 4,
      name: 'Price Optimization',
      description: 'Automatically adjust prices based on demand and competition',
      type: 'pricing',
      active: true,
      triggers: 'Daily at 6 AM',
      platforms: ['All platforms']
    },
    {
      id: 5,
      name: 'Cleaning Schedule',
      description: 'Schedule cleaning after each checkout',
      type: 'operations',
      active: true,
      triggers: 'Guest checkout',
      platforms: ['Internal']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'messaging': return MessageSquare;
      case 'pricing': return DollarSign;
      case 'operations': return Settings;
      default: return Zap;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'messaging': return 'bg-blue-100 text-blue-800';
      case 'pricing': return 'bg-green-100 text-green-800';
      case 'operations': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Center</h1>
          <p className="text-gray-600">Set up automated workflows to save time and improve guest experience</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Automations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automations.filter(a => a.active).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-gray-900">18.5h</p>
                <p className="text-sm text-purple-600">This month</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => {
              const Icon = getTypeIcon(automation.type);
              return (
                <div 
                  key={automation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(automation.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{automation.name}</h3>
                        <Badge variant={automation.active ? 'default' : 'secondary'}>
                          {automation.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Trigger: {automation.triggers}</span>
                        <span>Platforms: {automation.platforms.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Switch checked={automation.active} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
