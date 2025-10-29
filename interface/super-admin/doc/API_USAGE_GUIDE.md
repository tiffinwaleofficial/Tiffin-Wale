# 🚀 API Usage Guide - Auto-Generated Hooks

## ✅ What We Have Now

**100% Auto-Generated! Zero Manual Code!**

- ✅ TypeScript types from Swagger
- ✅ React Query hooks auto-generated
- ✅ Mutations auto-generated
- ✅ Firebase auth integrated
- ✅ Clean import aliases

---

## 📦 Import Paths

### Option 1: Using Clean Alias (Recommended)
```typescript
// Import React Query hooks directly
import { 
  superAdminControllerGetDashboardStatsOptions,
  superAdminControllerGetAllPartnersOptions,
  superAdminControllerUpdatePartnerStatusMutation 
} from '@tiffinwale/api';

// Import types
import type { PartnerDto, OrderDto } from '@tiffinwale/types';

// Import SDK (for direct calls)
import { superAdminControllerGetDashboardStats } from '@tiffinwale/sdk';
```

### Option 2: Using Relative Path
```typescript
import { 
  superAdminControllerGetDashboardStatsOptions 
} from '@/lib/api/generated/@tanstack/react-query.gen';
```

### Option 3: Using Centralized Index
```typescript
// Everything from index
import { 
  superAdminControllerGetDashboardStatsOptions,
  client 
} from '@/lib/api';
```

---

## 🎯 Usage Examples

### Query (GET Request)

```typescript
import { useQuery } from '@tanstack/react-query';
import { superAdminControllerGetAllPartnersOptions } from '@tiffinwale/api';

export function PartnersPage() {
  const { data, isLoading, error } = useQuery(
    superAdminControllerGetAllPartnersOptions({
      query: { 
        page: 1, 
        limit: 10,
        status: 'active' 
      }
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.partners.map(partner => (
        <div key={partner.id}>{partner.name}</div>
      ))}
    </div>
  );
}
```

### Mutation (POST/PATCH/DELETE)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { superAdminControllerUpdatePartnerStatusMutation } from '@tiffinwale/api';
import { useToast } from '@/hooks/use-toast';

export function UpdatePartnerButton({ partnerId }: { partnerId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateStatus = useMutation({
    ...superAdminControllerUpdatePartnerStatusMutation(),
    onSuccess: () => {
      // Auto-invalidate to refetch partners
      queryClient.invalidateQueries({ 
        queryKey: ['superAdminControllerGetAllPartners'] 
      });
      toast({ title: 'Partner updated successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const handleUpdate = () => {
    updateStatus.mutate({
      path: { id: partnerId },
      body: { status: 'active' }
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateStatus.isPending}>
      {updateStatus.isPending ? 'Updating...' : 'Activate Partner'}
    </button>
  );
}
```

---

## 📋 All Available Super Admin Hooks

### Dashboard & Analytics
- `superAdminControllerGetDashboardStatsOptions()` - Dashboard stats
- `superAdminControllerGetDashboardActivitiesOptions({ query: { limit } })` - Recent activities
- `superAdminControllerGetRevenueHistoryOptions({ query: { months } })` - Revenue history
- `superAdminControllerGetEarningsOptions({ query: { period } })` - Earnings data

### Partners
**Queries:**
- `superAdminControllerGetAllPartnersOptions({ query: { page, limit, ...filters } })` - List partners
- `superAdminControllerGetPartnerByIdOptions({ path: { id } })` - Get partner details

**Mutations:**
- `superAdminControllerUpdatePartnerStatusMutation()` - Update partner status
- `superAdminControllerUpdatePartnerMutation()` - Update partner details
- `superAdminControllerDeletePartnerMutation()` - Delete partner

### Customers
**Queries:**
- `superAdminControllerGetAllCustomersOptions({ query: { page, limit, ...filters } })` - List customers
- `superAdminControllerGetCustomerByIdOptions({ path: { id } })` - Get customer details

**Mutations:**
- `superAdminControllerUpdateCustomerStatusMutation()` - Update customer status
- `superAdminControllerUpdateCustomerMutation()` - Update customer details
- `superAdminControllerDeleteCustomerMutation()` - Delete customer

### Orders
**Queries:**
- `superAdminControllerGetAllOrdersOptions({ query: { page, limit, ...filters } })` - List orders
- `superAdminControllerGetOrderByIdOptions({ path: { id } })` - Get order details

**Mutations:**
- `superAdminControllerUpdateOrderStatusMutation()` - Update order status

### Subscriptions
**Queries:**
- `superAdminControllerGetAllSubscriptionsOptions({ query: { page, limit, ...filters } })` - List subscriptions
- `superAdminControllerGetActiveSubscriptionsOptions()` - Active subscriptions
- `superAdminControllerGetSubscriptionByIdOptions({ path: { id } })` - Get subscription details

**Mutations:**
- `superAdminControllerUpdateSubscriptionStatusMutation()` - Update subscription status

### Support Tickets
**Queries:**
- `superAdminControllerGetAllSupportTicketsOptions({ query: { page, limit, ...filters } })` - List tickets
- `superAdminControllerGetTicketByIdOptions({ path: { id } })` - Get ticket details

**Mutations:**
- `superAdminControllerUpdateTicketMutation()` - Update ticket
- `superAdminControllerUpdateTicketStatusMutation()` - Update ticket status

### Menu Management
**Queries:**
- `superAdminControllerGetAllMenuItemsOptions()` - List menu items
- `superAdminControllerGetAllMenusOptions()` - List menus
- `superAdminControllerGetMenuWithItemsOptions({ path: { id } })` - Get menu with items

**Mutations:**
- `superAdminControllerCreateMenuItemMutation()` - Create menu item
- `superAdminControllerUpdateMenuItemMutation()` - Update menu item
- `superAdminControllerDeleteMenuItemMutation()` - Delete menu item

---

## 🔄 Infinite Queries (Pagination)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { superAdminControllerGetAllPartnersInfiniteOptions } from '@tiffinwale/api';

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  ...superAdminControllerGetAllPartnersInfiniteOptions({ 
    query: { limit: 20 } 
  }),
  getNextPageParam: (lastPage, pages) => {
    // Your pagination logic
    return pages.length + 1;
  },
});
```

---

## 🛠️ Direct SDK Calls (Without Hooks)

```typescript
import { superAdminControllerGetDashboardStats } from '@tiffinwale/sdk';

// For server components or non-React contexts
const data = await superAdminControllerGetDashboardStats();
```

---

## ⚡ Key Benefits

**Before (Manual Wrapper):**
```typescript
// 243 lines of manual code
export const useGetPartners = (page, limit, filters) => {
  return useQuery({
    queryKey: ['partners', page, limit, filters],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/super-admin/partners');
      // ... manual code
    }
  });
};
```

**After (Auto-Generated):**
```typescript
// 0 lines of manual code - just import and use!
import { useQuery } from '@tanstack/react-query';
import { superAdminControllerGetAllPartnersOptions } from '@tiffinwale/api';

const { data } = useQuery(superAdminControllerGetAllPartnersOptions());
```

**Benefit:** When backend changes → just run `bun run api:generate` → everything updates automatically!

---

## 🔄 Regenerating (When Backend Changes)

```bash
# 1. Ensure backend is running
cd services/monolith_backend
bun run start:dev

# 2. Regenerate everything
cd interface/super-admin
bun run api:generate

# Done! All hooks, types, and SDK updated automatically
```

---

**Last Updated:** $(date)
**Code Maintenance:** 0 lines (100% auto-generated!)


