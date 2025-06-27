
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DirectMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export const DirectMessages = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: '1',
      content: 'Welcome to our community! Feel free to reach out if you have any questions about the course or platform.',
      timestamp: '2 days ago',
      isFromUser: false,
      status: 'read'
    },
    {
      id: '2', 
      content: 'Thank you for the warm welcome! I\'m excited to be part of this community.',
      timestamp: '2 days ago',
      isFromUser: true,
      status: 'read'
    }
  ]);

  const handleSubmitMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newDM: DirectMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        timestamp: 'now',
        isFromUser: true,
        status: 'sent'
      };

      setMessages(prevMessages => [...prevMessages, newDM]);
      setNewMessage('');

      toast({
        title: "Message Sent!",
        description: "Your message has been sent to the administrators.",
      });

      // Simulate admin response after a delay
      setTimeout(() => {
        const adminResponse: DirectMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Thank you for your message! We\'ll get back to you soon.',
          timestamp: 'just now',
          isFromUser: false,
          status: 'delivered'
        };
        setMessages(prev => [...prev, adminResponse]);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Direct Messages</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            Admin Chat
          </Badge>
        </div>
      </div>

      {/* Messages Container */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversation with Administrators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Thread */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.isFromUser
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                      : 'bg-slate-700/50 text-gray-100 border border-slate-600/50'
                  }`}
                >
                  {!message.isFromUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-cyan-300 font-medium">Administrator</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className={`flex items-center gap-2 mt-2 text-xs ${
                    message.isFromUser ? 'text-cyan-100' : 'text-gray-400'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp}</span>
                    {message.isFromUser && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1 py-0 ${
                          message.status === 'read' 
                            ? 'border-green-500/30 text-green-300' 
                            : message.status === 'delivered'
                            ? 'border-blue-500/30 text-blue-300'
                            : 'border-gray-500/30 text-gray-300'
                        }`}
                      >
                        {message.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-slate-600/50 pt-4 space-y-3">
            <Textarea
              placeholder="Type your message to the administrators..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-slate-700/50 border-cyan-500/20 text-white placeholder-gray-400 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitMessage}
                disabled={!newMessage.trim() || isSubmitting}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-slate-800/30 border-cyan-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-cyan-300 mb-1">Direct Messaging</h3>
              <p className="text-xs text-gray-400">
                Send private messages directly to the administrators. They'll receive notifications 
                and respond as soon as possible. All your conversation history is saved here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
