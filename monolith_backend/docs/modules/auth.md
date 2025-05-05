# Auth Module Documentation

## Overview
The Auth module handles user authentication and authorization across the TiffinMate platform. It provides JWT-based authentication services, including user registration, login, and password management.

## Core Features
- **User Registration**: Create new user accounts
- **User Login**: Authenticate users and issue JWT tokens
- **Password Management**: Allow users to change passwords securely
- **JWT Strategy**: Token-based authentication for secure API access 
- **Role-based Access Control**: Grant permissions based on user roles

## Module Structure
```
auth/
├── auth.module.ts         # Module definition
├── auth.controller.ts     # API endpoints
├── auth.service.ts        # Business logic
├── guards/                # Authentication guards
│   ├── jwt-auth.guard.ts  # JWT authentication guard
│   └── local-auth.guard.ts # Local authentication guard
├── strategies/            # Passport strategies
│   ├── jwt.strategy.ts    # JWT token validation strategy
│   └── local.strategy.ts  # Username/password validation strategy
└── dto/                   # Data transfer objects
    ├── register.dto.ts    # Registration data validation
    ├── login.dto.ts       # Login data validation
    └── change-password.dto.ts # Password change validation
```

## APIs

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Creates a new user account
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890"
  }
  ```
- **Response**: JWT token and user information
- **Status**: Implemented ✅

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and provides a JWT token
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: JWT token and user information
- **Status**: Implemented ✅

### Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Description**: Allows authenticated users to change their password
- **Auth Required**: Yes (JWT)
- **Request Body**: 
  ```json
  {
    "oldPassword": "currentpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response**: Success message
- **Status**: Implemented ✅

## Dependencies
- NestJS JWT Module
- NestJS Passport Module
- User Module

## Usage Examples

### Protecting Routes
```typescript
@Get()
@UseGuards(JwtAuthGuard)
findAll() {
  // This route is protected and requires authentication
}
```

### Role-based Access
```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
create() {
  // This route requires ADMIN role
}
```

## Future Enhancements
- OAuth integration for social logins
- Two-factor authentication
- Password reset functionality
- Token refresh mechanism
- Session management 