# Marketing Module Implementation

## Overview

This document provides technical implementation details of the Marketing Module in the TiffinMate monolith backend. The module handles referral tracking and marketing campaign management.

## Architecture

The Marketing Module follows the NestJS architecture pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and database operations
- **DTOs**: Define data transfer objects for request/response validation
- **Schemas**: Define MongoDB document structures
- **Guards**: Implement authentication and authorization

## Implementation Details

### Module Structure

```
marketing/
├── marketing.module.ts      # Module definition
├── marketing.controller.ts  # API endpoints
├── marketing.service.ts     # Business logic
├── dto/                     # Data transfer objects
│   ├── referral.dto.ts      # Referral DTOs
│   └── index.ts             # Export barrel
├── schemas/                 # MongoDB schemas
│   ├── referral.schema.ts   # Referral schema
│   └── index.ts             # Export barrel
```

### Key Components

#### DTOs

1. **Referral DTOs**:
   - `CreateReferralDto`: Validates referral submissions
   - `ReferralResponseDto`: Formats referral responses
   - `GetReferralsResponseDto`: Formats paginated referral list responses

#### Schemas

1. **Referral Schema**:
   - Defines the structure for tracking referrals
   - Includes timestamp functionality
   - Tracks referrer and referee information
   - Records conversion status
   - Tracks referral rewards

#### Controller

The `MarketingController` provides two main endpoints:
- `POST /referrals`: Public endpoint for submitting referrals
- `GET /referrals`: Protected endpoint for viewing tracked referrals

#### Service

The `MarketingService` implements the business logic:
- Referral validation and storage
- Self-referral detection and prevention
- Duplicate referral handling
- Paginated and filtered retrieval of referrals

### Security Implementation

1. **Public Endpoints**:
   - No authentication required for referral submission
   - Input validation using class-validator
   - Rate limiting support to prevent abuse

2. **Admin Endpoints**:
   - JWT authentication using `JwtAuthGuard`
   - Role-based authorization using `RolesGuard`
   - Restricted to `ADMIN` and `SUPER_ADMIN` roles

### Database Considerations

1. **Collection Names**:
   - `referrals`: Stores referral tracking data

2. **Indexes**:
   - Email indexes for both referrer and referee for quick lookups
   - Status index for conversion tracking
   - Date index for sorting
   - Compound indexes for unique referral enforcement

### Referral Logic

The module implements these key features for referral tracking:

1. **Validation Rules**:
   - Self-referral prevention (same email address)
   - Duplicate referral detection
   - Valid email format checking
   - Required fields validation

2. **Status Tracking**:
   - Initial status: "pending"
   - Conversion status: "converted" when referee signs up
   - Reward status: "rewarded" when incentives are provided

3. **Reward System**:
   - Customizable reward amounts
   - Tracking of reward distribution
   - Support for different reward types (credits, discounts)

### Pagination Implementation

The admin endpoint supports pagination with these parameters:
- `page`: Current page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by conversion status
- `startDate`: Filter referrals after this date
- `endDate`: Filter referrals before this date
- `search`: Text search on referrer or referee email
- `sortBy`: Field to sort by
- `sortOrder`: Sort direction (asc/desc)

### Error Handling

The module implements comprehensive error handling:
- Self-referral detection
- Duplicate referral detection
- Input validation errors with descriptive messages
- Authentication and authorization failures
- Database operation failures

## Testing

All endpoints have been thoroughly tested:

1. **Public Endpoint**:
   - Valid referral submissions
   - Invalid data formats
   - Self-referral attempts
   - Duplicate referral handling
   - Rate limiting behavior

2. **Admin Endpoint**:
   - Authorization checks
   - Pagination functionality
   - Search and filtering
   - Date range filtering
   - Sorting options

## Future Enhancements

1. **Campaign Management**:
   - Campaign creation endpoints
   - Campaign-specific referral tracking
   - A/B testing support
   - Campaign performance analytics

2. **Advanced Rewards**:
   - Multi-tier referral rewards
   - Custom reward rules engine
   - Automated reward distribution
   - Reward notification system

3. **Analytics**:
   - Conversion rate tracking
   - Referral source analytics
   - User acquisition cost calculations
   - ROI metrics by referral source 