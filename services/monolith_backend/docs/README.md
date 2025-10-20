# TiffinWale Backend Documentation

This folder contains comprehensive documentation for the TiffinWale monolith backend, which serves as the core API server for the TiffinWale ecosystem.

## Documentation Structure

### API Reference

- [**API Reference**](./api-reference.md) - Comprehensive list of all REST APIs with endpoints, descriptions, and authentication requirements.
- [**API Coverage Checklist**](./API_Coverage_Checklist.md) - Tracking document for API implementation status.
- [**API Testing Checklist**](./API_Testing_Checklist.md) - Guidelines for testing API endpoints.

### Architecture Documentation

The architecture directory contains information about the system design:

- System architecture diagrams
- Database schema documentation
- Deployment configurations
- Technology stack details

### Features Documentation

The features directory provides detailed information about specific features:

- Authentication and security
- Order management
- Payment processing
- Menu management
- Partner integration
- Customer profiles

### Implementation Guidelines

The implementation directory includes technical guides for developers:

- Coding standards
- Error handling
- Logging best practices
- Security considerations
- Testing requirements

### Module Documentation

The modules directory contains detailed documentation for each module:

- Auth
- User
- Menu
- Order
- Customer
- Partner
- Payment
- Feedback
- Notification
- Marketing
- System

## Development Progress

The [Development Progress](./DEVELOPMENT_PROGRESS.md) document provides an overview of the current development status, upcoming milestones, and known issues.

## How to Use This Documentation

- **New Developers**: Start with the Architecture Documentation to understand the system structure, then review the API Reference to understand available endpoints.
- **API Developers**: Use the API Reference as your primary guide when implementing or consuming endpoints.
- **QA Engineers**: Use the API Testing Checklist to ensure thorough test coverage.
- **Project Managers**: Refer to the Development Progress document for status updates.

## Contributing to Documentation

When making changes to the codebase, please update the relevant documentation files to keep them accurate and up-to-date. Documentation changes should be included in the same pull request as code changes.

Guidelines for documentation updates:

- Keep language clear, concise, and developer-focused
- Use markdown formatting consistently
- Include code examples where appropriate
- Update API endpoints in the API Reference when adding or modifying endpoints
- Note any breaking changes prominently

## Documentation Maintenance

The documentation should be reviewed and updated at least bi-weekly to ensure it remains current with the codebase. The team lead is responsible for ensuring documentation accuracy during code reviews. 