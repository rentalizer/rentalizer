import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'richie@dialogo.us';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  read_at?: string;
}

export default function SimplifiedChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('SimplifiedChat render - user:', user);

  // Simple check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('direct_messages')
      .insert({
        sender_id: user.id,
        recipient_id: 'admin-id', // We'll fix this later
        sender_name: user.email?.split('@')[0] || 'User',
        message: newMessage.trim()
      });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setNewMessage('');
      toast({
        title: "Message sent!",
        description: "Your message has been sent to staff"
      });
    }
    
    setLoading(false);
  };

  // Always show the chat interface
  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
            <h2 className="text-white font-semibold">
              {isAdmin ? 'Admin Chat' : 'Chat with Staff'}
            </h2>
          </div>
          {isAdmin && (
            <Crown className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        {user && (
          <div className="text-sm text-gray-400 mt-1">
            Logged in as: {user.email}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
            {!user && (
              <p className="text-sm mt-2">Please sign in to chat with staff</p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
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
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        {user ? (
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
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
        ) : (
          <div className="text-center text-gray-400">
            Please sign in to send messages
          </div>
        )}
      </div>
    </div>
  );
}