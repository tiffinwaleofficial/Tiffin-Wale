# Customer Profile Module

## Overview

The Customer Profile Module extends the basic user data to include detailed customer information such as educational background, location, preferences, and other profile enrichment data. This information helps in personalizing the food delivery experience and supports targeted meal offerings.

## Features

- **Enhanced Customer Profiles**: Collect and maintain additional information about customers beyond basic authentication data
- **Location-Based Queries**: Filter and retrieve customers by city for targeted marketing or service offerings
- **Statistical Analysis**: Generate aggregated statistics on customer demographics and preferences
- **Profile Management**: Allow customers to view and update their own profile information

## Data Model

### CustomerProfile Schema

```typescript
interface CustomerProfile {
  id: string;                 // Unique identifier
  user: string;               // Reference to User schema
  city: string;               // Customer's city
  college: string;            // Customer's college/university name (optional)
  branch: string;             // Field of study/department (optional)
  graduationYear: number;     // Expected/actual graduation year (optional)
  dietaryPreferences: string[]; // Array of dietary preferences (veg, non-veg, vegan, etc.)
  favoriteCuisines: string[]; // Array of favorite cuisine types
  preferredPaymentMethods: string[]; // Array of preferred payment methods
  deliveryAddresses: Address[]; // Array of saved delivery addresses
  createdAt: Date;            // Timestamp of profile creation
  updatedAt: Date;            // Timestamp of last update
}

interface Address {
  id: string;                 // Unique identifier
  name: string;               // Label for the address (e.g., "Home", "Work")
  street: string;             // Street address
  city: string;               // City
  state: string;              // State/province
  postalCode: string;         // Postal/ZIP code
  country: string;            // Country
  isDefault: boolean;         // Whether this is the default delivery address
}
```

## API Endpoints

### Create Customer Profile

**Endpoint**: `POST /api/customers/profile`

**Description**: Submit additional customer details to create or update a customer profile

**Access Control**: 
- Authenticated users with `CUSTOMER` role

**Request Body**:
```json
{
  "city": "Mumbai",
  "college": "IIT Mumbai",
  "branch": "Computer Science",
  "graduationYear": 2024,
  "dietaryPreferences": ["Vegetarian"],
  "favoriteCuisines": ["Indian", "Italian"],
  "preferredPaymentMethods": ["Credit Card", "UPI"],
  "deliveryAddresses": [
    {
      "name": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "user": "60d21b4667d0d8992e610c80",
  "city": "Mumbai",
  "college": "IIT Mumbai",
  "branch": "Computer Science",
  "graduationYear": 2024,
  "dietaryPreferences": ["Vegetarian"],
  "favoriteCuisines": ["Indian", "Italian"],
  "preferredPaymentMethods": ["Credit Card", "UPI"],
  "deliveryAddresses": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ],
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `201`: Profile created successfully
- `400`: Invalid data format
- `401`: Unauthorized
- `403`: Forbidden (not a customer)
- `404`: User not found

### Get Customer Profile

**Endpoint**: `GET /api/customers/:id/profile`

**Description**: Retrieve a customer's profile data

**Access Control**: 
- Profile owner
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: Customer user ID

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "user": "60d21b4667d0d8992e610c80",
  "city": "Mumbai",
  "college": "IIT Mumbai",
  "branch": "Computer Science",
  "graduationYear": 2024,
  "dietaryPreferences": ["Vegetarian"],
  "favoriteCuisines": ["Indian", "Italian"],
  "preferredPaymentMethods": ["Credit Card", "UPI"],
  "deliveryAddresses": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ],
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T10:15:30.000Z"
}
```

**Status Codes**:
- `200`: Profile details returned successfully
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Profile not found

### Update Customer Profile

**Endpoint**: `PATCH /api/customers/:id/profile`

**Description**: Update an existing customer profile

**Access Control**: 
- Profile owner
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `id`: Customer user ID

**Request Body** (partial update supported):
```json
{
  "city": "Delhi",
  "graduationYear": 2025,
  "dietaryPreferences": ["Vegetarian", "Gluten-free"]
}
```

**Response**:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "user": "60d21b4667d0d8992e610c80",
  "city": "Delhi",
  "college": "IIT Mumbai",
  "branch": "Computer Science",
  "graduationYear": 2025,
  "dietaryPreferences": ["Vegetarian", "Gluten-free"],
  "favoriteCuisines": ["Indian", "Italian"],
  "preferredPaymentMethods": ["Credit Card", "UPI"],
  "deliveryAddresses": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Home",
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ],
  "createdAt": "2023-06-03T10:15:30.000Z",
  "updatedAt": "2023-06-03T11:20:45.000Z"
}
```

**Status Codes**:
- `200`: Profile updated successfully
- `400`: Invalid data format
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Profile not found

### Get Customers by City

**Endpoint**: `GET /api/customers/city/:city`

**Description**: Retrieve all customers from a specific city

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Path Parameters**:
- `city`: Name of the city to filter by

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)

**Response**:
```json
{
  "customers": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "user": {
        "id": "60d21b4667d0d8992e610c80",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "+919876543210"
      },
      "city": "Mumbai",
      "college": "IIT Mumbai",
      "branch": "Computer Science",
      "graduationYear": 2024
    },
    // More customer profiles
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

**Status Codes**:
- `200`: Customers list returned successfully
- `401`: Unauthorized
- `403`: Forbidden
- `404`: No customers found

### Get Customer Statistics

**Endpoint**: `GET /api/customers/stats`

**Description**: Retrieve aggregated statistics about customers

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Response**:
```json
{
  "totalCustomers": 1500,
  "activeCustomers": 1200,
  "customersByCity": {
    "Mumbai": 450,
    "Delhi": 350,
    "Bangalore": 300,
    "Chennai": 200,
    "Other": 200
  },
  "customersByCollege": {
    "IIT Mumbai": 150,
    "Delhi University": 120,
    "Other": 1230
  },
  "customersByGraduationYear": {
    "2022": 250,
    "2023": 300,
    "2024": 350,
    "2025": 400,
    "Other": 200
  },
  "dietaryPreferences": {
    "Vegetarian": 700,
    "Non-vegetarian": 500,
    "Vegan": 200,
    "Gluten-free": 100
  },
  "favoriteCuisines": {
    "Indian": 800,
    "Chinese": 450,
    "Italian": 350,
    "Continental": 250,
    "Other": 150
  }
}
```

**Status Codes**:
- `200`: Statistics returned successfully
- `401`: Unauthorized
- `403`: Forbidden

## Usage Examples

### Creating a New Customer Profile

```typescript
// Client-side example
async function createCustomerProfile() {
  const profileData = {
    city: "Mumbai",
    college: "IIT Mumbai",
    branch: "Computer Science",
    graduationYear: 2024,
    dietaryPreferences: ["Vegetarian"],
    favoriteCuisines: ["Indian", "Italian"],
    preferredPaymentMethods: ["Credit Card"]
  };

  try {
    const response = await fetch('/api/customers/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify(profileData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Profile created:', result);
    } else {
      console.error('Failed to create profile:', await response.text());
    }
  } catch (error) {
    console.error('Error creating profile:', error);
  }
}
```

### Retrieving Customer Stats for Admin Dashboard

```typescript
// Client-side example
async function getCustomerStats() {
  try {
    const response = await fetch('/api/customers/stats', {
      headers: {
        'Authorization': 'Bearer ADMIN_JWT_TOKEN'
      }
    });
    
    if (response.ok) {
      const stats = await response.json();
      // Process and display stats in the admin dashboard
      renderCustomerStatistics(stats);
    } else {
      console.error('Failed to retrieve customer stats:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}
```

## Error Handling

- All endpoints implement proper error handling with descriptive error messages
- Validation errors return detailed information about the specific field that failed validation
- Authentication and authorization errors are handled appropriately with relevant HTTP status codes

## Dependencies

- Mongoose for schema validation and database interactions
- NestJS Guards for role-based access control
- Class-validator for DTO validation
- JWT for authentication 