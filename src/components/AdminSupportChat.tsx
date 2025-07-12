import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SupportMessage {
  id: string;
  message: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  created_at: string;
  read_at: string | null;
}

export const AdminSupportChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages between user and admins
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;

    try {
      setLoadingMessages(true);
      
      // Get admin user IDs
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      const adminUserIds = adminRoles?.map(role => role.user_id) || [];

      if (adminUserIds.length === 0) {
        setLoadingMessages(false);
        return;
      }

      // Get messages between current user and any admin
      const { data: messagesData, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.in.(${adminUserIds.join(',')})),and(sender_id.in.(${adminUserIds.join(',')}),recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !user || isLoading) return;

    setIsLoading(true);

    try {
      // Get the first admin user (in a real app, you might want to implement admin assignment)
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1);

      if (!adminRoles || adminRoles.length === 0) {
        toast({
          title: "No administrators available",
          description: "Please try again later.",
          variant: "destructive"
        });
        return;
      }

      const adminUserId = adminRoles[0].user_id;
      const senderName = user.email?.split('@')[0] || 'User';

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: adminUserId,
          message: currentMessage.trim(),
          sender_name: senderName
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Add message to local state immediately for better UX
      const newMessage: SupportMessage = {
        id: Date.now().toString(),
        message: currentMessage.trim(),
        sender_id: user.id,
        sender_name: senderName,
        recipient_id: adminUserId,
        created_at: new Date().toISOString(),
        read_at: null
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage('');

      toast({
        title: "Message sent",
        description: "Your message has been sent to the administrators.",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isUserMessage = (message: SupportMessage) => message.sender_id === user?.id;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
              AS
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white text-lg font-semibold">Admin Support</h3>
            <p className="text-gray-400 text-sm">Get help from our team</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMessages ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-sm">Loading your conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <User className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Send a message to get support from our admin team!</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`flex ${isUserMessage(message) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                isUserMessage(message) 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                  : 'bg-slate-700 text-gray-300'
              }`}>
                {!isUserMessage(message) && (
                  <div className="text-xs text-gray-400 mb-1 font-medium">
                    Admin • {message.sender_name}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                  {isUserMessage(message) && message.read_at && (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">Read</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-cyan-500/20 p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message to admin..."
              disabled={isLoading}
              className="bg-slate-700 border-cyan-500/30 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 self-end"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};