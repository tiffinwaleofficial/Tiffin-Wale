/**
 * Central API exports
 * 
 * This file exports all API hooks and the API client instance.
 * Import from here to use the API in your components.
 * 
 * Example usage:
 * ```tsx
 * import { useGetOrders, useCreateOrder, api } from '@/api';
 * 
 * const { data: orders, isLoading } = useGetOrders();
 * const createOrder = useCreateOrder();
 * ```
 */

// Export all hooks
export * from './hooks/useApi';

// Export API types
export * from './generated/api';

// Export the API client instance (for direct API calls if needed)
export { api as default } from './hooks/useApi';

