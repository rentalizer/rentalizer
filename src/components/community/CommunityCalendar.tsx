
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees?: number;
  isRecurring?: boolean;
}

export const CommunityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample events including weekly trainings
  const events: Event[] = [
    {
      id: '1',
      title: 'Weekly Live Training',
      date: new Date(2025, 5, 3), // June 3rd
      time: '5:00 PM PST',
      type: 'training',
      attendees: 45,
      isRecurring: true
    },
    {
      id: '2',
      title: 'Market Research Deep Dive',
      date: new Date(2025, 5, 5),
      time: '4:00 PM PST',
      type: 'webinar',
      attendees: 32
    },
    {
      id: '3',
      title: 'Weekly Live Training',
      date: new Date(2025, 5, 10),
      time: '5:00 PM PST',
      type: 'training',
      attendees: 38,
      isRecurring: true
    },
    {
      id: '4',
      title: 'Competitor Analysis Workshop',
      date: new Date(2025, 5, 12),
      time: '4:00 PM PST',
      type: 'workshop',
      attendees: 28
    },
    {
      id: '5',
      title: 'Weekly Live Training',
      date: new Date(2025, 5, 17),
      time: '5:00 PM PST',
      type: 'training',
      attendees: 41,
      isRecurring: true
    },
    {
      id: '6',
      title: 'Hosting Revenue Optimization',
      date: new Date(2025, 5, 19),
      time: '4:00 PM PST',
      type: 'webinar',
      attendees: 35
    },
    {
      id: '7',
      title: 'Weekly Live Training',
      date: new Date(2025, 5, 24),
      time: '5:00 PM PST',
      type: 'training',
      attendees: 42,
      isRecurring: true
    },
    {
      id: '8',
      title: 'Property Listing Strategies',
      date: new Date(2025, 5, 26),
      time: '4:00 PM PST',
      type: 'workshop',
      attendees: 29
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'training': return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'webinar': return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'workshop': return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
      case 'discussion': return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'training': return <Video className="h-4 w-4" />;
      case 'webinar': return <Video className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'discussion': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Get the first day of the month and calculate calendar grid
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  // Add previous month's days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i);
    calendarDays.push({ date, isCurrentMonth: false });
  }
  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  // Add next month's days to fill the grid
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Calendar */}
      <div className="lg:col-span-3">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              Events Calendar
            </CardTitle>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </CardHeader>
          <CardContent>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="border-cyan-500/30 text-cyan-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-semibold text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="border-cyan-500/30 text-cyan-300"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((calendarDay, index) => {
                const { date, isCurrentMonth } = calendarDay;
                const hasEvents = getEventsForDate(date).length > 0;
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      h-16 p-2 text-sm rounded-lg border transition-colors relative flex flex-col items-center justify-center
                      ${isSelected 
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' 
                        : 'border-gray-700 hover:border-cyan-500/50 hover:bg-slate-700/50'
                      }
                      ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                      ${isToday && !isSelected ? 'bg-slate-700/50 border-cyan-400/50' : ''}
                    `}
                  >
                    <span className="font-medium">{date.getDate()}</span>
                    {hasEvents && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-300">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-4 bg-slate-700/30 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{event.title}</h4>
                      {event.isRecurring && (
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs">
                          Weekly
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventIcon(event.type)}
                          <span className="ml-1 capitalize">{event.type}</span>
                        </Badge>
                      </div>
                      
                      {event.attendees && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users className="h-4 w-4" />
                          {event.attendees} attending
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                    >
                      Join Event
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-lg font-medium mb-2">No events scheduled for this date</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
