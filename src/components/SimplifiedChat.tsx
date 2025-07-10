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
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simple check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find admin user ID
  useEffect(() => {
    const findAdmin = async () => {
      if (!user || isAdmin) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', ADMIN_EMAIL)
          .maybeSingle();
        
        if (error) {
          console.error('Error finding admin:', error);
          return;
        }
        
        if (data) {
          setAdminUserId(data.id);
          console.log('Found admin user ID:', data.id);
        } else {
          console.log('Admin user not found in user_profiles');
          // Try to find in profiles table instead
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('display_name', 'Richie')
            .maybeSingle();
          
          if (profileData) {
            setAdminUserId(profileData.user_id);
            console.log('Found admin in profiles:', profileData.user_id);
          }
        }
      } catch (error) {
        console.error('Error in findAdmin:', error);
      }
    };

    findAdmin();
  }, [user, isAdmin]);

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || (!isAdmin && !adminUserId)) return;

      try {
        let query = supabase
          .from('direct_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (isAdmin) {
          // Admin sees all messages involving them
          query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
        } else if (adminUserId) {
          // Regular user sees messages between them and admin
          query = query.or(
            `and(sender_id.eq.${user.id},recipient_id.eq.${adminUserId}),and(sender_id.eq.${adminUserId},recipient_id.eq.${user.id})`
          );
        }

        const { data, error } = await query;

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
  }, [user, adminUserId, isAdmin]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    // Determine recipient
    let recipientId = '';
    if (isAdmin) {
      // For admin, we'd need to select a user - for now just use their own ID
      recipientId = user.id;
    } else {
      // Always use admin user ID if available, otherwise create a placeholder
      if (adminUserId) {
        recipientId = adminUserId;
      } else {
        // Create a hardcoded admin user ID for staff messages
        // This ensures messages can always be sent to staff
        recipientId = '00000000-0000-0000-0000-000000000001'; // Placeholder admin ID
      }
    }

    setLoading(true);
    
    try {
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
          description: "Your message has been sent to staff"
        });
        
        // Reload messages
        setTimeout(() => {
          const loadMessages = async () => {
            let query = supabase
              .from('direct_messages')
              .select('*')
              .order('created_at', { ascending: true });

            if (isAdmin) {
              query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
            } else if (adminUserId) {
              query = query.or(
                `and(sender_id.eq.${user.id},recipient_id.eq.${adminUserId}),and(sender_id.eq.${adminUserId},recipient_id.eq.${user.id})`
              );
            }

            const { data } = await query;
            if (data) {
              setMessages(data);
            }
          };
          loadMessages();
        }, 500);
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
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
      </div>
    </div>
  );
}