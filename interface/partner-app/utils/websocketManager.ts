import { io, Socket } from 'socket.io-client';
import { DeviceEventEmitter } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { secureTokenManager } from '../auth/SecureTokenManager';
import { config } from '../config/environment';

export interface WebSocketConfig {
  namespace?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  maxReconnectionDelay?: number;
  timeout?: number;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastError: string | null;
}

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

class WebSocketManager {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private connectionState: ConnectionState = {
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    lastError: null,
  };
  private eventQueue: Array<{ event: string; data: any }> = [];
  private isInitialized = false;
  private networkUnsubscribe: (() => void) | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig = {}) {
    this.config = {
      namespace: '/notifications',
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      maxReconnectionDelay: 5000,
      timeout: 20000,
      ...config,
    };
  }

  /**
   * Initialize WebSocket connection with authentication
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      if (__DEV__) console.log('🔌 WebSocket: Already initialized');
      return;
    }

    try {
      if (__DEV__) console.log('🔌 WebSocket: Initializing connection...');
      
      // Get authentication token
      const token = await secureTokenManager.getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create socket connection
      const socketUrl = `${config.apiBaseUrl}${this.config.namespace}`;
      
      this.socket = io(socketUrl, {
        auth: {
          token,
        },
        autoConnect: this.config.autoConnect,
        reconnection: this.config.reconnection,
        reconnectionAttempts: this.config.reconnectionAttempts,
        reconnectionDelay: this.config.reconnectionDelay,
        timeout: this.config.timeout,
        transports: ['websocket'], // Force WebSocket transport for React Native
      });

      this.setupEventListeners();
      this.setupNetworkListener();
      this.isInitialized = true;

      if (__DEV__) console.log('✅ WebSocket: Initialized successfully');
    } catch (error) {
      console.error('❌ WebSocket: Initialization failed:', error);
      this.connectionState.lastError = error instanceof Error ? error.message : 'Initialization failed';
      throw error;
    }
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (!this.socket) {
      await this.initialize();
    }

    if (this.connectionState.isConnected || this.connectionState.isConnecting) {
      if (__DEV__) console.log('🔌 WebSocket: Already connected or connecting');
      return;
    }

    try {
      this.connectionState.isConnecting = true;
      this.connectionState.lastError = null;
      
      // Refresh token before connecting
      const token = await secureTokenManager.getAccessToken();
      if (token && this.socket) {
        this.socket.auth = { token };
      }

      this.socket?.connect();
      if (__DEV__) console.log('🔌 WebSocket: Connection initiated');
    } catch (error) {
      console.error('❌ WebSocket: Connection failed:', error);
      this.connectionState.isConnecting = false;
      this.connectionState.lastError = error instanceof Error ? error.message : 'Connection failed';
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (__DEV__) console.log('🔌 WebSocket: Disconnecting...');
    
    this.clearHeartbeat();
    this.socket?.disconnect();
    this.connectionState.isConnected = false;
    this.connectionState.isConnecting = false;
    this.connectionState.isReconnecting = false;
  }

  /**
   * Cleanup and destroy WebSocket connection
   */
  destroy(): void {
    if (__DEV__) console.log('🔌 WebSocket: Destroying connection...');
    
    this.disconnect();
    this.socket?.removeAllListeners();
    this.socket = null;
    this.networkUnsubscribe?.();
    this.networkUnsubscribe = null;
    this.isInitialized = false;
    this.eventQueue = [];
  }

  /**
   * Send event to server
   */
  emit(event: string, data?: any): void {
    if (this.connectionState.isConnected && this.socket) {
      this.socket.emit(event, data);
      if (__DEV__) console.log(`📤 WebSocket: Sent event '${event}'`, data);
    } else {
      // Queue event for when connection is restored
      this.eventQueue.push({ event, data });
      if (__DEV__) console.log(`📦 WebSocket: Queued event '${event}' (not connected)`);
    }
  }

  /**
   * Join a room for targeted notifications
   */
  joinRoom(room: string): void {
    this.emit('joinRoom', room);
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.emit('leaveRoom', room);
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  /**
   * Setup event listeners for WebSocket events
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      if (__DEV__) console.log('✅ WebSocket: Connected successfully');
      
      this.connectionState.isConnected = true;
      this.connectionState.isConnecting = false;
      this.connectionState.isReconnecting = false;
      this.connectionState.reconnectAttempts = 0;
      this.connectionState.lastError = null;

      // Process queued events
      this.processEventQueue();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Emit connection event
      DeviceEventEmitter.emit('websocket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      if (__DEV__) console.log('🔌 WebSocket: Disconnected:', reason);
      
      this.connectionState.isConnected = false;
      this.connectionState.isConnecting = false;
      this.clearHeartbeat();
      
      // Emit disconnection event
      DeviceEventEmitter.emit('websocket:disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket: Connection error:', error);
      
      this.connectionState.isConnecting = false;
      this.connectionState.lastError = error.message;
      
      // Emit error event
      DeviceEventEmitter.emit('websocket:error', { error: error.message });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      if (__DEV__) console.log(`🔄 WebSocket: Reconnected after ${attemptNumber} attempts`);
      
      this.connectionState.isReconnecting = false;
      this.connectionState.reconnectAttempts = attemptNumber;
      
      // Emit reconnection event
      DeviceEventEmitter.emit('websocket:reconnected', { attempts: attemptNumber });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      if (__DEV__) console.log(`🔄 WebSocket: Reconnection attempt ${attemptNumber}`);
      
      this.connectionState.isReconnecting = true;
      this.connectionState.reconnectAttempts = attemptNumber;
      
      // Emit reconnection attempt event
      DeviceEventEmitter.emit('websocket:reconnecting', { attempts: attemptNumber });
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket: Reconnection failed after maximum attempts');
      
      this.connectionState.isReconnecting = false;
      this.connectionState.lastError = 'Reconnection failed after maximum attempts';
      
      // Emit reconnection failed event
      DeviceEventEmitter.emit('websocket:reconnect_failed');
    });

    // Business logic events
    this.socket.on('orderStatusUpdate', (data: OrderStatusUpdate) => {
      if (__DEV__) console.log('📦 WebSocket: Order status update received:', data);
      DeviceEventEmitter.emit('websocket:orderStatusUpdate', data);
    });

    this.socket.on('notification', (data: NotificationData) => {
      if (__DEV__) console.log('🔔 WebSocket: Notification received:', data);
      DeviceEventEmitter.emit('websocket:notification', data);
    });

    // Heartbeat response
    this.socket.on('pong', () => {
      if (__DEV__) console.log('💓 WebSocket: Heartbeat pong received');
    });
  }

  /**
   * Setup network state listener for auto-reconnection
   */
  private setupNetworkListener(): void {
    this.networkUnsubscribe = NetInfo.addEventListener(state => {
      if (__DEV__) console.log('🌐 Network state changed:', state.isConnected);
      
      if (state.isConnected && !this.connectionState.isConnected && this.isInitialized) {
        // Network is back, attempt to reconnect
        setTimeout(() => {
          if (!this.connectionState.isConnected) {
            if (__DEV__) console.log('🔄 WebSocket: Auto-reconnecting due to network restoration');
            this.connect().catch(error => {
              console.error('❌ WebSocket: Auto-reconnection failed:', error);
            });
          }
        }, 1000); // Wait 1 second before reconnecting
      }
    });
  }

  /**
   * Process queued events when connection is restored
   */
  private processEventQueue(): void {
    if (this.eventQueue.length > 0) {
      if (__DEV__) console.log(`📦 WebSocket: Processing ${this.eventQueue.length} queued events`);
      
      const events = [...this.eventQueue];
      this.eventQueue = [];
      
      events.forEach(({ event, data }) => {
        this.emit(event, data);
      });
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.clearHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.connectionState.isConnected && this.socket) {
        this.socket.emit('ping');
        if (__DEV__) console.log('💓 WebSocket: Heartbeat ping sent');
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Clear heartbeat interval
   */
  private clearHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// Create singleton instance
export const websocketManager = new WebSocketManager();

export default websocketManager;
