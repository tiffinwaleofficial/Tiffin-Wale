import { useEffect } from 'react';
import { useRealtimeStore } from '../store/realtimeStore';
import { useNotificationStore } from '../store/notificationStore';

/**
 * Hook to initialize real-time connections
 * This should be used in the main App component or root component
 */
export const useRealtimeConnection = () => {
  const { connect, isConnected, isConnecting } = useRealtimeStore();
  const { subscribeToWebSocketNotifications } = useNotificationStore();

  useEffect(() => {
    // Initialize WebSocket connection
    const initializeConnection = async () => {
      if (!isConnected && !isConnecting) {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to initialize real-time connection:', error);
        }
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    // Subscribe to notifications when connected
    if (isConnected) {
      subscribeToWebSocketNotifications();
    }
  }, [isConnected, subscribeToWebSocketNotifications]);

  return {
    isConnected,
    isConnecting,
  };
};

/**
 * Hook to manage real-time order tracking
 */
export const useRealtimeOrderTracking = (orderId: string) => {
  const { subscribeToOrderUpdates, unsubscribeFromOrderUpdates } = useNotificationStore();

  useEffect(() => {
    if (orderId) {
      subscribeToOrderUpdates(orderId);
      
      return () => {
        unsubscribeFromOrderUpdates(orderId);
      };
    }
  }, [orderId, subscribeToOrderUpdates, unsubscribeFromOrderUpdates]);
};

/**
 * Hook to get real-time connection status
 */
export const useRealtimeStatus = () => {
  const { isConnected, isConnecting, connectionState } = useRealtimeStore();
  
  return {
    isConnected,
    isConnecting,
    reconnectAttempts: connectionState.reconnectAttempts,
    lastConnectedAt: connectionState.lastConnectedAt,
    lastDisconnectedAt: connectionState.lastDisconnectedAt,
  };
};

export default useRealtimeConnection;









