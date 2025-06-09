
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Search, Filter } from 'lucide-react';

export const MessagingCenter = () => {
  const [selectedConversation, setSelectedConversation] = useState(0);

  const conversations = [
    {
      id: 1,
      guest: 'John Smith',
      property: 'Downtown Loft',
      platform: 'Airbnb',
      lastMessage: 'Thank you for the WiFi password!',
      unread: 0,
      time: '10:30 AM',
      avatar: 'JS'
    },
    {
      id: 2,
      guest: 'Sarah Johnson',
      property: 'Beach House',
      platform: 'VRBO',
      lastMessage: 'What time is check-out?',
      unread: 2,
      time: '9:15 AM',
      avatar: 'SJ'
    },
    {
      id: 3,
      guest: 'Mike Chen',
      property: 'Mountain Cabin',
      platform: 'Booking.com',
      lastMessage: 'The view is amazing!',
      unread: 0,
      time: 'Yesterday',
      avatar: 'MC'
    }
  ];

  const messages = [
    { sender: 'guest', text: 'Hi! I just arrived at the property.', time: '9:00 AM' },
    { sender: 'host', text: 'Welcome! I hope you had a great trip. Did you find the key okay?', time: '9:02 AM' },
    { sender: 'guest', text: 'Yes, found it easily. Could you share the WiFi password?', time: '9:05 AM' },
    { sender: 'host', text: 'Of course! The WiFi network is "BeachHouse_Guest" and the password is "ocean2024"', time: '9:06 AM' },
    { sender: 'guest', text: 'What time is check-out?', time: '9:15 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with guests across all platforms</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">{conversations.filter(c => c.unread > 0).length} unread</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(index)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                    selectedConversation === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {conversation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{conversation.guest}</p>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.property}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {conversation.platform}
                          </Badge>
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{conversations[selectedConversation].guest}</CardTitle>
                <p className="text-sm text-gray-600">
                  {conversations[selectedConversation].property} • {conversations[selectedConversation].platform}
                </p>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'host'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'host' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-2 pt-3 border-t">
              <Input 
                placeholder="Type your message..." 
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
