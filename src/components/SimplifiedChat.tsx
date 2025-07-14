
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

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
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const { unreadCount, refreshUnreadCount } = useUnreadMessages();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get available admin users
  useEffect(() => {
    const fetchAdminUsers = async () => {
      if (!user) return;
      
      // If current user is admin (including development mode), always include them
      if (isAdmin) {
        console.log('✅ Current user is admin, using them as admin user:', user.id);
        setAdminUsers([user.id]);
        return;
      }
      
      // For non-admin users, fetch actual admin users from database
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');
        
        if (data && data.length > 0) {
          const adminIds = data.map(role => role.user_id);
          setAdminUsers(adminIds);
        } else {
          setAdminUsers([]);
        }
      } catch (error) {
        console.error('Error fetching admin users:', error);
        setAdminUsers([]);
      }
    };

    fetchAdminUsers();
  }, [user, isAdmin]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load existing messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || adminUsers.length === 0) return;

      try {
        let query = supabase
          .from('direct_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (isAdmin) {
          // Admin sees all messages where any admin is either sender OR recipient
          const adminFilters = adminUsers.map(adminId => 
            `sender_id.eq.${adminId},recipient_id.eq.${adminId}`
          ).join(',');
          query = query.or(adminFilters);
        } else {
          // Regular user sees conversation with any admin
          const userToAdminFilters = adminUsers.map(adminId =>
            `and(sender_id.eq.${user.id},recipient_id.eq.${adminId}),and(sender_id.eq.${adminId},recipient_id.eq.${user.id})`
          ).join(',');
          query = query.or(userToAdminFilters);
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
  }, [user, isAdmin, adminUsers]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    console.log('🚀 SEND MESSAGE DEBUG:', {
      isAdmin,
      adminUsersLength: adminUsers.length,
      adminUsers,
      userID: user?.id,
      userEmail: user?.email
    });

    // For admin users, they should always be able to send messages
    // For non-admin users, check if there are admin users available
    if (!isAdmin && adminUsers.length === 0) {
      console.log('❌ BLOCKING: Non-admin user with no admin users available');
      toast({
        title: "No administrators available",
        description: "Please try again later.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ PROCEEDING with message send');

    // Determine recipient based on role
    let recipientId: string;
    
    if (isAdmin) {
      // Admin needs to reply to the latest user who sent a message
      const latestUserMessage = messages
        .filter(msg => !adminUsers.includes(msg.sender_id) && adminUsers.includes(msg.recipient_id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (latestUserMessage) {
        recipientId = latestUserMessage.sender_id;
      } else {
        // Fallback: if no user messages found, send to user ID (admin to themselves for testing)
        recipientId = user.id;
      }
    } else {
      // Non-admin always sends to first available admin
      recipientId = adminUsers[0];
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
          description: isAdmin ? "Message sent" : "Your message has been sent to staff"
        });
        
        // Reload messages after sending
        setTimeout(() => {
          const loadMessages = async () => {
            let query = supabase
              .from('direct_messages')
              .select('*')
              .order('created_at', { ascending: true });

            if (isAdmin) {
              const adminFilters = adminUsers.map(adminId => 
                `sender_id.eq.${adminId},recipient_id.eq.${adminId}`
              ).join(',');
              query = query.or(adminFilters);
            } else {
              const userToAdminFilters = adminUsers.map(adminId =>
                `and(sender_id.eq.${user.id},recipient_id.eq.${adminId}),and(sender_id.eq.${adminId},recipient_id.eq.${user.id})`
              ).join(',');
              query = query.or(userToAdminFilters);
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

  // Mark messages as read when admin opens chat
  useEffect(() => {
    if (isAdmin && messages.length > 0 && adminUsers.length > 0) {
      const markAsRead = async () => {
        const unreadMessages = messages.filter(msg => 
          adminUsers.includes(msg.recipient_id) && 
          !adminUsers.includes(msg.sender_id) && 
          !msg.read_at
        );

        if (unreadMessages.length > 0) {
          const { error } = await supabase
            .from('direct_messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(msg => msg.id));
          
          if (!error) {
            console.log('Marked messages as read, refreshing count');
            // Force refresh the unread count after marking as read
            setTimeout(() => {
              refreshUnreadCount();
            }, 500);
          }
        }
      };
      
      markAsRead();
    }
  }, [isAdmin, messages, user?.id, refreshUnreadCount, adminUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              {isAdmin && unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
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
