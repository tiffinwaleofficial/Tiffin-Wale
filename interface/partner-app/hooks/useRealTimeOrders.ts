import React, { useEffect, useCallback, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { nativeWebSocketService } from '../services/nativeWebSocketService';
import { useOrderStore } from '../store/orderStore';
import { usePartnerStore } from '../store/partnerStore';
import { useAuthStore } from '../store/authStore';

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
  message?: string;
  estimatedTime?: number;
  location?: { latitude: number; longitude: number };
  timestamp: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'order_status' | 'general' | 'promotion' | 'system';
  data?: any;
  timestamp: string;
}

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
 * React hook for real-time order updates via Native WebSocket
 * Automatically handles order status updates and notifications for partners
 */
export const useRealTimeOrders = (
  options: UseRealTimeOrdersOptions = {}
): UseRealTimeOrdersReturn => {
  const { autoJoinPartnerRoom = true, enableNotifications = true } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  
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
  const initializedRef = useRef(false);

  // Initialize and connect WebSocket
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeWebSocket = async () => {
      try {
        await nativeWebSocketService.initialize();
        
        // Listen for connection status changes
        const status = nativeWebSocketService.getStatus();
        setIsConnected(status.isConnected);

        // Update connection status when it changes
        const checkStatus = setInterval(() => {
          const currentStatus = nativeWebSocketService.getStatus();
          setIsConnected(currentStatus.isConnected);
        }, 1000);

        return () => clearInterval(checkStatus);
      } catch (error) {
        console.error('❌ useRealTimeOrders: Failed to initialize WebSocket:', error);
      }
    };

    initializeWebSocket();
  }, []);

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

    if (!currentRoomsRef.current.has(orderId)) {
      nativeWebSocketService.joinOrderRoom(orderId);
      currentRoomsRef.current.add(orderId);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Joined order room: ${orderId}`);
    }
  }, [isConnected]);

  // Leave specific order room
  const leaveOrderRoom = useCallback((orderId: string): void => {
    if (currentRoomsRef.current.has(orderId)) {
      nativeWebSocketService.leaveOrderRoom(orderId);
      currentRoomsRef.current.delete(orderId);
      if (__DEV__) console.log(`🏠 useRealTimeOrders: Left order room: ${orderId}`);
    }
  }, []);

  // Join partner-specific room for all partner notifications
  const joinPartnerRoom = useCallback((): void => {
    if (!isConnected || !partner?.id) {
      if (__DEV__) console.warn('⚠️ useRealTimeOrders: Cannot join partner room - not connected or no partner');
      return;
    }

    // For now, we'll just ensure WebSocket is connected
    // Partner-specific rooms can be implemented later if needed
    if (__DEV__) console.log(`🏠 useRealTimeOrders: Partner room joined via WebSocket connection`);
  }, [isConnected, partner?.id]);

  // Leave partner room
  const leavePartnerRoom = useCallback((): void => {
    if (!partner?.id) return;
    if (__DEV__) console.log(`🏠 useRealTimeOrders: Partner room left`);
  }, [partner?.id]);

  // Cleanup rooms on unmount
  useEffect(() => {
    return () => {
      // Leave all order rooms when component unmounts
      currentRoomsRef.current.forEach(orderId => {
        nativeWebSocketService.leaveOrderRoom(orderId);
      });
      currentRoomsRef.current.clear();
    };
  }, []);

  return {
    isConnected,
    joinOrderRoom,
    leaveOrderRoom,
    joinPartnerRoom,
    leavePartnerRoom,
  };
};

export default useRealTimeOrders;
