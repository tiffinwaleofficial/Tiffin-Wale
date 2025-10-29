/**
 * Native WebSocket Service for Expo/React Native
 * Uses native WebSocket API (not Socket.io)
 * Connects to backend's native WebSocket gateway on port 3002
 */

export enum WebSocketEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  
  // Chat
  JOIN_CONVERSATION = 'joinConversation',
  LEAVE_CONVERSATION = 'leaveConversation',
  SEND_MESSAGE = 'sendMessage',
  NEW_MESSAGE = 'newMessage',
  MESSAGE_STATUS = 'messageStatus',
  
  // Typing
  TYPING_START = 'typingStart',
  TYPING_STOP = 'typingStop',
  USER_TYPING = 'userTyping',
  
  // Notifications
  NEW_NOTIFICATION = 'newNotification',
  NOTIFICATION_READ = 'notificationRead',
}

export interface WSMessage {
  event: string;
  data: any;
  timestamp?: number;
}

export interface ChatMessage {
  _id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageType: 'text' | 'image' | 'video' | 'file' | 'system';
  content: string;
  mediaUrl?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  replyTo?: string;
  createdAt: string;
  readBy?: string[];
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

type MessageHandler = (message: WSMessage) => void;
type EventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private token: string | null = null;
  private userId: string | null = null;
  
  // Connection state
  private isConnecting = false;
  private isConnected = false;
  
  // Backend URLs (from environment variables)
  private readonly WS_URL_DEV = process.env.EXPO_PUBLIC_WS_URL_DEV || 'ws://localhost:3002';
  private readonly WS_URL_PROD = process.env.EXPO_PUBLIC_WS_URL_PROD || 'wss://tiffinmate-backend.vercel.app';
  
  constructor() {
    console.log('📱 Native WebSocket Service initialized');
  }
  
  /**
   * Connect to WebSocket server
   */
  async connect(token: string, userId: string): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      console.log('⚠️ Already connected or connecting');
      return;
    }
    
    this.token = token;
    this.userId = userId;
    this.isConnecting = true;
    
    try {
      const wsUrl = __DEV__ ? this.WS_URL_DEV : this.WS_URL_PROD;
      console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (error) => this.handleError(error);
      this.ws.onclose = (event) => this.handleClose(event);
      
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.isConnecting = false;
      throw error;
    }
  }
  
  /**
   * Handle connection open
   */
  private handleOpen(): void {
    console.log('✅ WebSocket connected');
    this.isConnected = true;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    // Send authentication
    this.authenticate();
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Emit connect event
    this.emit(WebSocketEvent.CONNECT, { connected: true });
  }
  
  /**
   * Authenticate with server
   */
  private authenticate(): void {
    if (!this.token || !this.userId) {
      console.error('❌ No token or userId for authentication');
      return;
    }
    
    this.send({
      event: 'authenticate',
      data: {
        token: this.token,
        userId: this.userId,
      },
    });
  }
  
  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessage = JSON.parse(event.data);
      console.log('📨 WebSocket message received:', message.event);
      
      // Emit to specific event handlers
      this.emit(message.event, message.data);
      
      // Emit to general message handlers
      const handlers = this.messageHandlers.get('*');
      if (handlers) {
        handlers.forEach(handler => handler(message));
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error);
    }
  }
  
  /**
   * Handle errors
   */
  private handleError(error: Event): void {
    console.error('❌ WebSocket error:', error);
    this.emit(WebSocketEvent.ERROR, { error });
  }
  
  /**
   * Handle connection close
   */
  private handleClose(event: CloseEvent): void {
    console.log('🔌 WebSocket disconnected', event.code, event.reason);
    this.isConnected = false;
    this.isConnecting = false;
    
    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Emit disconnect event
    this.emit(WebSocketEvent.DISCONNECT, { code: event.code, reason: event.reason });
    
    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        if (this.token && this.userId) {
          this.connect(this.token, this.userId);
        }
      }, this.reconnectDelay);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }
  
  /**
   * Send message to server
   */
  send(message: WSMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected');
      return;
    }
    
    try {
      const payload = JSON.stringify({
        ...message,
        timestamp: Date.now(),
      });
      this.ws.send(payload);
      console.log('📤 WebSocket message sent:', message.event);
    } catch (error) {
      console.error('❌ Failed to send WebSocket message:', error);
    }
  }
  
  /**
   * Subscribe to event
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    
    const wrappedHandler: MessageHandler = (message) => {
      handler(message.data);
    };
    
    this.messageHandlers.get(event)!.add(wrappedHandler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(event);
      if (handlers) {
        handlers.delete(wrappedHandler);
      }
    };
  }
  
  /**
   * Emit event to handlers
   */
  private emit(event: string, data: any): void {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler({ event, data }));
    }
  }
  
  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ event: 'ping', data: {} });
      }
    }, 30000) as any; // Every 30 seconds
  }
  
  /**
   * Disconnect from server
   */
  disconnect(): void {
    console.log('🔌 Disconnecting WebSocket...');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }
  
  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
  
  // ==================== CHAT METHODS ====================
  
  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string): void {
    this.send({
      event: WebSocketEvent.JOIN_CONVERSATION,
      data: { conversationId },
    });
  }
  
  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string): void {
    this.send({
      event: WebSocketEvent.LEAVE_CONVERSATION,
      data: { conversationId },
    });
  }
  
  /**
   * Send a chat message
   */
  sendChatMessage(message: Partial<ChatMessage>): void {
    this.send({
      event: WebSocketEvent.SEND_MESSAGE,
      data: message,
    });
  }
  
  /**
   * Update message status (delivered, read)
   */
  updateMessageStatus(messageId: string, status: string): void {
    this.send({
      event: WebSocketEvent.MESSAGE_STATUS,
      data: { messageId, status },
    });
  }
  
  /**
   * Start typing indicator
   */
  startTyping(conversationId: string): void {
    this.send({
      event: WebSocketEvent.TYPING_START,
      data: { conversationId },
    });
  }
  
  /**
   * Stop typing indicator
   */
  stopTyping(conversationId: string): void {
    this.send({
      event: WebSocketEvent.TYPING_STOP,
      data: { conversationId },
    });
  }
  
  /**
   * Listen for new messages
   */
  onNewMessage(handler: (message: ChatMessage) => void): () => void {
    return this.on(WebSocketEvent.NEW_MESSAGE, handler);
  }
  
  /**
   * Listen for typing indicators
   */
  onUserTyping(handler: (typing: TypingIndicator) => void): () => void {
    return this.on(WebSocketEvent.USER_TYPING, handler);
  }
  
  /**
   * Listen for message status updates
   */
  onMessageStatus(handler: (data: { messageId: string; status: string }) => void): () => void {
    return this.on(WebSocketEvent.MESSAGE_STATUS, handler);
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
export default wsService;

