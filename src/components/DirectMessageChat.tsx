import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Crown, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';

interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  read_at?: string;
}

interface DirectMessageChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DirectMessageChat({ isOpen, onClose }: DirectMessageChatProps) {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages
  useEffect(() => {
    if (!user || !isOpen) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading messages:', error);
          return;
        }

        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error('Error in loadMessages:', error);
      }
    };

    loadMessages();
  }, [user, isOpen]);

  // Real-time subscription
  useEffect(() => {
    if (!user || !isOpen) return;

    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as DirectMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isOpen]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    
    try {
      // Determine recipient
      let recipientId: string;
      
      if (isAdmin) {
        // Admin sends to the first admin (themselves for testing) or to a user
        // For now, send to themselves for testing
        recipientId = user.id;
      } else {
        // Regular user sends to admin - use a default admin ID or the first admin found
        const { data: adminRoles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(1);
        
        if (adminRoles && adminRoles.length > 0) {
          recipientId = adminRoles[0].user_id;
        } else {
          // Fallback: use current user (for development)
          recipientId = user.id;
        }
      }

      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          sender_name: user.email?.split('@')[0] || 'User',
          message: newMessage.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error sending message",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setNewMessage('');
        toast({
          title: "Message sent!",
          description: "Your message has been sent"
        });
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error sending message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl h-[600px] flex flex-col m-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              <h2 className="text-white font-semibold">
                {isAdmin ? 'Admin Support Chat' : 'Chat with Admin'}
              </h2>
              {isAdmin && <Crown className="h-4 w-4 text-yellow-400" />}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[70%]">
                  {message.sender_id !== user?.id && (
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full flex items-center justify-center">
                      {isAdmin ? <User className="h-4 w-4 text-white" /> : <Crown className="h-4 w-4 text-white" />}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                        : 'bg-slate-700 text-gray-100'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {message.sender_name}
                    </div>
                    <div>{message.message}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.sender_id === user?.id && (
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}