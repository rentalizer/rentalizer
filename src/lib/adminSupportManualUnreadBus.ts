type ManualUnreadDetail = {
  conversationId?: string;
};

type Listener = (detail: ManualUnreadDetail) => void;

const listeners = new Set<Listener>();

export const subscribeManualUnread = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const emitManualUnreadChange = (detail: ManualUnreadDetail = {}) => {
  listeners.forEach(listener => {
    try {
      listener(detail);
    } catch (error) {
      console.error('adminSupportManualUnreadBus listener error', error);
    }
  });
};

