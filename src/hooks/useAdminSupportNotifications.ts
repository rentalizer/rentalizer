import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import messagingService, { Conversation } from '@/services/messagingService';
import websocketService from '@/services/websocketService';
import { subscribeManualUnread } from '@/lib/adminSupportManualUnreadBus';

const MANUAL_UNREAD_STORAGE_KEY = 'rentalizerAdminSupportManualUnread';
const MANUAL_UNREAD_MESSAGES_STORAGE_KEY = 'rentalizerAdminSupportManualUnreadMessages';

export const useAdminSupportNotifications = () => {
  const [adminSupportUnreadCount, setAdminSupportUnreadCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);
  const { user } = useAuth();
  const lastFetchTimeRef = useRef(0);
  const pendingUpdateRef = useRef(false);
  const baseUnreadRef = useRef(0);
  const lastConversationsRef = useRef<Conversation[]>([]);

  const readManualFlags = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        manualConversationIds: new Set<string>(),
        manualMessageMap: {} as Record<string, string[]>
      };
    }

    let conversationIds: string[] = [];
    let messageMap: Record<string, string[]> = {};

    try {
      const storedConversations = window.localStorage.getItem(MANUAL_UNREAD_STORAGE_KEY);
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        if (Array.isArray(parsed)) {
          conversationIds = parsed.filter((id: unknown): id is string => typeof id === 'string');
        }
      }
    } catch (error) {
      console.error('Failed to parse manual unread conversations storage', error);
    }

    try {
      const storedMessages = window.localStorage.getItem(MANUAL_UNREAD_MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        if (parsed && typeof parsed === 'object') {
          Object.entries(parsed).forEach(([conversationId, ids]) => {
            if (Array.isArray(ids)) {
              const validIds = ids.filter((id): id is string => typeof id === 'string');
              if (validIds.length > 0) {
                messageMap[conversationId] = validIds;
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to parse manual unread messages storage', error);
    }

    return {
      manualConversationIds: new Set(conversationIds),
      manualMessageMap: messageMap
    };
  }, []);

  const computeManualExtras = useCallback((conversations?: Conversation[]) => {
    const { manualConversationIds, manualMessageMap } = readManualFlags();
    const manualMessageMapCopy: Record<string, string[]> = { ...manualMessageMap };
    const convs = conversations && conversations.length ? conversations : lastConversationsRef.current || [];

    let manualExtra = 0;

    convs.forEach(conv => {
      const convId = conv.participant_id;
      const actualUnread = conv.unread_count || 0;
      const manualMessages = manualMessageMapCopy[convId] ?? [];
      const manualMessagesCount = manualMessages.length;
      const hasManualConversationFlag = manualConversationIds.has(convId) ? 1 : 0;
      const manualCount = Math.max(hasManualConversationFlag, manualMessagesCount);

      if (manualCount > actualUnread) {
        manualExtra += manualCount - actualUnread;
      }

      manualConversationIds.delete(convId);
      delete manualMessageMapCopy[convId];
    });

    // Conversations flagged manually but not present in the fetched list
    manualConversationIds.forEach(convId => {
      const manualMessages = manualMessageMapCopy[convId] ?? [];
      const manualCount = Math.max(1, manualMessages.length);
      manualExtra += manualCount;
      delete manualMessageMapCopy[convId];
    });

    // Remaining manual message entries without a conversation flag
    Object.values(manualMessageMapCopy).forEach(ids => {
      manualExtra += ids.length;
    });

    return manualExtra;
  }, [readManualFlags]);

  const recomputeTotal = useCallback((baseCount: number, conversations?: Conversation[]) => {
    const manualExtra = computeManualExtras(conversations);
    const combined = baseCount + manualExtra;
    setAdminSupportUnreadCount(combined);
    setHasNotification(combined > 0);
  }, [computeManualExtras]);

  const fetchAdminSupportUnreadCount = useCallback(async (force = false) => {
    if (!user) {
      baseUnreadRef.current = 0;
      lastConversationsRef.current = [];
      setAdminSupportUnreadCount(0);
      setHasNotification(false);
      return;
    }

    if (!force && pendingUpdateRef.current) {
      console.log('⏭️ Skipping admin support fetch - pending local update');
      return;
    }

    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 10000) {
      console.log('⏭️ Skipping admin support fetch - too soon after local update');
      return;
    }

    try {
      const response = await messagingService.getConversations();
      if (response.success) {
        lastFetchTimeRef.current = now;
        lastConversationsRef.current = response.data;
        const serverUnread = response.data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
        baseUnreadRef.current = serverUnread;
        console.log('📬 Fetched admin support unread count from server:', serverUnread);
        recomputeTotal(serverUnread, response.data);
        pendingUpdateRef.current = false;
      }
    } catch (error) {
      console.error('Error fetching admin support unread count:', error);
    }
  }, [user, recomputeTotal]);

  const clearNotification = useCallback(() => {
    console.log('🔔 Clearing admin support notification');
    setHasNotification(false);
  }, []);

  useEffect(() => {
    if (!user) {
      baseUnreadRef.current = 0;
      lastConversationsRef.current = [];
      setAdminSupportUnreadCount(0);
      setHasNotification(false);
      return;
    }

    baseUnreadRef.current = 0;
    lastConversationsRef.current = [];
    recomputeTotal(0);
    fetchAdminSupportUnreadCount();

    const handleNewMessage = (data: any) => {
      console.log('📨 New admin support message received, updating notification');
      if (data.message && data.message.recipient_id === user.id) {
        baseUnreadRef.current += 1;
        recomputeTotal(baseUnreadRef.current);
      }
    };

    const handleMessagesRead = (data: any) => {
      console.log('✅ Admin support messages marked as read, data:', data);
      
      pendingUpdateRef.current = true;
      lastFetchTimeRef.current = Date.now();
      
      if (data.count !== undefined && data.count > 0) {
        baseUnreadRef.current = Math.max(0, baseUnreadRef.current - data.count);
        console.log(`📬 Adjusting base unread count locally: ${baseUnreadRef.current}`);
        recomputeTotal(baseUnreadRef.current);

        setTimeout(() => {
          pendingUpdateRef.current = false;
        }, 15000);
      } else {
        setTimeout(() => {
          pendingUpdateRef.current = false;
          fetchAdminSupportUnreadCount(true);
        }, 3000);
      }
    };

    const handleMessageSent = () => {
      console.log('📤 Admin support message sent confirmation');
    };

    const handleManualChange = () => {
      console.log('📌 Manual admin support follow-up change detected, recomputing badge count');
      recomputeTotal(baseUnreadRef.current);
    };

    websocketService.onNewMessage(handleNewMessage);
    websocketService.onMessagesRead(handleMessagesRead);
    websocketService.onMessageSent(handleMessageSent);
    const unsubscribeManual = subscribeManualUnread(handleManualChange);

    const interval = setInterval(() => {
      fetchAdminSupportUnreadCount(true);
    }, 60000);

    return () => {
      clearInterval(interval);
      unsubscribeManual();
    };
  }, [user, fetchAdminSupportUnreadCount, recomputeTotal]);

  return {
    adminSupportUnreadCount,
    hasNotification,
    clearNotification,
    fetchAdminSupportUnreadCount
  };
};
