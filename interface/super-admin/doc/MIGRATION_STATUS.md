# API Client Migration Status

## 🎯 Current Status: 17% Complete (1/6 pages)

### ✅ Completed
- [x] Installed openapi-typescript + openapi-fetch
- [x] Generated TypeScript types (src/lib/api/schema.ts)
- [x] Created API client with Firebase auth (src/lib/api/client.ts)
- [x] Created React Query hooks (src/lib/api/hooks.ts)
- [x] **Dashboard Page** - Fully migrated ✅

### 🔄 Files Still Using OLD `apiClient.ts` (5 files)

**Need to migrate these pages:**

1. ❌ `src/app/(dashboard)/dashboard/orders/page.tsx`
2. ❌ `src/app/(dashboard)/dashboard/partners/page.tsx`
3. ❌ `src/app/(dashboard)/dashboard/customers/page.tsx`
4. ❌ `src/app/(dashboard)/dashboard/subscriptions/page.tsx`
5. ❌ `src/context/auth-provider.tsx`

### 📋 Migration Checklist

**For Each Page:**
```typescript
// ❌ REMOVE this:
import api from '@/lib/apiClient';

// ✅ ADD this:
import { useGetOrders, useUpdateOrderStatus } from '@/lib/api';

// ❌ REMOVE useState + useEffect pattern:
const [data, setData] = useState([]);
useEffect(() => {
  api.orders.getAll().then(setData);
}, []);

// ✅ REPLACE with React Query hook:
const { data, isLoading, error } = useGetOrders(page, limit, filters);
```

---

## 🚀 Next Steps (Priority Order)

### Step 1: Migrate Orders Page
**File:** `src/app/(dashboard)/dashboard/orders/page.tsx`
**Replace:**
- `api.orders.getAll()` → `useGetOrders(page, limit, filters)`
- `api.orders.updateStatus()` → `useUpdateOrderStatus()` mutation

### Step 2: Migrate Partners Page
**File:** `src/app/(dashboard)/dashboard/partners/page.tsx`
**Replace:**
- `api.partners.getAll()` → `useGetPartners(page, limit, filters)`
- `api.partners.updateStatus()` → `useUpdatePartnerStatus()` mutation

### Step 3: Migrate Customers Page
**File:** `src/app/(dashboard)/dashboard/customers/page.tsx`
**Replace:**
- `api.customers.getAll()` → `useGetCustomers(page, limit, filters)`

### Step 4: Migrate Subscriptions Page
**File:** `src/app/(dashboard)/dashboard/subscriptions/page.tsx`
**Replace:**
- `api.subscriptions.getAll()` → `useGetSubscriptions(page, limit, filters)`
- `api.subscriptions.updateStatus()` → `useUpdateSubscriptionStatus()` mutation

### Step 5: Migrate Auth Provider
**File:** `src/context/auth-provider.tsx`
**Replace:**
- `api.auth.login()` → Direct `apiClient.POST()` call (no hook needed in context)
- `api.auth.logout()` → Direct `apiClient.POST()` call

### Step 6: Cleanup Old Files
**After all pages are migrated, DELETE:**
```bash
# Delete old generated code
rm -rf src/lib/api/generated/

# Delete old manual wrapper
rm src/lib/apiClient.ts

# Delete old hook wrapper (if exists)
rm src/lib/api/useApi.ts

# Remove old dependency
bun remove swagger-typescript-api
```

### Step 7: Final Testing
```bash
# Run type check
bun run typecheck

# Run linting
bun run lint --fix

# Test the app
bun run dev
```

---

## 📖 Quick Reference Guide

### Available Hooks in `src/lib/api/hooks.ts`:

**Queries (GET):**
- `useGetDashboardStats()` ✅ Used
- `useGetDashboardActivities(limit?)` ✅ Used
- `useGetRevenueHistory(months?)` ✅ Used
- `useGetEarnings(period?)`
- `useGetPartners(page, limit, filters?)`
- `useGetCustomers(page, limit, filters?)`
- `useGetOrders(page, limit, filters?)`
- `useGetSubscriptions(page, limit, filters?)`
- `useGetActiveSubscriptions()` ✅ Used
- `useGetSupportTickets(page, limit, filters?)`
- `useGetMenuItems()`
- `useGetMenus()`

**Mutations (POST/PATCH/DELETE):**
- `useUpdatePartnerStatus()` - { id, status, reason? }
- `useUpdateOrderStatus()` - { id, status, reason? }
- `useUpdateSubscriptionStatus()` - { id, status }
- `useUpdateTicket()` - { id, updates }
- `useUpdateTicketStatus()` - { id, status }

### Usage Pattern:

```typescript
// Query Example
const { data, isLoading, error, refetch } = useGetOrders(page, limit, filters);

// Mutation Example
const updateStatus = useUpdateOrderStatus();

updateStatus.mutate({
  id: 'order-123',
  status: 'delivered',
  reason: 'Done'
}, {
  onSuccess: () => toast({ title: 'Updated!' }),
  onError: (error) => toast({ title: 'Error', description: error.message })
});

// Check mutation state
if (updateStatus.isPending) { /* show spinner */ }
```

---

## ⚠️ Important Notes

**DO NOT DELETE `apiClient.ts` UNTIL:**
- ✅ All 5 files above are migrated
- ✅ No more `import api from '@/lib/apiClient'` found in codebase
- ✅ App is tested and working

**KEEP THESE FILES:**
- ✅ `src/lib/api/schema.ts` (generated types)
- ✅ `src/lib/api/client.ts` (openapi-fetch client)
- ✅ `src/lib/api/hooks.ts` (React Query hooks)
- ✅ `src/lib/api/index.ts` (exports)
- ✅ `src/lib/api/custom-instance.ts` (not used anymore but safe to keep)

---

**Last Updated:** $(date)
**Progress:** 1/6 pages migrated (17%)
**Estimated Time to Complete:** 45-60 minutes

