
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, CheckCircle, AlertCircle, Settings } from 'lucide-react';

export const PlatformIntegrations = () => {
  const platforms = [
    {
      name: 'Airbnb',
      status: 'connected',
      listings: 8,
      revenue: '$12,400',
      sync: 'Real-time',
      color: 'bg-red-500',
      logo: '🏠'
    },
    {
      name: 'VRBO',
      status: 'connected',
      listings: 6,
      revenue: '$8,200',
      sync: 'Real-time',
      color: 'bg-blue-500',
      logo: '🏖️'
    },
    {
      name: 'Booking.com',
      status: 'connected',
      listings: 4,
      revenue: '$5,600',
      sync: 'Real-time',
      color: 'bg-blue-800',
      logo: '✈️'
    },
    {
      name: 'Expedia',
      status: 'disconnected',
      listings: 0,
      revenue: '$0',
      sync: 'Not synced',
      color: 'bg-yellow-500',
      logo: '🌟'
    }
  ];

  const integrationStats = {
    totalListings: platforms.reduce((sum, p) => sum + p.listings, 0),
    totalRevenue: platforms.reduce((sum, p) => sum + parseInt(p.revenue.replace(/[$,]/g, '')), 0),
    connectedPlatforms: platforms.filter(p => p.status === 'connected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Integrations</h1>
          <p className="text-gray-600">Manage your listings across multiple booking platforms</p>
        </div>
        <Button>
          <Link className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connected Platforms</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.connectedPlatforms}</p>
              </div>
              <Link className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{integrationStats.totalListings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${integrationStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{platform.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={platform.status === 'connected' ? 'default' : 'secondary'}
                        className={platform.status === 'connected' ? 'bg-green-600' : ''}
                      >
                        {platform.status === 'connected' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {platform.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {platform.sync}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {platform.status === 'connected' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Active Listings</p>
                      <p className="text-xl font-bold text-gray-900">{platform.listings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-xl font-bold text-gray-900">{platform.revenue}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Sync Now
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Listings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Connect to start syncing your listings</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Connect {platform.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { platform: 'Airbnb', action: 'Calendar synced', time: '2 minutes ago', status: 'success' },
              { platform: 'VRBO', action: 'New booking imported', time: '15 minutes ago', status: 'success' },
              { platform: 'Booking.com', action: 'Pricing updated', time: '1 hour ago', status: 'success' },
              { platform: 'Airbnb', action: 'Guest message received', time: '3 hours ago', status: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.platform}: {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
