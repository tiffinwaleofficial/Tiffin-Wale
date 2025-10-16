# Scope Onboarding - Official Web App

## 🎯 Purpose

This document provides quick onboarding prompts for developers working on different scopes of the TiffinWale Official Web Application. Each prompt is designed to give developers the essential context they need to start working effectively on their assigned scope.

## 🚀 Quick Start Prompts

### Frontend Developer Onboarding
```
I'm a frontend developer working on the TiffinWale Official Web App. I need to understand:

1. The React component architecture and design system
2. State management patterns (React Query + local state)
3. Routing and navigation structure
4. Form handling and validation
5. API integration patterns
6. Performance optimization strategies
7. Accessibility requirements and implementation
8. Testing strategies for React components

Please provide me with:
- Key file locations and their purposes
- Component hierarchy and patterns
- State management flow
- API integration examples
- Testing examples and utilities
- Performance optimization techniques
- Accessibility implementation details

Focus on: client/src/ directory structure, component patterns, hooks usage, API client, and testing approaches.
```

### Backend Developer Onboarding
```
I'm a backend developer working on the TiffinWale Official Web App. I need to understand:

1. Express.js server architecture and middleware
2. NestJS backend integration patterns
3. API endpoint design and implementation
4. WebSocket server setup and management
5. Authentication and token management
6. Error handling and logging strategies
7. Fallback mechanisms for backend unavailability
8. Environment configuration management

Please provide me with:
- Server architecture overview
- API endpoint implementations
- NestJS integration patterns
- WebSocket communication setup
- Authentication flow
- Error handling strategies
- Environment configuration
- Testing approaches for APIs

Focus on: server/ directory structure, API routes, NestJS integration, WebSocket implementation, and fallback strategies.
```

### DevOps Engineer Onboarding
```
I'm a DevOps engineer working on the TiffinWale Official Web App. I need to understand:

1. Multi-platform deployment strategy (Vercel, Google Cloud, Docker)
2. Build and deployment processes
3. Environment configuration management
4. CI/CD pipeline setup
5. Monitoring and analytics integration
6. Security headers and configurations
7. Performance optimization strategies
8. Domain and DNS management

Please provide me with:
- Deployment architecture overview
- Build and deployment scripts
- Environment configuration
- CI/CD pipeline configuration
- Monitoring and analytics setup
- Security implementation
- Performance optimization
- Domain management

Focus on: deployment configurations, build processes, environment management, monitoring setup, and security implementation.
```

### Database Administrator Onboarding
```
I'm a database administrator working on the TiffinWale Official Web App. I need to understand:

1. PostgreSQL database schema and design
2. Drizzle ORM configuration and usage
3. Database migration management
4. Seeding strategies and test data
5. Query optimization and performance
6. Database security and access control
7. Backup and recovery procedures
8. Monitoring and health checks

Please provide me with:
- Database schema overview
- Drizzle ORM configuration
- Migration management
- Seeding strategies
- Query patterns and optimization
- Security implementation
- Backup procedures
- Monitoring setup

Focus on: database schema, Drizzle ORM usage, migration management, seeding, and performance optimization.
```

### QA Engineer Onboarding
```
I'm a QA engineer working on the TiffinWale Official Web App. I need to understand:

1. Testing strategy and pyramid approach
2. Unit testing with Jest and React Testing Library
3. Integration testing for APIs and components
4. End-to-end testing with Playwright
5. Performance testing and monitoring
6. Accessibility testing requirements
7. Cross-browser testing strategies
8. CI/CD integration and automation

Please provide me with:
- Testing strategy overview
- Unit testing examples and utilities
- Integration testing approaches
- E2E testing setup and examples
- Performance testing methods
- Accessibility testing requirements
- Cross-browser testing setup
- CI/CD integration

Focus on: testing tools, test examples, testing strategies, performance testing, and accessibility requirements.
```

### Integration Specialist Onboarding
```
I'm an integration specialist working on the TiffinWale Official Web App. I need to understand:

1. NestJS backend service integration
2. External API integrations and management
3. WebSocket real-time communication
4. Analytics and monitoring integrations
5. Media and asset management (Cloudinary)
6. SEO and search engine integrations
7. Security integrations and implementations
8. Performance and CDN integrations

Please provide me with:
- Integration architecture overview
- NestJS backend integration patterns
- External service integrations
- WebSocket implementation
- Analytics integration
- Media management setup
- SEO implementation
- Security integrations

Focus on: external service integrations, API management, real-time communication, analytics, and security implementations.
```

## 📚 Context Loading Strategy

### For New Team Members
1. **Start with**: `project-overview.md` - Get high-level understanding
2. **Then**: `architecture-patterns.md` - Understand technical architecture
3. **Finally**: Relevant scope documentation - Deep dive into your area

### For Existing Team Members
1. **Check**: `progress-tracking.md` - Understand current status
2. **Review**: `activeContext.md` - Get current focus areas
3. **Update**: Relevant scope documentation - Stay current with changes

### For Cross-Scope Work
1. **Read**: Multiple scope documents as needed
2. **Focus**: Integration points between scopes
3. **Understand**: Dependencies and interactions
4. **Coordinate**: With relevant team members

## 🔄 Daily Standup Context

### Quick Status Check
```
Based on the memory bank, provide me with:

1. Current project status and completion percentage
2. Recent changes and updates
3. Active development areas
4. Known issues and blockers
5. Upcoming priorities and deadlines
6. Team velocity and performance metrics

Focus on: progress-tracking.md, recent changes, current status, and immediate priorities.
```

### Sprint Planning Context
```
For sprint planning, I need to understand:

1. Current backlog and priorities
2. Technical debt and refactoring needs
3. Testing coverage and requirements
4. Performance optimization opportunities
5. Security and compliance requirements
6. Integration and deployment considerations

Focus on: progress-tracking.md, testing-scope.md, and integration requirements.
```

## 🎯 Scope-Specific Quick References

### Frontend Quick Reference
- **Components**: `client/src/components/`
- **Pages**: `client/src/pages/`
- **Hooks**: `client/src/hooks/`
- **API Client**: `client/src/lib/api.ts`
- **Styling**: Tailwind CSS with custom design system

### Backend Quick Reference
- **Server**: `server/index.ts`
- **Routes**: `server/routes.ts`
- **Storage**: `server/storage.ts`
- **Config**: `config/environment.ts`
- **Integration**: NestJS backend with fallback

### DevOps Quick Reference
- **Deployment**: Vercel (primary), Google Cloud, Docker
- **Build**: `npm run build`
- **Environment**: `.env` configuration
- **Monitoring**: Vercel Analytics and Speed Insights
- **Security**: CSP headers and security configurations

### Database Quick Reference
- **Schema**: `shared/schema.ts`
- **Config**: `drizzle.config.ts`
- **Migrations**: `db/migrations/`
- **Seeding**: `db/seed.ts`
- **ORM**: Drizzle with PostgreSQL

### Testing Quick Reference
- **Unit Tests**: Jest + React Testing Library
- **Integration**: Supertest for APIs
- **E2E**: Playwright for user journeys
- **Coverage**: 80% target coverage
- **CI/CD**: Automated testing pipeline

### Integration Quick Reference
- **Backend**: NestJS service integration
- **WebSocket**: Real-time communication
- **Analytics**: Vercel Analytics
- **Media**: Cloudinary integration
- **SEO**: Meta tags and structured data

## 🚨 Emergency Context

### Production Issues
```
For production issues, I need immediate access to:

1. Current deployment status and health
2. Recent changes and potential causes
3. Monitoring and alerting setup
4. Rollback procedures and options
5. Team contacts and escalation paths
6. Known issues and workarounds

Focus on: devops-scope.md, progress-tracking.md, and monitoring setup.
```

### Security Incidents
```
For security incidents, I need to understand:

1. Security implementations and configurations
2. Authentication and authorization flows
3. Data protection and privacy measures
4. Incident response procedures
5. Security monitoring and alerting
6. Compliance requirements and procedures

Focus on: security implementations, authentication flows, and incident response procedures.
```

## 📋 Onboarding Checklist

### Pre-Work Setup
- [ ] Read project overview and architecture
- [ ] Understand scope-specific requirements
- [ ] Set up development environment
- [ ] Review coding standards and practices
- [ ] Understand testing requirements

### First Day Tasks
- [ ] Clone repository and set up local environment
- [ ] Run tests and verify everything works
- [ ] Review recent changes and current status
- [ ] Understand team communication channels
- [ ] Set up monitoring and alerting access

### First Week Goals
- [ ] Complete scope-specific onboarding
- [ ] Make first small contribution
- [ ] Understand deployment and release process
- [ ] Review security and compliance requirements
- [ ] Establish regular communication with team

### Ongoing Maintenance
- [ ] Keep memory bank documentation updated
- [ ] Stay current with project changes
- [ ] Participate in code reviews and discussions
- [ ] Contribute to testing and quality assurance
- [ ] Maintain security and performance standards

---

*This onboarding guide provides quick access to essential context for developers working on the Official Web App. Use the appropriate prompt for your scope and refer to the detailed documentation as needed.*
