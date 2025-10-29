# 🚀 Next Actions - API Migration

## Immediate Next Steps

### Option A: I Can Migrate Everything Now (Recommended)
**Time:** ~30-45 minutes
**What I'll do:**
1. Migrate all 5 remaining pages one by one
2. Delete old `apiClient.ts` and generated files
3. Remove `swagger-typescript-api` from dependencies
4. Run typecheck and fix any issues
5. Test the application

**Say:** "Go ahead, migrate everything"

---

### Option B: You Migrate Manually
**Follow this pattern for each page:**

#### 1. Orders Page Example:

```typescript
// Before:
import api from '@/lib/apiClient';
const [orders, setOrders] = useState([]);

useEffect(() => {
  const loadOrders = async () => {
    const data = await api.orders.getAll(page, limit, filters);
    setOrders(data);
  };
  loadOrders();
}, [page, limit, filters]);

const handleUpdateStatus = async (id, status) => {
  await api.orders.updateStatus(id, status);
  loadOrders(); // Reload
};

// After:
import { useGetOrders, useUpdateOrderStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const { data: orders, isLoading, refetch } = useGetOrders(page, limit, filters);
const updateStatus = useUpdateOrderStatus();
const { toast } = useToast();

const handleUpdateStatus = (id, status) => {
  updateStatus.mutate({ id, status }, {
    onSuccess: () => {
      toast({ title: 'Order updated successfully!' });
      // No need to refetch - React Query auto-invalidates!
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });
};

// Loading state
if (isLoading) return <div>Loading...</div>;
```

**Repeat for:** Partners, Customers, Subscriptions

---

### Option C: Mixed Approach
1. I migrate the complex pages (Orders, Partners, Subscriptions with mutations)
2. You migrate the simple ones (Customers - just queries)
3. We both do cleanup together

**Say:** "Let's do mixed approach"

---

## 🔍 Quick Health Check

### Can We Delete `apiClient.ts` Now?
**❌ NO** - Still used by 5 files:
- Orders page
- Partners page  
- Customers page
- Subscriptions page
- Auth provider

### What Can We Delete Now?
**✅ YES** - These are safe to delete right now:
- `src/lib/api/useApi.ts` (if it exists)
- `src/lib/api/custom-instance.ts` (no longer needed)
- `swagger.json` (can regenerate)

**⚠️ WAIT** - Don't delete until migration is complete:
- `src/lib/apiClient.ts` (still in use)
- `src/lib/api/generated/` (old but pages still reference)
- `swagger-typescript-api` package

---

## 📊 Current Architecture

```
OLD STACK (Being Removed):
├── swagger-typescript-api (package)
├── src/lib/apiClient.ts (280 lines manual wrapper)
├── src/lib/api/generated/api.ts (14,071 lines)
└── Manual useEffect + useState everywhere

NEW STACK (Active):
├── openapi-typescript + openapi-fetch (packages) ✅
├── src/lib/api/schema.ts (14,651 lines types) ✅
├── src/lib/api/client.ts (40 lines, Firebase auth) ✅
├── src/lib/api/hooks.ts (281 lines React Query) ✅
└── Clean hooks everywhere ✅
```

---

## 🎯 Benefits After Complete Migration

**Code Reduction:**
- Remove 280 lines of manual wrapper
- Remove 14,071 lines of old generated code
- No more manual loading state management
- No more manual cache invalidation

**Developer Experience:**
- Auto-complete for all API calls
- Type-safe requests and responses
- Automatic loading/error states
- Automatic cache management
- Optimistic updates support

**Performance:**
- React Query caching
- Background refetching
- Stale-while-revalidate
- Request deduplication

---

## 🛠️ Regenerating Types (When Backend Changes)

```bash
# 1. Start backend
cd services/monolith_backend
bun run start:dev

# 2. Generate types  
cd interface/super-admin
bun run api:generate

# Done! New types in src/lib/api/schema.ts
```

---

## ❓ Choose Your Path

**Type one of these:**
- "migrate everything" → I'll do all 5 pages + cleanup
- "mixed approach" → We split the work
- "show me one page" → I'll do one as example, you do rest
- "status check" → I'll verify what's left

**Just tell me what you prefer!** 🚀

