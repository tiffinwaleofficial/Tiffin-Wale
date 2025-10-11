# Tiffin-Wale Memory Bank

## Overview

This memory bank contains comprehensive documentation for the Tiffin-Wale project - a multi-interface food delivery platform connecting students/bachelors with local food providers. The memory bank serves as the single source of truth for project context, architecture, and development guidance.

## Memory Bank Structure

### Core Documents
- **[projectbrief.md](./projectbrief.md)** - Foundation document defining project scope and requirements
- **[productContext.md](./productContext.md)** - Business context and user experience goals
- **[systemPatterns.md](./systemPatterns.md)** - Technical architecture and design patterns
- **[techContext.md](./techContext.md)** - Technology stack and development setup
- **[activeContext.md](./activeContext.md)** - Current work focus and recent changes
- **[progress.md](./progress.md)** - Implementation status and known issues

### Scope-Specific Onboarding
- **[scopes/backend-onboarding.md](./scopes/backend-onboarding.md)** - Backend development guide
- **[scopes/frontend-onboarding.md](./scopes/frontend-onboarding.md)** - Frontend development guide
- **[scopes/mobile-onboarding.md](./scopes/mobile-onboarding.md)** - Mobile development guide
- **[scopes/admin-onboarding.md](./scopes/admin-onboarding.md)** - Admin dashboard guide
- **[scopes/devops-onboarding.md](./scopes/devops-onboarding.md)** - DevOps and deployment guide

## Project Architecture

### Multi-Interface Platform
```
Tiffin-Wale Platform
├── Backend (NestJS Monolith)
│   ├── RESTful APIs
│   ├── JWT Authentication
│   ├── MongoDB Database
│   └── Real-time WebSockets
├── Frontend Interfaces
│   ├── Official Web App (React/Vite)
│   ├── Student Mobile App (Expo React Native)
│   ├── Partner Mobile App (Expo React Native)
│   └── Super Admin Web (Next.js)
└── Infrastructure
    ├── Google Cloud Platform
    ├── App Engine Services
    ├── MongoDB Atlas
    └── CI/CD Pipeline
```

### Technology Stack
- **Backend**: NestJS, TypeScript, MongoDB, JWT
- **Frontend**: React 18, Vite, Tailwind CSS, Radix UI
- **Mobile**: Expo React Native, TypeScript, Zustand
- **Admin**: Next.js 15, Firebase, Genkit AI
- **Infrastructure**: GCP App Engine, Cloud Build, Cloud Monitoring

## Quick Start Guide

### For New Developers
1. **Read Core Documents**: Start with `projectbrief.md` and `productContext.md`
2. **Choose Your Scope**: Select the appropriate onboarding guide from `scopes/`
3. **Set Up Environment**: Follow the setup instructions in `techContext.md`
4. **Understand Architecture**: Review `systemPatterns.md` for technical patterns
5. **Check Current Status**: Review `activeContext.md` and `progress.md`

### For Returning Developers
1. **Check Active Context**: Review `activeContext.md` for recent changes
2. **Update Progress**: Check `progress.md` for current status
3. **Review Scope Guide**: Use the appropriate scope onboarding guide
4. **Follow Patterns**: Ensure code follows patterns in `systemPatterns.md`

## Development Workflow

### Daily Development
1. **Morning Check**: Review `activeContext.md` for current priorities
2. **Scope Focus**: Use scope-specific onboarding guide
3. **Pattern Compliance**: Follow patterns in `systemPatterns.md`
4. **Progress Update**: Update `progress.md` with completed work

### Feature Development
1. **Requirements**: Check `projectbrief.md` and `productContext.md`
2. **Architecture**: Review `systemPatterns.md` for implementation patterns
3. **Implementation**: Follow scope-specific guidelines
4. **Testing**: Use patterns from `techContext.md`
5. **Documentation**: Update relevant memory bank files

## Project Status

### Current Phase
**Phase 1: Core Platform Development** - In Progress
- **Timeline**: 2-3 weeks remaining
- **Focus**: Complete API implementation and basic interfaces
- **Priority**: Feature completion over optimization

### Completion Status
- **Backend API**: 75% Complete
- **Frontend Interfaces**: 60% Complete
- **Mobile Applications**: 70% Complete
- **Admin Dashboard**: 40% Complete
- **Deployment Pipeline**: 60% Complete

### Immediate Priorities
1. **Complete Order API** - Real-time updates, payment integration
2. **Payment Module** - Payment gateway integration
3. **File Upload System** - Image upload for menu items
4. **Mobile App Completion** - Core user flows
5. **Production Deployment** - Complete deployment pipeline

## Key Features

### Core Functionality
- **User Authentication** - JWT-based authentication with role-based access
- **Subscription Management** - Flexible meal subscription plans
- **Order Management** - Real-time order tracking and management
- **Payment Processing** - Secure payment integration
- **Partner Management** - Partner onboarding and business tools
- **Admin Dashboard** - Comprehensive platform oversight

### Technical Features
- **RESTful APIs** - Comprehensive API coverage with Swagger documentation
- **Real-time Updates** - WebSocket connections for live updates
- **File Upload** - Image upload and management
- **Push Notifications** - Mobile push notifications
- **Analytics** - Business metrics and reporting
- **Multi-platform** - Web, mobile, and admin interfaces

## Development Guidelines

### Code Quality
- **TypeScript**: All code must be typed
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: Clear code documentation
- **Patterns**: Follow established architectural patterns

### Security
- **Authentication**: JWT tokens with proper expiration
- **Authorization**: Role-based access control
- **Data Protection**: Input validation and sanitization
- **HTTPS**: All production endpoints use HTTPS

### Performance
- **API Response**: <2s response times
- **Uptime**: 99.9% availability target
- **Mobile Performance**: Optimized bundle sizes
- **Caching**: Appropriate caching strategies

## Deployment Architecture

### Google Cloud Platform
- **App Engine**: Hosting for all services
- **Cloud Build**: CI/CD pipeline
- **Cloud Monitoring**: Performance monitoring
- **Cloud Logging**: Centralized logging

### Service Domains
- **API**: api.tiffin-wale.com
- **Web App**: tiffin-wale.com
- **Student Mobile**: m.tiffin-wale.com
- **Partner Mobile**: partner.tiffin-wale.com
- **Admin Dashboard**: admin.tiffin-wale.com

## Team Coordination

### Communication
- **Daily Standups**: Track progress and blockers
- **Code Reviews**: Ensure code quality
- **Documentation Updates**: Keep memory bank current
- **Testing Coordination**: Comprehensive testing

### Development Process
1. **Feature Planning**: Review requirements and architecture
2. **Implementation**: Follow scope-specific guidelines
3. **Testing**: Comprehensive testing at all levels
4. **Documentation**: Update memory bank files
5. **Deployment**: Follow deployment procedures

## Success Metrics

### Development Metrics
- **API Coverage**: 100% endpoint implementation
- **Test Coverage**: >80% code coverage
- **Build Success**: 100% successful builds
- **Deployment Success**: 100% successful deployments

### Performance Metrics
- **API Response Time**: <2s for all endpoints
- **Frontend Load Time**: <3s for web app
- **Mobile App Launch**: <3s for mobile apps
- **Database Query Time**: <500ms for queries

### Quality Metrics
- **Critical Bugs**: 0 critical bugs
- **Security Issues**: 0 security vulnerabilities
- **Code Quality**: >90% quality score
- **Documentation**: >95% documentation coverage

## Maintenance

### Regular Updates
- **Weekly**: Review and update progress tracking
- **Bi-weekly**: Update active context and priorities
- **Monthly**: Review and update architectural patterns
- **Quarterly**: Comprehensive memory bank review

### Documentation Standards
- **Clarity**: Clear, concise, and developer-focused
- **Completeness**: Comprehensive coverage of all aspects
- **Currency**: Keep documentation up-to-date
- **Accessibility**: Easy to find and navigate

---

## Quick Reference

### Essential Commands
```bash
# Development
pnpm run dev:all          # Start all services
pnpm run backend:dev      # Start backend only
pnpm run frontend:dev     # Start frontend only
pnpm run mobile:dev       # Start mobile apps

# Building
pnpm run build:all        # Build all services
pnpm run deploy:all       # Deploy all services

# Testing
pnpm run test:all         # Run all tests
pnpm run lint             # Lint all code
```

### Key URLs
- **API Documentation**: http://localhost:3001/api-docs
- **Web App**: http://localhost:5173
- **Admin Dashboard**: http://localhost:9002
- **Mobile Apps**: Expo development server

### Environment Setup
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/tiffin-wale
JWT_SECRET=your-jwt-secret

# Frontend
API_BASE_URL=http://localhost:3001/api

# Mobile
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

*This memory bank serves as the comprehensive guide for all Tiffin-Wale development. Keep it updated and use it as the single source of truth for project context and guidance.* 