/**
 * 🎯 EXAMPLE: How to Use the Generated API Client
 * 
 * This file shows real-world examples of using the API hooks in your components.
 * Copy these patterns to your actual screens!
 */

import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { 
  useGetOrders, 
  useGetOrder,
  useUpdateOrder, 
  useCreateOrder,
  useLogin,
  useGetProfile 
} from '@/api';
import { Button, Text, Loader, ErrorState, OrderCard, Screen } from '@/components';

// ==========================================
// EXAMPLE 1: Fetch and Display Orders
// ==========================================

export function OrdersListExample() {
  const { data: orders, isLoading, error, refetch } = useGetOrders();

  if (isLoading) return <Loader />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Screen>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </Screen>
  );
}

// ==========================================
// EXAMPLE 2: Fetch Single Order with ID
// ==========================================

export function OrderDetailsExample({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useGetOrder(orderId);

  if (isLoading) return <Loader />;
  if (error) return <ErrorState error={error} />;
  if (!order) return <EmptyState message="Order not found" />;

  return (
    <Screen>
      <Text variant="title">Order #{order.orderNumber}</Text>
      <Text>Status: {order.status}</Text>
      <Text>Total: ${order.totalAmount}</Text>
    </Screen>
  );
}

// ==========================================
// EXAMPLE 3: Create Order (Mutation)
// ==========================================

export function CreateOrderExample() {
  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created successfully!', data);
      // Navigate to order details or show success message
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      // Show error toast
    },
  });

  const handleCreateOrder = () => {
    createOrder.mutate({
      customerId: '123',
      items: [
        { menuItemId: 'item1', quantity: 2 },
        { menuItemId: 'item2', quantity: 1 },
      ],
      deliveryAddress: '123 Main St',
    });
  };

  return (
    <Screen>
      <Button
        title="Place Order"
        onPress={handleCreateOrder}
        loading={createOrder.isPending}
        disabled={createOrder.isPending}
      />
    </Screen>
  );
}

// ==========================================
// EXAMPLE 4: Update Order Status
// ==========================================

export function UpdateOrderStatusExample({ orderId }: { orderId: string }) {
  const updateOrder = useUpdateOrder({
    onSuccess: () => {
      console.log('Order updated!');
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', orderId]);
    },
  });

  const handleUpdateStatus = (status: string) => {
    updateOrder.mutate({
      id: orderId,
      data: { status },
    });
  };

  return (
    <View>
      <Button
        title="Mark as Preparing"
        onPress={() => handleUpdateStatus('preparing')}
        loading={updateOrder.isPending}
      />
      <Button
        title="Mark as Ready"
        onPress={() => handleUpdateStatus('ready')}
        loading={updateOrder.isPending}
      />
      <Button
        title="Mark as Delivered"
        onPress={() => handleUpdateStatus('delivered')}
        loading={updateOrder.isPending}
      />
    </View>
  );
}

// ==========================================
// EXAMPLE 5: Login Form
// ==========================================

export function LoginExample() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const login = useLogin({
    onSuccess: (response) => {
      // Store tokens
      AsyncStorage.setItem('partner_auth_token', response.data.accessToken);
      AsyncStorage.setItem('partner_refresh_token', response.data.refreshToken);
      
      // Navigate to dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      // Show error message
      console.error('Login failed:', error);
    },
  });

  const handleLogin = () => {
    login.mutate({ email, password });
  };

  return (
    <Screen>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        type="email"
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        type="password"
      />
      <Button
        title="Login"
        onPress={handleLogin}
        loading={login.isPending}
        disabled={!email || !password || login.isPending}
      />
    </Screen>
  );
}

// ==========================================
// EXAMPLE 6: User Profile with Auto-Fetch
// ==========================================

export function ProfileExample() {
  const { data: profile, isLoading, error, refetch } = useGetProfile({
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <Screen>
      <Avatar source={profile?.avatar} name={profile?.name} size="xl" />
      <Text variant="title">{profile?.name}</Text>
      <Text variant="body">{profile?.email}</Text>
      <Text variant="body">{profile?.phone}</Text>
    </Screen>
  );
}

// ==========================================
// EXAMPLE 7: Conditional Query (Only fetch when needed)
// ==========================================

export function ConditionalFetchExample({ shouldFetch }: { shouldFetch: boolean }) {
  const { data, isLoading } = useGetOrders({
    // Only fetch when shouldFetch is true
    enabled: shouldFetch,
  });

  if (!shouldFetch) {
    return <Text>Enable fetching to see orders</Text>;
  }

  if (isLoading) return <Loader />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

// ==========================================
// EXAMPLE 8: Multiple Queries in One Component
// ==========================================

export function DashboardExample() {
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: menus, isLoading: menusLoading } = useGetMenus();

  const isLoading = ordersLoading || profileLoading || menusLoading;

  if (isLoading) return <Loader />;

  return (
    <Screen>
      <Text variant="title">Welcome, {profile?.name}!</Text>
      <Text>Total Orders: {orders?.length}</Text>
      <Text>Total Menus: {menus?.length}</Text>
    </Screen>
  );
}

// ==========================================
// EXAMPLE 9: Optimistic Updates
// ==========================================

export function OptimisticUpdateExample({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();

  const updateOrder = useUpdateOrder({
    // Update UI immediately before server responds
    onMutate: async (newOrder) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['order', orderId]);

      // Snapshot previous value
      const previousOrder = queryClient.getQueryData(['order', orderId]);

      // Optimistically update
      queryClient.setQueryData(['order', orderId], newOrder);

      // Return context with previous value
      return { previousOrder };
    },
    // If mutation fails, rollback
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(['order', orderId], context.previousOrder);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries(['order', orderId]);
    },
  });

  return (
    <Button
      title="Update Order"
      onPress={() => updateOrder.mutate({ id: orderId, data: { status: 'delivered' } })}
    />
  );
}

// ==========================================
// 🎯 KEY TAKEAWAYS
// ==========================================

/**
 * 1. Import hooks from '@/api'
 * 2. Use hooks in your components
 * 3. Handle loading, error, and success states
 * 4. Mutations (create/update/delete) use .mutate()
 * 5. Queries (get) return { data, isLoading, error }
 * 6. All hooks are fully typed - use TypeScript autocomplete!
 * 7. React Query handles caching, refetching, and state management
 * 
 * That's it! You have a complete, type-safe API client! 🚀
 */

