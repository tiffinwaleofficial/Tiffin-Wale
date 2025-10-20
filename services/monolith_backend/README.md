# TiffinMate Monolithic Backend

A modular NestJS monolithic application for the TiffinMate food delivery platform.

## Project Structure

The backend follows a modular structure to keep code organized:

```
monolith_backend/
└── src/
    ├── modules/           # Feature modules
    │   ├── auth/          # Authentication and authorization
    │   ├── user/          # User management
    │   ├── order/         # Order management
    │   ├── menu/          # Menu management
    │   ├── admin/         # Admin features
    │   ├── partner/       # Business partner features
    │   ├── payment/       # Payment processing
    │   ├── notification/  # Notifications and real-time updates
    │   ├── customer/      # Customer profile management
    │   ├── subscription/  # Subscription plans and user subscriptions
    │   ├── feedback/      # User feedback and reports
    │   ├── marketing/     # Marketing and promotional features
    │   ├── landing/       # Landing page functionality
    │   ├── meal/          # Meal planning and delivery
    │   ├── system/        # System utilities and monitoring
    ├── common/            # Shared interfaces, DTOs, pipes, guards, constants
    ├── config/            # Environment and app configuration
    ├── main.ts           # Main entry point
    └── app.module.ts     # Root module
```

## Features

- **Modular Architecture**: Clean separation of concerns using NestJS modules
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **API Documentation**: Swagger UI for API documentation
- **Real-time Updates**: WebSocket and SSE support for real-time features
- **Database**: MongoDB integration with Mongoose
- **Validation**: Request validation using class-validator
- **Subscription Management**: Meal subscription plans with flexible options
- **Customer Profiles**: Custom user profiles with preferences
- **Business Partner Portal**: Tools for restaurants to manage their offerings
- **Admin Dashboard**: Comprehensive system management

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository
2. Navigate to the project folder:

```bash
cd monolith_backend
```

3. Install dependencies:

```bash
npm install
```

4. Configure environment variables:

Copy the `.env.example` file to `.env` and update the values as needed.

5. Start the development server:

```bash
npm run start:dev
```

The server will be available at http://localhost:3000/api.
Swagger documentation is available at http://localhost:3000/api-docs.

## API Platforms

This backend supports 3 major platforms:

1. **Customer Platform**: Student-facing app for ordering meals and managing subscriptions
2. **Business Partner Platform**: Lunch centers for managing menus and orders
3. **Super Admin Platform**: Internal dashboard for system management

## Available Scripts

- `npm run start`: Start the production server
- `npm run start:dev`: Start the development server with hot reload
- `npm run build`: Build the project
- `npm run test`: Run tests
- `npm run lint`: Run linting
- `npm run format`: Format code

## Documentation

Detailed module documentation can be found in the `docs/modules/` directory:

- [Auth Module](docs/modules/auth.md)
- [User Module](docs/modules/user.md)
- [Menu Module](docs/modules/menu.md)
- [Order Module](docs/modules/order.md)
- [Subscription Module](docs/modules/subscription.md)
- [Partner Module](docs/modules/partner.md)
- [Customer Module](docs/modules/customer.md)
- [Feedback Module](docs/modules/feedback.md)
- [Marketing Module](docs/modules/marketing.md)

## Future Considerations

This monolithic architecture is designed to be easily migrated to microservices when needed, with modular components that can be separated into individual services.

## Technologies

- NestJS
- MongoDB with Mongoose
- JWT Authentication
- Swagger
- WebSockets
- Server-Sent Events
- Class Validator 