# Landing Page Module Implementation

## Overview

This document provides technical implementation details of the Landing Page Module in the TiffinMate monolith backend. The module manages contact form submissions and newsletter subscriptions from the marketing website and landing pages.

## Architecture

The Landing Page Module follows the NestJS architecture pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and database operations
- **DTOs**: Define data transfer objects for request/response validation
- **Schemas**: Define MongoDB document structures
- **Guards**: Implement authentication and authorization

## Implementation Details

### Module Structure

```
landing/
├── landing.module.ts        # Module definition
├── landing.controller.ts    # API endpoints
├── landing.service.ts       # Business logic
├── dto/                     # Data transfer objects
│   ├── contact.dto.ts       # Contact form DTOs
│   ├── subscriber.dto.ts    # Newsletter subscriber DTOs
│   └── index.ts             # Export barrel
├── schemas/                 # MongoDB schemas
│   ├── contact.schema.ts    # Contact schema
│   ├── subscriber.schema.ts # Subscriber schema
│   └── index.ts             # Export barrel
```

### Key Components

#### DTOs

1. **Contact DTOs**:
   - `CreateContactDto`: Validates contact form submissions
   - `ContactResponseDto`: Formats contact responses

2. **Subscriber DTOs**:
   - `CreateSubscriberDto`: Validates newsletter subscriptions
   - `SubscriberResponseDto`: Formats subscriber responses
   - `GetSubscribersResponseDto`: Formats paginated subscriber list responses

#### Schemas

1. **Contact Schema**:
   - Defines the structure for contact form submissions
   - Includes timestamp functionality
   - Default status: "new"
   - Default isResolved: false

2. **Subscriber Schema**:
   - Defines the structure for newsletter subscribers
   - Includes timestamp functionality
   - Unique email constraint
   - Auto-generated unsubscribe token using crypto
   - Default isActive: true

#### Controller

The `LandingController` provides four main endpoints:
- `POST /contact`: Public endpoint for contact form submissions
- `POST /subscribe`: Public endpoint for newsletter subscriptions
- `GET /admin/contacts`: Protected endpoint for viewing contact submissions
- `GET /admin/subscribers`: Protected endpoint for viewing newsletter subscribers

#### Service

The `LandingService` implements the business logic:
- Contact form processing
- Newsletter subscription with duplicate check and reactivation
- Paginated and filtered retrieval of contacts and subscribers

### Security Implementation

1. **Public Endpoints**:
   - No authentication required for contact form and newsletter subscription
   - Input validation using class-validator
   - Rate limiting support

2. **Admin Endpoints**:
   - JWT authentication using `JwtAuthGuard`
   - Role-based authorization using `RolesGuard`
   - Restricted to `ADMIN` and `SUPER_ADMIN` roles

### Database Considerations

1. **Collection Names**:
   - `contacts`: Stores contact form submissions
   - `subscribers`: Stores newsletter subscriptions

2. **Indexes**:
   - Email index on subscribers collection for fast lookups
   - Text index on name and email fields for search functionality
   - Date index for sorting

### Pagination Implementation

Both admin endpoints support pagination with these parameters:
- `page`: Current page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Text search on name and email
- `sortBy`: Field to sort by
- `sortOrder`: Sort direction (asc/desc)

### Error Handling

The module implements comprehensive error handling:
- Duplicate email detection for subscribers
- Input validation errors with descriptive messages
- Authentication and authorization failures
- Database operation failures

## Testing

All endpoints have been thoroughly tested:

1. **Public Endpoints**:
   - Valid submissions
   - Invalid data formats
   - Rate limiting behavior

2. **Admin Endpoints**:
   - Authorization checks
   - Pagination functionality
   - Search and filtering
   - Sorting options

## Future Enhancements

1. **Contact Management**:
   - Status update endpoints
   - Assignment to team members
   - Response tracking

2. **Subscription Management**:
   - Bulk operations
   - Newsletter campaign integration
   - Preference management
   - Unsubscribe endpoint

3. **Analytics**:
   - Conversion tracking
   - Contact source analytics
   - Subscription trend reporting 