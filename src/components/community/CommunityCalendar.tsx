
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video, CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAdminRole } from '@/hooks/useAdminRole';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees?: number;
  isRecurring?: boolean;
  description?: string;
  location?: string;
  duration?: string;
}

export const CommunityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { isAdmin } = useAdminRole();
  
  // Form state for adding new events
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    duration: '1 hour',
    location: 'Zoom',
    zoomLink: '',
    description: '',
    isRecurring: false,
    remindMembers: false,
    attendees: 'All members'
  });

  // Sample events including weekly trainings
  const [events, setEvents] = useState<Event[]>([
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
  ]);

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

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: 'workshop', // Default type, could be dynamic
      description: newEvent.description,
      location: newEvent.location,
      duration: newEvent.duration,
      isRecurring: newEvent.isRecurring
    };
    
    setEvents([...events, event]);
    setIsAddEventOpen(false);
    
    // Reset form
    setNewEvent({
      title: '',
      date: new Date(),
      time: '',
      duration: '1 hour',
      location: 'Zoom',
      zoomLink: '',
      description: '',
      isRecurring: false,
      remindMembers: false,
      attendees: 'All members'
    });
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Calendar */}
      <div className="lg:col-span-3">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              Events Calendar
            </CardTitle>
            
            {/* Add Event Dialog - Only visible to admins */}
            {isAdmin && (
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
              <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Add event</DialogTitle>
                  <p className="text-gray-400 text-sm">
                    Need ideas? Try one of these fun formats: 
                    <span className="text-blue-400 hover:underline cursor-pointer"> coffee hour</span>,
                    <span className="text-blue-400 hover:underline cursor-pointer"> Q&A</span>,
                    <span className="text-blue-400 hover:underline cursor-pointer"> co-working session</span>, or
                    <span className="text-blue-400 hover:underline cursor-pointer"> happy hour</span>
                  </p>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="bg-slate-700 border-gray-600 text-white"
                      placeholder="Event title"
                    />
                    <div className="text-right text-sm text-gray-400">
                      {newEvent.title.length} / 30
                    </div>
                  </div>

                  {/* Date, Time, Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-slate-700 border-gray-600 text-white",
                              !newEvent.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-gray-700" align="start">
                          <Calendar
                            mode="single"
                            selected={newEvent.date}
                            onSelect={(date) => date && setNewEvent({...newEvent, date})}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Time</Label>
                      <Select value={newEvent.time} onValueChange={(value) => setNewEvent({...newEvent, time: value})}>
                        <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-gray-700">
                          {Array.from({length: 24}, (_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                              {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Duration</Label>
                      <Select value={newEvent.duration} onValueChange={(value) => setNewEvent({...newEvent, duration: value})}>
                        <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-gray-700">
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                          <SelectItem value="2 hours">2 hours</SelectItem>
                          <SelectItem value="3 hours">3 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Recurring Event */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recurring"
                      checked={newEvent.isRecurring}
                      onCheckedChange={(checked) => setNewEvent({...newEvent, isRecurring: checked as boolean})}
                    />
                    <Label htmlFor="recurring" className="text-white">Recurring event</Label>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <Label className="text-white">Location</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={newEvent.location} onValueChange={(value) => setNewEvent({...newEvent, location: value})}>
                        <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-gray-700">
                          <SelectItem value="Zoom">🔵 Zoom</SelectItem>
                          <SelectItem value="Google Meet">📹 Google Meet</SelectItem>
                          <SelectItem value="Microsoft Teams">🟣 Microsoft Teams</SelectItem>
                          <SelectItem value="In Person">📍 In Person</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {newEvent.location === 'Zoom' && (
                        <Input
                          placeholder="Zoom link"
                          value={newEvent.zoomLink}
                          onChange={(e) => setNewEvent({...newEvent, zoomLink: e.target.value})}
                          className="bg-slate-700 border-gray-600 text-white"
                        />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="bg-slate-700 border-gray-600 text-white h-24"
                      placeholder="Event description..."
                    />
                    <div className="text-right text-sm text-gray-400">
                      {newEvent.description.length} / 300
                    </div>
                  </div>

                  {/* Who can attend */}
                  <div className="space-y-2">
                    <Label className="text-white">Who can attend this event</Label>
                    <Select value={newEvent.attendees} onValueChange={(value) => setNewEvent({...newEvent, attendees: value})}>
                      <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-gray-700">
                        <SelectItem value="All members">All members</SelectItem>
                        <SelectItem value="Premium members">Premium members only</SelectItem>
                        <SelectItem value="Invited only">Invited members only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Upload cover image */}
                  <div className="space-y-2">
                    <Label className="text-white">Upload cover image</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-blue-400 text-sm cursor-pointer hover:underline">Upload cover image</p>
                      <p className="text-gray-400 text-xs mt-1">1460 x 752 px</p>
                    </div>
                  </div>

                  {/* Remind members */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remind"
                      checked={newEvent.remindMembers}
                      onCheckedChange={(checked) => setNewEvent({...newEvent, remindMembers: checked as boolean})}
                    />
                    <Label htmlFor="remind" className="text-white">Remind members by email 1 day before</Label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddEventOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      CANCEL
                    </Button>
                    <Button 
                      onClick={handleAddEvent}
                      disabled={!newEvent.title || !newEvent.time}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            )}
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
