# 🌱 Tiffin Wale Database Seeder

A comprehensive database seeding module for the Tiffin Wale application that populates all collections with realistic dummy data for development and testing purposes.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Data Generated](#data-generated)
- [Default Credentials](#default-credentials)
- [API Endpoint](#api-endpoint)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Seeder Module is designed to populate your MongoDB database with comprehensive, realistic dummy data that covers all aspects of the Tiffin Wale application. This enables:

- **Full-stack testing** with realistic data relationships
- **Frontend development** with meaningful content
- **Demo presentations** with convincing data
- **Performance testing** with substantial datasets
- **User journey testing** across all application features

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have:
- MongoDB running and accessible
- Valid `MONGODB_URI` in your `.env` file
- NestJS application running

### 2. Start the Application

```bash
cd monolith_backend
npm run start:dev
```

### 3. Run the Seeder

**Option A: Using cURL**
```bash
curl -X POST http://localhost:3000/seeder/seedDummyData
```

**Option B: Using REST Client (Postman, Insomnia, etc.)**
```
POST http://localhost:3000/seeder/seedDummyData
```

### 4. Verify Results

Check your MongoDB database - all collections should now contain realistic dummy data with proper relationships.

## 📊 Data Generated

### Core Data Summary

| Collection | Count | Description |
|------------|--------|-------------|
| **Users** | 67 | Admin, business partners, and customers |
| **Partners** | 15 | Restaurant/food service providers |
| **Categories** | 45-60 | Food categories per partner |
| **Menu Items** | 225-480 | Individual food items with pricing |
| **Customer Profiles** | 50 | Complete customer information |
| **Subscription Plans** | 4 | Different meal plan options |
| **Subscriptions** | ~30 | Active customer subscriptions |
| **Orders** | ~120 | Food orders with various statuses |
| **Meals** | ~210 | Scheduled meals for subscriptions |
| **Payments** | ~150 | Payment records and methods |
| **Feedback** | 30 | Customer feedback and support tickets |
| **Testimonials** | 20 | Customer reviews and ratings |
| **Referrals** | 25 | Referral codes and conversions |
| **Corporate Quotes** | 15 | B2B inquiry requests |
| **Contacts** | 25 | Contact form submissions |
| **Subscribers** | 100 | Newsletter subscriptions |

### Detailed Data Breakdown

#### 👥 **Users (67 total)**
- **1 Admin**: `admin@tiffin-wale.com`
- **1 Super Admin**: `superadmin@tiffin-wale.com`
- **15 Business Users**: Restaurant partners with complete profiles
- **50 Customer Users**: Individual customers with varied demographics

#### 🏪 **Partners (15 total)**
- Complete restaurant profiles with business details
- Realistic addresses across Indian cities
- Various cuisine types (North Indian, South Indian, Chinese, etc.)
- Business hours and operational status
- Ratings and review counts
- Featured partner flags

#### 🍽️ **Menu System**
- **Categories**: 3-4 per partner (Breakfast, Lunch, Dinner, Snacks, etc.)
- **Menu Items**: 5-8 per category with:
  - Realistic pricing (₹80-₹400)
  - Detailed descriptions
  - Nutritional information
  - Allergen warnings
  - Availability status

#### 👤 **Customer Profiles (50 total)**
- Personal information (college, branch, graduation year)
- Dietary preferences (Vegetarian, Vegan, etc.)
- Favorite cuisines
- Multiple delivery addresses (Home, College)
- Preferred payment methods

#### 📝 **Subscription System**
- **4 Subscription Plans**:
  - Basic Daily Plan (₹2,200/month)
  - Premium Daily Plan (₹4,000/month)
  - Weekday Special (₹2,700/month)
  - Weekend Feast (₹1,200/month)
- **~30 Active Subscriptions** with realistic status distribution

#### 🛒 **Orders (~120 total)**
- Multiple items per order with realistic quantities
- Various order statuses (pending, confirmed, delivered, etc.)
- Complete payment information
- Delivery addresses and special instructions
- Customer ratings and reviews

#### 🍽️ **Meals (~210 total)**
- Scheduled meals for active subscriptions
- 7 days of upcoming meal plans
- Different meal types (breakfast, lunch, dinner)
- Associated menu items and business partners
- Delivery tracking and status updates

#### 💳 **Payment System**
- Payment records for all paid orders and subscriptions
- Multiple payment methods (Card, UPI, Wallet, Net Banking)
- Saved payment methods for customers
- Transaction IDs and payment status tracking

#### 💬 **Support & Feedback**
- Customer feedback across different categories
- Support tickets with various priority levels
- Device information for technical issues
- Resolution status and admin notes

#### ⭐ **Marketing Data**
- Customer testimonials with high ratings
- Referral system with conversion tracking
- Corporate inquiry requests
- Contact form submissions
- Newsletter subscribers with preferences

## 🔑 Default Credentials

### Admin Access
- **Email**: `admin@tiffin-wale.com`
- **Password**: `password`
- **Role**: Admin

### Super Admin Access
- **Email**: `superadmin@tiffin-wale.com`
- **Password**: `password`
- **Role**: Super Admin

### All Other Users
- **Password**: `password`
- **Emails**: Generated by Faker.js (random but valid)

## 🔌 API Endpoint

### Seed Database
```http
POST /seeder/seedDummyData
```

**Response:**
```json
{
  "message": "Comprehensive dummy data seeding completed successfully!",
  "summary": {
    "users": 67,
    "partners": 15,
    "categories": 52,
    "menuItems": 312,
    "customerProfiles": 50,
    "subscriptionPlans": 4,
    "subscriptions": 28,
    "orders": 118
  }
}
```

## 🏗️ Architecture

### Module Structure
```
src/modules/seeder/
├── docs/                     # Documentation files
│   ├── README.md            # This file
│   ├── data-relationships.md # Data relationship documentation
│   └── seeding-strategy.md   # Seeding strategy and methodology
├── seeder.controller.ts      # HTTP endpoint controller
├── seeder.module.ts         # NestJS module configuration
└── seeder.service.ts        # Core seeding logic
```

### Seeding Order (Dependency-based)
1. **Users** - Base user accounts
2. **Partners** - Business profiles linked to business users
3. **Customer Profiles** - Customer details linked to customer users
4. **Categories & Menu Items** - Food categories and items per partner
5. **Subscription Plans** - Available meal plans
6. **Subscriptions** - Customer subscriptions to plans
7. **Orders** - Food orders from customers to partners
8. **Meals** - Scheduled meals for active subscriptions
9. **Payments & Payment Methods** - Financial transactions
10. **Feedback** - Customer feedback and support
11. **Marketing Data** - Testimonials, referrals, corporate quotes
12. **Landing Data** - Contact forms and newsletter subscriptions

## 📦 Dependencies

### Required Packages
- `@faker-js/faker` - Realistic dummy data generation
- `bcrypt` - Password hashing
- `@nestjs/mongoose` - MongoDB integration
- `mongoose` - MongoDB object modeling

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/tiffin-wale
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Empty Collections
**Symptoms**: Database collections remain empty after seeding
**Causes**: 
- Database connection issues
- Missing environment variables
- MongoDB not running

**Solutions**:
- Check MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `.env` file
- Check application logs for connection errors

#### 2. TypeScript Errors
**Symptoms**: Compilation errors in seeder files
**Causes**: 
- Missing type definitions
- Incorrect import paths

**Solutions**:
- Run `npm run format` to fix formatting
- Check import paths in seeder files
- Ensure all dependencies are installed

#### 3. Seeding Partially Fails
**Symptoms**: Some collections populated, others empty
**Causes**: 
- Data relationship errors
- Memory constraints
- Database constraints

**Solutions**:
- Check console logs for specific error messages
- Verify MongoDB has sufficient storage
- Run seeder multiple times if needed

#### 4. Performance Issues
**Symptoms**: Seeding takes very long or times out
**Causes**: 
- Large dataset size
- Slow database connection
- Memory constraints

**Solutions**:
- Reduce dataset sizes in seeder configuration
- Optimize database connection
- Increase Node.js memory limit: `node --max-old-space-size=4096`

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify your MongoDB connection
3. Ensure all environment variables are set
4. Review the [Data Relationships](./data-relationships.md) documentation
5. Check the [Seeding Strategy](./seeding-strategy.md) for implementation details

## 📝 License

This seeder module is part of the Tiffin Wale application and follows the same licensing terms.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Tiffin Wale Development Team 