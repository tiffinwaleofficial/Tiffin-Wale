# ✨ Clean Import Guide - Auto-Generated Hooks

## 🎯 Perfect! Now Using 100% Auto-Generated Code!

### What Changed:
- ❌ Deleted manual `hooks.ts` (243 lines)
- ✅ Using auto-generated hooks from `@tiffinwale/api`
- ✅ Added TypeScript path aliases
- ✅ Zero manual maintenance needed!

---

## 📦 Import Aliases Configured

```json
{
  "@tiffinwale/api": "src/lib/api/generated/@tanstack/react-query.gen",
  "@tiffinwale/types": "src/lib/api/generated/types.gen",
  "@tiffinwale/sdk": "src/lib/api/generated/sdk.gen"
}
```

---

## 💡 Import Examples

### Super Clean (Recommended):
```typescript
import { useQuery } from '@tanstack/react-query';
import { 
  superAdminControllerGetAllPartnersOptions,
  superAdminControllerUpdatePartnerStatusMutation 
} from '@tiffinwale/api';

// Or use centralized index:
import { 
  superAdminControllerGetAllPartnersOptions 
} from '@/lib/api';
```

### With Types:
```typescript
import type { PartnerDto, CreatePartnerDto } from '@tiffinwale/types';
import { superAdminControllerGetAllPartnersOptions } from '@tiffinwale/api';
```

---

## 📝 Migration Pattern for All Pages

**OLD (Manual):**
```typescript
import api from '@/lib/apiClient';
const [data, setData] = useState([]);

useEffect(() => {
  api.partners.getAll(page, limit).then(setData);
}, [page, limit]);
```

**NEW (Auto-Generated):**
```typescript
import { useQuery } from '@tanstack/react-query';
import { superAdminControllerGetAllPartnersOptions } from '@tiffinwale/api';

const { data, isLoading } = useQuery(
  superAdminControllerGetAllPartnersOptions({ 
    query: { page, limit } 
  })
);
```

---

## 🔍 Finding Hook Names

**Easy Pattern:**
1. Backend endpoint: `GET /api/super-admin/partners`
2. Controller method: `SuperAdminController.getAllPartners()`
3. Hook name: `superAdminControllerGetAllPartnersOptions()`

**Mutations:**
- PATCH/POST/DELETE → Ends with `Mutation()`
- GET → Ends with `Options()`

---

## 📋 Next: Update All Pages

Simply find/replace in each page:

```typescript
// Find this:
import api from '@/lib/apiClient';

// Replace with:
import { useQuery } from '@tanstack/react-query';
import { superAdminController...Options } from '@tiffinwale/api';
```

---

**Result:** 100% auto-generated, type-safe, zero maintenance! 🎉


