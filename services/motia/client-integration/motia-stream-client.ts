// Motia Stream Client Integration for Frontend Apps
// This file shows how to integrate Motia streams with existing WebSocket connections

import { io, Socket } from 'socket.io-client';

export class MotiaStreamClient {
  private socket: Socket;
  private motiaBaseUrl: string;
  private streams: Map<string, any> = new Map();

  constructor(motiaBaseUrl: string = 'http://localhost:3001') {
    this.motiaBaseUrl = motiaBaseUrl;
    this.socket = io('/notifications', {
      auth: {
        token: localStorage.getItem('authToken')
      }
    });
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for WebSocket events from NestJS
    this.socket.on('notification', (notification) => {
      this.handleNotification(notification);
    });

    this.socket.on('orderStatusUpdate', (orderStatus) => {
      this.handleOrderStatusUpdate(orderStatus);
    });

    this.socket.on('newMessage', (message) => {
      this.handleChatMessage(message);
    });

    this.socket.on('userPresenceUpdate', (presence) => {
      this.handleUserPresenceUpdate(presence);
    });
  }

  // Subscribe to Motia streams
  async subscribeToStream(streamName: string, groupId: string, callback: (data: any) => void) {
    try {
      const response = await fetch(`${this.motiaBaseUrl}/streams/${streamName}/${groupId}`);
      const data = await response.json();
      
      this.streams.set(`${streamName}_${groupId}`, callback);
      callback(data);
      
      // Set up polling for updates (in production, use WebSocket or SSE)
      setInterval(async () => {
        const updatedData = await this.getStreamData(streamName, groupId);
        callback(updatedData);
      }, 5000); // Poll every 5 seconds
      
    } catch (error) {
      console.error(`Failed to subscribe to stream ${streamName}:`, error);
    }
  }

  // Get stream data from Motia
  async getStreamData(streamName: string, groupId: string, itemId?: string) {
    try {
      const url = itemId 
        ? `${this.motiaBaseUrl}/streams/${streamName}/${groupId}/${itemId}`
        : `${this.motiaBaseUrl}/streams/${streamName}/${groupId}`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Failed to get stream data for ${streamName}:`, error);
      return null;
    }
  }

  // Send notification through Motia
  async sendNotification(notificationData: {
    userId: string;
    userType: 'student' | 'partner' | 'admin';
    type: 'order_status' | 'general' | 'promotion' | 'system';
    title: string;
    message: string;
    data?: any;
    expiresAt?: string;
  }) {
    try {
      const response = await fetch(`${this.motiaBaseUrl}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(notificationData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  // Send chat message through Motia
  async sendChatMessage(messageData: {
    conversationId: string;
    userId: string;
    userType: 'student' | 'partner' | 'admin';
    content: string;
    messageType?: 'text' | 'image' | 'file' | 'audio' | 'video';
    mediaUrl?: string;
    mediaThumbnail?: string;
    mediaSize?: number;
    mediaDuration?: number;
    replyTo?: string;
  }) {
    try {
      const response = await fetch(`${this.motiaBaseUrl}/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(messageData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  }

  // Event handlers
  private handleNotification(notification: any) {
    console.log('Received notification:', notification);
    // Update UI with notification
    this.showNotification(notification);
  }

  private handleOrderStatusUpdate(orderStatus: any) {
    console.log('Order status updated:', orderStatus);
    // Update order status in UI
    this.updateOrderStatusUI(orderStatus);
  }

  private handleChatMessage(message: any) {
    console.log('New chat message:', message);
    // Add message to chat UI
    this.addMessageToChat(message);
  }

  private handleUserPresenceUpdate(presence: any) {
    console.log('User presence updated:', presence);
    // Update user online status in UI
    this.updateUserPresenceUI(presence);
  }

  // UI update methods (implement based on your UI framework)
  private showNotification(notification: any) {
    // Implementation depends on your UI framework (React, Vue, Angular, etc.)
    console.log('Showing notification:', notification.title);
  }

  private updateOrderStatusUI(orderStatus: any) {
    // Implementation depends on your UI framework
    console.log('Updating order status UI:', orderStatus.status);
  }

  private addMessageToChat(message: any) {
    // Implementation depends on your UI framework
    console.log('Adding message to chat:', message.content);
  }

  private updateUserPresenceUI(presence: any) {
    // Implementation depends on your UI framework
    console.log('Updating user presence UI:', presence.status);
  }

  // Cleanup
  disconnect() {
    this.socket.disconnect();
    this.streams.clear();
  }
}

// Usage example:
/*
const motiaClient = new MotiaStreamClient('http://localhost:3001');

// Subscribe to notifications for current user
motiaClient.subscribeToStream('notifications', 'user_123', (notifications) => {
  console.log('User notifications:', notifications);
});

// Subscribe to order status updates
motiaClient.subscribeToStream('orderStatus', 'order_456', (orderStatus) => {
  console.log('Order status:', orderStatus);
});

// Subscribe to chat messages
motiaClient.subscribeToStream('chatMessages', 'conversation_789', (messages) => {
  console.log('Chat messages:', messages);
});

// Send a notification
motiaClient.sendNotification({
  userId: 'user_123',
  userType: 'student',
  type: 'general',
  title: 'Order Update',
  message: 'Your order has been confirmed!',
  data: { orderId: 'order_456' }
});
*/


