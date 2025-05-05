# Marketing Module

## Overview

The Marketing Module manages TiffinMate's referral program and marketing analytics. It allows customers to refer others to the platform, tracks marketing campaign effectiveness through UTM parameters, and provides administrators with tools to analyze marketing performance. This module is essential for growth and customer acquisition.

## Features

- **Referral Program**: Track and manage customer referrals
- **UTM Tracking**: Capture and analyze marketing campaign parameters
- **Referral Analytics**: Provide insights into referral program performance
- **Campaign Attribution**: Attribute user acquisition to specific marketing campaigns

## Data Model

### Referral Schema

```typescript
interface Referral {
  id: string;                 // Unique identifier
  referrer: string;           // User ID of the referrer (optional if not registered)
  referrerEmail: string;      // Email of the referrer (if not registered)
  referredEmail: string;      // Email of the person being referred
  referredUser: string;       // User ID once the referred person registers (optional)
  code: string;               // Unique referral code
  status: string;             // Status (pending, converted, expired)
  conversionDate: Date;       // When the referral was converted (optional)
  rewards: {                  // Rewards information
    referrerReward: string;   // Description of reward for referrer
    referredReward: string;   // Description of reward for referred person
    referrerRewardClaimed: boolean; // Whether referrer claimed the reward
    referredRewardClaimed: boolean; // Whether referred person claimed the reward
  };
  utmSource: string;          // UTM source parameter (optional)
  utmMedium: string;          // UTM medium parameter (optional)
  utmCampaign: string;        // UTM campaign parameter (optional)
  utmContent: string;         // UTM content parameter (optional)
  utmTerm: string;            // UTM term parameter (optional)
  createdAt: Date;            // Timestamp of referral creation
  expiresAt: Date;            // Expiration date of the referral
  updatedAt: Date;            // Timestamp of last update
}
```

## API Endpoints

### Submit Referral

**Endpoint**: `POST /api/referrals`

**Description**: Create a new referral entry when a user refers someone else

**Access Control**: 
- Public endpoint (no authentication required)
- Authenticated users (to associate with user account)

**Request Body**:
```json
{
  "referrerEmail": "existing@example.com",
  "referredEmail": "friend@example.com",
  "utmSource": "email",
  "utmMedium": "referral",
  "utmCampaign": "summer2023"
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c89",
  "referrerEmail": "existing@example.com",
  "referrer": "60d21b4667d0d8992e610c80", // If authenticated
  "referredEmail": "friend@example.com",
  "code": "REF123456",
  "status": "pending",
  "rewards": {
    "referrerReward": "₹100 off next order",
    "referredReward": "₹100 off first order",
    "referrerRewardClaimed": false,
    "referredRewardClaimed": false
  },
  "utmSource": "email",
  "utmMedium": "referral",
  "utmCampaign": "summer2023",
  "createdAt": "2023-06-03T10:15:30.000Z",
  "expiresAt": "2023-07-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `201`: Referral created successfully
- `400`: Invalid data format or missing required fields
- `409`: Self-referral or already referred
- `429`: Too many requests (rate limiting)

### View Referrals

**Endpoint**: `GET /api/referrals`

**Description**: Retrieve referral records for administration and analytics

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `status`: Filter by status (pending, converted, expired)
- `utmSource`: Filter by UTM source
- `utmMedium`: Filter by UTM medium
- `utmCampaign`: Filter by UTM campaign
- `startDate`: Filter by creation date range start
- `endDate`: Filter by creation date range end
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order (asc or desc, default: desc)

**Response**:
```json
{
  "referrals": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "referrerEmail": "existing@example.com",
      "referrer": {
        "id": "60d21b4667d0d8992e610c80",
        "email": "existing@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "referredEmail": "friend@example.com",
      "referredUser": null,
      "code": "REF123456",
      "status": "pending",
      "conversionDate": null,
      "rewards": {
        "referrerReward": "₹100 off next order",
        "referredReward": "₹100 off first order",
        "referrerRewardClaimed": false,
        "referredRewardClaimed": false
      },
      "utmSource": "email",
      "utmMedium": "referral",
      "utmCampaign": "summer2023",
      "utmContent": null,
      "utmTerm": null,
      "createdAt": "2023-06-03T10:15:30.000Z",
      "expiresAt": "2023-07-03T10:15:30.000Z",
      "updatedAt": "2023-06-03T10:15:30.000Z"
    },
    // More referrals
  ],
  "total": 35,
  "page": 1,
  "limit": 10,
  "statistics": {
    "totalReferrals": 35,
    "convertedReferrals": 15,
    "pendingReferrals": 18,
    "expiredReferrals": 2,
    "conversionRate": 42.8
  }
}
```

**Status Codes**:
- `200`: Referrals returned successfully
- `401`: Unauthorized
- `403`: Forbidden

## Additional Endpoints (Future Expansion)

### Get User Referrals

**Endpoint**: `GET /api/users/:id/referrals`

**Description**: Get referrals made by a specific user

**Access Control**: 
- Referenced user
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: User ID

**Response**:
```json
{
  "referrals": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "referredEmail": "friend@example.com",
      "status": "pending",
      "code": "REF123456",
      "createdAt": "2023-06-03T10:15:30.000Z",
      "expiresAt": "2023-07-03T10:15:30.000Z"
    },
    // More referrals
  ],
  "totalReferred": 5,
  "converted": 2,
  "pending": 3,
  "rewards": {
    "totalEarned": "₹200",
    "pending": "₹300"
  }
}
```

### Claim Referral Reward

**Endpoint**: `POST /api/referrals/:code/claim`

**Description**: Claim a reward from a successful referral

**Access Control**: 
- Authenticated users (either referrer or referred)

**Path Parameters**:
- `code`: Referral code

**Response**:
```json
{
  "success": true,
  "message": "Reward claimed successfully",
  "reward": "₹100 off next order",
  "rewardCode": "REWARD123456",
  "expiresAt": "2023-08-03T10:15:30.000Z"
}
```

## Usage Examples

### Submitting a Referral

```typescript
// Client-side example
async function submitReferral() {
  const referralData = {
    referrerEmail: "existing@example.com",
    referredEmail: "friend@example.com",
    utmSource: "email",
    utmMedium: "referral",
    utmCampaign: "summer2023"
  };

  try {
    const response = await fetch('/api/referrals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN' // Optional
      },
      body: JSON.stringify(referralData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Referral submitted:', result);
      showReferralSuccess(result.code);
    } else {
      console.error('Failed to submit referral:', await response.text());
      showReferralError();
    }
  } catch (error) {
    console.error('Error submitting referral:', error);
    showReferralError();
  }
}
```

### Retrieving Referral Analytics

```typescript
// Admin dashboard example
async function getReferralAnalytics(filters = {}) {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  try {
    const response = await fetch(
      `/api/referrals?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': 'Bearer ADMIN_JWT_TOKEN'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      renderReferralStats(data.statistics);
      renderReferralsList(data.referrals);
      setupPagination(data.total, data.page, data.limit);
    } else {
      console.error('Failed to retrieve referrals:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
  }
}
```

## Error Handling

- All endpoints implement proper error handling with descriptive error messages
- Self-referrals are prevented with appropriate validation
- Rate limiting is applied to public endpoints to prevent abuse
- Duplicate referrals for the same email address are handled appropriately

## Dependencies

- Mongoose for schema validation and database interactions
- NestJS Guards for role-based access control
- Class-validator for DTO validation
- JWT for authentication (when needed)
- Unique code generator for referral codes 