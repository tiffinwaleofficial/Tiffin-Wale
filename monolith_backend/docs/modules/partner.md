# Partner Module Documentation

## Overview
The Partner module manages restaurant partners in the TiffinMate platform. It handles partner registration, profile management, status updates, and related operations such as retrieving partner menus, orders, and statistics.

## Features
- Partner registration and profile management
- Role-based access control for partner operations
- Partner status management (pending, approved, rejected, suspended)
- Partner menu, order, and review management
- Partner statistics

## Database Schema
The Partner model is stored in MongoDB with the following schema:

```typescript
@Schema({ timestamps: true })
export class Partner extends Document {
  user: User;               // Reference to User document
  businessName: string;     // Name of the business
  description: string;      // Business description
  cuisineTypes: string[];   // Types of cuisine offered
  address: Address;         // Business address
  businessHours: BusinessHours; // Operating hours
  logoUrl: string;          // URL to business logo
  bannerUrl: string;        // URL to business banner image
  isAcceptingOrders: boolean; // Whether accepting orders
  isFeatured: boolean;      // Whether featured on platform
  status: string;           // Partner status (pending, approved, etc.)
  averageRating: number;    // Average customer rating
  totalReviews: number;     // Total number of reviews
}
```

## API Endpoints

### 1. Register a new partner
- **Endpoint**: `POST /partners`
- **Description**: Creates a new partner account
- **Access Control**: Public - no authentication required
- **Request Body**: CreatePartnerDto
- **Response**: PartnerResponseDto
- **Status Codes**:
  - 201: Partner successfully created
  - 400: Bad request - validation failed
  - 409: Email already in use
  - 500: Internal server error

### 2. Get all partners
- **Endpoint**: `GET /partners`
- **Description**: Retrieves a paginated list of partners
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**:
  - page: Page number (optional)
  - limit: Number of items per page (optional)
  - status: Filter by status (optional)
- **Response**: PartnerListResponseDto
- **Status Codes**:
  - 200: List of partners returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 3. Get partner by ID
- **Endpoint**: `GET /partners/:id`
- **Description**: Retrieves a specific partner by ID
- **Access Control**: Any authenticated user
- **Path Parameters**:
  - id: Partner ID
- **Response**: PartnerResponseDto
- **Status Codes**:
  - 200: Partner details returned
  - 401: Unauthorized - missing or invalid token
  - 404: Partner not found

### 4. Get partner by user ID
- **Endpoint**: `GET /partners/user/:userId`
- **Description**: Retrieves a partner by associated user ID
- **Access Control**: Any authenticated user
- **Path Parameters**:
  - userId: User ID
- **Response**: PartnerResponseDto
- **Status Codes**:
  - 200: Partner details returned
  - 401: Unauthorized - missing or invalid token
  - 404: Partner not found

### 5. Update partner
- **Endpoint**: `PUT /partners/:id`
- **Description**: Updates partner information
- **Access Control**: Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role)
- **Path Parameters**:
  - id: Partner ID
- **Request Body**: UpdatePartnerDto
- **Response**: PartnerResponseDto
- **Status Codes**:
  - 200: Partner successfully updated
  - 400: Bad request
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions
  - 404: Partner not found

### 6. Update partner status
- **Endpoint**: `PUT /partners/:id/status`
- **Description**: Updates a partner's status (approve, reject, suspend)
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Path Parameters**:
  - id: Partner ID
- **Request Body**: PartnerStatusUpdateDto
- **Response**: PartnerResponseDto
- **Status Codes**:
  - 200: Partner status successfully updated
  - 400: Bad request
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions
  - 404: Partner not found

### 7. Delete partner
- **Endpoint**: `DELETE /partners/:id`
- **Description**: Permanently removes a partner account
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Path Parameters**:
  - id: Partner ID
- **Response**: Object containing a success message
```json
{
  "message": "Partner successfully deleted"
}
```
- **Status Codes**:
  - 200: Partner successfully deleted
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions
  - 404: Partner not found

### 8. Get partner orders
- **Endpoint**: `GET /partners/:id/orders`
- **Description**: Retrieves orders for a specific partner
- **Access Control**: Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role)
- **Path Parameters**:
  - id: Partner ID
- **Query Parameters**:
  - page: Page number (optional)
  - limit: Number of items per page (optional)
  - status: Filter by status (optional)
- **Response**: Object containing orders array and pagination info
- **Status Codes**:
  - 200: Partner orders returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions
  - 404: Partner not found

### 9. Get partner menu
- **Endpoint**: `GET /partners/:id/menu`
- **Description**: Retrieves menu items for a specific partner
- **Access Control**: Any authenticated user
- **Path Parameters**:
  - id: Partner ID
- **Response**: Object containing menuItems array
- **Status Codes**:
  - 200: Partner menu returned
  - 401: Unauthorized - missing or invalid token
  - 404: Partner not found

### 10. Get partner reviews
- **Endpoint**: `GET /partners/:id/reviews`
- **Description**: Retrieves customer reviews for a specific partner
- **Access Control**: Any authenticated user
- **Path Parameters**:
  - id: Partner ID
- **Query Parameters**:
  - page: Page number (optional)
  - limit: Number of items per page (optional)
- **Response**: Object containing reviews array and pagination info
- **Status Codes**:
  - 200: Partner reviews returned
  - 401: Unauthorized - missing or invalid token
  - 404: Partner not found

### 11. Get partner statistics
- **Endpoint**: `GET /partners/:id/stats`
- **Description**: Retrieves business statistics for a specific partner
- **Access Control**: Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role)
- **Path Parameters**:
  - id: Partner ID
- **Response**: Object containing various statistics
- **Status Codes**:
  - 200: Partner statistics returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions
  - 404: Partner not found

## DTOs (Data Transfer Objects)
The Partner module uses the following DTOs:

### 1. CreatePartnerDto
Used when registering a new partner
```typescript
class CreatePartnerDto {
  email: string;              // Business email address
  password: string;           // Account password (min 6 chars)
  businessName: string;       // Business name
  phoneNumber: string;        // Business phone number
  description: string;        // Business description
  cuisineTypes: string[];     // Types of cuisine offered
  address: AddressDto;        // Business address
  businessHours: BusinessHoursDto; // Business hours
  logoUrl?: string;           // URL to business logo (optional)
  bannerUrl?: string;         // URL to banner image (optional)
  isAcceptingOrders?: boolean; // Whether accepting orders (optional)
  isFeatured?: boolean;       // Whether featured (optional)
}
```

### 2. UpdatePartnerDto
Used when updating an existing partner
```typescript
class UpdatePartnerDto {
  email?: string;             // Business email address
  businessName?: string;      // Business name
  phoneNumber?: string;       // Business phone number
  description?: string;       // Business description
  cuisineTypes?: string[];    // Types of cuisine offered
  address?: AddressDto;       // Business address
  businessHours?: BusinessHoursDto; // Business hours
  logoUrl?: string;           // URL to business logo
  bannerUrl?: string;         // URL to banner image
  isAcceptingOrders?: boolean; // Whether accepting orders
  isFeatured?: boolean;       // Whether featured
  isActive?: boolean;         // Whether active
}
```

### 3. PartnerStatusUpdateDto
Used when updating a partner's status
```typescript
class PartnerStatusUpdateDto {
  status: string;             // Partner status (enum: pending, approved, rejected, suspended)
}
```

### 4. PartnerResponseDto
Returned when requesting partner information
```typescript
class PartnerResponseDto {
  id: string;                 // Partner ID
  businessName: string;       // Business name
  email: string;              // Business email
  phoneNumber: string;        // Business phone
  description: string;        // Business description
  cuisineTypes: string[];     // Types of cuisine
  address: AddressDto;        // Business address
  businessHours: BusinessHoursDto; // Business hours
  logoUrl: string;            // URL to logo
  bannerUrl: string;          // URL to banner
  isAcceptingOrders: boolean; // Whether accepting orders
  isFeatured: boolean;        // Whether featured
  isActive: boolean;          // Whether active
  averageRating: number;      // Average rating
  totalReviews: number;       // Total reviews
  status: string;             // Partner status
  createdAt: Date;            // Creation timestamp
  updatedAt: Date;            // Update timestamp
}
```

### 5. PartnerListResponseDto
Returned when listing partners
```typescript
class PartnerListResponseDto {
  partners: PartnerResponseDto[]; // Array of partners
  total: number;              // Total matching partners
  page: number;               // Current page
  limit: number;              // Items per page
}
```

## Partner Workflow
1. Partner registers through the public registration endpoint
2. Partner is created with PENDING status
3. Admin approves/rejects the partner via status update endpoint
4. Approved partner can manage their profile, view orders, and statistics
5. Partner status can be changed by admin (e.g., suspended if violations occur)

## Role-Based Access Control
- **Public**: Partner registration only
- **Any authenticated user**: View partner details, menu, and reviews
- **BUSINESS role**: Update own profile, view own orders and statistics
- **ADMIN/SUPER_ADMIN roles**: Full access to all endpoints and operations 