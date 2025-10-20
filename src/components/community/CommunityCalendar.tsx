
import React, { useState, useMemo } from 'react';
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
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Video, CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, Event, CreateEventRequest, UpdateEventRequest } from '@/services/api';

// Transform backend Event to frontend Event format
interface FrontendEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'training' | 'webinar' | 'discussion' | 'workshop';
  attendees?: number | string;
  isRecurring?: boolean;
  description?: string;
  location?: string;
  duration?: string;
  zoomLink?: string;
  remindMembers?: boolean;
}

// Helper functions to transform between backend and frontend formats
const transformBackendToFrontend = (backendEvent: Event): FrontendEvent => {
  // Extract just the date part from the ISO string to avoid timezone issues
  const dateStr = backendEvent.event_date.split('T')[0]; // Get "2025-09-30" from "2025-09-30T00:00:00.000Z"
  const [year, month, day] = dateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // Create local date (month is 0-indexed)
  
  console.log(`📅 Transforming backend event: ${backendEvent.event_date} -> ${dateStr} -> ${localDate.toLocaleDateString()}`);
  
  return {
    id: backendEvent._id,
    title: backendEvent.title,
    date: localDate,
    time: backendEvent.event_time,
    type: backendEvent.event_type,
    attendees: backendEvent.attendees,
    isRecurring: backendEvent.is_recurring,
    description: backendEvent.description,
    location: backendEvent.location,
    duration: backendEvent.duration,
    zoomLink: backendEvent.zoom_link,
    remindMembers: backendEvent.remind_members,
  };
};

interface EventFormData {
  title: string;
  date: Date;
  time: string;
  hour: string;
  minute: string;
  period: string;
  duration: string;
  location: string;
  zoomLink: string;
  description: string;
  event_type: 'training' | 'webinar' | 'discussion' | 'workshop';
  isRecurring: boolean;
  remindMembers: boolean;
  attendees: string;
  coverImage?: string;
}

// Helper functions for time conversion
const timeToHourMinutePeriod = (timeStr: string) => {
  if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
  
  const [time, period] = timeStr.split(' ');
  const [hour, minute] = time.split(':');
  
  // Convert 24-hour to 12-hour format
  let hourNum = parseInt(hour);
  const newPeriod = hourNum >= 12 ? 'PM' : 'AM';
  
  if (hourNum === 0) hourNum = 12;
  else if (hourNum > 12) hourNum = hourNum - 12;
  
  return {
    hour: hourNum.toString(),
    minute: minute || '00',
    period: newPeriod
  };
};

const hourMinutePeriodToTime = (hour: string, minute: string, period: string) => {
  let hourNum = parseInt(hour);
  
  if (period === 'PM' && hourNum !== 12) {
    hourNum += 12;
  } else if (period === 'AM' && hourNum === 12) {
    hourNum = 0;
  }
  
  // Ensure minute is padded to 2 digits
  const paddedMinute = minute.padStart(2, '0');
  
  return `${hourNum.toString().padStart(2, '0')}:${paddedMinute}`;
};

const transformFrontendToBackend = (frontendEvent: EventFormData): CreateEventRequest => ({
  title: frontendEvent.title,
  description: frontendEvent.description,
  event_date: `${frontendEvent.date.getFullYear()}-${String(frontendEvent.date.getMonth() + 1).padStart(2, '0')}-${String(frontendEvent.date.getDate()).padStart(2, '0')}`,
  event_time: hourMinutePeriodToTime(frontendEvent.hour, frontendEvent.minute, frontendEvent.period),
  duration: frontendEvent.duration,
  location: frontendEvent.location,
  zoom_link: frontendEvent.zoomLink,
  event_type: frontendEvent.event_type || 'workshop', // Use actual event type or default
  attendees: String(frontendEvent.attendees),
  is_recurring: frontendEvent.isRecurring,
  remind_members: frontendEvent.remindMembers,
});

export const CommunityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  // Set current month to show events properly - default to current month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Log the initial selected date
  React.useEffect(() => {
    console.log('📅 Calendar initialized with selected date:', selectedDate?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, [selectedDate]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<FrontendEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const { isAdmin } = useAdminRole();
  const { user } = useAuth();
  
  // Form state for adding new events
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    hour: '12',
    minute: '00',
    period: 'AM',
    duration: '1 hour',
    location: 'Zoom',
    zoomLink: '',
    description: '',
    event_type: 'workshop' as 'training' | 'webinar' | 'discussion' | 'workshop',
    isRecurring: false,
    remindMembers: false,
    attendees: 'All members',
    coverImage: ''
  });

  // State for events
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock events data for September 2025
  const mockEvents = React.useMemo(() => [
    {
      id: 'mock-1',
      title: 'September Market Outlook',
      date: new Date(2025, 8, 3), // September 3, 2025
      time: '2:00 PM',
      type: 'webinar' as const,
      description: 'Join us for a comprehensive look at the September real estate market trends and investment opportunities.',
      location: 'Zoom Meeting',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/123456789',
      attendees: '48',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-2',
      title: 'Property Analysis Masterclass',
      date: new Date(2025, 8, 7), // September 7, 2025
      time: '10:00 AM',
      type: 'workshop' as const,
      description: 'Advanced property analysis techniques including cash flow modeling, ROI calculations, and market comparison methods.',
      location: 'Zoom Meeting',
      duration: '3 hours',
      zoomLink: 'https://zoom.us/j/987654321',
      attendees: '32',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-3',
      title: 'Weekly Community Check-in',
      date: new Date(2025, 8, 9), // September 9, 2025
      time: '6:00 PM',
      type: 'discussion' as const,
      description: 'Weekly community check-in where members share updates, ask questions, and support each other.',
      location: 'Zoom Meeting',
      duration: '1 hour',
      zoomLink: 'https://zoom.us/j/456789123',
      attendees: '28',
      isRecurring: true,
      remindMembers: false
    },
    {
      id: 'mock-4',
      title: 'New Member Orientation',
      date: new Date(2025, 8, 12), // September 12, 2025
      time: '3:00 PM',
      type: 'training' as const,
      description: 'Welcome session for new members. Learn about community resources and get started on your rental investment journey.',
      location: 'Zoom Meeting',
      duration: '1 hour',
      zoomLink: 'https://zoom.us/j/789123456',
      attendees: '18',
      isRecurring: true,
      remindMembers: false
    },
    {
      id: 'mock-5',
      title: 'Tax Planning for Q4',
      date: new Date(2025, 8, 14), // September 14, 2025
      time: '1:00 PM',
      type: 'webinar' as const,
      description: 'Strategic tax planning session for the fourth quarter. Learn how to optimize your rental property tax strategy.',
      location: 'Zoom Meeting',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/321654987',
      attendees: '52',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-6',
      title: 'Property Management Excellence',
      date: new Date(2025, 8, 17), // September 17, 2025
      time: '2:00 PM',
      type: 'training' as const,
      description: 'Advanced property management strategies including tenant retention, maintenance optimization, and cost control.',
      location: 'Zoom Meeting',
      duration: '2 hours',
      zoomLink: 'https://zoom.us/j/654321987',
      attendees: '38',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-7',
      title: 'Market Analysis Deep Dive',
      date: new Date(2025, 8, 19), // September 19, 2025
      time: '7:30 PM',
      type: 'webinar' as const,
      description: 'Advanced market analysis techniques and tools for identifying the best investment opportunities in today\'s market.',
      location: 'Zoom Meeting',
      duration: '1.5 hours',
      zoomLink: 'https://zoom.us/j/147258369',
      attendees: '45',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-8',
      title: 'Weekly Community Check-in',
      date: new Date(2025, 8, 23), // September 23, 2025
      time: '6:00 PM',
      type: 'discussion' as const,
      description: 'Weekly community check-in where members share updates, ask questions, and support each other.',
      location: 'Zoom Meeting',
      duration: '1 hour',
      zoomLink: 'https://zoom.us/j/369258147',
      attendees: '31',
      isRecurring: true,
      remindMembers: false
    },
    {
      id: 'mock-9',
      title: 'Creative Financing Strategies',
      date: new Date(2025, 8, 25), // September 25, 2025
      time: '1:00 PM',
      type: 'workshop' as const,
      description: 'Explore creative financing options including seller financing, partnerships, and alternative lending solutions.',
      location: 'Zoom Meeting',
      duration: '2.5 hours',
      zoomLink: 'https://zoom.us/j/852741963',
      attendees: '29',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-10',
      title: 'Legal Updates & Compliance',
      date: new Date(2025, 8, 28), // September 28, 2025
      time: '3:00 PM',
      type: 'webinar' as const,
      description: 'Stay updated on the latest legal changes affecting rental property investors and landlord-tenant laws.',
      location: 'Zoom Meeting',
      duration: '1 hour',
      zoomLink: 'https://zoom.us/j/963852741',
      attendees: '41',
      isRecurring: false,
      remindMembers: true
    },
    {
      id: 'mock-11',
      title: 'Portfolio Optimization Workshop',
      date: new Date(2025, 8, 30), // September 30, 2025
      time: '2:00 PM',
      type: 'workshop' as const,
      description: 'Learn how to optimize your rental portfolio for maximum returns and risk management.',
      location: 'Zoom Meeting',
      duration: '2 hours',
      zoomLink: 'https://zoom.us/j/741852963',
      attendees: '35',
      isRecurring: false,
      remindMembers: true
    }
  ], []);

  // Load events from API
  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📅 Loading calendar events from API...');
      
      // Get current month and year
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      console.log(`📅 Requesting events for ${year}-${month} (${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`);
      
      const response = await apiService.getEventsForMonth(year, month);
      
      if (response.success) {
        console.log('📅 Raw API response:', response.data);
        const frontendEvents = response.data.map(transformBackendToFrontend);
        console.log('📅 Transformed frontend events:', frontendEvents);
        setEvents(frontendEvents);
        console.log('📅 Loaded', frontendEvents.length, 'events for', year, month);
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setError(error instanceof Error ? error.message : 'Failed to load events');
      
      // Fallback to mock events for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📅 Using mock events as fallback');
        setEvents(mockEvents);
      }
    } finally {
      setLoading(false);
    }
  }, [currentMonth, mockEvents]);

  // Load events on component mount and when month changes
  React.useEffect(() => {
    console.log('📅 Calendar month changed to:', currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    fetchEvents();
  }, [currentMonth, fetchEvents]);

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

  // Memoized events lookup for better performance
  const eventsByDate = useMemo(() => {
    const lookup: { [key: string]: FrontendEvent[] } = {};
    console.log('📅 Building events lookup for', events.length, 'events');
    events.forEach(event => {
      const dateKey = event.date.toDateString();
      console.log(`📅 Event "${event.title}" on ${dateKey}`);
      if (!lookup[dateKey]) {
        lookup[dateKey] = [];
      }
      lookup[dateKey].push(event);
    });
    console.log('📅 Events lookup built:', Object.keys(lookup));
    return lookup;
  }, [events]);

  const getEventsForDate = (date: Date) => {
    const dateKey = date.toDateString();
    const eventsForDate = eventsByDate[dateKey] || [];
    console.log(`📅 Looking for events on ${dateKey}:`, eventsForDate.length, 'events found');
    return eventsForDate;
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

  const handleAddEvent = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }
    
    // Validate all required fields
    if (!newEvent.title.trim()) {
      console.error('Title is required');
      return;
    }
    
    if (!newEvent.hour || !newEvent.minute || !newEvent.period) {
      console.error('Time is required');
      return;
    }
    
    if (!newEvent.duration) {
      console.error('Duration is required');
      return;
    }
    
    if (!newEvent.event_type) {
      console.error('Event type is required');
      return;
    }
    
    if (!newEvent.location) {
      console.error('Location is required');
      return;
    }
    
    if (!newEvent.description.trim()) {
      console.error('Description is required');
      return;
    }
    
    // Validate zoom_link only if location is Zoom
    if (newEvent.location === 'Zoom' && !newEvent.zoomLink.trim()) {
      console.error('Zoom link is required when location is Zoom');
      return;
    }
    
    try {
      console.log('Creating event with date:', newEvent.date.toLocaleDateString(), 'which will be stored as:', `${newEvent.date.getFullYear()}-${String(newEvent.date.getMonth() + 1).padStart(2, '0')}-${String(newEvent.date.getDate()).padStart(2, '0')}`);
      console.log('Form data:', newEvent);
      
      const eventData = transformFrontendToBackend(newEvent);
      console.log('Transformed event data:', eventData);
      
      const response = await apiService.createEvent(eventData);
      
      if (response.success) {
        console.log('Event created successfully:', response.data);
        
        // Refresh events list
        await fetchEvents();
        setIsAddEventOpen(false);
        
        // Reset form
        setNewEvent({
          title: '',
          date: new Date(),
          time: '',
          hour: '12',
          minute: '00',
          period: 'AM',
          duration: '1 hour',
          location: 'Zoom',
          zoomLink: '',
          description: '',
          event_type: 'workshop',
          isRecurring: false,
          remindMembers: false,
          attendees: 'All members',
          coverImage: ''
        });
        
        console.log('Event added successfully');
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      // Show user-friendly error message
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditEvent = async () => {
    if (!selectedEvent || !user) return;
    
    // Validate all required fields
    if (!newEvent.title.trim()) {
      console.error('Title is required');
      return;
    }
    
    if (!newEvent.hour || !newEvent.minute || !newEvent.period) {
      console.error('Time is required');
      return;
    }
    
    if (!newEvent.duration) {
      console.error('Duration is required');
      return;
    }
    
    if (!newEvent.event_type) {
      console.error('Event type is required');
      return;
    }
    
    if (!newEvent.location) {
      console.error('Location is required');
      return;
    }
    
    if (!newEvent.description.trim()) {
      console.error('Description is required');
      return;
    }
    
    // Validate zoom_link only if location is Zoom
    if (newEvent.location === 'Zoom' && !newEvent.zoomLink.trim()) {
      console.error('Zoom link is required when location is Zoom');
      return;
    }
    
    try {
      console.log('Editing event with new date:', newEvent.date.toLocaleDateString(), 'stored as:', `${newEvent.date.getFullYear()}-${String(newEvent.date.getMonth() + 1).padStart(2, '0')}-${String(newEvent.date.getDate()).padStart(2, '0')}`);
      console.log('Original event date was:', selectedEvent.date.toLocaleDateString());
      
      const eventData = transformFrontendToBackend(newEvent);
      console.log('Sending event data to backend:', eventData);
      
      const response = await apiService.updateEvent(selectedEvent.id, eventData);
      
      if (response.success) {
        console.log('Event updated successfully:', response.data);
        
        // Refresh events list
        await fetchEvents();
        setIsEditEventOpen(false);
        setIsEventDetailsOpen(false);
        
        console.log('Event updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !user) return;
    
    // Confirm deletion
    const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedEvent.title}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
      console.log('Deleting event:', selectedEvent.id);
      
      const response = await apiService.deleteEvent(selectedEvent.id);
      
      if (response.success) {
        console.log('Event deleted successfully');
        
        // Refresh events list
        await fetchEvents();
        setIsEditEventOpen(false);
        setIsEventDetailsOpen(false);
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const openEditDialog = (event: FrontendEvent) => {
    setSelectedEvent(event);
    const timeParts = timeToHourMinutePeriod(event.time);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      hour: timeParts.hour,
      minute: timeParts.minute,
      period: timeParts.period,
      duration: event.duration || '1 hour',
      location: event.location || 'Zoom',
      zoomLink: event.zoomLink || '',
      description: event.description || '',
      event_type: event.type || 'workshop',
      isRecurring: event.isRecurring || false,
      remindMembers: event.remindMembers || false,
      attendees: String(event.attendees) || 'All members',
      coverImage: ''
    });
    setIsEditEventOpen(true);
  };

  const addToCalendar = async (event: FrontendEvent) => {
    try {
      // Get calendar links from the API
      const response = await apiService.getCalendarLinks(event.id);
      
      if (response.success) {
        // Open Google Calendar link
        window.open(response.data.google, '_blank');
      } else {
        throw new Error(response.message || 'Failed to generate calendar links');
      }
    } catch (error) {
      console.error('Error getting calendar links:', error);
      
      // Fallback to manual URL generation
      const startDate = new Date(event.date);
      const endDate = new Date(startDate);
      
      // Parse duration to add to end time
      const duration = event.duration || '1 hour';
      const durationValue = parseInt(duration.split(' ')[0]);
      const durationUnit = duration.includes('hour') ? 'hours' : 'minutes';
      
      if (durationUnit === 'hours') {
        endDate.setHours(endDate.getHours() + durationValue);
      } else {
        endDate.setMinutes(endDate.getMinutes() + durationValue);
      }
      
      // Format dates for calendar
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const details = [
        event.description || '',
        event.location && event.location !== 'Zoom' ? `Location: ${event.location}` : '',
        event.zoomLink ? `Join: ${event.zoomLink}` : ''
      ].filter(Boolean).join('\n\n');
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.zoomLink || '')}`;
      
      window.open(calendarUrl, '_blank');
    }
  };

  const handleDayClick = (date: Date) => {
    console.log('📅 User clicked on date:', date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    console.log('📅 Date object:', date);
    console.log('📅 ISO string:', date.toISOString());
    
    const dayEvents = getEventsForDate(date);
    console.log('📅 Events for this date:', dayEvents.length, dayEvents);
    
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]); // For now, show first event
      setIsEventDetailsOpen(true);
    }
    setSelectedDate(date);
  };

  const handleAddEventClick = () => {
    console.log('📅 Opening add event dialog with selected date:', selectedDate?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Set the form date to the currently selected date or default to today
    const defaultDate = selectedDate || new Date();
    console.log('📅 Setting form date to:', defaultDate.toLocaleDateString());
    
    setNewEvent(prev => ({
      ...prev,
      date: defaultDate
    }));
    
    setIsAddEventOpen(true);
  };

  return (
    <div className="w-full">
      {/* Calendar */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            Events Calendar
            {loading && <span className="text-sm text-gray-400">(Loading...)</span>}
          </CardTitle>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm mb-2">
              Error: {error}
            </div>
          )}
          
          {/* Add Event Dialog - Only visible to admins */}
          {isAdmin && (
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <Button 
                onClick={handleAddEventClick}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            <DialogContent className="bg-slate-800 border-gray-700 w-full max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto p-4 sm:max-w-2xl sm:max-h-[90vh] sm:p-6" aria-describedby="add-event-description">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Add event</DialogTitle>
                <p id="add-event-description" className="text-gray-400 text-sm">
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
                  <Label htmlFor="title" className="text-white">
                    Title <span className="text-red-500">*</span>
                  </Label>
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
                    <Label className="text-white">
                      Date <span className="text-red-500">*</span>
                    </Label>
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
                          onSelect={(date) => {
                            console.log('📅 Date selected in calendar:', date);
                            if (date) {
                              setNewEvent({...newEvent, date});
                            }
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                          defaultMonth={new Date()} // Default to current month
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">
                      Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        value={newEvent.hour}
                        onChange={(e) => {
                          let hour = e.target.value;
                          if (hour && parseInt(hour) > 12) {
                            hour = '12';
                          }
                          setNewEvent({...newEvent, hour});
                        }}
                        className="bg-slate-700 border-gray-600 text-white w-14 text-center px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="12"
                      />
                      <span className="text-white">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={newEvent.minute}
                        onChange={(e) => {
                          let minute = e.target.value;
                          if (minute && parseInt(minute) > 59) {
                            minute = '59';
                          }
                          setNewEvent({...newEvent, minute});
                        }}
                        className="bg-slate-700 border-gray-600 text-white w-14 text-center px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="00"
                      />
                      <Select value={newEvent.period} onValueChange={(value) => setNewEvent({...newEvent, period: value})}>
                        <SelectTrigger className="bg-slate-700 border-gray-600 text-white w-16 px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-gray-700">
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">
                      Duration <span className="text-red-500">*</span>
                    </Label>
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

                {/* Event Type */}
                <div className="space-y-2">
                  <Label className="text-white">
                    Event Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({...newEvent, event_type: value as 'training' | 'webinar' | 'discussion' | 'workshop'})}>
                    <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-700">
                      <SelectItem value="training">🟢 Training</SelectItem>
                      <SelectItem value="webinar">🔵 Webinar</SelectItem>
                      <SelectItem value="discussion">🟡 Discussion</SelectItem>
                      <SelectItem value="workshop">🟣 Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recurring Event */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recurring"
                    checked={newEvent.isRecurring}
                    onCheckedChange={(checked) => setNewEvent({...newEvent, isRecurring: checked as boolean})}
                  />
                  <Label htmlFor="recurring" className="text-white">Recurring event (creates 12 weekly events)</Label>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">
                      Location <span className="text-red-500">*</span>
                    </Label>
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
                  </div>
                  
                  {newEvent.location === 'Zoom' && (
                    <div className="space-y-2">
                      <Label className="text-white">
                        Zoom Link <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Meeting ID, room name, or full Zoom URL"
                        value={newEvent.zoomLink}
                        onChange={(e) => setNewEvent({...newEvent, zoomLink: e.target.value})}
                        className="bg-slate-700 border-gray-600 text-white"
                      />
                      <p className="text-xs text-gray-400">
                        Examples: "123456789", "Room A", or "https://zoom.us/j/123456789"
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description <span className="text-red-500">*</span>
                  </Label>
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
                  <Label className="text-white">Upload cover image (Optional)</Label>
                  <ImageUpload
                    value={newEvent.coverImage}
                    onChange={(value) => setNewEvent({...newEvent, coverImage: value})}
                  />
                  <p className="text-gray-400 text-xs">Recommended size: 1460 x 752 px</p>
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
                    disabled={!newEvent.title.trim() || !newEvent.hour || !newEvent.minute || !newEvent.period || !newEvent.duration || !newEvent.event_type || !newEvent.location || !newEvent.description.trim() || (newEvent.location === 'Zoom' && !newEvent.zoomLink.trim())}
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
                    onClick={() => handleDayClick(date)}
                    className={`
                      h-16 p-2 text-sm rounded-lg border transition-colors relative flex flex-col items-center justify-center cursor-pointer
                      ${isSelected 
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' 
                        : 'border-gray-700 hover:border-cyan-500/50 hover:bg-slate-700/50'
                      }
                      ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                      ${isToday && !isSelected ? 'bg-slate-700/50 border-cyan-400/50' : ''}
                      ${hasEvents ? 'ring-1 ring-cyan-400/50' : ''}
                    `}
                  >
                    <span className="font-medium">{date.getDate()}</span>
                    {hasEvents && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {getEventsForDate(date).map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className={`w-2 h-2 rounded-full animate-pulse ${
                              event.type === 'training' ? 'bg-green-400' :
                              event.type === 'webinar' ? 'bg-blue-400' :
                              event.type === 'workshop' ? 'bg-purple-400' :
                              event.type === 'discussion' ? 'bg-orange-400' :
                              'bg-cyan-400'
                            }`}
                            title={event.title}
                          ></div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Type Legend */}
        {/* <Card className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <h3 className="text-cyan-300 font-semibold text-lg">Event Type Legend</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-green-500/20">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/30"></div>
                <div>
                  <span className="text-green-300 font-medium">Training</span>
                  <p className="text-green-400/70 text-xs">Skill Development</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-blue-500/20">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/30"></div>
                <div>
                  <span className="text-blue-300 font-medium">Webinar</span>
                  <p className="text-blue-400/70 text-xs">Expert Presentation</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/30"></div>
                <div>
                  <span className="text-purple-300 font-medium">Workshop</span>
                  <p className="text-purple-400/70 text-xs">Hands-on Learning</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-orange-500/20">
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/30"></div>
                <div>
                  <span className="text-orange-300 font-medium">Discussion</span>
                  <p className="text-orange-400/70 text-xs">Community Chat</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-600/20 rounded-lg border border-gray-600/30">
              <p className="text-gray-400 text-sm">
                <span className="text-cyan-300">💡 Tip:</span> Click on any date with colored dots to view event details!
              </p>
            </div>
          </CardContent>
        </Card> */}
        
        {/* Event Details Popup */}
        <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
          <DialogContent className="bg-slate-800 border-gray-700 w-full max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto p-4 sm:max-w-md sm:max-h-[90vh] sm:p-6" aria-describedby="event-details-description">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {selectedEvent?.title}
              </DialogTitle>
              <p id="event-details-description" className="text-gray-400 text-sm">
                View event details, add to calendar, or join the event
              </p>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-4">
                <div className="text-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-4 w-4 text-cyan-400" />
                    <span>{selectedEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>{selectedEvent.time}</span>
                    {selectedEvent.duration && <span>• {selectedEvent.duration}</span>}
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-cyan-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  
                  {selectedEvent.zoomLink && (
                    <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                      <div className="text-blue-400 text-sm break-all">
                        {selectedEvent.zoomLink}
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.description && (
                    <p className="text-gray-300 text-sm mb-4">
                      {selectedEvent.description}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => addToCalendar(selectedEvent)}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    ADD TO CALENDAR
                  </Button>
                  
                  {selectedEvent.zoomLink && (
                    <Button 
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      onClick={() => {
                        window.open(selectedEvent.zoomLink, '_blank');
                        setIsEventDetailsOpen(false);
                      }}
                     >
                       Join Event
                     </Button>
                   )}
                   
                   {/* Admin Edit Button */}
                   {isAdmin && (
                     <Button 
                       variant="outline"
                       className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                       onClick={() => openEditDialog(selectedEvent)}
                     >
                       Edit Event
                     </Button>
                   )}
                   
                   {/* Admin Delete Button */}
                   {isAdmin && (
                     <Button 
                       variant="destructive"
                       className="w-full bg-red-600 hover:bg-red-700 text-white"
                       onClick={handleDeleteEvent}
                     >
                       Delete Event
                     </Button>
                   )}
                 </div>
               </div>
             )}
           </DialogContent>
         </Dialog>
         
         {/* Edit Event Dialog - Only visible to admins */}
         {isAdmin && (
           <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
             <DialogContent className="bg-slate-800 border-gray-700 w-full max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto p-4 sm:max-w-2xl sm:max-h-[90vh] sm:p-6" aria-describedby="edit-event-description">
               <DialogHeader>
                 <DialogTitle className="text-white text-xl">Edit Event</DialogTitle>
                 <p id="edit-event-description" className="text-gray-400 text-sm">
                   Modify event details, update information, or delete the event
                 </p>
               </DialogHeader>
               
               <div className="space-y-6 mt-6">
                 {/* Title */}
                 <div className="space-y-2">
                   <Label htmlFor="edit-title" className="text-white">
                     Title <span className="text-red-500">*</span>
                   </Label>
                   <Input
                     id="edit-title"
                     value={newEvent.title}
                     onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                     className="bg-slate-700 border-gray-600 text-white"
                     placeholder="Event title"
                   />
                 </div>

                 {/* Date, Time, Duration */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label className="text-white">
                       Date <span className="text-red-500">*</span>
                     </Label>
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
                           onSelect={(date) => {
                             console.log('📅 Date selected in edit calendar:', date);
                             if (date) {
                               setNewEvent({...newEvent, date});
                             }
                           }}
                           initialFocus
                           className="p-3 pointer-events-auto"
                           defaultMonth={newEvent.date} // Default to the event's current date
                         />
                       </PopoverContent>
                     </Popover>
                   </div>
                   
                   <div className="space-y-2">
                     <Label className="text-white">
                       Time <span className="text-red-500">*</span>
                     </Label>
                     <div className="flex gap-2 items-center">
                       <Input
                         type="number"
                         min="1"
                         max="12"
                         value={newEvent.hour}
                         onChange={(e) => {
                           let hour = e.target.value;
                           if (hour && parseInt(hour) > 12) {
                             hour = '12';
                           }
                           setNewEvent({...newEvent, hour});
                         }}
                         className="bg-slate-700 border-gray-600 text-white w-14 text-center px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         placeholder="12"
                       />
                       <span className="text-white">:</span>
                       <Input
                         type="number"
                         min="0"
                         max="59"
                         value={newEvent.minute}
                         onChange={(e) => {
                           let minute = e.target.value;
                           if (minute && parseInt(minute) > 59) {
                             minute = '59';
                           }
                           setNewEvent({...newEvent, minute});
                         }}
                         className="bg-slate-700 border-gray-600 text-white w-14 text-center px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         placeholder="00"
                       />
                       <Select value={newEvent.period} onValueChange={(value) => setNewEvent({...newEvent, period: value})}>
                         <SelectTrigger className="bg-slate-700 border-gray-600 text-white w-16 px-2">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-slate-800 border-gray-700">
                           <SelectItem value="AM">AM</SelectItem>
                           <SelectItem value="PM">PM</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <Label className="text-white">
                       Duration <span className="text-red-500">*</span>
                     </Label>
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

                 {/* Location */}
                 <div className="space-y-4">
                   <Label className="text-white">
                     Location <span className="text-red-500">*</span>
                   </Label>
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
                       <div className="space-y-1">
                         <Input
                           placeholder="Meeting ID, room name, or full Zoom URL"
                           value={newEvent.zoomLink}
                           onChange={(e) => setNewEvent({...newEvent, zoomLink: e.target.value})}
                           className="bg-slate-700 border-gray-600 text-white"
                         />
                         <p className="text-xs text-gray-400">
                           Examples: "123456789", "Room A", or "https://zoom.us/j/123456789"
                         </p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Event Type */}
                 <div className="space-y-2">
                   <Label className="text-white">
                     Event Type <span className="text-red-500">*</span>
                   </Label>
                   <Select value={newEvent.event_type} onValueChange={(value) => setNewEvent({...newEvent, event_type: value as 'training' | 'webinar' | 'discussion' | 'workshop'})}>
                     <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-slate-800 border-gray-700">
                       <SelectItem value="training">🟢 Training</SelectItem>
                       <SelectItem value="webinar">🔵 Webinar</SelectItem>
                       <SelectItem value="discussion">🟡 Discussion</SelectItem>
                       <SelectItem value="workshop">🟣 Workshop</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 {/* Description */}
                 <div className="space-y-2">
                   <Label htmlFor="edit-description" className="text-white">
                     Description <span className="text-red-500">*</span>
                   </Label>
                   <Textarea
                     id="edit-description"
                     value={newEvent.description}
                     onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                     className="bg-slate-700 border-gray-600 text-white h-24"
                     placeholder="Event description..."
                   />
                 </div>

                 {/* Recurring Event */}
                 <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="edit-recurring"
                     checked={newEvent.isRecurring}
                     onCheckedChange={(checked) => setNewEvent({...newEvent, isRecurring: checked as boolean})}
                   />
                   <Label htmlFor="edit-recurring" className="text-white">Recurring event (creates 12 weekly events)</Label>
                 </div>

                 {/* Remind members */}
                 <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="edit-remind"
                     checked={newEvent.remindMembers}
                     onCheckedChange={(checked) => setNewEvent({...newEvent, remindMembers: checked as boolean})}
                   />
                   <Label htmlFor="edit-remind" className="text-white">Remind members by email 1 day before</Label>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex justify-end gap-3 pt-4">
                   <Button 
                     variant="ghost" 
                     onClick={() => setIsEditEventOpen(false)}
                     className="text-gray-400 hover:text-white"
                   >
                     CANCEL
                   </Button>
                   <Button 
                     onClick={handleEditEvent}
                     disabled={!newEvent.title.trim() || !newEvent.hour || !newEvent.minute || !newEvent.period || !newEvent.duration || !newEvent.event_type || !newEvent.location || !newEvent.description.trim() || (newEvent.location === 'Zoom' && !newEvent.zoomLink.trim())}
                     className="bg-purple-600 hover:bg-purple-700 text-white"
                   >
                     UPDATE
                   </Button>
                 </div>
               </div>
             </DialogContent>
           </Dialog>
         )}
      </div>
    );
  };
