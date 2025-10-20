# API Design Principles

## Overview
The TiffinMate API is designed following RESTful principles with a focus on consistency, predictability, and developer experience. This document outlines the design principles and conventions used across all API endpoints.

## RESTful Resource Design

### Resource Naming
- Resources are named using **plural nouns** (e.g., `/users`, `/orders`, `/menu-items`)
- Resource relationships are represented through nested paths (e.g., `/partners/{partnerId}/menus`)
- Actions that don't fit CRUD operations use action verbs (e.g., `/orders/{orderId}/cancel`)

### HTTP Methods
| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve resources | `GET /menu-items` |
| POST | Create new resources | `POST /orders` |
| PUT | Replace a resource | `PUT /users/{userId}` |
| PATCH | Partially update a resource | `PATCH /menu-items/{itemId}` |
| DELETE | Remove a resource | `DELETE /orders/{orderId}` |

### Status Codes
| Code | Meaning | Example Usage |
|------|---------|---------------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating a resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing authentication |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side error |

## Query Parameters

### Filtering
Resources can be filtered using query parameters:
```
GET /menu-items?category=vegetarian
GET /orders?status=delivered
```

### Pagination
All list endpoints support pagination:
```
GET /orders?page=2&limit=10
```

### Sorting
Resources can be sorted by specific fields:
```
GET /menu-items?sort=price:asc
GET /orders?sort=createdAt:desc
```

### Field Selection
Clients can request specific fields:
```
GET /users?fields=name,email,profilePicture
```

## Response Format

### Success Responses
```json
{
  "status": "success",
  "data": {
    "item": { ... }  // or "items": [...]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalItems": 48
    }
  }
}
```

### Error Responses
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Authentication and Authorization

### JWT Authentication
- All protected endpoints require a JWT token in the Authorization header
- Format: `Authorization: Bearer {token}`

### Role-Based Access Control
- Endpoints enforce role requirements using guards
- Roles include: 'customer', 'business', 'admin', 'super_admin'

## Versioning

### URL-Based Versioning
API versions are specified in the URL path:
```
/api/v1/users
/api/v2/users
```

### Header-Based Version Acceptance
API versions can also be negotiated using headers:
```
Accept: application/json; version=1.0
```

## Documentation

### OpenAPI/Swagger
- All API endpoints are documented using OpenAPI/Swagger
- Accessible at `/api-docs` when the server is running
- Includes request/response schemas, examples, and authentication requirements

### Decorators
Endpoints are decorated with metadata for documentation:
```typescript
@ApiOperation({ summary: 'Get all menu items' })
@ApiResponse({ status: 200, description: 'Successful operation', type: MenuItemsResponseDto })
@ApiResponse({ status: 400, description: 'Bad request' })
```

## Data Validation

### DTO-Based Validation
- Input validation uses DTOs with class-validator decorators
- Example:
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  password: string;
  
  @IsString()
  name: string;
}
```

### Transformation
- DTOs are automatically transformed using class-transformer
- Helps ensure type safety and data consistency

## Rate Limiting

### Default Limits
- Public APIs: 60 requests per IP per minute
- Authenticated APIs: 100 requests per user per minute

### Custom Limits
- Critical endpoints may have stricter limits
- Business-critical operations have special considerations

## CORS Configuration

Cross-Origin Resource Sharing is configured to allow requests from:
- Web app origins
- Mobile app origins
- Partner dashboard origins

## API Evolution Guidelines

### Backward Compatibility
- New fields in responses won't break clients
- Required fields won't be added to existing request bodies
- Field types won't be changed on existing endpoints

### Deprecation Process
1. Mark endpoints as deprecated in documentation
2. Add a `Deprecation` header with a sunset date
3. Continue supporting for at least 6 months
4. Notify affected users before removal 