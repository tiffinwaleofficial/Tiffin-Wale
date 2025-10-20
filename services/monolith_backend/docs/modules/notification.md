# Notification Module Documentation

## Overview
The Notification module provides real-time updates and notifications to users of the TiffinMate platform. It uses Server-Sent Events (SSE) and WebSockets to deliver timely information without requiring page refreshes.

## Core Features
- **Order Status Updates**: Real-time updates on order status changes
- **WebSocket Notifications**: General notifications for various events
- **Notification Gateway**: Manages WebSocket connections and rooms
- **SSE Implementation**: Server-Sent Events for continuous data streams

## Module Structure
```
notification/
├── notification.module.ts          # Module definition
├── notification.controller.ts      # API endpoints
├── notification.service.ts         # Business logic
├── gateways/                      # WebSocket gateways
│   └── notification.gateway.ts    # WebSocket implementation
└── interfaces/                    # Interfaces
    └── notification.interface.ts  # Notification data models
```

## APIs

### Get Order Status Updates (SSE)
- **Endpoint**: `GET /api/notifications/orders/:id/status`
- **Description**: Stream of real-time order status updates using SSE
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Response**: Stream of order status events
- **Status**: Implemented ✅

## WebSocket Events

### Notification Gateway
- **Namespace**: `/notifications`
- **Description**: WebSocket gateway for notifications
- **Status**: Implemented ✅

### Events
- `notification`: General notification event
- `orderStatusUpdate`: Specific to order status changes

### Room Management
- `joinRoom`: Join a specific notification room (e.g., for an order)
- `leaveRoom`: Leave a notification room

## Data Models

### OrderStatusEvent Interface
```typescript
interface OrderStatusEvent {
  data: {
    orderId: string;
    status: string;
    timestamp: Date;
  };
}
```

## Dependencies
- NestJS SSE
- Socket.io
- RxJS
- Order Module (for order status information)

## Usage Examples

### Client-Side SSE Connection
```javascript
// Connect to SSE endpoint for order status
const eventSource = new EventSource(`/api/notifications/orders/${orderId}/status`);

// Handle incoming events
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`Order ${data.orderId} status changed to: ${data.status}`);
  updateOrderStatusUI(data.status);
};

// Handle connection errors
eventSource.onerror = (error) => {
  console.error('SSE connection error:', error);
  eventSource.close();
};
```

### Client-Side WebSocket Connection
```javascript
// Connect to notification namespace
const socket = io('/notifications');

// Join room for specific order updates
socket.emit('joinRoom', `order-${orderId}`);

// Listen for order status updates
socket.on('orderStatusUpdate', (data) => {
  console.log(`Order ${data.orderId} status changed to: ${data.status}`);
  updateOrderStatusUI(data.status);
});

// Listen for general notifications
socket.on('notification', (notification) => {
  showNotification(notification);
});

// Leave room when no longer needed
socket.emit('leaveRoom', `order-${orderId}`);
```

## Future Enhancements
- Email notifications
- SMS notifications
- Push notifications
- Notification preferences
- Notification history and storage
- Notification read/unread status tracking
- Notification grouping and categorization 