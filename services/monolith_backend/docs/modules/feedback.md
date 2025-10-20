# Feedback Module

## Overview

The Feedback Module collects, manages, and analyzes user feedback, suggestions, and bug reports from various sources including the web application, mobile app, and after-order experiences. This module helps TiffinMate continuously improve its service quality, identify issues quickly, and prioritize feature development based on user input.

## Features

- **Feedback Collection**: Gather user feedback through various channels
- **Bug Reporting**: Allow users to report issues they encounter
- **Feedback Management**: Categorize, prioritize, and track feedback items
- **Admin Dashboard**: View and manage feedback in the admin panel
- **Analytics**: Generate insights from collected feedback

## Data Model

### Feedback Schema

```typescript
interface Feedback {
  id: string;                 // Unique identifier
  user: string;               // Reference to User schema (optional for anonymous feedback)
  type: string;               // Type of feedback (general, suggestion, bug, complaint)
  subject: string;            // Brief subject of the feedback
  message: string;            // Detailed feedback message
  category: string;           // Category (app, food, delivery, partner, etc.)
  priority: string;           // Priority level (low, medium, high, critical)
  status: string;             // Status (new, in-review, addressed, closed)
  rating: number;             // Optional rating (1-5)
  screenshots: string[];      // URLs to screenshots (for bug reports)
  deviceInfo: {               // Device information (for technical issues)
    platform: string;         // Web, iOS, Android
    browser: string;          // Browser name and version
    device: string;           // Device model
    os: string;               // Operating system
  };
  adminNotes: string;         // Internal notes for administrators
  isResolved: boolean;        // Whether the feedback has been resolved
  resolvedAt: Date;           // When the feedback was resolved
  createdAt: Date;            // Timestamp of submission
  updatedAt: Date;            // Timestamp of last update
}
```

## API Endpoints

### Submit Feedback

**Endpoint**: `POST /api/feedback`

**Description**: Submit customer feedback, suggestions, or bug reports

**Access Control**: 
- Public endpoint with optional authentication
- Authenticated users get their feedback linked to their account

**Request Body**:
```json
{
  "type": "suggestion",
  "subject": "Add Meal Plans Feature",
  "message": "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
  "category": "app",
  "rating": 4,
  "deviceInfo": {
    "platform": "web",
    "browser": "Chrome 91.0.4472.124",
    "device": "Desktop",
    "os": "Windows 10"
  }
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c90",
  "user": "60d21b4667d0d8992e610c80", // If authenticated
  "type": "suggestion",
  "subject": "Add Meal Plans Feature",
  "message": "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
  "category": "app",
  "priority": "medium", // Assigned by system
  "status": "new",
  "rating": 4,
  "screenshots": [],
  "deviceInfo": {
    "platform": "web",
    "browser": "Chrome 91.0.4472.124",
    "device": "Desktop",
    "os": "Windows 10"
  },
  "isResolved": false,
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `201`: Feedback submitted successfully
- `400`: Invalid data format or missing required fields
- `429`: Too many requests (rate limiting)

### View Feedback

**Endpoint**: `GET /api/admin/feedback`

**Description**: Retrieve and manage submitted feedback in the admin panel

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `type`: Filter by feedback type (general, suggestion, bug, complaint)
- `category`: Filter by category (app, food, delivery, partner)
- `priority`: Filter by priority (low, medium, high, critical)
- `status`: Filter by status (new, in-review, addressed, closed)
- `isResolved`: Filter by resolution status (true or false)
- `search`: Search term for subject or message
- `startDate`: Filter by creation date range start
- `endDate`: Filter by creation date range end
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order (asc or desc, default: desc)

**Response**:
```json
{
  "feedback": [
    {
      "id": "60d21b4667d0d8992e610c90",
      "user": {
        "id": "60d21b4667d0d8992e610c80",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "type": "suggestion",
      "subject": "Add Meal Plans Feature",
      "message": "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
      "category": "app",
      "priority": "medium",
      "status": "new",
      "rating": 4,
      "screenshots": [],
      "deviceInfo": {
        "platform": "web",
        "browser": "Chrome 91.0.4472.124",
        "device": "Desktop",
        "os": "Windows 10"
      },
      "adminNotes": "",
      "isResolved": false,
      "createdAt": "2023-06-03T10:15:30.000Z",
      "updatedAt": "2023-06-03T10:15:30.000Z"
    },
    // More feedback items
  ],
  "total": 28,
  "page": 1,
  "limit": 10,
  "statistics": {
    "byType": {
      "general": 8,
      "suggestion": 12,
      "bug": 5,
      "complaint": 3
    },
    "byCategory": {
      "app": 15,
      "food": 7,
      "delivery": 4,
      "partner": 2
    },
    "byPriority": {
      "low": 10,
      "medium": 12,
      "high": 5,
      "critical": 1
    },
    "resolved": 10,
    "unresolved": 18
  }
}
```

**Status Codes**:
- `200`: Feedback list returned successfully
- `401`: Unauthorized
- `403`: Forbidden

## Additional Endpoints (Future Expansion)

### Update Feedback Status

**Endpoint**: `PATCH /api/admin/feedback/:id`

**Description**: Update the status, priority, or admin notes for a feedback item

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: Feedback ID

**Request Body**:
```json
{
  "status": "in-review",
  "priority": "high",
  "adminNotes": "This is a common request, we should consider implementing it in the next sprint."
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c90",
  "status": "in-review",
  "priority": "high",
  "adminNotes": "This is a common request, we should consider implementing it in the next sprint.",
  "updatedAt": "2023-06-03T11:20:45.000Z"
}
```

### Get User Feedback

**Endpoint**: `GET /api/users/:id/feedback`

**Description**: Retrieve feedback submitted by a specific user

**Access Control**: 
- Referenced user
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: User ID

**Response**:
```json
{
  "feedback": [
    {
      "id": "60d21b4667d0d8992e610c90",
      "type": "suggestion",
      "subject": "Add Meal Plans Feature",
      "category": "app",
      "status": "in-review",
      "createdAt": "2023-06-03T10:15:30.000Z"
    },
    // More feedback items
  ],
  "total": 3
}
```

## Usage Examples

### Submitting Feedback

```typescript
// Client-side example
async function submitFeedback() {
  const feedbackData = {
    type: "suggestion",
    subject: "Add Meal Plans Feature",
    message: "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
    category: "app",
    rating: 4,
    deviceInfo: {
      platform: "web",
      browser: "Chrome 91.0.4472.124",
      device: "Desktop",
      os: "Windows 10"
    }
  };

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN' // Optional
      },
      body: JSON.stringify(feedbackData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Feedback submitted:', result);
      showFeedbackSuccess();
    } else {
      console.error('Failed to submit feedback:', await response.text());
      showFeedbackError();
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    showFeedbackError();
  }
}
```

### Retrieving and Filtering Feedback in Admin Panel

```typescript
// Admin dashboard example
async function getFeedback(filters = {}) {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  try {
    const response = await fetch(
      `/api/admin/feedback?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': 'Bearer ADMIN_JWT_TOKEN'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      renderFeedbackStats(data.statistics);
      renderFeedbackList(data.feedback);
      setupPagination(data.total, data.page, data.limit);
    } else {
      console.error('Failed to retrieve feedback:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
  }
}

// Setting up filter controls
document.getElementById('typeFilter').addEventListener('change', (e) => {
  updateFeedbackFilters({ type: e.target.value });
});

document.getElementById('statusFilter').addEventListener('change', (e) => {
  updateFeedbackFilters({ status: e.target.value });
});

document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value;
  updateFeedbackFilters({ search: searchTerm });
});

function updateFeedbackFilters(newFilters) {
  currentFilters = { ...currentFilters, ...newFilters };
  getFeedback(currentFilters);
}
```

## Implementation Notes

### Priority Assignment

The system automatically assigns initial priority based on the following rules:

- **Critical**: Bug reports affecting payment or order functionality
- **High**: Bug reports affecting core user experience, complaints about food quality or delivery
- **Medium**: Feature suggestions, general improvements
- **Low**: General feedback, minor UI improvements

Administrators can override the automatically assigned priority.

### Feedback Categories

The system supports the following feedback categories:

- **App**: Related to the web or mobile application functionality
- **Food**: Related to food quality, options, or menu
- **Delivery**: Related to delivery experience or timing
- **Partner**: Related to restaurant or delivery partners
- **Pricing**: Related to pricing, discounts, or promotions
- **Account**: Related to user account management
- **Other**: Miscellaneous feedback

## Error Handling

- All endpoints implement proper error handling with descriptive error messages
- Rate limiting is applied to public endpoints to prevent abuse
- Input validation ensures that required fields are present and correctly formatted
- Screenshots are validated for file size and type before acceptance

## Dependencies

- Mongoose for schema validation and database interactions
- NestJS Guards for role-based access control
- Class-validator for DTO validation
- JWT for authentication (when provided)
- File storage service for screenshot uploads (future feature) 