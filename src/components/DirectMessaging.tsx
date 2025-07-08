import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

interface Profile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

interface Conversation {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const DirectMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch all users for starting new conversations
  const fetchAllUsers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .neq('user_id', user.id)
        .not('display_name', 'is', null);

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch conversations with latest message and unread count
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: messages, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      let totalUnread = 0;

      messages?.forEach(msg => {
        const partnerId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const partnerName = msg.sender_id === user.id ? 
          (msg.sender_name || 'Unknown') : 
          msg.sender_name;

        if (!conversationMap.has(partnerId)) {
          const unreadCount = messages.filter(m => 
            m.sender_id === partnerId && 
            m.recipient_id === user.id && 
            !m.read_at
          ).length;

          totalUnread += unreadCount;

          conversationMap.set(partnerId, {
            user_id: partnerId,
            display_name: partnerName,
            avatar_url: null,
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: unreadCount
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async (partnerId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('direct_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .is('read_at', null);

      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!user || !activeConversation || !newMessage.trim()) return;

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
          recipient_id: activeConversation,
          sender_name: senderName,
          message: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Get recipient info for email notification
      const { data: recipient } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', activeConversation)
        .single();

      const { data: recipientAuth } = await supabase.auth.admin.getUserById(activeConversation);

      if (recipientAuth.user?.email) {
        // Send email notification
        try {
          await supabase.functions.invoke('send-dm-notification', {
            body: {
              recipient_email: recipientAuth.user.email,
              recipient_name: recipient?.display_name || 'User',
              sender_name: senderName,
              message_preview: newMessage.trim().substring(0, 100) + (newMessage.length > 100 ? '...' : ''),
              chat_url: `${window.location.origin}/community?chat=${user.id}`
            }
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      }

      setNewMessage('');
      fetchMessages(activeConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Start new conversation
  const startConversation = async (partnerId: string) => {
    setActiveConversation(partnerId);
    setShowUserList(false);
    await fetchMessages(partnerId);
  };

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('direct-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          const newMsg = payload.new as DirectMessage;
          
          // If it's for the current conversation, add it to messages
          if (activeConversation && 
              ((newMsg.sender_id === user.id && newMsg.recipient_id === activeConversation) ||
               (newMsg.sender_id === activeConversation && newMsg.recipient_id === user.id))) {
            setMessages(prev => [...prev, newMsg]);
            
            // Auto-mark as read if conversation is open
            if (newMsg.sender_id === activeConversation) {
              setTimeout(() => {
                supabase
                  .from('direct_messages')
                  .update({ read_at: new Date().toISOString() })
                  .eq('id', newMsg.id);
              }, 1000);
            }
          }
          
          // Refresh conversations for unread count
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversation]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchAllUsers();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) return null;

  return (
    <>
      {/* Chat button with notification badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          data-dm-trigger
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat interface */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-96 h-[500px] z-40 border-cyan-500/20 bg-slate-800/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-b border-cyan-500/20 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg">
                {activeConversation ? 
                  conversations.find(c => c.user_id === activeConversation)?.display_name || 'Chat' :
                  'Messages'
                }
              </CardTitle>
              <div className="flex gap-2">
                {!activeConversation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserList(!showUserList)}
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                )}
                {activeConversation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveConversation(null)}
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    ←
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-[420px] flex flex-col">
            {!activeConversation ? (
              <div className="flex-1 overflow-y-auto">
                {/* Show user list or conversations */}
                {showUserList ? (
                  <div className="p-4">
                    <h3 className="text-white text-sm font-medium mb-3">Start new conversation</h3>
                    <div className="space-y-2">
                      {allUsers.map(user => (
                        <div
                          key={user.user_id}
                          onClick={() => startConversation(user.user_id)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-300">{user.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="text-white text-sm font-medium mb-3">Conversations</h3>
                    <div className="space-y-2">
                      {conversations.map(conv => (
                        <div
                          key={conv.user_id}
                          onClick={() => startConversation(conv.user_id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 font-medium">{conv.display_name}</span>
                              {conv.unread_count > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conv.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm truncate">
                              {conv.last_message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender_id === user.id
                            ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                            : 'bg-slate-700 text-gray-300'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
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
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};