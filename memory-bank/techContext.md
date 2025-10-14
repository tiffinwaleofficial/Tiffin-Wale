# Tiffin-Wale Technical Context

## Technology Stack Overview

### Backend Technology
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Logging**: Winston

### Frontend Technologies

#### Official Web App
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter
- **Build Tool**: Vite

#### Student Mobile App
- **Framework**: Expo React Native
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **UI Components**: Custom components with React Native
- **Icons**: Lucide React Native
- **Build**: Expo CLI

#### Partner Mobile App
- **Framework**: Expo React Native
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand
- **UI Components**: Custom components with React Native
- **Icons**: Lucide React Native
- **Build**: Expo CLI

#### Super Admin Web
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: Genkit AI

### Infrastructure & Deployment
- **Cloud Platform**: Google Cloud Platform (GCP)
- **Hosting**: App Engine
- **Database**: MongoDB Atlas
- **Domain Routing**: Cloud DNS with dispatch.yaml
- **CI/CD**: GitLab CI/CD
- **Monitoring**: Google Cloud Monitoring

### Development Tools
- **Package Manager**: Bun (Partner App), pnpm (Other apps)
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript
- **Testing**: Jest, React Testing Library
- **API Testing**: Postman/Swagger

## Development Environment Setup

### Prerequisites
```bash
# Required software
Node.js >= 18.0.0
Bun >= 1.0.0 (for Partner App)
pnpm >= 8.0.0 (for other apps)
Git
Google Cloud CLI
Expo CLI
```

### Installation Commands
```bash
# Install all dependencies
pnpm install:all

# Install specific services
pnpm install:backend
pnpm install:frontend
pnpm install:mobile
pnpm install:partner
pnpm install:admin
```

### Environment Configuration

#### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/tiffin-wale
MONGODB_USER=
MONGODB_PASSWORD=

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api
APP_NAME=TiffinMate

# Swagger
SWAGGER_TITLE=TiffinMate API
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0
SWAGGER_PATH=api-docs

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

#### Frontend Environment Variables
```env
# API Configuration
API_BASE_URL=http://localhost:3001/api
VITE_API_BASE_URL=http://localhost:3001/api

# Environment
NODE_ENV=development
VITE_NODE_ENV=development
```

#### Mobile App Environment Variables
```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Environment
EXPO_PUBLIC_ENVIRONMENT=development
```

## Build & Development Commands

### Backend Commands
```bash
# Development
pnpm run backend:dev          # Start development server
pnpm run backend:build        # Build for production
pnpm run backend:test         # Run tests
pnpm run backend:lint         # Lint code

# Production
pnpm run backend              # Start production server
```

### Frontend Commands
```bash
# Development
pnpm run frontend:dev         # Start development server
pnpm run frontend:build       # Build for production
pnpm run frontend:preview     # Preview production build
pnpm run frontend:check       # Type checking

# Production
pnpm run frontend             # Start production server
```

### Mobile App Commands
```bash
# Development
pnpm run mobile:dev           # Start Expo development server
pnpm run mobile:android       # Run on Android
pnpm run mobile:ios           # Run on iOS

# Building
pnpm run mobile:build:web     # Build for web
pnpm run mobile:build:android # Build for Android
pnpm run mobile:build:ios     # Build for iOS
pnpm run mobile:build:gcloud  # Build for Google Cloud

# Deployment
pnpm run mobile:deploy:gcloud # Deploy to Google Cloud
```

### Partner App Commands
```bash
# Development
bun run dev                   # Start Expo development server
bun run start                 # Start Expo development server
bun run api:generate          # Generate API clients with Orval
bun run api:watch            # Watch mode for API generation

# Building
bun run build:web            # Build for web
bun run build:gcloud         # Build for Google Cloud
bun run export:web           # Export for web

# Deployment
bun run deploy:gcloud        # Deploy to Google Cloud
```

### Admin Dashboard Commands
```bash
# Development
pnpm run admin:dev            # Start development server
pnpm run admin:build          # Build for production
pnpm run admin:start          # Start production server
pnpm run admin:lint           # Lint code
pnpm run admin:typecheck      # Type checking
```

### Combined Commands
```bash
# Development
pnpm run dev                  # Backend + Frontend
pnpm run dev:all             # All services
pnpm run dev:web             # Web services only
pnpm run dev:mobile          # Mobile services only

# Building
pnpm run build               # Backend + Frontend
pnpm run build:all           # All services
pnpm run build:mobile        # Mobile apps only

# Testing
pnpm run test                # Backend tests
pnpm run test:all            # All tests
pnpm run lint                # All linting
```

## Deployment Configuration

### Google Cloud Platform Setup
```bash
# Initialize GCP project
gcloud init
gcloud config set project your-project-id

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

### App Engine Configuration
```yaml
# Backend app.yaml
runtime: nodejs20
instance_class: F2
entrypoint: npm run start:prod

env_variables:
  NODE_ENV: "production"
  PORT: "8080"
  MONGODB_URI: "your-mongodb-uri"
  JWT_SECRET: "your-jwt-secret"
```

### Dispatch Routing
```yaml
# dispatch.yaml
dispatch:
  - url: "api.tiffin-wale.com/*"
    service: default
  
  - url: "tiffin-wale.com/*"
    service: official-web
  
  - url: "m.tiffin-wale.com/*"
    service: app
  
  - url: "admin.tiffin-wale.com/*"
    service: super-admin-web
  
  - url: "partner.tiffin-wale.com/*"
    service: partner-app
```

## Database Schema

### Core Collections
```typescript
// User Schema
interface User {
  _id: ObjectId;
  email: string;
  password: string;
  role: 'customer' | 'partner' | 'admin';
  profile: {
    name: string;
    phone: string;
    address: Address;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
interface Order {
  _id: ObjectId;
  customerId: ObjectId;
  partnerId: ObjectId;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed';
  totalAmount: number;
  deliveryAddress: Address;
  deliveryTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Partner Schema
interface Partner {
  _id: ObjectId;
  userId: ObjectId;
  businessName: string;
  description: string;
  cuisine: string[];
  location: Address;
  menu: MenuItem[];
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Structure

### Authentication Endpoints
```
POST /api/auth/register          # User registration
POST /api/auth/login            # User login
POST /api/auth/refresh-token    # Token refresh
POST /api/auth/change-password  # Password change
```

### User Management
```
GET    /api/users/profile       # Get user profile
PUT    /api/users/profile       # Update profile
GET    /api/users/orders        # Get user orders
```

### Order Management
```
GET    /api/orders              # List orders
POST   /api/orders              # Create order
GET    /api/orders/:id          # Get order details
PUT    /api/orders/:id          # Update order
DELETE /api/orders/:id          # Cancel order
```

### Partner Management
```
GET    /api/partners            # List partners
GET    /api/partners/:id        # Get partner details
POST   /api/partners            # Create partner
PUT    /api/partners/:id        # Update partner
```

### Menu Management
```
GET    /api/menu                # List menu items
POST   /api/menu                # Add menu item
PUT    /api/menu/:id            # Update menu item
DELETE /api/menu/:id            # Remove menu item
```

## Security Configuration

### Authentication
- **JWT Tokens**: Access and refresh token system
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Customer, Partner, Admin roles
- **Token Expiration**: Configurable expiration times

### API Security
- **CORS**: Configured for frontend domains
- **Rate Limiting**: Implemented on sensitive endpoints
- **Input Validation**: Zod schemas for all inputs
- **Error Handling**: Sanitized error responses

### Data Protection
- **Environment Variables**: Sensitive data in .env files
- **Database Security**: MongoDB Atlas with network access
- **HTTPS**: All production endpoints use HTTPS
- **Token Storage**: Secure storage in mobile apps

## Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimized MongoDB indexes
- **Query Optimization**: Efficient Mongoose queries
- **Caching**: Redis for session management
- **Compression**: Gzip compression enabled

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and lazy loading
- **CDN**: Static assets served via CDN

### Mobile Optimization
- **Bundle Size**: Optimized React Native bundle
- **Image Caching**: Efficient image loading
- **Offline Support**: Basic offline functionality
- **Performance Monitoring**: Expo performance tools

## Monitoring & Logging

### Application Monitoring
- **Google Cloud Monitoring**: Performance metrics
- **Error Tracking**: Winston logging with file rotation
- **Health Checks**: API health check endpoints
- **Uptime Monitoring**: GCP uptime checks

### Development Monitoring
- **Console Logging**: Structured logging in development
- **Debug Tools**: React DevTools and Redux DevTools
- **Performance Profiling**: React Profiler and Expo tools
- **Error Boundaries**: React error boundaries

## Testing Strategy

### Backend Testing
- **Unit Tests**: Jest for service and utility functions
- **Integration Tests**: API endpoint testing with Supertest
- **Database Tests**: MongoDB test database
- **Mocking**: Jest mocks for external dependencies

### Frontend Testing
- **Component Tests**: React Testing Library
- **Integration Tests**: User interaction testing
- **E2E Tests**: Playwright for critical user flows
- **Visual Regression**: Screenshot testing

### Mobile Testing
- **Component Tests**: React Native Testing Library
- **Integration Tests**: Expo testing utilities
- **Device Testing**: Physical device testing
- **Performance Testing**: Expo performance tools

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create pull request
```

### Code Quality
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Strict type checking

### Deployment Pipeline
```bash
# Development deployment
pnpm run deploy:backend
pnpm run deploy:frontend
pnpm run deploy:mobile
pnpm run deploy:partner
pnpm run deploy:admin

# Production deployment
pnpm run deploy:all
```

---

*This document defines the technical stack, development setup, and configuration requirements. All developers should follow these technical standards.* 