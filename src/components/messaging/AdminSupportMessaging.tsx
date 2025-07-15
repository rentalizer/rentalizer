
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MessageThread, { Message } from './MessageThread';
import MembersList, { Member } from './MembersList';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
}

export default function AdminSupportMessaging() {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectingToAdmin, setConnectingToAdmin] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // Load members (for admin view)
  useEffect(() => {
    if (!user || !isAdmin) return;

    const loadMembers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            user_id,
            display_name,
            first_name,
            last_name,
            avatar_url
          `);

        if (error) {
          console.error('Error loading members:', error);
          return;
        }

        // Get user roles to identify admins
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id, role');

        // Load conversations for each member
        const membersList: Member[] = await Promise.all(
          profiles
            .filter(profile => profile.user_id !== user.id)
            .map(async (profile) => {
              const isUserAdmin = userRoles?.some(
                role => role.user_id === profile.user_id && role.role === 'admin'
              );

              // Get latest message with this member
              const { data: latestMessage } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},recipient_id.eq.${profile.user_id}),and(sender_id.eq.${profile.user_id},recipient_id.eq.${user.id})`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              // Count unread messages from this member
              const { count: unreadCount } = await supabase
                .from('direct_messages')
                .select('*', { count: 'exact', head: true })
                .eq('sender_id', profile.user_id)
                .eq('recipient_id', user.id)
                .is('read_at', null);

              return {
                id: profile.user_id,
                name: profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
                email: profile.user_id, // We don't have email in profiles, using user_id as fallback
                avatar: profile.avatar_url,
                isOnline: false, // TODO: Implement presence
                unreadCount: unreadCount || 0,
                isAdmin: isUserAdmin || false,
                lastMessage: latestMessage ? {
                  content: latestMessage.message,
                  timestamp: latestMessage.created_at,
                  isFromMember: latestMessage.sender_id !== user.id
                } : undefined
              };
            })
        );

        setMembers(membersList);
        
        // Calculate total unread
        const total = membersList.reduce((sum, member) => sum + member.unreadCount, 0);
        setTotalUnread(total);
        
      } catch (error) {
        console.error('Error in loadMembers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [user, isAdmin]);

  // For members, find admin to connect with - IMPROVED LOGIC
  useEffect(() => {
    if (!user || isAdmin || selectedMemberId) return;

    const findAdminToConnect = async () => {
      try {
        setConnectingToAdmin(true);
        console.log('🔍 Member finding admin to chat with...');
        
        // First, try to find an existing conversation with an admin
        const { data: existingMessages } = await supabase
          .from('direct_messages')
          .select('sender_id, recipient_id')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (existingMessages && existingMessages.length > 0) {
          // Get all user IDs from existing conversations
          const conversationUserIds = new Set<string>();
          existingMessages.forEach(msg => {
            if (msg.sender_id !== user.id) conversationUserIds.add(msg.sender_id);
            if (msg.recipient_id !== user.id) conversationUserIds.add(msg.recipient_id);
          });

          // Check if any of these users are admins
          if (conversationUserIds.size > 0) {
            const { data: adminRoles } = await supabase
              .from('user_roles')
              .select('user_id')
              .eq('role', 'admin')
              .in('user_id', Array.from(conversationUserIds));

            if (adminRoles && adminRoles.length > 0) {
              const existingAdminId = adminRoles[0].user_id;
              console.log('✅ Found existing admin conversation:', existingAdminId);
              setSelectedMemberId(existingAdminId);
              setConnectingToAdmin(false);
              return;
            }
          }
        }

        // If no existing conversation, find any available admin
        const { data: adminRoles, error: adminError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(5); // Get multiple admins to choose from

        if (adminError) {
          console.error('❌ Error finding admin:', adminError);
          toast({
            title: "Connection Error",
            description: "Could not connect to admin support. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        if (adminRoles && adminRoles.length > 0) {
          // Choose the first available admin (you could implement more sophisticated logic here)
          const adminId = adminRoles[0].user_id;
          console.log('✅ Connected to admin:', adminId);
          setSelectedMemberId(adminId);
          
          toast({
            title: "Connected to Admin Support",
            description: "You are now connected to our admin team. Send your message below.",
          });
        } else {
          console.log('❌ No admin found');
          toast({
            title: "Admin Unavailable",
            description: "No admin is currently available. Please try again later or contact us directly.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('❌ Error in findAdminToConnect:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to admin support. Please try again.",
          variant: "destructive"
        });
      } finally {
        setConnectingToAdmin(false);
        setLoading(false);
      }
    };

    findAdminToConnect();
  }, [user, isAdmin, selectedMemberId, toast]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!user || !selectedMemberId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        console.log('📨 Loading messages for conversation:', { userId: user.id, selectedMemberId });
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedMemberId}),and(sender_id.eq.${selectedMemberId},recipient_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading messages:', error);
          setMessages([]);
          return;
        }

        const formattedMessages: Message[] = (data || []).map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.recipient_id,
          message: msg.message,
          timestamp: msg.created_at,
          isRead: !!msg.read_at,
          messageType: 'text',
          senderName: msg.sender_name
        }));

        setMessages(formattedMessages);

        // Mark messages as read if current user is recipient
        const unreadMessages = data
          ?.filter(msg => msg.recipient_id === user.id && !msg.read_at)
          ?.map(msg => msg.id) || [];

        if (unreadMessages.length > 0) {
          await supabase
            .from('direct_messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages);

          // Update member unread count in local state
          setMembers(prev => prev.map(member => 
            member.id === selectedMemberId 
              ? { ...member, unreadCount: 0 }
              : member
          ));
        }

      } catch (error) {
        console.error('Error in loadMessages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [user, selectedMemberId]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('direct_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          const newMessage = payload.new as any;
          
          // Only process if it's for current conversation or affects member list
          const isCurrentConversation = selectedMemberId &&
            ((newMessage.sender_id === user.id && newMessage.recipient_id === selectedMemberId) ||
             (newMessage.sender_id === selectedMemberId && newMessage.recipient_id === user.id));

          // Add to messages if it's for current conversation
          if (isCurrentConversation) {
            const formattedMessage: Message = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              receiverId: newMessage.recipient_id,
              message: newMessage.message,
              timestamp: newMessage.created_at,
              isRead: !!newMessage.read_at,
              messageType: 'text',
              senderName: newMessage.sender_name
            };
            
            // Only add if not already in state (avoid duplicates)
            setMessages(prev => {
              const exists = prev.some(msg => msg.id === formattedMessage.id);
              return exists ? prev : [...prev, formattedMessage];
            });
          }

          // Update members list for admin view
          if (isAdmin && newMessage.sender_id !== user.id) {
            setMembers(prev => prev.map(member => {
              if (member.id === newMessage.sender_id) {
                return {
                  ...member,
                  unreadCount: selectedMemberId === member.id ? member.unreadCount : member.unreadCount + 1,
                  lastMessage: {
                    content: newMessage.message,
                    timestamp: newMessage.created_at,
                    isFromMember: true
                  }
                };
              }
              return member;
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          
          // Update read status in local state
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id 
              ? { ...msg, isRead: !!updatedMessage.read_at }
              : msg
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedMemberId, isAdmin]);

  const handleSendMessage = async (messageContent: string) => {
    if (!user || !selectedMemberId || !messageContent.trim()) {
      console.error('❌ Cannot send message - missing requirements:', {
        user: !!user,
        selectedMemberId: !!selectedMemberId,
        messageContent: messageContent.trim()
      });
      toast({
        title: "Cannot send message",
        description: "Please make sure you're connected to admin support and have entered a message.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('🚀 Sending message:', {
      sender_id: user.id,
      recipient_id: selectedMemberId,
      message: messageContent.trim()
    });

    try {
      // Get sender profile info for display name
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('display_name, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      const senderName = senderProfile?.display_name || 
        `${senderProfile?.first_name || ''} ${senderProfile?.last_name || ''}`.trim() ||
        user.email?.split('@')[0] || 'User';

      console.log('👤 Sender name resolved:', senderName);

      // Create optimistic message first for immediate UI feedback
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user.id,
        receiverId: selectedMemberId,
        message: messageContent.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        messageType: 'text',
        senderName: senderName
      };

      // Add to UI immediately
      setMessages(prev => [...prev, optimisticMessage]);

      // Insert message to database
      const { data: newMessage, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMemberId,
          sender_name: senderName,
          message: messageContent.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error sending message:', error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        toast({
          title: "Message Failed",
          description: error.message || "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Message sent successfully:', newMessage);

      // Replace optimistic message with real message
      if (newMessage) {
        const formattedMessage: Message = {
          id: newMessage.id,
          senderId: newMessage.sender_id,
          receiverId: newMessage.recipient_id,
          message: newMessage.message,
          timestamp: newMessage.created_at,
          isRead: false,
          messageType: 'text',
          senderName: newMessage.sender_name
        };
        
        // Replace the optimistic message with the real one
        setMessages(prev => prev.map(msg => 
          msg.id === optimisticMessage.id ? formattedMessage : msg
        ));
      }

      toast({
        title: "Message sent!",
        description: "Your message has been delivered to admin support.",
      });

    } catch (error) {
      console.error('❌ Error in handleSendMessage:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };

  const selectedMember = members.find(m => m.id === selectedMemberId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800/90 rounded-lg">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Please log in to access messaging</p>
          <p className="text-slate-300 text-sm">You need to be authenticated to send and receive messages.</p>
        </div>
      </div>
    );
  }

  if (loading || connectingToAdmin) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800/90 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-white">
            {connectingToAdmin ? 'Connecting to admin support...' : 'Loading messages...'}
          </p>
        </div>
      </div>
    );
  }

  // Member view - simple chat with admin
  if (!isAdmin) {
    return (
      <div className="h-[600px] max-w-4xl mx-auto">
        <div className="bg-slate-700/50 border border-border rounded-lg p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-white">Contact Admin Support</h2>
            {totalUnread > 0 && (
              <Badge variant="destructive">{totalUnread}</Badge>
            )}
          </div>
          <p className="text-slate-300 mb-4">
            Need help? Send a message to our admin team and we'll get back to you as soon as possible.
          </p>
          {selectedMemberId && (
            <p className="text-green-400 text-sm">
              ✅ Connected to admin support - you can now send messages below
            </p>
          )}
        </div>

        {selectedMemberId ? (
          <MessageThread
            messages={messages}
            currentUserId={user.id}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            recipientName="Admin Support"
            isOnline={true}
          />
        ) : (
          <div className="bg-slate-800/90 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-slate-300">Connecting to admin support...</p>
            <p className="text-slate-400 text-sm mt-2">
              If this takes too long, please refresh the page and try again
            </p>
          </div>
        )}
      </div>
    );
  }

  // Admin view - full messaging interface
  return (
    <div className="h-[600px] flex bg-card border border-border rounded-lg overflow-hidden shadow-lg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-800/90">
        {selectedMember ? (
          <MessageThread
            messages={messages}
            currentUserId={user.id}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            recipientName={selectedMember.name}
            recipientAvatar={selectedMember.avatar}
            isOnline={selectedMember.isOnline}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-800/90 border-r-2 border-border">
            <div className="text-center p-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/70" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Admin Support Center
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Select a member from the list to start or continue a conversation.
                You can help resolve issues and provide support directly through this interface.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>{totalUnread} unread</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{members.length} members</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <MembersList
        members={members}
        selectedMemberId={selectedMemberId}
        onMemberSelect={setSelectedMemberId}
      />
    </div>
  );
}
