import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

const ADMIN_EMAIL = 'richie@dialogo.us';

export const SimplifiedChat = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find admin user ID
  const findAdminUserId = async () => {
    try {
      console.log('Looking for admin user with email:', ADMIN_EMAIL);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', ADMIN_EMAIL)
        .single();

      console.log('Admin lookup result:', { data, error });
      if (error) throw error;
      setAdminUserId(data?.id || null);
      console.log('Admin user ID set to:', data?.id || null);
    } catch (error) {
      console.error('Error finding admin:', error);
      // Set a fallback so component doesn't stay stuck
      setAdminUserId('not-found');
    }
  };

  // Fetch all users (for admin view)
  const fetchAllUsers = async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .not('display_name', 'is', null);

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch messages between user and admin (or selected user if admin)
  const fetchMessages = async () => {
    if (!user) return;
    
    let chatPartnerId: string | null = null;
    
    if (isAdmin) {
      // Admin can select any user to chat with
      chatPartnerId = selectedUserId;
    } else {
      // Regular users chat with admin
      chatPartnerId = adminUserId;
    }

    if (!chatPartnerId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('direct_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', chatPartnerId)
        .eq('recipient_id', user.id)
        .is('read_at', null);

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    let recipientId: string | null = null;
    
    if (isAdmin) {
      recipientId = selectedUserId;
    } else {
      recipientId = adminUserId;
    }

    if (!recipientId) {
      toast({
        title: "Error",
        description: "Cannot send message - recipient not found",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get sender name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      const senderName = profile?.display_name || user.email || 'Unknown';

      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          sender_name: senderName,
          message: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-dm-notification', {
          body: {
            recipient_id: recipientId,
            sender_name: senderName,
            message_preview: newMessage.trim().substring(0, 100) + (newMessage.length > 100 ? '...' : ''),
            chat_url: `${window.location.origin}/community#messages`
          }
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }

      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Get display name for a user
  const getUserDisplayName = (userId: string) => {
    if (isAdmin) {
      const user = allUsers.find(u => u.user_id === userId);
      return user?.display_name || 'Unknown User';
    }
    return 'Richie (Admin)';
  };

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('simplified-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          
          // Check if this message is relevant to current conversation
          const isRelevant = isAdmin ? 
            (selectedUserId && ((newMsg.sender_id === user.id && newMsg.recipient_id === selectedUserId) ||
             (newMsg.sender_id === selectedUserId && newMsg.recipient_id === user.id))) :
            (adminUserId && ((newMsg.sender_id === user.id && newMsg.recipient_id === adminUserId) ||
             (newMsg.sender_id === adminUserId && newMsg.recipient_id === user.id)));
          
          if (isRelevant) {
            setMessages(prev => [...prev, newMsg]);
            
            // Auto-mark as read if message is from partner
            if (newMsg.sender_id !== user.id) {
              setTimeout(() => {
                supabase
                  .from('direct_messages')
                  .update({ read_at: new Date().toISOString() })
                  .eq('id', newMsg.id);
              }, 1000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, selectedUserId, adminUserId]);

  useEffect(() => {
    if (user) {
      findAdminUserId();
      fetchAllUsers();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchMessages();
  }, [user, adminUserId, selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) return (
    <div className="h-full flex items-center justify-center bg-slate-800/50 rounded-lg">
      <div className="text-center p-8">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-white font-semibold mb-2">Join the Conversation</h3>
        <p className="text-gray-400 mb-4">Please log in to chat with Richie and other community members</p>
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
        >
          Sign In
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
            <h2 className="text-white font-semibold">
              {isAdmin ? 'Admin Chat' : 'Chat with Richie'}
            </h2>
          </div>
          {isAdmin && (
            <Crown className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        
        {/* User selector for admin */}
        {isAdmin && (
          <div className="mt-3">
            <select
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(e.target.value || null)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Select a user to chat with...</option>
              {allUsers.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.display_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat partner info */}
      {((isAdmin && selectedUserId) || (!isAdmin && adminUserId)) && (
        <div className="p-3 border-b border-gray-700 bg-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full flex items-center justify-center">
              {isAdmin ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Crown className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-medium text-sm">
                {isAdmin ? getUserDisplayName(selectedUserId!) : 'Richie Matthews'}
              </p>
              <p className="text-gray-400 text-xs">
                {isAdmin ? 'Community Member' : 'Community Admin'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            {isAdmin ? (
              selectedUserId ? 'No messages yet. Start the conversation!' : 'Select a user to start chatting'
            ) : (
              adminUserId ? 'No messages yet. Say hello to Richie!' : 'Loading...'
            )}
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender_id === user.id
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                      : 'bg-slate-700 text-gray-300'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      {((isAdmin && selectedUserId) || (!isAdmin && adminUserId)) && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAdmin ? "Type your message..." : "Ask Richie anything..."}
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};