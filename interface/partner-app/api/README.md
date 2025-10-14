# 🚀 API Client Documentation

## ✅ Successfully Generated with `swagger-typescript-api`

Your API client has been **successfully generated** from your backend Swagger/OpenAPI specification!

---

## 📦 What Was Generated?

1. **`api/generated/api.ts`** - Complete TypeScript client with all API methods
2. **`api/hooks/useApi.ts`** - React Query hooks for easy data fetching
3. **`api/index.ts`** - Central export file for clean imports

---

## 🎯 How to Use (Just Like Orval!)

### 1. Basic Usage - Query Data (GET)

```tsx
import { useGetOrders, useGetMenu } from '@/api';

function OrdersScreen() {
  // Fetch orders with React Query
  const { data: orders, isLoading, error, refetch } = useGetOrders();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState error={error} />;

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderCard order={item} />}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

### 2. Mutations - Create/Update/Delete

```tsx
import { useCreateOrder, useUpdateOrder } from '@/api';
import { useMutation } from '@tanstack/react-query';

function CreateOrderScreen() {
  // Create order mutation
  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created:', data);
      // Navigate or show success message
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });

  const handleSubmit = async (orderData) => {
    await createOrder.mutate(orderData);
  };

  return (
    <Button
      title="Place Order"
      onPress={handleSubmit}
      loading={createOrder.isPending}
    />
  );
}
```

### 3. Update with ID

```tsx
import { useUpdateOrder, useDeleteMenu } from '@/api';

function OrderDetailsScreen({ orderId }) {
  const updateOrder = useUpdateOrder({
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries(['orders']);
    },
  });

  const handleUpdateStatus = (status) => {
    updateOrder.mutate({
      id: orderId,
      data: { status },
    });
  };

  return (
    <Button
      title="Mark as Delivered"
      onPress={() => handleUpdateStatus('delivered')}
      loading={updateOrder.isPending}
    />
  );
}
```

### 4. Dynamic Queries with Parameters

```tsx
import { useGetOrder, useGetRestaurantReviews } from '@/api';

function OrderDetailsScreen({ orderId }) {
  // Query will only run when orderId is available
  const { data: order, isLoading } = useGetOrder(orderId);

  return (
    <Screen>
      {isLoading ? <Skeleton /> : <OrderDetails order={order} />}
    </Screen>
  );
}
```

### 5. Direct API Calls (Advanced)

```tsx
import api from '@/api';

// For one-off API calls outside React components
async function uploadImage(file) {
  try {
    const response = await api.api.uploadControllerUpload({ file });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

---

## 🔄 Available Hooks

### Auth Hooks
- `useLogin()` - Login user
- `useRegister()` - Register new user
- `useChangePassword()` - Change user password

### User Hooks
- `useGetProfile()` - Get current user profile
- `useUpdateProfile()` - Update user profile

### Order Hooks
- `useGetOrders()` - Get all orders
- `useGetOrder(id)` - Get single order by ID
- `useCreateOrder()` - Create new order
- `useUpdateOrder()` - Update existing order
- `useCancelOrder()` - Cancel order

### Menu Hooks
- `useGetMenus()` - Get all menus
- `useGetMenu(id)` - Get single menu by ID
- `useCreateMenu()` - Create new menu
- `useUpdateMenu()` - Update existing menu
- `useDeleteMenu()` - Delete menu

### Partner Hooks
- `useGetPartner(id)` - Get partner details
- `useUpdatePartner()` - Update partner information

### Review Hooks
- `useGetRestaurantReviews(restaurantId)` - Get restaurant reviews
- `useCreateReview()` - Create new review

---

## 🔧 Advanced Configuration

### Query Options

```tsx
const { data } = useGetOrders({
  // Refetch every 30 seconds
  refetchInterval: 30000,
  
  // Only fetch once
  staleTime: Infinity,
  
  // Retry 3 times on failure
  retry: 3,
  
  // Enable/disable query
  enabled: true,
});
```

### Mutation Options

```tsx
const updateOrder = useUpdateOrder({
  onSuccess: (data, variables, context) => {
    // Called on success
  },
  onError: (error, variables, context) => {
    // Called on error
  },
  onSettled: (data, error, variables, context) => {
    // Called on both success and error
  },
});
```

---

## 🔄 Regenerate API Client

When your backend API changes, regenerate the client:

```bash
# Generate API client from backend
bun run api:generate

# Or watch for changes (if backend updates)
bun run api:watch
```

**Note:** Make sure your backend is running on `http://localhost:3001` before generating!

---

## 📝 TypeScript Support

All API methods are **fully typed**! You get:

✅ Auto-completion for all API methods  
✅ Type-safe request/response data  
✅ Error type checking  
✅ IDE IntelliSense support  

```tsx
// TypeScript knows the exact shape of the data!
const { data } = useGetOrders(); // data is typed as Order[]
```

---

## 🎨 Integration with Components

```tsx
import { useGetOrders } from '@/api';
import { OrderCard, Loader, ErrorState } from '@/components';

export default function OrdersScreen() {
  const { data: orders, isLoading, error, refetch } = useGetOrders();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState error={error} />;

  return (
    <Screen>
      <ScrollView refreshing={isLoading} onRefresh={refetch}>
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </Screen>
  );
}
```

---

## ✨ Benefits Over Manual API Calls

✅ **Auto-generated** - No manual typing needed  
✅ **Type-safe** - Full TypeScript support  
✅ **React Query** - Caching, refetching, loading states  
✅ **Error handling** - Built-in error states  
✅ **Auto-refresh** - Token refresh handled automatically  
✅ **Consistent** - Same pattern across all endpoints  

---

## 🚨 Important Notes

1. **Backend must be running** to generate the API client
2. **Regenerate after backend changes** to get latest endpoints
3. **Authentication tokens** are handled automatically by `custom-instance.ts`
4. All hooks use **React Query** for state management

---

## 🎉 Success!

Your API client is ready to use! Import hooks and start fetching data just like with Orval!

```tsx
import { useGetOrders, useCreateOrder, useLogin } from '@/api';
```

Happy coding! 🚀

