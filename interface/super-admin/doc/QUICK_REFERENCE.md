# 🚀 Quick Reference - Auto-Generated API

## One-Line Summary
**Zero manual code** - Just import and use auto-generated hooks from `@tiffinwale/api`

---

## 📦 Import Pattern

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  superAdminControllerGetAllPartnersOptions,
  superAdminControllerUpdatePartnerStatusMutation 
} from '@tiffinwale/api';
```

---

## 🔄 Common Patterns

### GET (Query)
```typescript
const { data, isLoading, error, refetch } = useQuery(
  superAdminControllerGetAllPartnersOptions({ 
    query: { page, limit, status: 'active' } 
  })
);
```

### PATCH/POST/DELETE (Mutation)
```typescript
const queryClient = useQueryClient();

const updateStatus = useMutation({
  ...superAdminControllerUpdatePartnerStatusMutation(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['superAdminControllerGetAllPartners'] });
    toast({ title: 'Success!' });
  },
  onError: (err: any) => {
    toast({ title: 'Error', description: err.message, variant: 'destructive' });
  },
});

// Call it
updateStatus.mutate({
  path: { id: '123' },
  body: { status: 'active' }
});

// Check state
if (updateStatus.isPending) { /* show spinner */ }
```

---

## 📋 All Super Admin Hooks

| Endpoint | Hook | Parameters |
|----------|------|------------|
| Dashboard Stats | `superAdminControllerGetDashboardStatsOptions()` | - |
| Dashboard Activities | `superAdminControllerGetDashboardActivitiesOptions()` | `{ query: { limit } }` |
| Revenue History | `superAdminControllerGetRevenueHistoryOptions()` | `{ query: { months } }` |
| Partners List | `superAdminControllerGetAllPartnersOptions()` | `{ query: { page, limit } }` |
| Update Partner Status | `superAdminControllerUpdatePartnerStatusMutation()` | `{ path: { id }, body: { status } }` |
| Customers List | `superAdminControllerGetAllCustomersOptions()` | `{ query: { page, limit } }` |
| Orders List | `superAdminControllerGetAllOrdersOptions()` | `{ query: { page, limit } }` |
| Update Order Status | `superAdminControllerUpdateOrderStatusMutation()` | `{ path: { id }, body: { status } }` |
| Subscriptions List | `superAdminControllerGetAllSubscriptionsOptions()` | `{ query: { page, limit } }` |
| Active Subscriptions | `superAdminControllerGetActiveSubscriptionsOptions()` | - |
| Update Subscription | `superAdminControllerUpdateSubscriptionStatusMutation()` | `{ path: { id }, body: { status } }` |

---

## 🔄 Regenerate Types (When Backend Changes)

```bash
# One command does everything:
bun run api:generate

# Output:
# ✅ All types updated
# ✅ All hooks updated
# ✅ All SDK functions updated
```

---

## 🎯 Pro Tips

1. **Use useMemo for derived data:**
```typescript
const partners = useMemo(() => (data as any)?.partners || [], [data]);
```

2. **Invalidate queries after mutations:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['superAdminControllerGetAllPartners'] });
}
```

3. **Handle loading states:**
```typescript
if (isLoading) return <Skeleton />;
if (error) return <div>Error: {error.message}</div>;
```

4. **Optimistic updates:**
```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['partners'] });
  const previous = queryClient.getQueryData(['partners']);
  queryClient.setQueryData(['partners'], newData);
  return { previous };
},
onError: (err, variables, context) => {
  queryClient.setQueryData(['partners'], context?.previous);
},
```

---

## 📁 Files You'll Touch

**ONLY 2 files for 99% of work:**
1. Import hooks from `@tiffinwale/api`
2. Use them in your components

**Rarely edit:**
- `src/lib/api/client.ts` - Only if changing auth logic

**Never edit:**
- `src/lib/api/generated/*` - Auto-generated!

---

**Happy Coding!** 🎉


