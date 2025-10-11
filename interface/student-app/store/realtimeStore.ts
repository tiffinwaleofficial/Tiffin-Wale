import { create } from 'zustand';
import { getWebSocketManager, WebSocketMessage } from '../utils/websocketManager';

interface RealtimeData {
  [key: string]: unknown;
}

interface PendingSyncAction {
  type: string;
  data?: RealtimeData;
  message?: WebSocketMessage;
}

interface RealtimeState {
  isConnected: boolean;
  isConnecting: boolean;
  lastSyncTime: Date | null;
  pendingSync: PendingSyncAction[];
  subscriptions: Map<string, string>; // channel -> subscriptionId
  connectionState: {
    reconnectAttempts: number;
    lastConnectedAt: Date | null;
    lastDisconnectedAt: Date | null;
  };
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  subscribe: (channel: string, callback: (data: RealtimeData) => void) => string;
  unsubscribe: (subscriptionId: string) => void;
  unsubscribeChannel: (channel: string) => void;
  sendMessage: (message: WebSocketMessage) => void;
  syncAllStores: () => Promise<void>;
  handleRealtimeUpdate: (channel: string, data: RealtimeData) => void;
  addPendingSync: (action: PendingSyncAction) => void;
  processPendingSync: () => Promise<void>;
  clearError: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set, get) => {
  let wsManager: ReturnType<typeof getWebSocketManager> | null = null;
  
  const initializeWebSocket = () => {
    if (!wsManager) {
      wsManager = getWebSocketManager();
      
      // Set up event listeners
      wsManager.on('connected', () => {
        set({ 
          isConnected: true, 
          isConnecting: false,
          connectionState: {
            ...get().connectionState,
            lastConnectedAt: new Date(),
            reconnectAttempts: 0,
          }
        });
        
        // Re-subscribe to all channels
        const { subscriptions } = get();
        subscriptions.forEach((subscriptionId, channel) => {
          if (wsManager) {
            wsManager.send({
              type: 'subscribe',
              channel,
            });
          }
        });
        
        // Process any pending sync actions
        get().processPendingSync();
      });
      
      wsManager.on('disconnected', () => {
        set({ 
          isConnected: false, 
          isConnecting: false,
          connectionState: {
            ...get().connectionState,
            lastDisconnectedAt: new Date(),
          }
        });
      });
      
      wsManager.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
      
      wsManager.on('message', (message: WebSocketMessage) => {
        if (message.channel) {
          get().handleRealtimeUpdate(message.channel, message.data);
        }
      });
    }
    
    return wsManager;
  };

  return {
    isConnected: false,
    isConnecting: false,
    lastSyncTime: null,
    pendingSync: [],
    subscriptions: new Map(),
    connectionState: {
      reconnectAttempts: 0,
      lastConnectedAt: null,
      lastDisconnectedAt: null,
    },
    
    connect: async () => {
      set({ isConnecting: true });
      try {
        const manager = initializeWebSocket();
        await manager.connect();
        set({ 
          isConnected: true, 
          isConnecting: false,
          lastSyncTime: new Date(),
        });
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        set({ 
          isConnected: false, 
          isConnecting: false,
          connectionState: {
            ...get().connectionState,
            reconnectAttempts: get().connectionState.reconnectAttempts + 1,
          }
        });
      }
    },
    
    disconnect: () => {
      if (wsManager) {
        wsManager.disconnect();
      }
      set({ 
        isConnected: false, 
        isConnecting: false,
        subscriptions: new Map(),
      });
    },
    
    reconnect: async () => {
      set({ isConnecting: true });
      try {
        const manager = initializeWebSocket();
        await manager.reconnect();
        set({ 
          isConnected: true, 
          isConnecting: false,
          lastSyncTime: new Date(),
        });
      } catch (error) {
        console.error('Failed to reconnect WebSocket:', error);
        set({ 
          isConnected: false, 
          isConnecting: false,
        });
      }
    },
    
    subscribe: (channel: string, callback: (data: RealtimeData) => void) => {
      const manager = initializeWebSocket();
      const subscriptionId = manager.subscribe(channel, callback);
      
      set(state => {
        const newSubscriptions = new Map(state.subscriptions);
        newSubscriptions.set(channel, subscriptionId);
        return { subscriptions: newSubscriptions };
      });
      
      return subscriptionId;
    },
    
    unsubscribe: (subscriptionId: string) => {
      if (wsManager) {
        wsManager.unsubscribe(subscriptionId);
      }
      
      set(state => {
        const newSubscriptions = new Map(state.subscriptions);
        for (const [channel, id] of newSubscriptions.entries()) {
          if (id === subscriptionId) {
            newSubscriptions.delete(channel);
            break;
          }
        }
        return { subscriptions: newSubscriptions };
      });
    },
    
    unsubscribeChannel: (channel: string) => {
      const { subscriptions } = get();
      const subscriptionId = subscriptions.get(channel);
      if (subscriptionId) {
        get().unsubscribe(subscriptionId);
      }
    },
    
    sendMessage: (message: WebSocketMessage) => {
      if (wsManager) {
        wsManager.send(message);
      } else {
        // Queue message for when connection is established
        get().addPendingSync({ type: 'sendMessage', message });
      }
    },
    
    syncAllStores: async () => {
      if (!get().isConnected) {
        console.warn('Cannot sync stores: WebSocket not connected');
        return;
      }
      
      try {
        // Trigger sync for all connected stores
        const syncMessage: WebSocketMessage = {
          type: 'sync_request',
          data: { timestamp: Date.now() },
        };
        
        get().sendMessage(syncMessage);
        set({ lastSyncTime: new Date() });
      } catch (error) {
        console.error('Error syncing stores:', error);
      }
    },
    
    handleRealtimeUpdate: (channel: string, data: RealtimeData) => {
      // This will be used by individual stores to handle their specific updates
      console.log(`Realtime update received for channel ${channel}:`, data);
      
      // Emit a custom event that stores can listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('realtimeUpdate', {
          detail: { channel, data }
        }));
      }
    },
    
    addPendingSync: (action: PendingSyncAction) => {
      set(state => ({
        pendingSync: [...state.pendingSync, action]
      }));
    },
    
    processPendingSync: async () => {
      const { pendingSync } = get();
      if (pendingSync.length === 0) return;
      
      try {
        for (const action of pendingSync) {
          if (action.type === 'sendMessage' && action.message && wsManager) {
            wsManager.send(action.message);
          }
        }
        
        set({ pendingSync: [] });
      } catch (error) {
        console.error('Error processing pending sync:', error);
      }
    },
    
    clearError: () => {
      set({ 
        connectionState: {
          ...get().connectionState,
          reconnectAttempts: 0,
        }
      });
    },
  };
});

// Auto-connect when the store is first used
let hasAutoConnected = false;
export const initializeRealtimeConnection = () => {
  if (!hasAutoConnected) {
    hasAutoConnected = true;
    const { connect } = useRealtimeStore.getState();
    connect().catch(error => {
      console.error('Auto-connect failed:', error);
    });
  }
};
