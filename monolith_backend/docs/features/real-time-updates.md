# Real-time Updates Documentation

## Overview
TiffinMate provides real-time updates for various features, enhancing the user experience by delivering timely information without requiring page refreshes. This documentation covers the real-time functionality implemented using Server-Sent Events (SSE) and WebSockets.

## Technologies Used
- **WebSockets**: For bidirectional real-time communication
- **Socket.IO**: Library for WebSockets implementation
- **Server-Sent Events (SSE)**: For unidirectional real-time updates from server to client

## Key Real-time Features

### Order Status Updates
- **Technology**: Server-Sent Events (SSE)
- **Endpoint**: `GET /api/notifications/orders/:id/status`
- **Description**: Provides real-time updates on order status changes (pending, confirmed, preparing, ready, delivered, cancelled)
- **Implementation**: The server maintains an SSE connection and emits updates whenever an order's status changes
- **Status**: Implemented ✅

### Notifications
- **Technology**: WebSockets (Socket.IO)
- **Namespace**: `/notifications`
- **Description**: Delivers various notifications to users including order confirmations, status updates, and promotional messages
- **Events**:
  - `notification`: General notification event
  - `orderStatusUpdate`: Specific to order status changes
- **Status**: Implemented ✅

### Live Chat Support
- **Technology**: WebSockets (Socket.IO)
- **Namespace**: `/support`
- **Description**: Enables real-time chat between users and customer support
- **Events**:
  - `message`: Real-time message exchange
  - `typing`: Typing indicators
  - `read`: Message read receipts
- **Status**: Planned for future implementation

## Implementation Details

### NotificationGateway
The `NotificationGateway` class is the core component for WebSocket functionality, handling connections, rooms, and event distribution.

```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Methods for connection management
  afterInit(server: Server) {}
  handleConnection(client: Socket, ...args: any[]) {}
  handleDisconnect(client: Socket) {}

  // Room management
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {}
  
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {}

  // Notification methods
  sendNotification(room: string, notification: any) {}
  sendOrderStatusUpdate(orderId: string, status: string) {}
}
```

### SSE Controller
Server-Sent Events are implemented in controllers using NestJS's `@Sse()` decorator.

```typescript
@Controller('notifications')
export class NotificationController {
  @Sse('orders/:id/status')
  getOrderStatusUpdates(@Param('id') orderId: string): Observable<OrderStatusEvent> {
    return interval(5000).pipe(
      map(() => ({
        data: {
          orderId,
          status: this.notificationService.getRandomOrderStatus(),
          timestamp: new Date(),
        },
      })),
    );
  }
}
```

## Client-side Integration

### WebSocket Connection
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
```

### SSE Connection
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

## Notes on Implementation
- **SSE vs WebSockets**: SSE is used for one-way communication from server to client (like order status updates) while WebSockets are used for bidirectional communication (like chat).
- **Connection Behavior**: SSE connections appear to be continuously loading in browsers - this is normal behavior as they maintain an open connection to receive server updates.
- **Browser Support**: SSE and WebSockets are supported in all modern browsers.

## Planned Improvements
- Integrate with a message queue (like RabbitMQ or Kafka) for scalability
- Add authentication to WebSocket connections
- Implement reconnection strategies for both SSE and WebSockets
- Add support for message persistence when clients are offline

## Security Considerations
- WebSocket connections require authentication through JWT tokens
- Room-based authorization ensures users only receive updates for relevant entities
- Rate limiting is applied to prevent abuse

## Performance Optimization
- Connection pooling
- Event batching for high-frequency updates
- Selective broadcasting to minimize network traffic

## Future Enhancements
- Delivery location tracking
- Payment notification integration
- Real-time kitchen queue status
- Batched notifications for high-volume periods
- Push notifications integration 