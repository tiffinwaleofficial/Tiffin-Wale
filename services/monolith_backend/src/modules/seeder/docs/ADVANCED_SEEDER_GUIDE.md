# 🌱 Advanced Phase-Based Seeder System - User Guide

## Overview

The TiffinMate Advanced Seeder System is a powerful, modular database seeding solution that provides comprehensive test data for all backend APIs. It features phase-based execution, configurable data volumes, realistic images, and extensive customization options.

## 🚀 Quick Start

### Basic Usage

```bash
# Seed all data with standard profile
curl -X POST http://localhost:3001/seeder/seed

# Seed specific phase only
curl -X POST http://localhost:3001/seeder/phase/partner

# Use minimal profile for quick testing
curl -X POST http://localhost:3001/seeder/profile/minimal
```

### Configuration

```bash
# Check current configuration
curl http://localhost:3001/seeder/config

# Update configuration
curl -X POST http://localhost:3001/seeder/config \
  -H "Content-Type: application/json" \
  -d '{"profile": "extensive", "incremental": true}'
```

## 📋 Available Phases

### 1. Core Phase (`core`)
- **Purpose**: Users, authentication, basic setup
- **Dependencies**: None
- **Collections**: `users`
- **Data**: Admin users, business users, customer users with profiles

### 2. Partner Phase (`partner`)
- **Purpose**: Restaurants, menus, categories with realistic images
- **Dependencies**: `core`
- **Collections**: `partners`, `categories`, `menuitems`
- **Features**: 
  - Realistic restaurant profiles with images
  - Geographic distribution across Indian cities
  - Comprehensive menu systems with food images
  - Business hours and operational details

### 3. Communication Phase (`communication`)
- **Purpose**: Chat conversations, messages, notifications
- **Dependencies**: `core`, `partner`
- **Collections**: `conversations`, `chatmessages`, `typingindicators`
- **Features**:
  - Support conversations between customers and admins
  - Restaurant conversations between customers and partners
  - Group order conversations
  - Realistic message flows with media attachments

### 4. Customer Phase (`customer`) - *Coming Soon*
- **Purpose**: Customer profiles, addresses, preferences
- **Dependencies**: `core`
- **Collections**: `customerprofiles`, `deliveryaddresses`

### 5. Transaction Phase (`transaction`) - *Coming Soon*
- **Purpose**: Orders, payments, subscriptions
- **Dependencies**: `core`, `partner`, `customer`
- **Collections**: `orders`, `payments`, `subscriptions`, `meals`

### 6. Marketing Phase (`marketing`) - *Coming Soon*
- **Purpose**: Testimonials, referrals, analytics data
- **Dependencies**: `core`, `customer`
- **Collections**: `testimonials`, `referrals`, `corporatequotes`

### 7. Support Phase (`support`) - *Coming Soon*
- **Purpose**: Feedback, tickets, corporate quotes
- **Dependencies**: `core`, `customer`
- **Collections**: `feedback`, `contacts`, `subscribers`

## 🎯 Data Profiles

### Minimal Profile
- **Use Case**: Quick testing, development
- **Records**: ~100 total records
- **Time**: ~30 seconds
- **Configuration**:
  ```json
  {
    "users": { "admin": 1, "business": 5, "customer": 20 },
    "partners": 5,
    "conversations": 10,
    "messagesPerConversation": { "min": 5, "max": 15 }
  }
  ```

### Standard Profile (Default)
- **Use Case**: Realistic testing, demos
- **Records**: ~500 total records
- **Time**: ~2 minutes
- **Configuration**:
  ```json
  {
    "users": { "admin": 2, "business": 15, "customer": 50 },
    "partners": 15,
    "conversations": 25,
    "messagesPerConversation": { "min": 10, "max": 30 }
  }
  ```

### Extensive Profile
- **Use Case**: Performance testing, load testing
- **Records**: ~1500 total records
- **Time**: ~5 minutes
- **Configuration**:
  ```json
  {
    "users": { "admin": 3, "business": 30, "customer": 100 },
    "partners": 30,
    "conversations": 50,
    "messagesPerConversation": { "min": 20, "max": 50 }
  }
  ```

## 🛠️ API Endpoints

### Seeding Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/seeder/seed` | Seed all data with optional configuration |
| `POST` | `/seeder/phase/:phaseName` | Seed specific phase |
| `POST` | `/seeder/profile/:profileName` | Seed using predefined profile |
| `POST` | `/seeder/seedDummyData` | Legacy endpoint (backward compatibility) |

### Management Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/seeder/status` | Get current seeding status |
| `GET` | `/seeder/config` | Get current configuration |
| `POST` | `/seeder/config` | Update configuration |
| `GET` | `/seeder/validate` | Validate data integrity |
| `GET` | `/seeder/stats` | Get collection statistics |

### Cleanup Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `DELETE` | `/seeder/phase/:phaseName` | Clean specific phase data |
| `DELETE` | `/seeder/all` | Clean all seeded data |

### Utility Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/seeder/phases` | List available phases |
| `GET` | `/seeder/profiles` | List available profiles |

## 🖼️ Image Strategy

The seeder supports multiple image providers for realistic visual content:

### Unsplash (Default)
- **Provider**: `unsplash`
- **Features**: High-quality, contextual images
- **Food Images**: Category-specific food photography
- **Restaurant Images**: Professional restaurant interiors
- **Profile Images**: Professional headshots

### Configuration Example
```json
{
  "imageStrategy": {
    "provider": "unsplash",
    "categories": {
      "food": ["indian-food", "chinese-food", "italian-food"],
      "restaurant": ["restaurant-interior", "kitchen"],
      "profile": ["professional-headshot"]
    }
  }
}
```

## 🌍 Geographic Configuration

### Indian Cities Support
- Mumbai, Delhi, Bangalore, Chennai, Hyderabad
- Pune, Kolkata, Ahmedabad, Jaipur, Lucknow

### Features
- City-specific restaurant distribution
- Realistic addresses with proper state mapping
- Delivery radius calculations
- Regional cuisine preferences

## ⚙️ Advanced Configuration

### Environment Variables

```bash
# Seeding profile
SEEDER_PROFILE=standard

# Incremental seeding (don't clean existing data)
SEEDER_INCREMENTAL=true

# Skip cleanup phase
SEEDER_SKIP_CLEANUP=true

# Image provider
SEEDER_IMAGE_PROVIDER=unsplash
```

### Custom Configuration via API

```javascript
// Update volumes for specific testing
await fetch('/seeder/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    volumes: {
      users: { admin: 1, business: 10, customer: 30 },
      partners: 10,
      conversations: 15
    },
    incremental: true
  })
});
```

## 📊 Monitoring & Validation

### Real-time Status
```bash
# Check seeding progress
curl http://localhost:3001/seeder/status

# Response example
{
  "isRunning": true,
  "currentPhase": "partner",
  "progress": 65,
  "totalPhases": 3,
  "completedPhases": ["core", "communication"],
  "estimatedCompletion": "~2m"
}
```

### Data Validation
```bash
# Validate data integrity
curl http://localhost:3001/seeder/validate

# Response example
{
  "isValid": true,
  "errors": [],
  "warnings": ["Orders: 5 orders with total amount mismatch"]
}
```

### Collection Statistics
```bash
# Get collection stats
curl http://localhost:3001/seeder/stats

# Response example
{
  "collections": [
    {
      "collection": "users",
      "count": 67,
      "issues": []
    },
    {
      "collection": "partners", 
      "count": 15,
      "issues": []
    }
  ]
}
```

## 🔧 Development Workflow

### 1. Quick Testing Setup
```bash
# Minimal data for rapid development
curl -X POST http://localhost:3001/seeder/profile/minimal
```

### 2. Feature Development
```bash
# Seed only relevant phases
curl -X POST http://localhost:3001/seeder/phase/core
curl -X POST http://localhost:3001/seeder/phase/communication
```

### 3. Demo Preparation
```bash
# Full realistic data with images
curl -X POST http://localhost:3001/seeder/profile/standard
```

### 4. Performance Testing
```bash
# Extensive data for load testing
curl -X POST http://localhost:3001/seeder/profile/extensive
```

### 5. Incremental Updates
```bash
# Add data without clearing existing
curl -X POST http://localhost:3001/seeder/seed \
  -H "Content-Type: application/json" \
  -d '{"incremental": true}'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Seeding Fails with Relationship Errors
```bash
# Validate data first
curl http://localhost:3001/seeder/validate

# Clean and re-seed in correct order
curl -X DELETE http://localhost:3001/seeder/all
curl -X POST http://localhost:3001/seeder/seed
```

#### 2. Out of Memory During Extensive Seeding
```bash
# Use smaller profile or incremental seeding
curl -X POST http://localhost:3001/seeder/profile/standard

# Or seed phases individually
curl -X POST http://localhost:3001/seeder/phase/core
curl -X POST http://localhost:3001/seeder/phase/partner
```

#### 3. Images Not Loading
```bash
# Check image strategy configuration
curl http://localhost:3001/seeder/config

# Switch to different provider
curl -X POST http://localhost:3001/seeder/config \
  -H "Content-Type: application/json" \
  -d '{"imageStrategy": {"provider": "picsum"}}'
```

### Performance Tips

1. **Use Incremental Seeding**: Avoid full cleanup for faster iterations
2. **Phase-Specific Seeding**: Seed only what you need for current development
3. **Monitor Memory**: Use minimal/standard profiles for development
4. **Validate Regularly**: Run validation to catch issues early

## 📈 Performance Metrics

### Seeding Speed (Standard Profile)
- **Core Phase**: ~10 seconds (67 users)
- **Partner Phase**: ~45 seconds (15 partners, 300+ menu items)
- **Communication Phase**: ~30 seconds (25 conversations, 500+ messages)
- **Total Time**: ~2 minutes

### Resource Usage
- **Memory**: ~200MB peak usage (standard profile)
- **Database**: ~50MB data size (standard profile)
- **Network**: Minimal (images are URLs, not downloaded)

## 🔮 Future Enhancements

### Planned Features
- **Customer Phase**: Complete customer journey data
- **Transaction Phase**: Orders, payments, subscriptions with realistic patterns
- **Marketing Phase**: Testimonials, referrals, analytics
- **Support Phase**: Feedback, tickets, corporate inquiries
- **Notification System**: Push notifications, email templates
- **Regional Customization**: City-specific menus and preferences
- **Seasonal Data**: Time-based menu availability
- **Performance Analytics**: Advanced seeding metrics

### Extensibility
- **Custom Phases**: Plugin architecture for custom seeding logic
- **External Data Sources**: Import from CSV, JSON, APIs
- **Data Export**: Export seeded data for backup/sharing
- **Automated Testing**: Integration with CI/CD pipelines

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Compatibility**: Node.js 18+, NestJS 10+, MongoDB 6+
