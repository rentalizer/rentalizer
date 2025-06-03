import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  MessageCircle,
  Home,
  Settings,
  Bell,
  Send,
  Plus,
  Edit,
  Trash2,
  Link,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  Search,
  BarChart3,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

const PMS = () => {
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Enhanced mock data with more properties and details
  const properties = [
    { 
      id: 1, 
      name: "Downtown Loft", 
      platform: "Airbnb", 
      status: "occupied", 
      guests: 2, 
      checkIn: "2024-06-01", 
      checkOut: "2024-06-05",
      revenue: 3200,
      rating: 4.9,
      bookings: 23,
      occupancy: 85
    },
    { 
      id: 2, 
      name: "Beach House", 
      platform: "VRBO", 
      status: "cleaning", 
      guests: 0, 
      checkIn: "2024-06-06", 
      checkOut: "2024-06-10",
      revenue: 4100,
      rating: 4.8,
      bookings: 18,
      occupancy: 78
    },
    { 
      id: 3, 
      name: "Mountain Cabin", 
      platform: "Booking.com", 
      status: "available", 
      guests: 0, 
      checkIn: null, 
      checkOut: null,
      revenue: 2800,
      rating: 4.7,
      bookings: 15,
      occupancy: 72
    },
    { 
      id: 4, 
      name: "City Apartment", 
      platform: "Airbnb", 
      status: "maintenance", 
      guests: 0, 
      checkIn: "2024-06-08", 
      checkOut: "2024-06-12",
      revenue: 2900,
      rating: 4.6,
      bookings: 20,
      occupancy: 82
    },
    { 
      id: 5, 
      name: "Luxury Suite", 
      platform: "VRBO", 
      status: "occupied", 
      guests: 4, 
      checkIn: "2024-06-03", 
      checkOut: "2024-06-08",
      revenue: 5200,
      rating: 4.9,
      bookings: 12,
      occupancy: 90
    }
  ];

  const enhancedMessages = [
    { 
      id: 1, 
      propertyId: 1, 
      guest: "John Smith", 
      platform: "Airbnb", 
      message: "Hi! What time is check-in? Also, is there parking available?", 
      time: "10:30 AM", 
      unread: true,
      type: "question",
      priority: "medium"
    },
    { 
      id: 2, 
      propertyId: 2, 
      guest: "Sarah Johnson", 
      platform: "VRBO", 
      message: "Thank you for the amazing stay! Everything was perfect.", 
      time: "Yesterday", 
      unread: false,
      type: "review",
      priority: "low"
    },
    { 
      id: 3, 
      propertyId: 1, 
      guest: "Mike Chen", 
      platform: "Airbnb", 
      message: "The WiFi password isn't working. Can you help?", 
      time: "2 hours ago", 
      unread: true,
      type: "issue",
      priority: "high"
    },
    { 
      id: 4, 
      propertyId: 4, 
      guest: "Lisa Garcia", 
      platform: "Booking.com", 
      message: "Can I check in early? My flight arrived ahead of schedule.", 
      time: "1 hour ago", 
      unread: true,
      type: "request",
      priority: "medium"
    },
    { 
      id: 5, 
      propertyId: 5, 
      guest: "David Wilson", 
      platform: "VRBO", 
      message: "Is it possible to extend my stay by one more night?", 
      time: "30 min ago", 
      unread: true,
      type: "request",
      priority: "medium"
    }
  ];

  // Mock data
  const messages = [
    { id: 1, propertyId: 1, guest: "John Smith", platform: "Airbnb", message: "Hi! What time is check-in?", time: "10:30 AM", unread: true },
    { id: 2, propertyId: 2, guest: "Sarah Johnson", platform: "VRBO", message: "Thank you for the stay!", time: "Yesterday", unread: false },
    { id: 3, propertyId: 1, guest: "Mike Chen", platform: "Airbnb", message: "Is there parking available?", time: "2 hours ago", unread: true },
    { id: 4, propertyId: 4, guest: "Lisa Garcia", platform: "Booking.com", message: "Can I check in early?", time: "1 hour ago", unread: true }
  ];

  const cannedMessages = [
    { id: 1, title: "Check-in Instructions", message: "Welcome! Check-in is at 3 PM. The lockbox code is 1234." },
    { id: 2, title: "WiFi Information", message: "WiFi: PropertyGuest, Password: Welcome123" },
    { id: 3, title: "Check-out Reminder", message: "Check-out is at 11 AM. Please leave keys in lockbox." },
    { id: 4, title: "House Rules", message: "No smoking, no pets, quiet hours 10 PM - 8 AM." }
  ];

  const autoMessages = [
    { id: 1, trigger: "Booking Confirmed", delay: "Immediate", message: "Welcome! Your booking is confirmed." },
    { id: 2, trigger: "1 Day Before Check-in", delay: "24 hours", message: "Check-in reminder with instructions." },
    { id: 3, trigger: "Check-in Day", delay: "3 hours before", message: "Check-in instructions and property details." },
    { id: 4, trigger: "Check-out Day", delay: "Morning of", message: "Check-out reminder and thank you message." }
  ];

  const enhancedCalendarEvents = [
    { date: "2024-06-01", property: "Downtown Loft", type: "checkin", guest: "John Smith", revenue: 280 },
    { date: "2024-06-05", property: "Downtown Loft", type: "checkout", guest: "John Smith", revenue: 0 },
    { date: "2024-06-06", property: "Beach House", type: "checkin", guest: "Sarah Johnson", revenue: 350 },
    { date: "2024-06-08", property: "City Apartment", type: "maintenance", guest: "Cleaning Crew", revenue: -80 },
    { date: "2024-06-10", property: "Beach House", type: "checkout", guest: "Sarah Johnson", revenue: 0 },
    { date: "2024-06-12", property: "Mountain Cabin", type: "checkin", guest: "Family Group", revenue: 320 }
  ];

  const analytics = {
    totalRevenue: 18200,
    monthlyGrowth: 12.5,
    averageRating: 4.78,
    totalBookings: 88,
    occupancyRate: 81.4,
    responseTime: "12 min"
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-blue-600';
      case 'cleaning': return 'bg-yellow-600';
      case 'available': return 'bg-cyan-600';
      case 'maintenance': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Airbnb': return 'bg-red-100 text-red-800 border-red-200';
      case 'VRBO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Booking.com': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Property Management System
              </h1>
              <p className="text-gray-300 text-lg">
                Manage all your short-term rental properties from one unified dashboard
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
              <Button variant="outline" className="border-gray-600">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyan-600">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-cyan-600">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-cyan-600">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-cyan-600">
              <Home className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-cyan-600">
              <Bell className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-cyan-600">
              <Link className="h-4 w-4 mr-2" />
              Platforms
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <Card className="bg-gray-900/80 border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-300 text-sm">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">${analytics.totalRevenue.toLocaleString()}</div>
                  <p className="text-cyan-400 text-sm flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analytics.monthlyGrowth}% this month
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/80 border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-300 text-sm">Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{properties.length}</div>
                  <p className="text-gray-400 text-sm">Active listings</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-300 text-sm">Occupied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {properties.filter(p => p.status === 'occupied').length}
                  </div>
                  <p className="text-gray-400 text-sm">Currently hosting</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-yellow-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-300 text-sm">Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {enhancedMessages.filter(m => m.unread).length}
                  </div>
                  <p className="text-gray-400 text-sm">Unread</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-300 text-sm">Avg Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white flex items-center">
                    {analytics.averageRating}
                    <Star className="h-5 w-5 text-orange-400 ml-1" />
                  </div>
                  <p className="text-gray-400 text-sm">Across all properties</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-300 text-sm">Occupancy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{analytics.occupancyRate}%</div>
                  <p className="text-gray-400 text-sm">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Property Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/80 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Property Performance
                    <Button variant="outline" size="sm" className="border-gray-600">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(property.status)}`} />
                          <div>
                            <h4 className="font-medium text-white">{property.name}</h4>
                            <p className="text-gray-400 text-sm">{property.occupancy}% occupancy</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">${property.revenue}</div>
                          <div className="text-gray-400 text-sm">{property.rating} ⭐</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-600/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white">David Wilson checked into Luxury Suite</p>
                        <p className="text-gray-400 text-sm">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyan-600/20 rounded-full">
                        <MessageCircle className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white">New high-priority message from Mike Chen</p>
                        <p className="text-gray-400 text-sm">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-600/20 rounded-full">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white">Beach House cleaning scheduled</p>
                        <p className="text-gray-400 text-sm">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-600/20 rounded-full">
                        <Star className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white">5-star review received for Mountain Cabin</p>
                        <p className="text-gray-400 text-sm">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search messages..." 
                  className="bg-gray-800/50 border-gray-600"
                  prefix={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <Button variant="outline" className="border-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/80 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Guest Messages
                    <div className="flex gap-2">
                      <Badge className="bg-red-600">{enhancedMessages.filter(m => m.unread && m.priority === 'high').length} urgent</Badge>
                      <Badge className="bg-yellow-600">{enhancedMessages.filter(m => m.unread).length} total</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {enhancedMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          message.unread ? 'bg-cyan-900/30 border border-cyan-500/30' : 'bg-gray-800/50'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{message.guest}</span>
                            <Badge className={getPlatformColor(message.platform)}>
                              {message.platform}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                          </div>
                          <span className="text-gray-400 text-sm">{message.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{message.message}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                            <Send className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Eye className="h-3 w-3 mr-1" />
                            View Property
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Canned Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cannedMessages.map((template) => (
                      <div key={template.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{template.title}</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{template.message}</p>
                      </div>
                    ))}
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-gray-900/80 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Unified Calendar</CardTitle>
                <p className="text-gray-400">All bookings across platforms in one view</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-gray-400 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const event = enhancedCalendarEvents.find(e => e.date === dateStr);
                    
                    return (
                      <div key={i} className="h-24 p-1 border border-gray-700 rounded">
                        <div className="text-gray-300 text-sm mb-1">{date.getDate()}</div>
                        {event && (
                          <div className={`text-xs p-1 rounded ${
                            event.type === 'checkin' ? 'bg-green-600/20 text-green-300' :
                            event.type === 'checkout' ? 'bg-red-600/20 text-red-300' :
                            'bg-yellow-600/20 text-yellow-300'
                          }`}>
                            {event.type === 'checkin' ? 'Check-in' : 
                             event.type === 'checkout' ? 'Check-out' : 'Maintenance'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card className="bg-gray-900/80 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Property Listings
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{property.name}</h3>
                        <Badge className={`${getStatusColor(property.status)} text-white`}>
                          {property.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Platform:</span>
                          <Badge className={getPlatformColor(property.platform)}>
                            {property.platform}
                          </Badge>
                        </div>
                        {property.guests > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Current Guests:</span>
                            <span className="text-white">{property.guests}</span>
                          </div>
                        )}
                        {property.checkIn && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Check-in:</span>
                            <span className="text-white">{property.checkIn}</span>
                          </div>
                        )}
                        {property.checkOut && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Check-out:</span>
                            <span className="text-white">{property.checkOut}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-900/80 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Automated Messages</CardTitle>
                <p className="text-gray-400">Set up automatic guest communications</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autoMessages.map((auto) => (
                    <div key={auto.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{auto.trigger}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">{auto.delay}</Badge>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{auto.message}</p>
                    </div>
                  ))}
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Automation Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-gray-900/80 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white">Connected Platforms</CardTitle>
                <p className="text-gray-400">Manage your booking platform integrations</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">Airbnb</h3>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">2 properties synced</p>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">VRBO</h3>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">1 property synced</p>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">Booking.com</h3>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">1 property synced</p>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-white font-medium mb-4">Available Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                      <h5 className="font-medium text-white mb-2">Expedia</h5>
                      <p className="text-gray-400 text-sm mb-3">Connect your Expedia listings</p>
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">
                        <Link className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                    <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                      <h5 className="font-medium text-white mb-2">TripAdvisor</h5>
                      <p className="text-gray-400 text-sm mb-3">Sync TripAdvisor rentals</p>
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600">
                        <Link className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PMS;
