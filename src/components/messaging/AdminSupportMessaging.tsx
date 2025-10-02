
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users, Bell, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MessageThread, { Message } from './MessageThread';
import MembersList from './MembersList';
import messagingService, { Conversation, AdminUser } from '@/services/messagingService';
import websocketService from '@/services/websocketService';

export default function AdminSupportMessaging() {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectingToAdmin, setConnectingToAdmin] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);


  // Load conversations or all users (for admins)
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      
      let response;
      if (isAdmin) {
        // For admins, get all users
        response = await messagingService.getAllUsers();
      } else {
        // For regular users, get conversations
        response = await messagingService.getConversations();
      }
      
      if (response.success) {
        setConversations(response.data);
        
        // Calculate total unread
        const total = response.data.reduce((sum, conv) => sum + conv.unread_count, 0);
        setTotalUnread(total);
      }
    } catch (error: unknown) {
      console.error('Error loading conversations:', error);
      
      // Type guard for axios errors
      const isAxiosError = (err: unknown): err is { code?: string; message?: string; response?: { status: number } } => {
        return typeof err === 'object' && err !== null;
      };
      
      if (isAxiosError(error)) {
        // Check if it's a network error (backend not running)
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
          setBackendOffline(true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Setup WebSocket event listeners
  const setupWebSocketListeners = useCallback(() => {
    // New message received
    websocketService.onNewMessage((data) => {
      const newMessage = data.message;
      
      // Add to messages if it's for current conversation
      setMessages(prev => {
        const exists = prev.some(msg => msg._id === newMessage._id);
        if (exists) return prev;
        
        // Check if message is for current conversation
        const isForCurrentConversation = selectedMemberId && 
          (newMessage.sender_id === selectedMemberId || newMessage.recipient_id === selectedMemberId);
        
        if (isForCurrentConversation) {
          return [...prev, newMessage as Message];
        }
        
        return prev;
      });

      // Update conversations list
      loadConversations();
    });

    // Message sent confirmation
    websocketService.onMessageSent((data) => {
      if (data.message) {
        setMessages(prev => {
          const exists = prev.some(msg => msg._id === data.message._id);
          return exists ? prev : [...prev, data.message as Message];
        });
      }
    });

    // Typing indicators
    websocketService.onTypingStart((data) => {
      if (data.recipient_id === user?.id) {
        setIsTyping(true);
      }
    });

    websocketService.onTypingStop((data) => {
      if (data.recipient_id === user?.id) {
        setIsTyping(false);
      }
    });

    // Messages marked as read
    websocketService.onMessagesRead((data) => {
      setMessages(prev => prev.map(msg => 
        msg.recipient_id === user?.id ? { ...msg, read_at: new Date().toISOString() } : msg
      ));
      loadConversations();
    });

    // Message deleted
    websocketService.onMessageDeleted((data) => {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
      loadConversations();
    });

    // Error handling
    websocketService.onError((error) => {
      console.error('WebSocket error:', error);
    });
  }, [user?.id, selectedMemberId, loadConversations]);

  // Initialize WebSocket connection
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        await websocketService.connect();
        setWsConnected(true);
        setupWebSocketListeners();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setWsConnected(false);
      }
    };

    if (user) {
      initWebSocket();
    }

    return () => {
      websocketService.disconnect();
      setWsConnected(false);
    };
  }, [user, setupWebSocketListeners]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);


  // Load messages for selected conversation
  const loadMessages = useCallback(async (memberId: string) => {
    try {
      const response = await messagingService.getConversation(memberId);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedMemberId && user) {
      loadMessages(selectedMemberId);
    }
  }, [selectedMemberId, user, loadMessages]);

  // For members, find the first admin to chat with
  useEffect(() => {
    if (!user || isAdmin || selectedMemberId) return;

    const findAdminAndLoadMessages = async () => {
      try {
        setConnectingToAdmin(true);
        const response = await messagingService.getFirstAdmin();
        if (response.success) {
          setSelectedMemberId(response.data._id);
        } else {
          toast({
            title: "No Admin Available",
            description: "No admin users are currently available for support.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error finding admin:', error);
        toast({
          title: "Connection Issue",
          description: "Unable to connect to admin support at the moment. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setConnectingToAdmin(false);
      }
    };

    findAdminAndLoadMessages();
  }, [user, isAdmin, selectedMemberId, toast]);

  // Send message
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!user || !selectedMemberId || !messageContent.trim()) {
      return;
    }

    try {
      setSendingMessage(true);

      // Send via WebSocket for real-time delivery
      if (wsConnected) {
        websocketService.sendMessage({
          recipient_id: selectedMemberId,
          message: messageContent.trim(),
          message_type: 'text',
          support_category: 'general',
          priority: 'medium'
        });
      } else {
        // Fallback to REST API
        const response = await messagingService.sendMessage({
          recipient_id: selectedMemberId,
          message: messageContent.trim(),
          message_type: 'text',
          support_category: 'general',
          priority: 'medium'
        });

        if (response.success) {
          setMessages(prev => [...prev, response.data]);
          loadConversations();
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  }, [user, selectedMemberId, wsConnected, loadConversations]);

  // Mark conversation as read
  const handleMarkAsRead = useCallback(async () => {
    if (!selectedMemberId || !user) return;

    try {
      await messagingService.markConversationAsRead(selectedMemberId);
      if (wsConnected) {
        websocketService.markMessagesAsRead(selectedMemberId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [selectedMemberId, user, wsConnected]);

  // Handle member selection
  const handleMemberSelect = useCallback((memberId: string) => {
    setSelectedMemberId(memberId);
  }, []);

  const selectedMember = conversations.find(c => c.participant_id === selectedMemberId);

  // Early return check - before any conditional hooks
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

  // Show backend offline message
  if (backendOffline) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800/90 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Backend Server Offline</p>
          <p className="text-slate-300 text-sm mb-4">
            The messaging service is currently unavailable. Please ensure the backend server is running.
          </p>
          <Button 
            onClick={() => {
              setBackendOffline(false);
              loadConversations();
            }}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }


  // Member view - simple chat with admin
  if (!isAdmin) {
    return (
      <div className="h-[600px] max-w-4xl mx-auto">
        {connectingToAdmin ? (
          <div className="bg-slate-800/90 rounded-lg p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-300">Connecting to admin support...</p>
          </div>
        ) : loading ? (
          <div className="bg-slate-800/90 rounded-lg p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-300">Loading messages...</p>
          </div>
        ) : (
          <MessageThread
            messages={messages}
            currentUserId={user.id}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            recipientName={selectedMember?.participant ? 
              `${selectedMember.participant.firstName} ${selectedMember.participant.lastName}`.trim() || 
              selectedMember.participant.email.split('@')[0] : 
              "Admin Support"
            }
            recipientAvatar={selectedMember?.participant.profilePicture}
            isOnline={true}
            recipientId={selectedMemberId}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
        
        {/* Connection status indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-slate-400">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    );
  }

  // Admin view - full messaging interface
  return (
    <div className="h-[600px] flex bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-800/90">
        {selectedMember ? (
          <MessageThread
            messages={messages}
            currentUserId={user.id}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            recipientName={selectedMember.participant ? 
              `${selectedMember.participant.firstName} ${selectedMember.participant.lastName}`.trim() || 
              selectedMember.participant.email.split('@')[0] : 
              "Unknown User"
            }
            recipientAvatar={selectedMember.participant.profilePicture}
            isOnline={true}
            recipientId={selectedMemberId}
            onMarkAsRead={handleMarkAsRead}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-800/90">
            <div className="text-center p-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Admin Support Center
              </h3>
              <p className="text-slate-400 mb-4 max-w-md">
                Select a user from the list to start or continue a conversation.
                You can help resolve issues and provide support directly through this interface.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>{totalUnread} unread</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{conversations.length} conversations</span>
                </div>
              </div>
              
              {/* Connection status */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-400">
                  {wsConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <MembersList
        members={conversations}
        selectedMemberId={selectedMemberId}
        onMemberSelect={handleMemberSelect}
      />
    </div>
  );
}
