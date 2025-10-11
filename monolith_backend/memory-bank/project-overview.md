# TiffinMate Monolith Backend - Project Overview

## 🎯 Project Summary
**TiffinMate Monolith Backend** is a comprehensive NestJS-based API server that powers a food delivery platform connecting students with local meal providers through subscription-based services. The backend serves as the central nervous system for a multi-platform ecosystem including student mobile apps, partner web applications, and admin dashboards.

## 🏗️ Technology Stack
- **Framework**: NestJS 10.x (Node.js framework)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator + class-transformer
- **Real-time**: WebSocket + Server-Sent Events
- **File Upload**: Multer integration
- **Logging**: Winston with daily rotation
- **Testing**: Jest + Supertest
- **Deployment**: Google Cloud Run + MongoDB Atlas

## 🏛️ Architecture Pattern
**Modular Monolith Architecture** with clean separation of concerns:
- **Backend**: NestJS API server (this project)
- **Database**: MongoDB Atlas (cloud-hosted)
- **Frontend**: React Native mobile app + Next.js web apps
- **Deployment**: Containerized with Google Cloud Run
- **Monitoring**: Winston logging + error tracking

## 📊 Project Scale
- **150+ API Endpoints** implemented across 20+ modules
- **20+ NestJS Modules** with clear boundaries
- **Multi-platform Support**: Student app, Partner app, Admin dashboard
- **Real-time Features**: Live notifications, order tracking, chat
- **Subscription Management**: Complex meal subscription logic
- **Payment Integration**: Razorpay payment gateway

## 🎨 Design System
- **API Design**: RESTful with consistent patterns
- **Response Format**: Standardized JSON responses
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation with detailed error messages
- **Documentation**: Auto-generated Swagger documentation
- **Logging**: Structured logging with correlation IDs

## 🔐 Security Features
- JWT authentication with automatic refresh
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration for frontend domains
- Secure password hashing with bcrypt
- API rate limiting and protection
- Environment-based configuration

## 📈 Key Metrics
- **Build Time**: ~2-3 minutes (development)
- **API Response Time**: <500ms average
- **Database Queries**: Optimized with proper indexing
- **Authentication**: <200ms login flow
- **Real-time Updates**: <100ms WebSocket latency
- **Concurrent Users**: 1000+ supported
- **Uptime Target**: 99.9%

## 🚀 Deployment Targets
- **Development**: Local development server (port 3001)
- **Staging**: Google Cloud Run staging environment
- **Production**: Google Cloud Run production environment
- **Database**: MongoDB Atlas (cloud-hosted)
- **Documentation**: Auto-deployed Swagger UI

## 📋 Current Status
- ✅ **Core Modules**: Complete (20+ modules)
- ✅ **API Endpoints**: 150+ implemented
- ✅ **Authentication**: Complete with JWT + refresh tokens
- ✅ **Database**: MongoDB schemas and relationships
- ✅ **Real-time**: WebSocket + SSE implementation
- ✅ **Payment Integration**: Razorpay integration complete
- 🔄 **Testing**: 70% coverage (target: 85%)
- 🔄 **Performance Optimization**: Ongoing
- 🔄 **Production Monitoring**: In progress

## 🎯 Target Users
- **Primary**: College students and bachelors (via mobile app)
- **Secondary**: Restaurant partners (via partner web app)
- **Tertiary**: System administrators (via admin dashboard)
- **Geographic**: India (initially), expandable globally
- **Age Group**: 18-35 years (students), 25-50 years (partners)
- **Income Level**: Middle to upper-middle class

## 📱 Supported Platforms
- **Student Mobile App**: React Native (iOS, Android)
- **Partner Web App**: Next.js web application
- **Admin Dashboard**: Next.js admin interface
- **API Consumers**: Any HTTP client
- **Documentation**: Swagger UI web interface

## 🔄 Development Workflow
1. **Local Development**: `npm run start:dev`
2. **Testing**: `npm run test` (Jest + Supertest)
3. **Build**: `npm run build` for production
4. **Deploy**: Google Cloud Run deployment
5. **Monitor**: Winston logging + error tracking

## 📚 Documentation Status
- ✅ **API Documentation**: Complete (Swagger)
- ✅ **Module Documentation**: Complete
- ✅ **Architecture Documentation**: Complete
- ✅ **Development Setup**: Complete
- ✅ **Deployment Guide**: Complete
- 🔄 **Testing Guide**: In progress
- 🔄 **Performance Guide**: In progress

## 🎯 Business Model
- **Subscription-based**: Monthly meal plans
- **Commission**: Revenue share with restaurant partners
- **Premium Features**: Enhanced customization options
- **Partner Fees**: Restaurant onboarding and maintenance
- **Admin Tools**: System management and analytics

## 🔮 Future Roadmap
- **Phase 1**: Core functionality (Current)
- **Phase 2**: Advanced features (Planned)
- **Phase 3**: Microservices migration (Future)
- **Phase 4**: International expansion (Long-term)

## 🏗️ Module Architecture

### **Core Modules**
- **AuthModule**: Authentication and authorization
- **UserModule**: User management and profiles
- **OrderModule**: Order processing and management
- **MenuModule**: Menu and item management
- **PaymentModule**: Payment processing and webhooks

### **Business Modules**
- **SubscriptionModule**: Subscription plans and management
- **MealModule**: Meal planning and delivery
- **PartnerModule**: Restaurant partner management
- **CustomerModule**: Customer profile management
- **FeedbackModule**: User feedback and ratings

### **System Modules**
- **AdminModule**: Administrative functions
- **SystemModule**: System utilities and monitoring
- **NotificationModule**: Real-time notifications
- **AnalyticsModule**: Business analytics and reporting
- **SupportModule**: Customer support system

### **Feature Modules**
- **LandingModule**: Landing page functionality
- **MarketingModule**: Marketing and promotional features
- **UploadModule**: File upload and management
- **SeederModule**: Database seeding and testing

## 🔧 Environment Configuration

### **Required Environment Variables**
```bash
# Application
NODE_ENV=development
PORT=3001
API_PREFIX=api
APP_NAME=TiffinMate

# Database
MONGODB_URI=mongodb+srv://...
MONGODB_USER=
MONGODB_PASSWORD=

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=1d

# Swagger
SWAGGER_TITLE=TiffinMate API
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0
SWAGGER_PATH=api-docs

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

## 🚀 Quick Start Commands

### **Development**
```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

### **Production**
```bash
# Start production server
npm run start:prod

# Run tests with coverage
npm run test:cov

# Lint and format code
npm run lint
npm run format
```

## 📊 Performance Characteristics

### **API Performance**
- **Average Response Time**: <500ms
- **95th Percentile**: <1s
- **Database Query Time**: <100ms
- **Authentication Time**: <200ms
- **File Upload Time**: <2s (1MB files)

### **Scalability**
- **Concurrent Users**: 1000+ supported
- **Database Connections**: Pooled (100 max)
- **Memory Usage**: <512MB per instance
- **CPU Usage**: <50% under normal load
- **Auto-scaling**: Google Cloud Run

### **Reliability**
- **Uptime Target**: 99.9%
- **Error Rate**: <0.1%
- **Recovery Time**: <5 minutes
- **Backup Frequency**: Daily
- **Monitoring**: 24/7

## 🔒 Security Measures

### **Authentication & Authorization**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session management
- Token expiration handling

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Environment variable protection

### **Infrastructure Security**
- HTTPS enforcement
- Secure headers
- Database connection encryption
- Environment isolation
- Secret management
- Audit logging

## 📈 Monitoring & Observability

### **Logging**
- Winston logger with daily rotation
- Structured logging format
- Correlation IDs for request tracking
- Error tracking and alerting
- Performance metrics logging

### **Health Checks**
- Database connectivity checks
- External service health checks
- Memory and CPU monitoring
- Response time monitoring
- Error rate tracking

### **Alerting**
- Error rate thresholds
- Response time alerts
- Database connection alerts
- Memory usage alerts
- Custom business logic alerts

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team









