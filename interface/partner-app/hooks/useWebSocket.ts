import { useState, useEffect, useCallback, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { websocketManager, ConnectionState, OrderStatusUpdate, NotificationData } from '../utils/websocketManager';
import { useAuthStore } from '../store/authStore';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnAuth?: boolean;
}

interface UseWebSocketReturn {
  connectionState: ConnectionState;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  lastError: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

/**
 * React hook for WebSocket connection management
 * Provides real-time connection state and methods for WebSocket operations
 */
export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const { autoConnect = false, reconnectOnAuth = true } = options;
  const { isAuthenticated } = useAuthStore();
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    websocketManager.getConnectionState()
  );
  const isInitializedRef = useRef(false);
  const lastAuthStateRef = useRef(isAuthenticated);

  // Update connection state when WebSocket events occur
  useEffect(() => {
    const updateConnectionState = () => {
      setConnectionState(websocketManager.getConnectionState());
    };

    const listeners = [
      DeviceEventEmitter.addListener('websocket:connected', updateConnectionState),
      DeviceEventEmitter.addListener('websocket:disconnected', updateConnectionState),
      DeviceEventEmitter.addListener('websocket:error', updateConnectionState),
      DeviceEventEmitter.addListener('websocket:reconnecting', updateConnectionState),
      DeviceEventEmitter.addListener('websocket:reconnected', updateConnectionState),
      DeviceEventEmitter.addListener('websocket:reconnect_failed', updateConnectionState),
    ];

    // Initial state update
    updateConnectionState();

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated && !lastAuthStateRef.current && reconnectOnAuth) {
        // User just logged in, connect WebSocket
        if (__DEV__) console.log('🔌 useWebSocket: User authenticated, connecting...');
        try {
          await connect();
        } catch (error) {
          console.error('❌ useWebSocket: Failed to connect after authentication:', error);
        }
      } else if (!isAuthenticated && lastAuthStateRef.current) {
        // User just logged out, disconnect WebSocket
        if (__DEV__) console.log('🔌 useWebSocket: User logged out, disconnecting...');
        disconnect();
      }
      
      lastAuthStateRef.current = isAuthenticated;
    };

    handleAuthChange();
  }, [isAuthenticated, reconnectOnAuth]);

  // Auto-connect on mount if enabled and authenticated
  useEffect(() => {
    if (autoConnect && isAuthenticated && !isInitializedRef.current) {
      isInitializedRef.current = true;
      connect().catch(error => {
        console.error('❌ useWebSocket: Auto-connect failed:', error);
      });
    }
  }, [autoConnect, isAuthenticated]);

  // Connect to WebSocket
  const connect = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Cannot connect WebSocket: User not authenticated');
    }

    try {
      await websocketManager.connect();
    } catch (error) {
      console.error('❌ useWebSocket: Connection failed:', error);
      throw error;
    }
  }, [isAuthenticated]);

  // Disconnect from WebSocket
  const disconnect = useCallback((): void => {
    websocketManager.disconnect();
  }, []);

  // Emit event to server
  const emit = useCallback((event: string, data?: any): void => {
    websocketManager.emit(event, data);
  }, []);

  // Join a room for targeted notifications
  const joinRoom = useCallback((room: string): void => {
    websocketManager.joinRoom(room);
  }, []);

  // Leave a room
  const leaveRoom = useCallback((room: string): void => {
    websocketManager.leaveRoom(room);
  }, []);

  return {
    connectionState,
    isConnected: connectionState.isConnected,
    isConnecting: connectionState.isConnecting,
    isReconnecting: connectionState.isReconnecting,
    lastError: connectionState.lastError,
    connect,
    disconnect,
    emit,
    joinRoom,
    leaveRoom,
  };
};

export default useWebSocket;
