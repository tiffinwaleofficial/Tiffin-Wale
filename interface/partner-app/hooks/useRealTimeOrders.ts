import { useEffect, useCallback, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useWebSocket } from './useWebSocket';
import { useOrderStore } from '../store/orderStore';
import { usePartnerStore } from '../store/partnerStore';
import { useAuthStore } from '../store/authStore';
import { OrderStatusUpdate, NotificationData } from '../utils/websocketManager';

interface UseRealTimeOrdersOptions {
  autoJoinPartnerRoom?: boolean;
  enableNotifications?: boolean;
}

interface UseRealTimeOrdersReturn {
  isConnected: boolean;
  joinOrderRoom: (orderId: string) => void;
  leaveOrderRoom: (orderId: string) => void;
  joinPartnerRoom: () => void;
  leavePartnerRoom: () => void;
}

/**
 * React hook for real-time order updates via WebSocket
 * Automatically handles order status updates and notifications for partners
 */
export const useRealTimeOrders = (
  options: UseRealTimeOrdersOptions = {}
): UseRealTimeOrdersReturn => {
  const { autoJoinPartnerRoom = true, enableNotifications = true } = options;
  
  const { isConnected, joinRoom, leaveRoom } = useWebSocket({
    autoConnect: true,
    reconnectOnAuth: true,
  });
  
  const { partner } = useAuthStore();
  const { 
    fetchTodayOrders, 
    fetchOrders, 
    updateOrderInStore,
    addOrderToStore 
  } = useOrderStore();
  const { 
    fetchStats, 
    refreshProfile 
  } = usePartnerStore();
  
  const currentRoomsRef = useRef<Set<string>>(new Set());
  const partnerIdRef = useRef<string | null>(null);

  // Handle order status updates
  useEffect(() => {
    const handleOrderStatusUpdate = (data: OrderStatusUpdate) => {
      if (__DEV__) console.log('📦 useRealTimeOrders: Order status update:', data);
      
      try {
        // Update the order in the store
        updateOrderInStore(data.orderId, {
          status: data.status,
          updatedAt: data.timestamp,
          ...(data.estimatedTime && { estimatedDeliveryTime: new Date(Date.now() + data.estimatedTime * 60 * 1000).toISOString() }),
          ...(data.location && { location: data.location }),
        });

        // Refresh today's orders to get updated counts
        fetchTodayOrders().catch(error => {
          console.error('❌ useRealTimeOrders: Failed to refresh today orders:', error);
        });

        // Refresh partner stats for updated metrics
        fetchStats().catch(error => {
          console.error('❌ useRealTimeOrders: Failed to refresh stats:', error);
        });

        // Show success notification based on status
        const statusMessages: Record<string, string> = {
          confirmed: '✅ Order accepted successfully',
          preparing: '👨‍🍳 Order is being prepared',
          ready: '📦 Order is ready for pickup',
          delivered: '🎉 Order delivered successfully',
          cancelled: '❌ Order was cancelled',
        };

        const message = statusMessages[data.status] || `Order status updated to ${data.status}`;
        
        // Emit local notification event
        DeviceEventEmitter.emit('show_toast', {
          type: 'success',
          title: 'Order Update',
          message: data.message || message,
        });

      } catch (error) {
        console.error('❌ useRealTimeOrders: Error handling order status update:', error);
      }
    };

    const listener = DeviceEventEmitter.addListener('websocket:orderStatusUpdate', handleOrderStatusUpdate);
    return () => listener.remove();
  }, [updateOrderInStore, fetchTodayOrders, fetchStats]);

  // Handle general notifications
  useEffect(() => {
    if (!enableNotifications) return;

    const handleNotification = (data: NotificationData) => {
      if (__DEV__) console.log('🔔 useRealTimeOrders: Notification received:', data);
      
      try {
        // Show notification toast
        DeviceEventEmitter.emit('show_toast', {
          type: data.type === 'system' ? 'info' : 'success',
          title: data.title,
          message: data.message,
        });

        // Handle specific notification types
        switch (data.type) {
          case 'order_status':
            // Refresh orders when order-related notifications arrive
            fetchTodayOrders().catch(error => {
              console.error('❌ useRealTimeOrders: Failed to refresh orders after notification:', error);
            });
            break;
          
          case 'general':
            // Handle general notifications (e.g., new features, announcements)
            break;
          
          case 'promotion':
            // Handle promotional notifications
            break;
          
          case 'system':
            // Handle system notifications (e.g., maintenance, updates)
            break;
        }
      } catch (error) {
        console.error('❌ useRealTimeOrders: Error handling notification:', error);
      }
    };

    const listener = DeviceEventEmitter.addListener('websocket:notification', handleNotification);
    return () => listener.remove();
  }, [enableNotifications, fetchTodayOrders]);

  // Auto-join partner room when connected and partner is available
  useEffect(() => {
    if (isConnected && autoJoinPartnerRoom && partner?.id && partner.id !== partnerIdRef.current) {
      partnerIdRef.current = partner.id;
      joinPartnerRoom();
    }
  }, [isConnected, autoJoinPartnerRoom, partner?.id]);

  // Join specific order room
  const joinOrderRoom = useCallback((orderId: string): void => {
    if (!isConnected) {
      if (__DEV__) console.warn('⚠️ useRealTimeOrders: Cannot join order room - not connected');
      return;
    }

    const roomName = `order-${orderId}`;
    if (!currentRoomsRef.current.has(roomName)) {
      joinRoom(roomName);
      currentRoomsRef.current.add(roomName);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Joined order room: ${roomName}`);
    }
  }, [isConnected, joinRoom]);

  // Leave specific order room
  const leaveOrderRoom = useCallback((orderId: string): void => {
    const roomName = `order-${orderId}`;
    if (currentRoomsRef.current.has(roomName)) {
      leaveRoom(roomName);
      currentRoomsRef.current.delete(roomName);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Left order room: ${roomName}`);
    }
  }, [leaveRoom]);

  // Join partner-specific room for all partner notifications
  const joinPartnerRoom = useCallback((): void => {
    if (!isConnected || !partner?.id) {
      if (__DEV__) console.warn('⚠️ useRealTimeOrders: Cannot join partner room - not connected or no partner');
      return;
    }

    const roomName = `partner-${partner.id}`;
    if (!currentRoomsRef.current.has(roomName)) {
      joinRoom(roomName);
      currentRoomsRef.current.add(roomName);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Joined partner room: ${roomName}`);
    }
  }, [isConnected, partner?.id, joinRoom]);

  // Leave partner room
  const leavePartnerRoom = useCallback((): void => {
    if (!partner?.id) return;

    const roomName = `partner-${partner.id}`;
    if (currentRoomsRef.current.has(roomName)) {
      leaveRoom(roomName);
      currentRoomsRef.current.delete(roomName);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Left partner room: ${roomName}`);
    }
  }, [partner?.id, leaveRoom]);

  // Cleanup rooms on unmount
  useEffect(() => {
    return () => {
      // Leave all rooms when component unmounts
      currentRoomsRef.current.forEach(roomName => {
        leaveRoom(roomName);
      });
      currentRoomsRef.current.clear();
    };
  }, [leaveRoom]);

  return {
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    joinPartnerRoom,
    leavePartnerRoom,
  };
};

export default useRealTimeOrders;
