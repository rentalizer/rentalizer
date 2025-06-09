
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Home, Users, Star, TrendingUp, AlertCircle } from 'lucide-react';

export const DashboardOverview = () => {
  const stats = [
    {
      title: 'Monthly Revenue',
      value: '$18,247',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Properties',
      value: '12',
      change: '+2',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      title: 'Current Guests',
      value: '8',
      change: '75% occupancy',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const recentBookings = [
    { guest: 'John Smith', property: 'Downtown Loft', checkin: 'Today', status: 'confirmed' },
    { guest: 'Sarah Johnson', property: 'Beach House', checkin: 'Tomorrow', status: 'pending' },
    { guest: 'Mike Chen', property: 'Mountain Cabin', checkin: 'Dec 15', status: 'confirmed' },
  ];

  const alerts = [
    { type: 'urgent', message: 'WiFi issue reported at Downtown Loft' },
    { type: 'info', message: 'New booking for Beach House' },
    { type: 'warning', message: 'Cleaning scheduled for Mountain Cabin' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.guest}</p>
                    <p className="text-sm text-gray-600">{booking.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{booking.checkin}</p>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'urgent' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
