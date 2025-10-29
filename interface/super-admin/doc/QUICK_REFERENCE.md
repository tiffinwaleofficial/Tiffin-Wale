# API Client - Quick Reference

## 🎯 TL;DR

**Problem**: API requests were hitting Next.js (port 9002) instead of backend (port 3001)

**Solution**: Permanent configuration that survives regeneration

---

## ✅ What We Fixed

1. ✅ Created custom client with hardcoded backend URL
2. ✅ Wrapped all SDK functions to use configured client
3. ✅ Added post-generation script to prevent config loss
4. ✅ Updated package.json to run post-processing automatically

---

## 🚀 Daily Usage

### Switch Between Local and Production

Edit `.env` and comment/uncomment the URL you want:

```env
# LOCAL DEVELOPMENT
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001

# PRODUCTION
# NEXT_PUBLIC_API_BASE_URL=https://api.tiffin-wale.com
```

Then **restart Next.js**: `npm run dev`

### Regenerate API Client (after backend changes)

```bash
npm run api:generate
```

That's it! ✨ Post-processing runs automatically.

### Import API Functions

```typescript
// ✅ CORRECT
import { authControllerLogin, userControllerGetProfile } from '@/lib/api';

// ❌ WRONG
import { authControllerLogin } from '@tiffinwale/sdk';  // Bypasses config!
```

---

## 🔧 Files You Should Never Edit

These files are auto-generated and will be overwritten:

- `src/lib/api/generated/**/*` - ALL files in this folder

---

## 📝 Files You CAN Edit

These files are safe to customize:

- `src/lib/api/client.ts` - Custom axios configuration
- `src/lib/api/index.ts` - SDK function wrappers
- `scripts/post-generate-api.js` - Post-processing script
- `openapi-ts.config.ts` - Generator configuration

---

## 🐛 Debugging Checklist

If API requests aren't working:

1. ☑️ Check `.env` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001  # ✅ Correct
   ```

2. ☑️ Check browser console for:
   ```
   🔧 API Client Configuration:
      - Environment: development
      - Base URL: http://127.0.0.1:3001
      - Source: .env file
      - Mode: LOCAL DEVELOPMENT
   📡 API Request: POST http://127.0.0.1:3001/api/auth/login
   ```

3. ☑️ Verify imports use `@/lib/api`:
   ```typescript
   import { xxx } from '@/lib/api';  // ✅ Good
   ```

4. ☑️ Ensure backend is running on port 3001

5. ☑️ Restart Next.js after changing `.env`

6. ☑️ Check for CORS errors (backend needs CORS for localhost:9002)

---

## 📦 Key Files

```
interface/super-admin/
├── .env                       ← Backend URL config (EDIT THIS!)
├── .env.example               ← Template for .env
├── src/lib/api/
│   ├── client.ts              ← Custom Axios config (EDIT SAFE)
│   ├── index.ts               ← SDK wrappers (EDIT SAFE)
│   └── generated/             ← Auto-generated (DON'T EDIT)
│       ├── client.gen.ts
│       ├── sdk.gen.ts
│       └── @tanstack/react-query.gen.ts
├── scripts/
│   └── post-generate-api.js   ← Post-processing (EDIT SAFE)
├── openapi-ts.config.ts       ← Generator config (EDIT SAFE)
└── package.json               ← Scripts
```

---

## 🎓 Architecture Summary

```
Your Code
    ↓ import from '@/lib/api'
index.ts (wraps SDK with configured client)
    ↓
client.ts (custom Axios with baseURL: 3001)
    ↓
sdk.gen.ts (auto-generated functions)
    ↓
Backend API (port 3001) ✅
```

---

## 💡 Pro Tips

1. **Always restart Next.js after changing `.env.local`**
2. **Use React Query hooks for better caching**
3. **Check console logs to verify request URLs**
4. **Don't import from `@tiffinwale/sdk` - it bypasses config**

---

## 🆘 Emergency Fix

If things break after regeneration:

```bash
# Run post-processing manually
node scripts/post-generate-api.js

# Restart Next.js
npm run dev
```

---

For detailed documentation, see: `doc/API_CLIENT_GUIDE.md`
