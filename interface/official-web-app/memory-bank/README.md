# Official Web App - Memory Bank

This memory bank contains comprehensive documentation for the TiffinWale Official Web Application, enabling developers to work effectively across different scopes while maintaining context and tracking progress.

## 📁 Memory Bank Structure

```
memory-bank/
├── README.md                           # This file - overview and navigation
├── project-overview.md                 # High-level project understanding
├── architecture-patterns.md           # Technical architecture and patterns
├── frontend-scope.md                   # Frontend development scope
├── backend-scope.md                    # Backend development scope
├── devops-scope.md                     # DevOps and deployment scope
├── database-scope.md                   # Database and schema scope
├── testing-scope.md                    # Testing strategies and tools
├── integrations-scope.md               # External services and APIs
├── progress-tracking.md                # Development progress and changes
└── scope-onboarding.md                 # Quick onboarding for each scope
```

## 🎯 Quick Navigation

### By Development Scope
- **Frontend Developer**: Start with `frontend-scope.md` → `architecture-patterns.md`
- **Backend Developer**: Start with `backend-scope.md` → `architecture-patterns.md`
- **DevOps Engineer**: Start with `devops-scope.md` → `project-overview.md`
- **Database Admin**: Start with `database-scope.md` → `architecture-patterns.md`
- **QA Engineer**: Start with `testing-scope.md` → `frontend-scope.md`

### By Task Type
- **New Feature Development**: `project-overview.md` → relevant scope → `architecture-patterns.md`
- **Bug Fixing**: `progress-tracking.md` → relevant scope → `testing-scope.md`
- **Performance Optimization**: `architecture-patterns.md` → `devops-scope.md`
- **Integration Work**: `integrations-scope.md` → `backend-scope.md`

## 🔄 Memory Bank Maintenance

### When to Update
- After implementing new features
- When architectural decisions change
- When dependencies are updated
- When deployment processes change
- When new integrations are added

### Update Process
1. Identify affected scopes
2. Update relevant documentation files
3. Update `progress-tracking.md` with changes
4. Verify all cross-references are accurate

## 📊 Project Status Overview

**Current State**: Production-ready web application
**Architecture**: Full-stack React + Express + PostgreSQL
**Deployment**: Multi-platform (Vercel, Google Cloud, Docker)
**Development Status**: Active maintenance and feature development

## 🚀 Quick Start Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npm run db:push               # Push schema changes
npm run db:seed               # Seed database

# Deployment
npm run deploy:vercel         # Deploy to Vercel
npm run deploy:gcloud         # Deploy to Google Cloud
```

## 📞 Support & Resources

- **Documentation**: This memory bank
- **API Reference**: Backend API documentation
- **Deployment Guides**: `devops-scope.md`
- **Troubleshooting**: `progress-tracking.md`

---

*Last Updated: $(date)*
*Maintained by: Development Team*

