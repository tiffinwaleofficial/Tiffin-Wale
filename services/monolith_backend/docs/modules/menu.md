# Menu Module Documentation

## Overview
The Menu module manages food items and categories offered by business partners on the TiffinMate platform. It handles the creation, management, and display of menus and their associated details.

## Core Features
- **Menu Item Management**: Create, update, and manage food items
- **Category Management**: Organize menu items into categories
- **Menu Search**: Find menu items by various criteria
- **Partner-specific Menus**: Each business partner has their own menu
- **Availability Management**: Track which items are currently available

## Module Structure
```
menu/
├── menu.module.ts           # Module definition
├── menu.controller.ts       # API endpoints
├── menu.service.ts          # Business logic
├── schemas/                # Database schemas
│   ├── menu-item.schema.ts # Menu item schema
│   └── category.schema.ts  # Category schema
└── dto/                    # Data transfer objects
    ├── create-menu-item.dto.ts # Menu item creation validation
    ├── update-menu-item.dto.ts # Menu item update validation
    ├── create-category.dto.ts  # Category creation validation
    └── update-category.dto.ts  # Category update validation
```

## APIs

### Get All Menu Items
- **Endpoint**: `GET /api/menu`
- **Description**: Retrieves all menu items
- **Auth Required**: Yes (JWT)
- **Response**: Array of menu items
- **Status**: Implemented ✅

### Get Menu Item by ID
- **Endpoint**: `GET /api/menu/:id`
- **Description**: Retrieves details of a specific menu item
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the menu item
- **Response**: Menu item object
- **Status**: Implemented ✅

### Get Menu Items by Partner
- **Endpoint**: `GET /api/menu/partner/:partnerId`
- **Description**: Retrieves menu items for a specific business partner
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the business partner
- **Response**: Array of menu items
- **Status**: Implemented ✅

### Get All Categories
- **Endpoint**: `GET /api/menu/categories`
- **Description**: Retrieves all menu categories
- **Auth Required**: Yes (JWT)
- **Response**: Array of categories
- **Status**: Implemented ✅

### Get Category by ID
- **Endpoint**: `GET /api/menu/categories/:id`
- **Description**: Retrieves details of a specific category
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the category
- **Response**: Category object
- **Status**: Implemented ✅

### Create Menu Item
- **Endpoint**: `POST /api/menu`
- **Description**: Creates a new menu item
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Request Body**: Menu item details
- **Response**: Created menu item object
- **Status**: Implemented ✅

### Update Menu Item
- **Endpoint**: `PATCH /api/menu/:id`
- **Description**: Updates an existing menu item
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Parameters**: ID of the menu item
- **Request Body**: Fields to update
- **Response**: Updated menu item object
- **Status**: Implemented ✅

### Delete Menu Item
- **Endpoint**: `DELETE /api/menu/:id`
- **Description**: Deletes a menu item
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Parameters**: ID of the menu item
- **Response**: Success message
- **Status**: Implemented ✅

### Create Category
- **Endpoint**: `POST /api/menu/categories`
- **Description**: Creates a new menu category
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Request Body**: Category details
- **Response**: Created category object
- **Status**: Implemented ✅

### Update Category
- **Endpoint**: `PATCH /api/menu/categories/:id`
- **Description**: Updates an existing category
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Parameters**: ID of the category
- **Request Body**: Fields to update
- **Response**: Updated category object
- **Status**: Implemented ✅

### Delete Category
- **Endpoint**: `DELETE /api/menu/categories/:id`
- **Description**: Deletes a category
- **Auth Required**: Yes (JWT)
- **Roles Required**: BUSINESS, ADMIN, SUPER_ADMIN
- **Parameters**: ID of the category
- **Response**: Success message
- **Status**: Implemented ✅

## Data Models

### MenuItem Schema
```typescript
interface MenuItem {
  name: string;                   // Name of the food item
  description: string;            // Description
  price: number;                  // Price
  imageUrl: string;               // Image URL
  businessPartner: User | string; // Reference to partner
  category: string;               // Reference to category
  isAvailable: boolean;           // Availability status
  tags: string[];                 // Item tags (vegan, spicy, etc.)
  allergens: string[];            // Allergen information
  nutritionalInfo: {              // Nutritional details
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;                // Creation timestamp
  updatedAt: Date;                // Last update timestamp
}
```

### Category Schema
```typescript
interface Category {
  name: string;                   // Category name
  description: string;            // Description
  businessPartner: User | string; // Reference to partner (required)
  imageUrl: string;               // Category image
  isActive: boolean;              // Status
  createdAt: Date;                // Creation timestamp
  updatedAt: Date;                // Last update timestamp
}
```

## Dependencies
- Mongoose Module
- User Module (for business partner association)

## Usage Examples

### Finding Menu Items by Category
```typescript
// In a service
const menuItems = await this.menuItemModel.find({ category: categoryId }).exec();
```

### Getting Available Menu Items
```typescript
// In a service
const availableItems = await this.menuItemModel.find({ 
  businessPartner: partnerId,
  isAvailable: true 
}).exec();
```

## Future Enhancements
- Daily specials
- Meal combos and packages
- Seasonal items
- Featured items
- Pricing options (sizes, add-ons)
- Menu item ratings and popularity metrics
- Menu item recommendations
- Dietary preferences filtering
- Menu search and filtering 