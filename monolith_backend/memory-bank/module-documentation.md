# TiffinMate Monolith Backend - Module Documentation

## 🏗️ Module Architecture Overview

The TiffinMate Monolith Backend follows a modular architecture pattern with 20+ specialized modules, each handling specific business domains. This documentation provides comprehensive details about each module's purpose, structure, and implementation.

## 📋 Module Categories

### **Core Modules** (Essential functionality)
- AuthModule - Authentication and authorization
- UserModule - User management and profiles
- OrderModule - Order processing and management
- MenuModule - Menu and item management
- PaymentModule - Payment processing and webhooks

### **Business Modules** (Business logic)
- SubscriptionModule - Subscription plans and management
- MealModule - Meal planning and delivery
- PartnerModule - Restaurant partner management
- CustomerModule - Customer profile management
- FeedbackModule - User feedback and ratings

### **System Modules** (System functionality)
- AdminModule - Administrative functions
- SystemModule - System utilities and monitoring
- NotificationModule - Real-time notifications
- AnalyticsModule - Business analytics and reporting
- SupportModule - Customer support system

### **Feature Modules** (Additional features)
- LandingModule - Landing page functionality
- MarketingModule - Marketing and promotional features
- UploadModule - File upload and management
- SeederModule - Database seeding and testing

## 🔐 AuthModule

### **Purpose**
Handles user authentication, authorization, and session management using JWT tokens.

### **Key Components**
- **AuthController**: Authentication endpoints
- **AuthService**: Business logic for auth operations
- **JwtStrategy**: JWT token validation strategy
- **LocalStrategy**: Local authentication strategy
- **Guards**: JWT and role-based guards

### **API Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Token refresh
- `POST /auth/change-password` - Password change
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### **Dependencies**
- UserModule (user management)
- SubscriptionModule (user subscriptions)
- CustomerProfileModule (user profiles)
- MealModule (user meal preferences)

### **Security Features**
- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control
- Token refresh mechanism
- Password reset functionality

## 👤 UserModule

### **Purpose**
Manages user accounts, profiles, and user-related operations.

### **Key Components**
- **UserController**: User management endpoints
- **UserService**: User business logic
- **UserSchema**: MongoDB user schema
- **User DTOs**: Data transfer objects

### **API Endpoints**
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user information
- `DELETE /users/:id` - Delete user account

### **User Schema**
```typescript
{
  _id: ObjectId,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  role: UserRole,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **User Roles**
- **CUSTOMER**: Regular app users
- **PARTNER**: Restaurant partners
- **ADMIN**: System administrators
- **SUPER_ADMIN**: Super administrators

## 🛒 OrderModule

### **Purpose**
Handles order creation, processing, status updates, and order management.

### **Key Components**
- **OrderController**: Order management endpoints
- **OrderService**: Order business logic
- **OrderSchema**: MongoDB order schema
- **Order DTOs**: Order data transfer objects

### **API Endpoints**
- `POST /orders` - Create new order
- `GET /orders` - Get all orders (Admin)
- `GET /orders/:id` - Get order by ID
- `GET /orders/me` - Get user's orders
- `GET /orders/customer/:customerId` - Get customer orders
- `GET /orders/partner/:partnerId` - Get partner orders
- `PATCH /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `PATCH /orders/:id/paid` - Mark order as paid
- `PATCH /orders/:id/review` - Add order review
- `DELETE /orders/:id` - Delete order

### **Order Schema**
```typescript
{
  _id: ObjectId,
  userId: string,
  restaurantId: string,
  items: OrderItem[],
  totalAmount: number,
  status: OrderStatus,
  deliveryAddress: DeliveryAddress,
  specialInstructions: string,
  paymentStatus: PaymentStatus,
  review: OrderReview,
  createdAt: Date,
  updatedAt: Date
}
```

### **Order Statuses**
- **PENDING**: Order placed, awaiting confirmation
- **CONFIRMED**: Order confirmed by restaurant
- **PREPARING**: Order being prepared
- **READY**: Order ready for pickup/delivery
- **OUT_FOR_DELIVERY**: Order out for delivery
- **DELIVERED**: Order delivered successfully
- **CANCELLED**: Order cancelled

## 🍽️ MenuModule

### **Purpose**
Manages menu categories, menu items, and restaurant menu operations.

### **Key Components**
- **MenuController**: Menu management endpoints
- **MenuService**: Menu business logic
- **CategorySchema**: Menu category schema
- **MenuItemSchema**: Menu item schema

### **API Endpoints**
- `GET /menu/categories` - Get all categories
- `POST /menu/categories` - Create category
- `GET /menu/categories/:id` - Get category by ID
- `PATCH /menu/categories/:id` - Update category
- `DELETE /menu/categories/:id` - Delete category
- `GET /menu` - Get all menu items
- `POST /menu` - Create menu item
- `GET /menu/:id` - Get menu item by ID
- `PATCH /menu/:id` - Update menu item
- `DELETE /menu/:id` - Delete menu item
- `GET /menu/partner/:partnerId` - Get partner menu items

### **Category Schema**
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **MenuItem Schema**
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  categoryId: string,
  partnerId: string,
  imageUrl: string,
  isAvailable: boolean,
  customizations: string[],
  createdAt: Date,
  updatedAt: Date
}
```

## 💳 PaymentModule

### **Purpose**
Handles payment processing, payment methods, and financial transactions.

### **Key Components**
- **PaymentController**: Payment management endpoints
- **PaymentService**: Payment business logic
- **RazorpayService**: Razorpay integration
- **WebhookController**: Payment webhook handling
- **PaymentMethodSchema**: Payment method schema

### **API Endpoints**
- `POST /payment/methods` - Create payment method
- `GET /payment/methods/customer/:customerId` - Get customer payment methods
- `GET /payment/methods/:id` - Get payment method by ID
- `PATCH /payment/methods/:id` - Update payment method
- `DELETE /payment/methods/:id` - Delete payment method
- `PATCH /payment/methods/:id/set-default` - Set default payment method

### **Payment Integration**
- **Razorpay Gateway**: Primary payment processor
- **Webhook Processing**: Real-time payment updates
- **Transaction Validation**: Payment verification
- **Refund Processing**: Refund handling

### **Payment Method Schema**
```typescript
{
  _id: ObjectId,
  customerId: string,
  type: PaymentType,
  cardDetails: CardDetails,
  isDefault: boolean,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 📋 SubscriptionModule

### **Purpose**
Manages subscription plans, user subscriptions, and subscription lifecycle.

### **Key Components**
- **SubscriptionController**: Subscription management endpoints
- **SubscriptionService**: Subscription business logic
- **SubscriptionSchema**: Subscription schema
- **SubscriptionPlanSchema**: Subscription plan schema

### **API Endpoints**
- `POST /subscriptions` - Create subscription
- `GET /subscriptions` - Get all subscriptions
- `GET /subscriptions/:id` - Get subscription by ID
- `GET /subscriptions/customer/:customerId` - Get customer subscriptions
- `PATCH /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription
- `PATCH /subscriptions/:id/cancel` - Cancel subscription
- `PATCH /subscriptions/:id/pause` - Pause subscription
- `PATCH /subscriptions/:id/resume` - Resume subscription

### **Subscription Schema**
```typescript
{
  _id: ObjectId,
  customerId: string,
  planId: string,
  restaurantId: string,
  status: SubscriptionStatus,
  startDate: Date,
  endDate: Date,
  deliverySchedule: DeliverySchedule,
  createdAt: Date,
  updatedAt: Date
}
```

### **Subscription Statuses**
- **ACTIVE**: Subscription is active
- **PAUSED**: Subscription is paused
- **CANCELLED**: Subscription is cancelled
- **EXPIRED**: Subscription has expired

## 🍽️ MealModule

### **Purpose**
Handles meal planning, meal creation, and meal delivery management.

### **Key Components**
- **MealController**: Meal management endpoints
- **MealService**: Meal business logic
- **MealSchema**: Meal schema

### **API Endpoints**
- `GET /meals` - Get all meals
- `POST /meals` - Create meal
- `GET /meals/:id` - Get meal by ID
- `PATCH /meals/:id` - Update meal
- `DELETE /meals/:id` - Delete meal

### **Meal Schema**
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  items: string[],
  price: number,
  partnerId: string,
  availableDate: Date,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 👥 CustomerModule

### **Purpose**
Manages customer profiles, delivery addresses, and customer-specific operations.

### **Key Components**
- **CustomerController**: Customer management endpoints
- **CustomerService**: Customer business logic
- **CustomerProfileSchema**: Customer profile schema
- **DeliveryAddressSchema**: Delivery address schema

### **API Endpoints**
- `GET /customers` - Get all customers (Admin)
- `GET /customers/:id` - Get customer by ID
- `PATCH /customers/:id` - Update customer information
- `POST /customers/:id/delivery-addresses` - Add delivery address
- `PATCH /customers/:id/delivery-addresses/:addressId` - Update delivery address
- `DELETE /customers/:id/delivery-addresses/:addressId` - Delete delivery address

### **Customer Profile Schema**
```typescript
{
  _id: ObjectId,
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  preferences: CustomerPreferences,
  createdAt: Date,
  updatedAt: Date
}
```

### **Delivery Address Schema**
```typescript
{
  _id: ObjectId,
  customerId: string,
  street: string,
  city: string,
  state: string,
  pincode: string,
  landmark: string,
  isDefault: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🏢 PartnerModule

### **Purpose**
Manages business partners (restaurants), partner profiles, and partner operations.

### **Key Components**
- **PartnerController**: Partner management endpoints
- **PartnerService**: Partner business logic
- **PartnerSchema**: Partner schema

### **API Endpoints**
- `GET /partners` - Get all partners (Admin)
- `POST /partners` - Create partner (Admin)
- `GET /partners/:id` - Get partner by ID
- `PATCH /partners/:id` - Update partner information
- `DELETE /partners/:id` - Delete partner (Admin)

### **Partner Schema**
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phoneNumber: string,
  address: Address,
  cuisineType: string,
  isActive: boolean,
  rating: number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔔 NotificationModule

### **Purpose**
Handles real-time notifications, WebSocket communication, and notification management.

### **Key Components**
- **NotificationController**: Notification endpoints
- **NotificationService**: Notification business logic
- **NotificationGateway**: WebSocket gateway
- **NotificationSchema**: Notification schema

### **API Endpoints**
- `GET /notifications` - Get user notifications
- `POST /notifications` - Create notification (Admin)
- `PATCH /notifications/:id/read` - Mark notification as read
- `DELETE /notifications/:id` - Delete notification

### **WebSocket Events**
- `order.status.changed` - Order status updates
- `notification.new` - New notifications
- `subscription.updated` - Subscription changes
- `payment.completed` - Payment confirmations

### **Notification Schema**
```typescript
{
  _id: ObjectId,
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  isRead: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 📊 AnalyticsModule

### **Purpose**
Provides business analytics, reporting, and performance metrics.

### **Key Components**
- **AnalyticsController**: Analytics endpoints
- **AnalyticsService**: Analytics business logic

### **API Endpoints**
- `GET /analytics/earnings` - Get earnings analytics
- `GET /analytics/orders` - Get order analytics
- `GET /analytics/revenue-history` - Get revenue history

### **Analytics Features**
- Earnings tracking and reporting
- Order statistics and trends
- Revenue history and projections
- Performance metrics
- Business intelligence insights

## 🏢 AdminModule

### **Purpose**
Provides administrative functions, system management, and admin-specific operations.

### **Key Components**
- **AdminController**: Admin endpoints
- **AdminService**: Admin business logic

### **API Endpoints**
- `GET /admin/stats` - Get system statistics (Super Admin)
- `GET /admin/users` - Get user statistics
- `GET /admin/orders` - Get order statistics
- `GET /admin/revenue` - Get revenue statistics
- `GET /admin/partners` - Get partner statistics

### **Admin Features**
- System statistics and monitoring
- User management and analytics
- Order tracking and management
- Revenue reporting
- Partner management
- System configuration

## 🎯 LandingModule

### **Purpose**
Handles landing page functionality, public information, and marketing content.

### **Key Components**
- **LandingController**: Landing page endpoints
- **LandingService**: Landing page business logic

### **API Endpoints**
- `GET /landing/stats` - Get landing page statistics
- `GET /landing/testimonials` - Get customer testimonials
- `POST /landing/contact` - Submit contact form

### **Landing Features**
- Public statistics display
- Customer testimonials
- Contact form handling
- Marketing content management

## 📈 MarketingModule

### **Purpose**
Manages marketing campaigns, promotional features, and corporate inquiries.

### **Key Components**
- **MarketingController**: Marketing endpoints
- **CorporateController**: Corporate endpoints
- **MarketingService**: Marketing business logic

### **API Endpoints**
- `POST /corporate/quote` - Submit corporate quote request
- `GET /corporate/quotes` - Get corporate quotes (Admin)

### **Marketing Features**
- Corporate quote management
- Promotional campaign tracking
- Marketing analytics
- Lead generation
- Customer acquisition

## 📝 FeedbackModule

### **Purpose**
Handles user feedback, ratings, and review management.

### **Key Components**
- **FeedbackController**: Feedback endpoints
- **FeedbackService**: Feedback business logic
- **FeedbackSchema**: Feedback schema

### **API Endpoints**
- `POST /feedback` - Submit feedback
- `GET /feedback` - Get feedback (Admin)
- `GET /feedback/order/:orderId` - Get order feedback

### **Feedback Schema**
```typescript
{
  _id: ObjectId,
  orderId: string,
  userId: string,
  rating: number,
  comment: string,
  category: FeedbackCategory,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎫 SupportModule

### **Purpose**
Manages customer support tickets and support operations.

### **Key Components**
- **SupportController**: Support endpoints
- **SupportService**: Support business logic

### **API Endpoints**
- `POST /support/ticket` - Create support ticket
- `GET /support/tickets` - Get user support tickets

### **Support Features**
- Ticket creation and management
- Support category classification
- Ticket status tracking
- Support analytics

## 📤 UploadModule

### **Purpose**
Handles file uploads, image processing, and file management.

### **Key Components**
- **UploadController**: Upload endpoints
- **UploadService**: Upload business logic

### **API Endpoints**
- `POST /upload/image` - Upload image file

### **Upload Features**
- Image file upload
- File validation and processing
- Secure file storage
- File URL generation

## 🔧 SystemModule

### **Purpose**
Provides system utilities, health checks, and system monitoring.

### **Key Components**
- **SystemController**: System endpoints
- **SystemService**: System business logic

### **API Endpoints**
- `GET /ping` - Health check
- `GET /version` - Application version

### **System Features**
- Health check monitoring
- Version information
- System status reporting
- Performance metrics

## 🌱 SeederModule

### **Purpose**
Handles database seeding, test data generation, and development utilities.

### **Key Components**
- **SeederController**: Seeder endpoints
- **SeederService**: Seeder business logic

### **API Endpoints**
- `POST /seeder/run` - Run database seeder (Development)
- `POST /seeder/reset` - Reset database (Development)

### **Seeder Features**
- Test data generation
- Database initialization
- Development utilities
- Data migration support

## 🔄 Module Dependencies

### **Dependency Graph**
```
AuthModule → UserModule
OrderModule → UserModule, MenuModule, PaymentModule
MenuModule → PartnerModule
PaymentModule → OrderModule
SubscriptionModule → UserModule, MealModule
CustomerModule → UserModule
PartnerModule → MenuModule
NotificationModule → All Modules
AnalyticsModule → OrderModule, PaymentModule
AdminModule → All Modules
```

### **Shared Dependencies**
- **DatabaseModule**: MongoDB connection
- **ConfigModule**: Environment configuration
- **Common Module**: Shared utilities, guards, decorators

## 📊 Module Metrics

### **Code Metrics**
- **Total Modules**: 20+
- **Total Controllers**: 20+
- **Total Services**: 20+
- **Total Schemas**: 25+
- **Total DTOs**: 50+

### **API Metrics**
- **Total Endpoints**: 150+
- **Authentication Required**: 90%
- **Admin Only**: 15%
- **Public Endpoints**: 10%

### **Database Metrics**
- **Total Collections**: 25+
- **Indexed Fields**: 50+
- **Relationships**: 30+
- **Validation Rules**: 100+

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Module Coverage**: 100%















