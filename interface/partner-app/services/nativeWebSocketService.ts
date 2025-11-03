/**
 * TiffinWale Native WebSocket Service for Partner App
 * Universal WebSocket implementation using React Native's native WebSocket API
 * 
 * Features:
 * - Works on all platforms (Web, iOS, Android, Expo Go)
 * - No external dependencies (native WebSocket API)
 * - Automatic reconnection
 * - Message queuing during offline
 * - Integration with notification system
 * - Real-time order status updates
 */

import { DeviceEventEmitter } from 'react-native';
import { tokenManager } from '../lib/auth/TokenManager';
import { config } from '../config';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

export interface WebSocketNotification {
  id: string;
  type: 'toast' | 'modal' | 'banner';
  variant: 'success' | 'error' | 'warning' | 'info' | 'order' | 'promotion';
  category: 'order' | 'promotion' | 'system' | 'chat' | 'reminder';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
}

export interface OrderUpdate {
  orderId: string;
  status: string;
  message?: string;
  estimatedTime?: number;
  location?: { latitude: number; longitude: number };
  timestamp: string;
}

type EventHandler = (data: any) => void;

class NativeWebSocketService {
  private static instance: NativeWebSocketService;
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private messageQueue: WebSocketMessage[] = [];
  private currentOrderId: string | null = null;
  private reconnectTimer: any = null;
  private heartbeatInterval: any = null;
  private eventListeners: Map<string, Set<EventHandler>> = new Map();
  private orderRooms: Set<string> = new Set();

  private constructor() {
    if (__DEV__) console.log('🔌 Partner Native WebSocket service initialized');
  }

  public static getInstance(): NativeWebSocketService {
    if (!NativeWebSocketService.instance) {
      NativeWebSocketService.instance = new NativeWebSocketService();
    }
    return NativeWebSocketService.instance;
  }

  /**
   * Initialize WebSocket connection
   */
  public async initialize(): Promise<void> {
    try {
      const token = await tokenManager.getAccessToken();

      if (!token) {
        if (__DEV__) console.log('⚠️ No auth token available - WebSocket will connect after login');
        return;
      }

      // Auto-connect if token is available
      await this.connect();
    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
    }
  }

  /**
   * Connect to WebSocket server using native WebSocket API
   */
  public async connect(): Promise<void> {
    try {
      const token = await tokenManager.getAccessToken();

      if (!token) {
        if (__DEV__) console.log('⚠️ No auth token available for WebSocket connection');
        return;
      }

      // Disconnect existing connection
      if (this.socket) {
        this.disconnect();
      }

      // Get WebSocket URL from config
      // Native WebSocket gateway runs on port 3002
      const apiBaseUrl = config.api.baseUrl || 'http://localhost:3001';
      let wsUrl = apiBaseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      
      // Replace port with 3002 for native WebSocket gateway
      try {
        const url = new URL(wsUrl.replace('ws://', 'http://').replace('wss://', 'https://'));
        url.port = '3002';
        wsUrl = `${url.protocol === 'https:' ? 'wss:' : 'ws:'}//${url.hostname}:${url.port}`;
      } catch (error) {
        // Fallback if URL parsing fails
        wsUrl = wsUrl.replace(/:3001|:3000|:8080/, ':3002');
        if (!wsUrl.includes(':3002')) {
          wsUrl = wsUrl.replace(/\/$/, '') + ':3002';
        }
      }

      // Add auth token as query parameter
      wsUrl += `?token=${encodeURIComponent(token)}`;
      
      if (__DEV__) console.log('🔌 Partner connecting to native WebSocket:', wsUrl);

      // Create native WebSocket connection
      this.socket = new WebSocket(wsUrl);

      this.setupEventListeners();
      
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Set up WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection opened
    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      if (__DEV__) console.log('✅ Partner WebSocket connected');
      
      // Process queued messages
      this.processMessageQueue();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Rejoin order rooms if any
      this.orderRooms.forEach(orderId => {
        this.joinOrderRoom(orderId);
      });
    };

    // Message received
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        if (__DEV__) console.error('❌ Failed to parse WebSocket message:', error);
      }
    };

    // Connection closed
    this.socket.onclose = (event) => {
      this.isConnected = false;
      this.stopHeartbeat();
      if (__DEV__) console.log('🔌 Partner WebSocket disconnected:', event.code, event.reason);
      
      // Don't reconnect on 404 errors (endpoint not available)
      if (event.code === 1006 && event.reason?.includes('404')) {
        if (__DEV__) console.log('⚠️ WebSocket endpoint not available - skipping reconnection');
        return;
      }
      
      // Auto-reconnect unless it was a clean close
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };

    // Connection error
    this.socket.onerror = (error) => {
      if (__DEV__) console.error('❌ Partner WebSocket error:', error);
      this.isConnected = false;
      this.stopHeartbeat();
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: any): void {
    if (__DEV__) console.log('📨 Partner WebSocket message received:', message.type);

    switch (message.type) {
      case 'notification':
        this.handleNotification(message.data);
        break;
      case 'order_update':
        this.handleOrderUpdate(message.data);
        break;
      case 'chat_message':
        this.handleChatMessage(message.data);
        break;
      case 'pong':
        // Heartbeat response - connection is alive
        break;
      default:
        if (__DEV__) console.log('📨 Unknown message type:', message.type);
    }
  }

  /**
   * Handle notification messages
   */
  private handleNotification(data: WebSocketNotification): void {
    if (__DEV__) console.log('🔔 Partner received notification:', data.title);
    
    // Emit event to subscribers
    this.emit('notification', data);
    
    // Emit via DeviceEventEmitter for React Native components
    DeviceEventEmitter.emit('websocket:notification', {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.category,
      data: data.data,
      timestamp: data.timestamp,
    });
  }

  /**
   * Handle order update messages
   */
  private handleOrderUpdate(data: OrderUpdate): void {
    if (__DEV__) console.log('📦 Partner received order update:', data.orderId, data.status);
    
    // Emit event to subscribers
    this.emit('order_update', data);
    
    // Emit via DeviceEventEmitter for useRealTimeOrders hook
    DeviceEventEmitter.emit('websocket:orderStatusUpdate', {
      orderId: data.orderId,
      status: data.status,
      message: data.message,
      estimatedTime: data.estimatedTime,
      location: data.location,
      timestamp: data.timestamp,
    });
  }

  /**
   * Handle chat messages
   */
  private handleChatMessage(data: any): void {
    if (__DEV__) console.log('💬 Partner chat message received:', data);
    // Emit event to subscribers
    this.emit('chat_message', data);
  }

  /**
   * Send message to WebSocket server
   */
  public sendMessage(type: string, data?: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
    };

    if (!this.socket || !this.isConnected) {
      // Queue the message for when connected
      this.messageQueue.push(message);
      if (__DEV__) console.log('📤 Message queued (not connected):', type);
      return;
    }

    try {
      this.socket.send(JSON.stringify(message));
      if (__DEV__) console.log('📤 Message sent:', type);
    } catch (error) {
      if (__DEV__) console.error('❌ Failed to send message:', error);
      // Queue the message for retry
      this.messageQueue.push(message);
    }
  }

  /**
   * Join order room for real-time updates
   */
  public joinOrderRoom(orderId: string): void {
    this.currentOrderId = orderId;
    this.orderRooms.add(orderId);
    this.sendMessage('join_order_room', { orderId });
    if (__DEV__) console.log('🏠 Partner joined order room:', orderId);
  }

  /**
   * Leave order room (with optional orderId parameter for compatibility)
   */
  public leaveOrderRoom(orderId?: string): void {
    const idToLeave = orderId || this.currentOrderId;
    if (idToLeave) {
      this.sendMessage('leave_order_room', { orderId: idToLeave });
      this.orderRooms.delete(idToLeave);
      if (orderId === this.currentOrderId || !orderId) {
        this.currentOrderId = null;
      }
      if (__DEV__) console.log('🏠 Partner left order room:', idToLeave);
    }
  }

  /**
   * Mark notification as read
   */
  public markNotificationRead(notificationId: string): void {
    this.sendMessage('mark_notification_read', { notificationId });
  }

  /**
   * Send message to student (for chat)
   */
  public sendMessageToStudent(studentId: string, message: string, orderId?: string): void {
    this.sendMessage('send_message_to_partner', { partnerId: studentId, message, orderId });
  }

  /**
   * Process queued messages
   */
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    if (__DEV__) console.log(`📤 Processing ${this.messageQueue.length} queued messages`);
    
    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach(message => {
      try {
        this.socket?.send(JSON.stringify(message));
      } catch (error) {
        if (__DEV__) console.error('❌ Failed to send queued message:', error);
        // Re-queue failed messages
        this.messageQueue.push(message);
      }
    });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.socket) {
        this.sendMessage('ping');
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (__DEV__) console.log('❌ Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
    if (__DEV__) console.log(`🔄 Attempting to reconnect in ${delay}ms... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Update user authentication
   */
  public updateAuth(token: string): void {
    if (__DEV__) console.log('🔐 Updating Partner WebSocket authentication');
    // Reconnect with new token
    this.connect();
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    
    this.isConnected = false;
    this.currentOrderId = null;
    this.reconnectAttempts = 0;
    this.orderRooms.clear();
  }

  /**
   * Get connection status
   */
  public getStatus(): { isConnected: boolean; reconnectAttempts: number } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  /**
   * Subscribe to an event
   */
  public on(event: string, handler: EventHandler): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(handler);
  }

  /**
   * Unsubscribe from an event
   */
  public off(event: string, handler: EventHandler): void {
    this.eventListeners.get(event)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          if (__DEV__) console.error(`❌ Error in event handler for ${event}:`, error);
        }
      });
    }
  }
}

// Export singleton instance
export const nativeWebSocketService = NativeWebSocketService.getInstance();
export default nativeWebSocketService;
