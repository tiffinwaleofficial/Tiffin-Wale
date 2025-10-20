# Landing Page Module

## Overview

The Landing Page Module manages user interactions from the TiffinMate marketing website and landing pages. It handles contact form submissions, newsletter subscriptions, and provides administration panels for managing these interactions. This module is crucial for customer acquisition, marketing communication, and maintaining potential customer leads.

## Features

- **Contact Form Management**: Process and store user inquiries and contact requests
- **Newsletter Subscription**: Allow visitors to subscribe to marketing communications
- **Admin Panels**: Provide interfaces for administrators to view and manage contacts and subscriptions
- **Data Export**: Export contact and subscriber data for marketing campaigns

## Implementation Status

All core endpoints for the Landing Page Module have been successfully implemented and tested:

- ✅ Contact form submission API
- ✅ Newsletter subscription API with reactivation support
- ✅ Admin contact management API with pagination and search
- ✅ Admin subscriber management API with pagination and search

## Data Model

### Contact Schema

```typescript
interface Contact {
  id: string;                 // Unique identifier
  name: string;               // Full name of the contact
  email: string;              // Email address
  phoneNumber: string;        // Phone number (optional)
  message: string;            // Contact message/inquiry
  subject: string;            // Subject of the inquiry (optional)
  source: string;             // Where the contact came from (website, mobile app, etc.)
  status: string;             // Status of the contact (new, contacted, resolved)
  isResolved: boolean;        // Whether the inquiry has been resolved
  createdAt: Date;            // Timestamp of contact submission
  updatedAt: Date;            // Timestamp of last update
}
```

### Subscriber Schema

```typescript
interface Subscriber {
  id: string;                 // Unique identifier
  email: string;              // Email address
  name: string;               // Full name (optional)
  preferences: string[];      // Content preferences (optional)
  isActive: boolean;          // Whether the subscription is active
  unsubscribeToken: string;   // Token for unsubscribing (auto-generated)
  source: string;             // Source of the subscription (landing page, app, etc.)
  createdAt: Date;            // Timestamp of subscription
  updatedAt: Date;            // Timestamp of last update
}
```

## API Endpoints

### Submit Contact Form

**Endpoint**: `POST /api/contact`

**Status**: ✅ Implemented and tested

**Description**: Process a contact form submission from the landing page

**Access Control**: 
- Public endpoint (no authentication required)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+919876543210",
  "subject": "Partnership Inquiry",
  "message": "I'm interested in becoming a delivery partner for TiffinMate.",
  "source": "website"
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c87",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+919876543210",
  "subject": "Partnership Inquiry",
  "message": "I'm interested in becoming a delivery partner for TiffinMate.",
  "source": "website",
  "status": "new",
  "isResolved": false,
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `201`: Contact form submitted successfully
- `400`: Invalid data format or missing required fields
- `429`: Too many requests (rate limiting)

**Implementation Notes**:
- Validation for required fields (name, email, message)
- Email format validation
- Optional fields (phoneNumber, subject, source) with defaults

### Subscribe to Newsletter

**Endpoint**: `POST /api/subscribe`

**Status**: ✅ Implemented and tested

**Description**: Subscribe to the TiffinMate newsletter

**Access Control**: 
- Public endpoint (no authentication required)

**Request Body**:
```json
{
  "email": "subscriber@example.com",
  "name": "Jane Smith",
  "preferences": ["promotions", "new-partners"],
  "source": "landing-page"
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "email": "subscriber@example.com",
  "name": "Jane Smith",
  "preferences": ["promotions", "new-partners"],
  "isActive": true,
  "source": "landing-page",
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `201`: Subscription created successfully
- `400`: Invalid data format or missing required fields
- `409`: Email already subscribed
- `429`: Too many requests (rate limiting)

**Implementation Notes**:
- Automatic reactivation of inactive subscriptions
- Unique email validation to prevent duplicates
- Random generation of unsubscribe tokens
- Support for preference tracking

### Get Contact Submissions

**Endpoint**: `GET /api/admin/contacts`

**Status**: ✅ Implemented and tested

**Description**: Retrieve contact form submissions for the admin panel

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `status`: Filter by status (new, contacted, resolved)
- `search`: Search term for name or email
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order (asc or desc, default: desc)

**Response**:
```json
{
  "contacts": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+919876543210",
      "subject": "Partnership Inquiry",
      "message": "I'm interested in becoming a delivery partner for TiffinMate.",
      "source": "website",
      "status": "new",
      "isResolved": false,
      "createdAt": "2023-06-03T10:15:30.000Z",
      "updatedAt": "2023-06-03T10:15:30.000Z"
    },
    // More contacts
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

**Status Codes**:
- `200`: Contacts list returned successfully
- `401`: Unauthorized
- `403`: Forbidden

**Implementation Notes**:
- Role-based access control using JWT auth guard and roles guard
- Pagination system with customizable limit
- Flexible filtering and search functionality
- Data transformation for consistent response format

### Get Newsletter Subscribers

**Endpoint**: `GET /api/admin/subscribers`

**Status**: ✅ Implemented and tested

**Description**: Retrieve newsletter subscribers for the admin panel

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `isActive`: Filter by active status (true or false)
- `search`: Search term for name or email
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order (asc or desc, default: desc)

**Response**:
```json
{
  "subscribers": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "email": "subscriber@example.com",
      "name": "Jane Smith",
      "preferences": ["promotions", "new-partners"],
      "isActive": true,
      "source": "landing-page",
      "unsubscribeToken": "9062e06b0aab3a0523a47d9b41dda64f910e2cb3cec4a200d97f858328a7b256",
      "createdAt": "2023-06-03T10:15:30.000Z",
      "updatedAt": "2023-06-03T10:15:30.000Z"
    },
    // More subscribers
  ],
  "total": 120,
  "page": 1,
  "limit": 10
}
```

**Status Codes**:
- `200`: Subscribers list returned successfully
- `401`: Unauthorized
- `403`: Forbidden

**Implementation Notes**:
- Role-based access control using JWT auth guard and roles guard
- Pagination system with customizable limit
- Option to filter by active/inactive status
- Full text search capability on email and name fields
- Configurable sorting by any field
- Explicitly defined collection name to match MongoDB setup

## Additional Endpoints (Future Expansion)

### Update Contact Status

**Endpoint**: `PATCH /api/admin/contacts/:id`

**Description**: Update the status of a contact submission

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: Contact ID

**Request Body**:
```json
{
  "status": "contacted",
  "isResolved": true
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c87",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+919876543210",
  "subject": "Partnership Inquiry",
  "message": "I'm interested in becoming a delivery partner for TiffinMate.",
  "source": "website",
  "status": "contacted",
  "isResolved": true,
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T11:20:45.000Z"
}
```

### Unsubscribe from Newsletter

**Endpoint**: `GET /api/unsubscribe/:token`

**Description**: Unsubscribe from the newsletter using a unique token

**Access Control**: 
- Public endpoint (no authentication required)

**Path Parameters**:
- `token`: Unsubscribe token

**Response**:
```json
{
  "success": true,
  "message": "You have been successfully unsubscribed."
}
```

## Usage Examples

### Submitting Contact Form

```typescript
// Client-side example
async function submitContactForm() {
  const contactData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+919876543210",
    subject: "Partnership Inquiry",
    message: "I'm interested in becoming a delivery partner for TiffinMate.",
    source: "website"
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Contact submitted:', result);
      showSuccessMessage();
    } else {
      console.error('Failed to submit contact form:', await response.text());
      showErrorMessage();
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    showErrorMessage();
  }
}
```

### Retrieving Contacts in Admin Panel

```typescript
// Client-side admin panel example
async function getContacts(page = 1, limit = 10, status = 'new') {
  try {
    const response = await fetch(
      `/api/admin/contacts?page=${page}&limit=${limit}&status=${status}`, 
      {
        headers: {
          'Authorization': 'Bearer ADMIN_JWT_TOKEN'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      renderContactsList(data.contacts);
      setupPagination(data.total, data.page, data.limit);
    } else {
      console.error('Failed to retrieve contacts:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
}
```

## Error Handling

- All endpoints implement proper error handling with descriptive error messages
- Rate limiting is applied to public endpoints to prevent abuse
- Input validation is performed to ensure data integrity

## Dependencies

- Mongoose for schema validation and database interactions
- NestJS Guards for role-based access control
- Class-validator for DTO validation
- Nodemailer for sending confirmation emails (future feature)
- Rate-limiting middleware for protecting public endpoints 