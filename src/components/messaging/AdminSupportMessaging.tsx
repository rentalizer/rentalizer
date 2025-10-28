
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { emitManualUnreadChange } from '@/lib/adminSupportManualUnreadBus';

const MANUAL_UNREAD_STORAGE_KEY = 'rentalizerAdminSupportManualUnread';
const MANUAL_UNREAD_MESSAGES_STORAGE_KEY = 'rentalizerAdminSupportManualUnreadMessages';

interface AdminSupportMessagingProps {
  initialMessageUserId?: string;
  initialMessageUserName?: string;
  fromDiscussion?: string;
}

export default function AdminSupportMessaging({ 
  initialMessageUserId, 
  initialMessageUserName, 
  fromDiscussion 
}: AdminSupportMessagingProps = {}) {
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
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [manualUnreadConversationIds, setManualUnreadConversationIds] = useState<string[]>([]);
  const [manualUnreadMessageMap, setManualUnreadMessageMap] = useState<Record<string, string[]>>({});

  const manualUnreadSet = useMemo(() => new Set(manualUnreadConversationIds), [manualUnreadConversationIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(MANUAL_UNREAD_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setManualUnreadConversationIds(parsed.filter((id: unknown): id is string => typeof id === 'string'));
      }
    } catch (error) {
      console.error('Failed to load manual unread conversations from storage', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(MANUAL_UNREAD_MESSAGES_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        const cleaned: Record<string, string[]> = {};
        Object.entries(parsed).forEach(([conversationId, ids]) => {
          if (Array.isArray(ids)) {
            const validIds = ids.filter((id): id is string => typeof id === 'string');
            if (validIds.length > 0) {
              cleaned[conversationId] = validIds;
            }
          }
        });
        setManualUnreadMessageMap(cleaned);
      }
    } catch (error) {
      console.error('Failed to load manual unread messages from storage', error);
    }
  }, []);

  const persistManualUnread = useCallback((ids: string[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MANUAL_UNREAD_STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const persistManualUnreadMessages = useCallback((map: Record<string, string[]>) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MANUAL_UNREAD_MESSAGES_STORAGE_KEY, JSON.stringify(map));
  }, []);

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

  const calculateTotalUnread = useCallback((list: Conversation[], manualSet: Set<string>, manualMap: Record<string, string[]>) => {
    return list.reduce((sum, conv) => {
      const actualUnread = conv.unread_count || 0;
      const manualCount = Math.max(
        manualSet.has(conv.participant_id) ? 1 : 0,
        (manualMap[conv.participant_id] ?? []).length
      );
      return sum + Math.max(actualUnread, manualCount);
    }, 0);
  }, []);

  // Setup WebSocket event listeners
  const setupWebSocketListeners = useCallback(() => {
    // New message received
    websocketService.onNewMessage((data) => {
      const newMessage = data.message;
      
      console.log('📨 Received new message via WebSocket:', {
        messageId: newMessage._id,
        sender_id: newMessage.sender_id,
        sender_idType: typeof newMessage.sender_id,
        currentUserId: user?.id,
        currentUserIdType: typeof user?.id,
        created_at: newMessage.created_at,
        createdAt: (newMessage as { createdAt?: string }).createdAt,
        message: newMessage.message,
        fullMessage: newMessage
      });
      
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

      // Update conversations list without full reload
      setConversations(prev => {
        const senderId = newMessage.sender_id;
        const recipientId = newMessage.recipient_id;
        const otherUserId = senderId === user?.id ? recipientId : senderId;

        const updated = prev.map(conv => {
          if (conv.participant_id === otherUserId) {
            return {
              ...conv,
              last_message: newMessage,
              // Only increment unread if we're not currently viewing this conversation
              unread_count: selectedMemberId === otherUserId ? conv.unread_count : conv.unread_count + 1
            };
          }
          return conv;
        });

        return updated;
      });
    });

    // Message sent confirmation
    websocketService.onMessageSent((data) => {
      if (data.message) {
        console.log('✅ Message sent confirmation via WebSocket:', {
          messageId: data.message._id,
          sender_id: data.message.sender_id,
          sender_idType: typeof data.message.sender_id,
          currentUserId: user?.id,
          currentUserIdType: typeof user?.id,
          created_at: data.message.created_at,
          message: data.message.message
        });
        
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
      console.log('📨 Messages read event received:', data);
      
      // Update message read status
      setMessages(prev => prev.map(msg => 
        msg.recipient_id === user?.id ? { ...msg, read_at: new Date().toISOString() } : msg
      ));
      
      // Update conversations locally instead of reloading
      if (data.userId) {
        setConversations(prev => prev.map(conv => 
          conv.participant_id === data.userId 
            ? { ...conv, unread_count: 0 }
            : conv
        ));
        if (data.readCount > 0) {
          setManualUnreadConversationIds(prev => {
            if (!data.userId) return prev;
            if (!prev.includes(data.userId)) return prev;
            const updated = prev.filter(id => id !== data.userId);
            persistManualUnread(updated);
            emitManualUnreadChange({ conversationId: data.userId });
            return updated;
          });
          setManualUnreadMessageMap(prev => {
            if (!data.userId) return prev;
            if (!prev[data.userId]?.length) return prev;
            const updated = { ...prev };
            delete updated[data.userId];
            persistManualUnreadMessages(updated);
            emitManualUnreadChange({ conversationId: data.userId });
            return updated;
          });
        }
      }
    });

    // Message deleted
    websocketService.onMessageDeleted((data) => {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
      loadConversations();
    });

    // Online users update
    websocketService.onOnlineUsersUpdate((data) => {
      console.log('📊 Received online users update:', data);
      const onlineUserIds = new Set(data.users.map((user: { user_id: string }) => user.user_id));
      setOnlineUsers(onlineUserIds);
    });

    // User online status update
    websocketService.onUserOnlineStatus((data) => {
      console.log('👤 Received user online status update:', data);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.isOnline) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    // Error handling
    websocketService.onError((error) => {
      console.error('WebSocket error:', error);
    });
  }, [user?.id, selectedMemberId, loadConversations, persistManualUnread, persistManualUnreadMessages]);

  // Initialize WebSocket connection
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        await websocketService.connect();
        setWsConnected(true);
        setupWebSocketListeners();
        
        // Request online users for real-time status (both admin and user need this)
        websocketService.requestOnlineUsers();
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
  }, [user, setupWebSocketListeners, isAdmin]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  useEffect(() => {
    setTotalUnread(calculateTotalUnread(conversations, manualUnreadSet, manualUnreadMessageMap));
  }, [conversations, manualUnreadSet, manualUnreadMessageMap, calculateTotalUnread]);

  const markConversationForFollowUp = useCallback((conversationId: string) => {
    setManualUnreadConversationIds(prev => {
      if (prev.includes(conversationId)) return prev;
      const updated = [...prev, conversationId];
      persistManualUnread(updated);
      emitManualUnreadChange({ conversationId });
      return updated;
    });
  }, [persistManualUnread]);

  const clearConversationFollowUp = useCallback((conversationId: string) => {
    setManualUnreadConversationIds(prev => {
      if (!prev.includes(conversationId)) return prev;
      const updated = prev.filter(id => id !== conversationId);
      persistManualUnread(updated);
      emitManualUnreadChange({ conversationId });
      return updated;
    });
  }, [persistManualUnread]);

  const clearManualUnreadMessagesForConversation = useCallback((conversationId: string) => {
    setManualUnreadMessageMap(prev => {
      if (!prev[conversationId]?.length) return prev;
      const updated = { ...prev };
      delete updated[conversationId];
      persistManualUnreadMessages(updated);
      emitManualUnreadChange({ conversationId });
      return updated;
    });
  }, [persistManualUnreadMessages]);

  const toggleManualUnreadMessage = useCallback((conversationId: string, messageId: string) => {
    setManualUnreadMessageMap(prev => {
      const existing = new Set(prev[conversationId] ?? []);
      if (existing.has(messageId)) {
        existing.delete(messageId);
      } else {
        existing.add(messageId);
      }
      const next: Record<string, string[]> = { ...prev };
      if (existing.size > 0) {
        next[conversationId] = Array.from(existing);
      } else {
        delete next[conversationId];
      }
      persistManualUnreadMessages(next);
      emitManualUnreadChange({ conversationId });
      return next;
    });
  }, [persistManualUnreadMessages]);

  // Mark conversation as read
  const handleMarkAsRead = useCallback(async () => {
    if (!selectedMemberId || !user) return;

    try {
      console.log('✅ Marking messages as read for:', selectedMemberId);
      
      // Mark messages as read on backend
      await messagingService.markConversationAsRead(selectedMemberId);
      
      // Update local state immediately (optimistic update)
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.participant_id === selectedMemberId 
            ? { ...conv, unread_count: 0 }
            : conv
        );
        return updated;
      });

      const unreadMessagesCount = conversations.find(c => c.participant_id === selectedMemberId)?.unread_count || 0;

      // Broadcast via WebSocket so other clients update
      // Include the count of messages marked as read
      if (unreadMessagesCount > 0 && wsConnected) {
        websocketService.markMessagesAsRead(selectedMemberId, unreadMessagesCount);
      }
      
      console.log('✅ Messages marked as read (local state updated, count:', unreadMessagesCount, ')');
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // On error, refresh from server
      loadConversations();
    }
  }, [selectedMemberId, user, wsConnected, loadConversations, conversations]);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (memberId: string) => {
    try {
      const response = await messagingService.getConversation(memberId);
      if (response.success) {
        // Messages come in descending order (newest first) from API
        // Reverse them to show oldest first (typical chat order)
        const messagesInChatOrder = [...response.data].reverse();
        
        console.log('📨 Frontend received messages from API:', {
          messageCount: messagesInChatOrder.length,
          messageOrder: messagesInChatOrder.slice(-5).map(msg => ({
            id: msg._id,
            created_at: msg.created_at,
            message: msg.message.substring(0, 20) + '...'
          }))
        });
        setMessages(messagesInChatOrder);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Track if user has manually selected a conversation (clicked on it)
  const [hasUserSelectedConversation, setHasUserSelectedConversation] = useState(false);
  
  // Track the last loaded member to prevent duplicate loads
  const [lastLoadedMemberId, setLastLoadedMemberId] = useState<string | null>(null);

  useEffect(() => {
    // Prevent loading the same conversation multiple times
    if (!selectedMemberId || !user || lastLoadedMemberId === selectedMemberId) {
      return;
    }
    
    console.log('📥 Loading messages for:', selectedMemberId);
    setLastLoadedMemberId(selectedMemberId);
    loadMessages(selectedMemberId);
    
    if (hasUserSelectedConversation) {
      // Mark messages as read after a short delay to allow messages to load
      // This only happens AFTER user clicks on the conversation
      const markReadTimer = setTimeout(() => {
        console.log('⏰ Auto-marking messages as read for:', selectedMemberId);
        handleMarkAsRead();
      }, 1000); // 1 second delay to ensure user sees the messages
      
      return () => {
        clearTimeout(markReadTimer);
      };
    }
  }, [selectedMemberId, user, hasUserSelectedConversation]);

  // Debug logging for user and messages
  useEffect(() => {
    if (user && messages.length > 0) {
      console.log('🔍 Debug - User and Messages:', {
        userId: user.id,
        userIdType: typeof user.id,
        messages: messages.map(msg => ({
          id: msg._id,
          sender_id: msg.sender_id,
          sender_idType: typeof msg.sender_id,
          message: msg.message
        }))
      });
    }
  }, [user, messages]);

  // For members, find the first admin to chat with
  useEffect(() => {
    if (!user || isAdmin || selectedMemberId) return;

    const findAdminAndLoadMessages = async () => {
      try {
        setConnectingToAdmin(true);
        console.log('🔍 Looking for admin user...');
        const response = await messagingService.getFirstAdmin();
        console.log('👤 Admin response:', response);
        if (response.success) {
          console.log('✅ Found admin:', response.data);
          setSelectedMemberId(response.data._id);
          // Don't auto-mark as read for auto-selected admin
          setHasUserSelectedConversation(false);
        } else {
          console.log('❌ No admin found');
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

  // Handle initial message user selection (for admins coming from GroupDiscussions)
  useEffect(() => {
    if (!isAdmin || !initialMessageUserId || selectedMemberId) return;

    console.log('📨 Admin navigating to message user:', initialMessageUserId, 'from discussion:', fromDiscussion);
    
    // Set the selected member to the user we want to message
    setSelectedMemberId(initialMessageUserId);
    setHasUserSelectedConversation(true); // Mark as user-selected so messages are marked as read
    setShowMembersPanel(false); // Ensure chat view is visible, even on mobile

    // Show a toast notification
    if (initialMessageUserName) {
      toast({
        title: "Message User",
        description: `Starting conversation with ${initialMessageUserName}`,
        variant: "default"
      });
    }
  }, [isAdmin, initialMessageUserId, initialMessageUserName, fromDiscussion, selectedMemberId, toast]);

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

  // Handle member selection
  const handleMemberSelect = useCallback((memberId: string) => {
    console.log('👆 User clicked on member:', memberId);
    setSelectedMemberId(memberId);
    setHasUserSelectedConversation(true); // Mark that user actively selected this
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setShowMembersPanel(false);
    }
  }, []);

  const baseSelectedConversation = useMemo(() => {
    if (!selectedMemberId) return undefined;
    return conversations.find(conv => conv.participant_id === selectedMemberId);
  }, [conversations, selectedMemberId]);

  const decoratedConversations = useMemo(() => {
    return conversations.map(conv => {
      const manualMessages = manualUnreadMessageMap[conv.participant_id] ?? [];
      const manualMessageCount = manualMessages.length;
      const manualFlagCount = Math.max(
        manualUnreadSet.has(conv.participant_id) ? 1 : 0,
        manualMessageCount
      );
      const hasManualFlag = manualFlagCount > 0;
      const adjustedUnread = conv.unread_count > 0 ? conv.unread_count : manualFlagCount;
      return {
        ...conv,
        unread_count: adjustedUnread,
        manualUnread: hasManualFlag,
        manualUnreadCount: manualFlagCount,
        manualUnreadMessageIds: manualMessages,
        actualUnreadCount: conv.unread_count
      } as Conversation & {
        manualUnread?: boolean;
        manualUnreadCount?: number;
        manualUnreadMessageIds?: string[];
        actualUnreadCount?: number;
      };
    });
  }, [conversations, manualUnreadSet, manualUnreadMessageMap]);

  const selectedMember = decoratedConversations.find(c => c.participant_id === selectedMemberId);

  const handleToggleManualUnread = useCallback(() => {
    if (!selectedMemberId) return;
    const hasManualFlag = manualUnreadSet.has(selectedMemberId);
    const hasManualMessages = (manualUnreadMessageMap[selectedMemberId] ?? []).length > 0;
    if (hasManualFlag || hasManualMessages) {
      clearConversationFollowUp(selectedMemberId);
      clearManualUnreadMessagesForConversation(selectedMemberId);
    } else {
      markConversationForFollowUp(selectedMemberId);
    }
  }, [
    selectedMemberId,
    manualUnreadSet,
    manualUnreadMessageMap,
    clearConversationFollowUp,
    clearManualUnreadMessagesForConversation,
    markConversationForFollowUp
  ]);

  const handleToggleManualUnreadMessage = useCallback((messageId: string) => {
    if (!selectedMemberId) return;
    toggleManualUnreadMessage(selectedMemberId, messageId);
  }, [selectedMemberId, toggleManualUnreadMessage]);

  const selectedManualMessageIds = useMemo(() => {
    if (!selectedMemberId) return [] as string[];
    return manualUnreadMessageMap[selectedMemberId] ?? [];
  }, [manualUnreadMessageMap, selectedMemberId]);

  const isSelectedManualUnread = useMemo(() => {
    if (!selectedMemberId) return false;
    return manualUnreadSet.has(selectedMemberId) || selectedManualMessageIds.length > 0;
  }, [manualUnreadSet, selectedManualMessageIds, selectedMemberId]);

  const canToggleManualUnread = useMemo(() => {
    if (!baseSelectedConversation) return true;
    return (baseSelectedConversation.unread_count ?? 0) === 0;
  }, [baseSelectedConversation]);

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
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg flex flex-col h-full min-h-0">
            {/* Unread Messages Notification Banner for Users */}
            {totalUnread > 0 && (
              <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2">
                <Bell className="h-4 w-4 text-red-400 animate-pulse" />
                <span className="text-red-400 text-sm font-medium">
                  You have {totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'} from admin support
                </span>
              </div>
            )}
            
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
              isOnline={selectedMemberId ? onlineUsers.has(selectedMemberId) || (selectedMember?.participant as { isOnline?: boolean })?.isOnline || false : false}
              recipientId={selectedMemberId}
              onMarkAsRead={handleMarkAsRead}
            isAdmin={false}
            adminUserId={selectedMemberId || undefined}
            memberAvatarUrl={user.profile_picture || (user as any).profilePicture || undefined}
            />
          </div>
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
    <div className="flex h-[600px] min-h-0 flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg sm:h-[600px] sm:flex-row">
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900/80 px-4 py-2 sm:hidden">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          {showMembersPanel ? (
            <Users className="h-4 w-4 text-cyan-300" />
          ) : (
            <MessageSquare className="h-4 w-4 text-cyan-300" />
          )}
          <span>{showMembersPanel ? 'Members' : 'Support Chat'}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"
          onClick={() => setShowMembersPanel((prev) => !prev)}
        >
          {showMembersPanel ? 'View Chat' : 'View Members'}
        </Button>
      </div>

      {/* Main Chat Area */}
      <div className={`${showMembersPanel ? 'hidden' : 'flex'} flex-1 flex-col bg-slate-800/90 sm:flex min-h-0`}>
        {/* Unread Messages Notification Banner */}
        {totalUnread > 0 && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">
                You have {totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'}
              </span>
            </div>
            <div className="text-xs text-red-300">
              Select a conversation to view
            </div>
          </div>
        )}
        
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
            isOnline={onlineUsers.has(selectedMember.participant_id) || (selectedMember.participant as { isOnline?: boolean }).isOnline || false}
            recipientId={selectedMemberId}
            onMarkAsRead={handleMarkAsRead}
            isAdmin={true}
            adminUserId={user.id}
            memberAvatarUrl={selectedMember.participant.profilePicture}
            onToggleManualUnread={handleToggleManualUnread}
            isManualUnread={isSelectedManualUnread}
            canToggleManualUnread={canToggleManualUnread}
            manualUnreadMessageIds={selectedManualMessageIds}
            onToggleManualUnreadMessage={handleToggleManualUnreadMessage}
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
                {/* Unread messages count */}
                {totalUnread > 0 && (
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-red-400 animate-pulse" />
                    <span className="text-red-400 font-semibold">{totalUnread} unread</span>
                  </div>
                )}
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
      <div className={`${showMembersPanel ? 'flex' : 'hidden'} h-full min-h-0 w-full sm:flex sm:w-80 sm:min-w-[18rem] border-t border-slate-700 bg-slate-900/60 sm:border-t-0 sm:border-l`}>
        <MembersList
          members={decoratedConversations}
          selectedMemberId={selectedMemberId}
          onMemberSelect={handleMemberSelect}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
}
