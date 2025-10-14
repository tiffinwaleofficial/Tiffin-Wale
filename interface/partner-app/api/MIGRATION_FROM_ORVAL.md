# 🔄 Migration from Orval to swagger-typescript-api

## ❌ Problem with Orval

Orval had compatibility issues with Node.js 22.x:
- `@stoplight/spectral-core` dependency failed with syntax errors
- Even with validation disabled, the error persisted
- Multiple versions (6.x, 7.x) all failed

## ✅ Solution: swagger-typescript-api

Successfully replaced Orval with `swagger-typescript-api` which:
- ✅ Works with Node.js 22
- ✅ Generates complete TypeScript clients
- ✅ Compatible with React Native/Expo
- ✅ Supports Axios integration
- ✅ Provides full type safety

---

## 📦 What Changed

### Before (Orval)
```json
{
  "devDependencies": {
    "orval": "^7.13.2"
  }
}
```

### After (swagger-typescript-api)
```json
{
  "devDependencies": {
    "swagger-typescript-api": "^13.2.15"
  }
}
```

---

## 🔧 Configuration Changes

### Before: `orval.config.ts`
```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  tiffinApi: {
    input: { target: 'http://localhost:3001/api-docs-json' },
    output: {
      mode: 'split',
      client: 'react-query',
      // ... config
    },
  },
});
```

### After: Package.json Script
```json
{
  "scripts": {
    "api:generate": "bunx swagger-typescript-api generate -p http://localhost:3001/api-docs-json -o ./api/generated -n api.ts --axios --route-types --responses"
  }
}
```

---

## 📁 File Structure

### Generated Files
```
api/
├── generated/
│   └── api.ts              # Auto-generated API client (8948 lines!)
├── hooks/
│   └── useApi.ts           # React Query hooks wrapper
├── custom-instance.ts      # Axios instance with auth interceptors
├── index.ts                # Central export file
└── README.md               # Complete documentation
```

---

## 🎯 Usage Comparison

### Orval (How it would work)
```tsx
import { useGetOrders, useCreateOrder } from './api/generated';

const { data } = useGetOrders();
const { mutate } = useCreateOrder();
```

### swagger-typescript-api (Current)
```tsx
import { useGetOrders, useCreateOrder } from '@/api';

const { data } = useGetOrders();
const { mutate } = useCreateOrder();
```

**Result: EXACTLY THE SAME!** 🎉

---

## ✨ Features Preserved

Everything Orval provided is still available:

✅ **Auto-generated TypeScript types**
✅ **React Query hooks**
✅ **Full type safety**
✅ **Request/response types**
✅ **Error handling**
✅ **Authentication integration**
✅ **Token refresh logic**

---

## 🚀 How to Use

1. **Generate API Client**
   ```bash
   bun run api:generate
   ```

2. **Import and Use**
   ```tsx
   import { useGetOrders, useCreateOrder } from '@/api';
   
   function MyComponent() {
     const { data, isLoading } = useGetOrders();
     const createOrder = useCreateOrder();
     
     return <OrderList orders={data} />;
   }
   ```

3. **That's it!** Works exactly like Orval would.

---

## 🔄 Regeneration

When backend API changes:

```bash
# Make sure backend is running on localhost:3001
bun run api:generate
```

The API client will automatically regenerate with all new endpoints!

---

## 📊 Comparison Table

| Feature | Orval | swagger-typescript-api |
|---------|-------|------------------------|
| TypeScript Generation | ✅ | ✅ |
| React Query Support | ✅ | ✅ (via wrapper) |
| Axios Integration | ✅ | ✅ |
| Type Safety | ✅ | ✅ |
| Node.js 22 Support | ❌ | ✅ |
| Expo/RN Compatible | ✅ | ✅ |
| Auto-refresh | ✅ | ✅ |
| Custom Instance | ✅ | ✅ |

---

## 💡 Pro Tips

1. **Add to .gitignore** (optional):
   ```
   api/generated/
   ```

2. **Regenerate after backend changes**:
   ```bash
   bun run api:generate
   ```

3. **Use TypeScript autocomplete** - All methods are fully typed!

4. **Check `api/README.md`** for complete usage documentation

---

## ✅ Migration Complete!

Your Partner App now has a **fully functional API client** that works exactly like Orval, but without the Node.js compatibility issues!

**Next Steps:**
1. Start using the generated hooks in your components
2. Build the authentication service
3. Implement business logic with type-safe API calls

🎉 **You're ready to go!**

