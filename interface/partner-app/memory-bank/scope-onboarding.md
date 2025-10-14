# Tiffin-Wale Partner App - Scope Onboarding Prompts

## Overview
This document provides scope-specific onboarding prompts for developers working on different aspects of the Tiffin-Wale Partner App. Each prompt is designed to quickly bring a developer up to speed on their specific area of responsibility.

## Frontend Development Scope

### Onboarding Prompt
```
You are joining the Tiffin-Wale Partner App frontend development team. This is a React Native Expo application for food partners to manage their restaurant operations.

**Your Scope**: React Native UI development, component creation, screen implementation, and user experience optimization.

**Key Technologies**:
- Expo React Native (v54.0.0) with TypeScript
- Expo Router for file-based navigation
- Zustand for state management
- Custom React Native components with Lucide icons
- AsyncStorage for persistence

**Critical Files to Review**:
1. `app/(tabs)/dashboard.tsx` - Main dashboard with earnings and order overview
2. `app/(tabs)/orders.tsx` - Order management interface with filtering
3. `components/CustomTabBar.tsx` - Custom tab navigation component
4. `store/authStore.ts` - Authentication state management
5. `utils/apiClient.ts` - API integration layer

**Current Priorities**:
- Complete order status update workflow
- Implement real-time order notifications
- Optimize dashboard performance
- Add menu management screens
- Improve mobile responsiveness

**Design System**:
- Primary color: #FF9B42 (orange)
- Background: #FFFAF0 (cream)
- Font: Poppins family
- Icons: Lucide React Native
- Spacing: 4, 8, 16, 24, 32px system

**Development Commands**:
- `npm run dev` - Start development server
- `npm run build:web` - Build for web
- `npm run lint` - Run linter

**Next Steps**:
1. Review the component architecture documentation
2. Set up development environment
3. Test the current dashboard functionality
4. Identify areas for UI/UX improvements
5. Start with order management screen enhancements

**Key Challenges**:
- Real-time data synchronization
- Mobile performance optimization
- Offline functionality
- Cross-platform compatibility
```

## Backend Integration Scope

### Onboarding Prompt
```
You are joining the Tiffin-Wale Partner App backend integration team. Your focus is on API integration, data management, and real-time features.

**Your Scope**: API client development, state management, data synchronization, and backend communication.

**Key Technologies**:
- Axios for HTTP requests
- Zustand for state management
- AsyncStorage for offline persistence
- WebSocket for real-time updates
- JWT authentication

**Critical Files to Review**:
1. `utils/apiClient.ts` - Main API client with interceptors
2. `store/authStore.ts` - Authentication and session management
3. `store/partnerStore.ts` - Partner profile and business data
4. `store/orderStore.ts` - Order management and tracking
5. `config/environment.ts` - Environment configuration

**API Endpoints You'll Work With**:
- `/auth/*` - Authentication (login, register, token refresh)
- `/partners/*` - Partner profile and statistics
- `/orders/*` - Order management and status updates
- `/menu/*` - Menu item management
- `/analytics/*` - Earnings and business analytics
- `/notifications/*` - Push notifications
- `/chat/*` - Customer communication

**Current Priorities**:
- Implement real-time order updates via WebSocket
- Complete menu management API integration
- Add earnings analytics data fetching
- Implement push notification handling
- Optimize API response caching

**Authentication Flow**:
1. Login returns JWT token and refresh token
2. Token stored in AsyncStorage
3. Axios interceptor adds token to requests
4. Handle 401 responses with token refresh
5. Logout clears tokens and redirects

**State Management Pattern**:
- Zustand stores with persistence middleware
- Selective persistence (exclude UI state)
- Optimistic updates for better UX
- Error handling with retry mechanisms

**Development Commands**:
- `npm run check:env` - Verify environment setup
- `npm run dev` - Start with API integration
- Test API endpoints with Postman

**Next Steps**:
1. Review API reference documentation
2. Test current API integrations
3. Implement missing endpoints
4. Add real-time WebSocket connections
5. Optimize data fetching and caching

**Key Challenges**:
- Token management and refresh
- Offline data synchronization
- Real-time update handling
- API error handling and retry logic
```

## Mobile Deployment Scope

### Onboarding Prompt
```
You are joining the Tiffin-Wale Partner App mobile deployment team. Your focus is on build processes, deployment, testing, and mobile platform optimization.

**Your Scope**: Mobile app deployment, build optimization, platform-specific features, and production releases.

**Key Technologies**:
- Expo CLI and build system
- Google Cloud Platform deployment
- Android Studio for Android builds
- Xcode for iOS builds (macOS)
- Metro bundler configuration

**Critical Files to Review**:
1. `app.config.ts` - Expo configuration and app settings
2. `package.json` - Dependencies and build scripts
3. `metro.config.js` - Metro bundler configuration
4. `babel.config.js` - Babel transpilation settings
5. `scripts/` - Build and deployment scripts

**Build Targets**:
- **Web**: PWA deployment to Google Cloud
- **Android**: APK/AAB for Google Play Store
- **iOS**: IPA for App Store
- **Development**: Expo development builds

**Current Priorities**:
- Optimize bundle size for mobile
- Implement over-the-air updates
- Set up automated testing pipeline
- Configure push notifications
- Optimize app performance metrics

**Deployment Pipeline**:
1. Development builds via Expo
2. Staging builds for testing
3. Production builds for app stores
4. Over-the-air updates for web

**Performance Targets**:
- App launch time: < 3 seconds
- Bundle size: < 50MB
- Memory usage: < 100MB
- Battery optimization for all-day usage

**Development Commands**:
- `npm run build:web` - Build for web deployment
- `npm run build:gcloud` - Build for Google Cloud
- `npm run deploy:gcloud` - Deploy to production
- `npx expo build:android` - Build Android APK
- `npx expo build:ios` - Build iOS IPA

**Environment Setup**:
- Configure Google Cloud project
- Set up Expo account and project
- Configure app store credentials
- Set up CI/CD pipeline

**Next Steps**:
1. Review development guide
2. Set up build environment
3. Test current build process
4. Optimize bundle size
5. Configure deployment pipeline

**Key Challenges**:
- Cross-platform compatibility
- App store approval process
- Performance optimization
- Over-the-air update management
```

## Full-Stack Development Scope

### Onboarding Prompt
```
You are joining the Tiffin-Wale Partner App as a full-stack developer. You'll work across the entire application stack from UI to backend integration.

**Your Scope**: End-to-end feature development, from UI components to API integration, state management, and deployment.

**Key Technologies**:
- React Native with Expo
- TypeScript for type safety
- Zustand for state management
- Axios for API communication
- Expo Router for navigation
- AsyncStorage for persistence

**Critical Areas**:
1. **Frontend**: UI components, screens, navigation
2. **State Management**: Zustand stores, data flow
3. **API Integration**: HTTP clients, authentication
4. **Mobile Features**: Push notifications, offline support
5. **Deployment**: Build processes, platform optimization

**Current Feature Priorities**:
- Complete order management workflow
- Implement real-time notifications
- Add menu management functionality
- Build earnings analytics dashboard
- Optimize app performance

**Development Workflow**:
1. Feature planning and design
2. UI component development
3. State management implementation
4. API integration and testing
5. Mobile optimization and deployment

**Key Files to Master**:
- `app/(tabs)/dashboard.tsx` - Main business dashboard
- `store/orderStore.ts` - Order management logic
- `utils/apiClient.ts` - API communication layer
- `components/` - Reusable UI components
- `app.config.ts` - App configuration

**Testing Strategy**:
- Unit tests for utilities and stores
- Component testing with React Native Testing Library
- Integration testing for API flows
- End-to-end testing on real devices

**Performance Considerations**:
- Bundle size optimization
- Memory usage monitoring
- Network request optimization
- Offline functionality
- Battery usage optimization

**Development Commands**:
- `npm run dev` - Start development
- `npm run build:web` - Build for web
- `npm run lint` - Code quality checks
- `npm test` - Run test suite

**Next Steps**:
1. Review all memory bank documentation
2. Set up complete development environment
3. Understand the current codebase structure
4. Identify areas for improvement
5. Start with high-priority features

**Key Challenges**:
- Balancing feature development with performance
- Managing complex state across multiple stores
- Ensuring cross-platform compatibility
- Maintaining code quality and testing coverage
```

## Quick Start Commands

### For Any Scope
```bash
# Clone and setup
git clone <repository-url>
cd partner-app
npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start development
npm run dev

# Check setup
npm run check:env
```

### Scope-Specific Commands
```bash
# Frontend Development
npm run dev                    # Start UI development
npm run lint                   # Check code quality

# Backend Integration
npm run check:env             # Verify API connection
# Test API endpoints with Postman

# Mobile Deployment
npm run build:web             # Build for web
npm run deploy:gcloud         # Deploy to production
```

## Success Metrics

### Frontend Development
- Component reusability and consistency
- User experience and interface quality
- Performance optimization
- Cross-platform compatibility

### Backend Integration
- API integration completeness
- Data synchronization accuracy
- Error handling robustness
- Real-time feature functionality

### Mobile Deployment
- Build success rates
- App store approval
- Performance metrics
- User adoption rates

### Full-Stack Development
- Feature delivery timeline
- Code quality and testing coverage
- System performance and reliability
- User satisfaction and engagement

---

*Use these prompts to quickly onboard developers to their specific scope of work on the Tiffin-Wale Partner App. Each prompt provides the essential context and next steps for immediate productivity.*



