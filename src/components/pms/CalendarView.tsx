
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const properties = ['Downtown Loft', 'Beach House', 'Mountain Cabin'];
  
  const bookings = {
    '2024-12-10': [{ property: 'Downtown Loft', guest: 'John Smith', type: 'checkin' }],
    '2024-12-12': [{ property: 'Beach House', guest: 'Sarah Johnson', type: 'checkout' }],
    '2024-12-15': [{ property: 'Mountain Cabin', guest: 'Mike Chen', type: 'checkin' }],
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      if (days.length >= 42) break;
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Unified view of all your bookings across platforms</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Sync Calendars
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthYear}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((day, index) => {
              const dateStr = formatDate(day);
              const dayBookings = bookings[dateStr] || [];
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              
              return (
                <div 
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-100 ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-sm ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Bookings */}
                  <div className="mt-1 space-y-1">
                    {dayBookings.map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="text-xs">
                        <Badge 
                          variant={booking.type === 'checkin' ? 'default' : 'secondary'}
                          className="w-full text-xs p-1"
                        >
                          {booking.type === 'checkin' ? '→' : '←'} {booking.guest}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Properties Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((property, index) => (
              <div key={property} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <span className="text-sm font-medium">{property}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
