# 📚 TiffinWale Partner App - Memory Bank

**Complete Project Intelligence & Documentation Repository**

---

## 🎯 Quick Start

**New to the project?** Start here:
1. Read [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) for high-level context
2. Check [07_SCOPE_ONBOARDING.md](./07_SCOPE_ONBOARDING.md) for scope-specific prompts
3. Refer to relevant documentation as needed

**Working on a specific scope?** Jump to your area:
- 📱 Frontend development → [07_SCOPE_ONBOARDING.md#frontend](./07_SCOPE_ONBOARDING.md#-frontend---react-native-development)
- 🔌 Backend integration → [07_SCOPE_ONBOARDING.md#backend](./07_SCOPE_ONBOARDING.md#-backend-integration)
- 🎨 UI/UX design → [07_SCOPE_ONBOARDING.md#uidesign](./07_SCOPE_ONBOARDING.md#-uiux-design)

---

## 📖 Documentation Index

| Document | Description | When to Use |
|----------|-------------|--------------|
| **[00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)** | High-level project context | First read for new developers |
| **[01_FOLDER_STRUCTURE.md](./01_FOLDER_STRUCTURE.md)** | Complete directory tree | Finding files and understanding organization |
| **[02_API_ENDPOINTS.md](./02_API_ENDPOINTS.md)** | API reference & integration | Working with backend APIs |
| **[03_ARCHITECTURE_PATTERNS.md](./03_ARCHITECTURE_PATTERNS.md)** | Design patterns & architecture | Understanding system design |
| **[04_STATE_MANAGEMENT.md](./04_STATE_MANAGEMENT.md)** | Zustand stores & state patterns | Working with app state |
| **[05_COMPONENT_LIBRARY.md](./05_COMPONENT_LIBRARY.md)** | Component reference | Building UI components |
| **[06_PROGRESS_TRACKING.md](./06_PROGRESS_TRACKING.md)** | Current status & TODO | Tracking work and priorities |
| **[07_SCOPE_ONBOARDING.md](./07_SCOPE_ONBOARDING.md)** | Scope-specific prompts | Quick context for specific work |

---

## 🗺️ Project Structure Overview

```
partner-app/
├── app/                    # Expo Router screens
├── components/             # Reusable UI components (50+)
├── store/                  # Zustand state stores (6 stores)
├── api/                    # API integration layer
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
├── config/                 # Configuration files
├── hooks/                  # Custom React hooks
├── services/              # Business logic services
└── docs/                  # Documentation
```

**Key Technologies:**
- React Native + Expo (SDK 54)
- Zustand (state management)
- React Query (data fetching)
- TypeScript (type safety)
- Expo Router (file-based routing)

---

## 🚀 Common Tasks

### I want to...
**...understand the project** → Read [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)
**...find a specific file** → Check [01_FOLDER_STRUCTURE.md](./01_FOLDER_STRUCTURE.md)
**...integrate an API** → Read [02_API_ENDPOINTS.md](./02_API_ENDPOINTS.md)
**...understand architecture** → Read [03_ARCHITECTURE_PATTERNS.md](./03_ARCHITECTURE_PATTERNS.md)
**...work with state** → Read [04_STATE_MANAGEMENT.md](./04_STATE_MANAGEMENT.md)
**...use a component** → Check [05_COMPONENT_LIBRARY.md](./05_COMPONENT_LIBRARY.md)
**...see what's done** → Read [06_PROGRESS_TRACKING.md](./06_PROGRESS_TRACKING.md)
**...get context for a scope** → Use [07_SCOPE_ONBOARDING.md](./07_SCOPE_ONBOARDING.md)

---

## 📊 Project Status

### ✅ Implemented (Phase 2A - December 2024)
- Authentication system (phone + email)
- Dashboard with real-time statistics
- Order management (listing, filtering, details)
- Partner profile management
- Menu management UI (ready for backend)
- Status toggle (accept/reject orders)
- 7 critical APIs integrated

### 🚧 In Progress
- Order action APIs (accept/reject/mark ready)
- Image upload integration
- Advanced analytics
- WebSocket real-time updates

### 📋 Pending
- Customer chat
- Support tickets
- Payment/payout management
- Testing infrastructure

---

## 🔧 Development Quick Reference

### Setup
```bash
# Install dependencies
bun install

# Start development
bun run dev

# Generate API client
bun run api:generate

# Check environment
bun run check:env
```

### Key Commands
- `bun run dev` - Start Expo dev server
- `bun run build:web` - Build for web
- `bun run deploy:vercel` - Deploy to Vercel
- `bun run api:generate` - Regenerate API client

### Environment Variables
```bash
API_BASE_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## 🎯 Key Components & Files

### Essential Files
- `app/_layout.tsx` - Root layout
- `store/authStore.ts` - Authentication
- `store/partnerStore.ts` - Partner data
- `store/orderStore.ts` - Order management
- `utils/apiClient.ts` - API client

### Essential Components
- `components/ui/Button.tsx` - Button
- `components/ui/Text.tsx` - Typography
- `components/feedback/Loader.tsx` - Loading state
- `components/feedback/ErrorState.tsx` - Error state
- `components/business/OrderCard.tsx` - Order card
- `components/business/StatsCard.tsx` - Statistics card

---

## 🔗 External Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Query Docs](https://tanstack.com/query)

### Tools
- [Expo Go](https://expo.dev/) - Development client
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) - Development tools

### API
- Backend API: `http://localhost:3001` (dev)
- Swagger Docs: `http://localhost:3001/api-docs-json`
- Production: `https://api.tiffin-wale.com`

---

## 📝 Documentation Standards

### When Updating This Memory Bank

**Always update when:**
- Adding new features
- Changing architecture
- Modifying API contracts
- Adding new components
- Changing development patterns

**Update process:**
1. Make code changes
2. Update relevant memory bank document
3. Update [06_PROGRESS_TRACKING.md](./06_PROGRESS_TRACKING.md)
4. Commit with clear message

**Commit message format:**
```
docs: Update memory bank for [feature/change]
```

---

## 🚨 Important Notes

### Authentication
- All API endpoints require JWT Bearer token
- Tokens managed by SecureTokenManager
- Auto-refresh on 401 errors
- Auto-logout on refresh failure

### Backend Integration
- Backend must be running for API calls
- Regenerate client when backend changes
- Use `bun run api:generate` after backend updates

### State Management
- Use Zustand stores for global state
- Components subscribe to stores
- Actions update stores
- Stores persist to AsyncStorage

### Component Usage
- Follow atomic design pattern
- Use loading/error/empty states
- Handle platform differences
- Test on multiple devices

---

## 🤝 Contributing

### Before Starting Work
1. Read relevant memory bank documents
2. Understand current architecture
3. Check existing patterns
4. Identify related files

### While Working
1. Follow existing patterns
2. Update documentation as you go
3. Write clear commit messages
4. Test your changes

### After Completing Work
1. Update progress tracking
2. Update relevant documentation
3. Test thoroughly
4. Submit for review

---

## 📞 Getting Help

**Documentation Issues**
- Check memory bank documents
- Read comments in code
- Review related files

**Technical Issues**
- Check progress tracking for known issues
- Review error handling patterns
- Check console logs

**Architecture Questions**
- Read architecture patterns doc
- Check state management guide
- Review component library

---

## 🎉 Success Metrics

- ✅ 7 APIs integrated and working
- ✅ 50+ reusable components
- ✅ 6 stores managing state
- ✅ Complete authentication flow
- ✅ Real-time dashboard
- 📊 15,000+ lines of code
- 📊 ~150 TypeScript files

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintained By:** Development Team

---

*This memory bank is the single source of truth for project intelligence. Always consult it before making architectural or design decisions.*

