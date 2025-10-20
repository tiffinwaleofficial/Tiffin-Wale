# User Module Documentation

## Overview
The User module provides functionality for managing user accounts across the TiffinMate platform. It supports managing different user types (customers, business partners, admins) and their associated data.

## Core Features
- **User Management**: CRUD operations for user accounts
- **User Profiles**: Store and manage user profile information
- **Role Management**: Support for different user roles and permissions
- **User Search**: Find users by various criteria

## Module Structure
```
user/
├── user.module.ts        # Module definition
├── user.controller.ts    # API endpoints
├── user.service.ts       # Business logic
├── schemas/             # Database schemas
│   └── user.schema.ts   # MongoDB user schema
└── dto/                 # Data transfer objects
    ├── create-user.dto.ts  # User creation validation
    └── update-user.dto.ts  # User update validation
```

## APIs

### Get All Users
- **Endpoint**: `GET /api/users`
- **Description**: Retrieves a list of all users
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Response**: Array of user objects
- **Status**: Implemented ✅

### Get User by ID
- **Endpoint**: `GET /api/users/:id`
- **Description**: Retrieves details of a specific user
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the user
- **Response**: User object
- **Status**: Implemented ✅

### Create User
- **Endpoint**: `POST /api/users`
- **Description**: Creates a new user (admin function)
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
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
- **Response**: Created user object
- **Status**: Implemented ✅

### Update User
- **Endpoint**: `PATCH /api/users/:id`
- **Description**: Updates an existing user
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: ID of the user
- **Request Body**: Fields to update (partial)
- **Response**: Updated user object
- **Status**: Implemented ✅

### Delete User
- **Endpoint**: `DELETE /api/users/:id`
- **Description**: Deletes a user
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: ID of the user
- **Response**: Success message
- **Status**: Implemented ✅

## Data Model

### User Schema
```typescript
interface User {
  email: string;         // Unique email address
  password: string;      // Hashed password
  role: UserRole;        // Role (customer, business, admin, super_admin)
  firstName?: string;    // Optional first name
  lastName?: string;     // Optional last name
  phoneNumber?: string;  // Optional phone number
  isActive: boolean;     // Account status
  createdAt: Date;       // Creation timestamp
  updatedAt: Date;       // Last update timestamp
}
```

## Dependencies
- Mongoose Module
- Authentication Module (for password hashing)

## Usage Examples

### Finding a User by Email
```typescript
// In a service
const user = await this.userService.findByEmail('user@example.com');
```

### Updating a User
```typescript
// In a controller
const updatedUser = await this.userService.update(userId, {
  firstName: 'New Name',
  isActive: false
});
```

## Future Enhancements
- User profile pictures
- Email verification
- Account deactivation (soft delete)
- User activity logging
- Address management
- Payment method management
- User preferences 