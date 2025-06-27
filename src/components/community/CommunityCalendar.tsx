
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Users, Plus, ExternalLink, Edit } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  link: string;
  zoomId?: string;
  passcode?: string;
  topic?: string;
}

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Monthly Mastermind',
    date: 'July 15, 2024',
    time: '7:00 PM - 9:00 PM',
    location: 'Virtual - Zoom',
    description: 'Join us for our monthly mastermind session where we discuss the latest trends and strategies in real estate investing.',
    link: 'https://us06web.zoom.us/j/84255424839?pwd=3RsbkFbegOF7wwUisPYGNX3Ts1KWHJ.1',
    zoomId: '842 5542 4839',
    passcode: '803338',
    topic: 'Market Analysis & Investment Strategies'
  },
  {
    id: '2',
    title: 'Property Tour - Downtown LA',
    date: 'July 22, 2024',
    time: '10:00 AM - 12:00 PM',
    location: 'Downtown Los Angeles',
    description: 'Explore potential investment properties in Downtown LA with our expert guides. Meet at Grand Central Market.',
    link: 'https://example.com/propertytour',
    topic: 'On-Site Property Evaluation'
  },
  {
    id: '3',
    title: 'Weekly Training',
    date: 'Every Thursday',
    time: '4:00 PM PST / 7:00 PM ET',
    location: 'Virtual - Zoom',
    description: 'Weekly training sessions covering various aspects of real estate investing and property management.',
    link: 'https://us06web.zoom.us/j/84255424839?pwd=3RsbkFbegOF7wwUisPYGNX3Ts1KWHJ.1',
    zoomId: '842 5542 4839',
    passcode: '803338',
    topic: 'Property Listing Strategies'
  }
];

const CommunityCalendar = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      link: '',
      zoomId: '',
      passcode: '',
      topic: ''
    }
  });

  const editForm = useForm({
    defaultValues: {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      link: '',
      zoomId: '',
      passcode: '',
      topic: ''
    }
  });

  const onSubmit = async (data: any) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: data.title,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      link: data.link,
      zoomId: data.zoomId,
      passcode: data.passcode,
      topic: data.topic
    };

    setEvents(prev => [...prev, newEvent]);
    setIsAddEventModalOpen(false);
    form.reset();
  };

  const onEditSubmit = async (data: any) => {
    if (!editingEvent) return;

    const updatedEvent: Event = {
      ...editingEvent,
      title: data.title,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      link: data.link,
      zoomId: data.zoomId,
      passcode: data.passcode,
      topic: data.topic
    };

    setEvents(prev => prev.map(event => event.id === editingEvent.id ? updatedEvent : event));
    setIsEditModalOpen(false);
    setEditingEvent(null);
    editForm.reset();
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    editForm.reset({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      link: event.link,
      zoomId: event.zoomId || '',
      passcode: event.passcode || '',
      topic: event.topic || ''
    });
    setIsEditModalOpen(true);
  };

  const isAdmin = true;

  return (
    <div className="space-y-6">
      {/* Centered Events Calendar Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">Events Calendar</h2>
        <p className="text-slate-400">Stay updated with our community events and training sessions</p>
      </div>

      {/* Admin Add Event Button */}
      {isAdmin && (
        <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyan-300">Add New Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Event Title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Training Topic</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Training Topic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="MM/DD/YYYY"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Time</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Event Description"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Zoom Link</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Zoom Meeting Link"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zoomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Meeting ID</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Meeting ID"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Passcode</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Meeting Passcode"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddEventModalOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Add Event
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Event Modal */}
      {isAdmin && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-cyan-300">Edit Event</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                {/* Same form fields as Add Event form but using editForm */}
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Event Title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Training Topic</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Training Topic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="MM/DD/YYYY"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Time</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="HH:MM AM/PM"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Event Description"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Zoom Link</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Zoom Meeting Link"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="zoomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Meeting ID</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Meeting ID"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="passcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Passcode</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Meeting Passcode"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    Update Event
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="text-xl font-semibold text-white">{event.title}</CardTitle>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditEvent(event)}
                  className="text-slate-400 hover:text-cyan-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {event.topic && (
                <div className="text-cyan-300 font-semibold text-lg">
                  {event.topic}
                </div>
              )}
              <div className="text-slate-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-slate-400">{event.description}</p>
              
              {event.zoomId && (
                <div className="bg-slate-700/50 p-3 rounded-lg space-y-1">
                  <div className="text-sm text-slate-300">
                    <strong>Meeting ID:</strong> {event.zoomId}
                  </div>
                  {event.passcode && (
                    <div className="text-sm text-slate-300">
                      <strong>Passcode:</strong> {event.passcode}
                    </div>
                  )}
                </div>
              )}
              
              <Button asChild className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2">
                  <span>Join Event</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityCalendar;
