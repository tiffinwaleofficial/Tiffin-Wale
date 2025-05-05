# Order Module Documentation

## Overview
The Order module manages food orders within the TiffinMate platform. It handles the full lifecycle of orders, including creation, status updates, payment tracking, and order history.

## Core Features
- **Order Management**: Create and track food orders
- **Order Status Tracking**: Real-time updates on order status
- **Payment Integration**: Track payment status of orders
- **Order History**: Maintain history of all orders for users and partners
- **Review System**: Allow customers to rate and review their orders

## Module Structure
```
order/
├── order.module.ts        # Module definition
├── order.controller.ts    # API endpoints
├── order.service.ts       # Business logic
├── schemas/              # Database schemas
│   └── order.schema.ts   # MongoDB order schema
└── dto/                  # Data transfer objects
    ├── create-order.dto.ts  # Order creation validation
    ├── update-order.dto.ts  # Order update validation
    └── order-status.dto.ts  # Status update validation
```

## APIs

### Get All Orders
- **Endpoint**: `GET /api/orders`
- **Description**: Retrieves a list of all orders (admin function)
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Query Parameters**: status, page, limit
- **Response**: Array of order objects
- **Status**: Implemented ✅

### Get Order by ID
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Retrieves details of a specific order
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Response**: Order object with details
- **Status**: Implemented ✅

### Get Orders by Status
- **Endpoint**: `GET /api/orders/status/:status`
- **Description**: Retrieves orders with a specific status
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: Status of the orders
- **Response**: Array of matching order objects
- **Status**: Implemented ✅

### Get Orders by Customer
- **Endpoint**: `GET /api/orders/customer/:customerId`
- **Description**: Retrieves orders for a specific customer
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the customer
- **Response**: Array of customer orders
- **Status**: Implemented ✅

### Get Orders by Business Partner
- **Endpoint**: `GET /api/orders/partner/:partnerId`
- **Description**: Retrieves orders assigned to a specific business partner
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the business partner
- **Response**: Array of partner orders
- **Status**: Implemented ✅

### Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Creates a new food order
- **Auth Required**: Yes (JWT)
- **Request Body**: Order details including items, delivery address, etc.
- **Response**: Created order object
- **Status**: Implemented ✅

### Update Order
- **Endpoint**: `PATCH /api/orders/:id`
- **Description**: Updates an existing order
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Request Body**: Fields to update
- **Response**: Updated order object
- **Status**: Implemented ✅

### Delete Order
- **Endpoint**: `DELETE /api/orders/:id`
- **Description**: Cancels/deletes an order
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: ID of the order
- **Response**: Success message
- **Status**: Implemented ✅

### Update Order Status
- **Endpoint**: `PATCH /api/orders/:id/status`
- **Description**: Updates the status of an order
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Request Body**: New status
- **Response**: Updated order object
- **Status**: Implemented ✅

### Mark Order as Paid
- **Endpoint**: `PATCH /api/orders/:id/paid`
- **Description**: Marks an order as paid
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Request Body**: Payment details
- **Response**: Updated order object
- **Status**: Implemented ✅

### Add Review
- **Endpoint**: `PATCH /api/orders/:id/review`
- **Description**: Adds customer review to an order
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the order
- **Request Body**: Rating and review text
- **Response**: Updated order object
- **Status**: Implemented ✅

## Data Model

### Order Schema
```typescript
interface Order {
  customer: User | string;        // Reference to customer
  businessPartner: User | string; // Reference to business partner
  items: OrderItem[];             // Array of ordered items
  totalAmount: number;            // Total price
  status: OrderStatus;            // Current status
  deliveryAddress: string;        // Delivery location
  deliveryInstructions?: string;  // Special instructions
  isPaid: boolean;                // Payment status
  paymentDetails: {               // Payment information
    transactionId?: string;
    paidAt?: Date;
    paymentMethod?: string;
    amount?: number;
  };
  scheduledDeliveryTime?: Date;   // Planned delivery time
  actualDeliveryTime?: Date;      // Actual delivery time
  rating?: number;                // Customer rating (1-5)
  review?: string;                // Customer review text
  createdAt: Date;                // Order creation time
  updatedAt: Date;                // Last update time
}
```

### Order Status Enum
```typescript
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}
```

## Dependencies
- Mongoose Module
- User Module
- Menu Module (for meal information)
- Notification Module (for status updates)

## Events
The Order module emits events that can be consumed by other modules:
- `order.created`: When a new order is placed
- `order.updated`: When an order is modified
- `order.status-changed`: When order status changes
- `order.paid`: When payment is received

## Real-time Features
- Server-Sent Events (SSE) for order status tracking ✅
- WebSocket notifications for new orders and updates ✅

## Future Enhancements
- Order scheduling for future dates
- Recurring orders
- Batch orders for groups
- Order modification window
- Delivery tracking integration
- Automated status updates
- Analytics for popular items and peak times 