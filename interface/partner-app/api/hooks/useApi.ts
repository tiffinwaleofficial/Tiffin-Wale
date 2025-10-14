import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { Api } from '../generated/api';
import { customInstance } from '../custom-instance';
import { envConfig } from '../../config/env';

// Initialize API client with custom instance
const api = new Api({
  baseURL: envConfig.apiBaseUrl,
  // Use custom axios instance for requests
  instance: customInstance as any,
});

// Export the API client for direct usage
export { api };

// ==========================================
// AUTH HOOKS
// ==========================================

export const useLogin = (options?: UseMutationOptions<any, any, { email: string; password: string }>) => {
  return useMutation({
    mutationFn: (data) => api.api.authControllerLogin(data),
    ...options,
  });
};

export const useRegister = (options?: UseMutationOptions<any, any, any>) => {
  return useMutation({
    mutationFn: (data) => api.api.authControllerRegister(data),
    ...options,
  });
};

export const useChangePassword = (options?: UseMutationOptions<any, any, any>) => {
  return useMutation({
    mutationFn: (data) => api.api.authControllerChangePassword(data),
    ...options,
  });
};

// ==========================================
// USER HOOKS
// ==========================================

export const useGetProfile = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => api.api.usersControllerGetProfile(),
    ...options,
  });
};

export const useUpdateProfile = (options?: UseMutationOptions<any, any, any>) => {
  return useMutation({
    mutationFn: (data) => api.api.usersControllerUpdateProfile(data),
    ...options,
  });
};

// ==========================================
// ORDER HOOKS
// ==========================================

export const useGetOrders = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.api.orderControllerFindAll(),
    ...options,
  });
};

export const useGetOrder = (id: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.api.orderControllerFindOne(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateOrder = (options?: UseMutationOptions<any, any, any>) => {
  return useMutation({
    mutationFn: (data) => api.api.orderControllerCreate(data),
    ...options,
  });
};

export const useUpdateOrder = (options?: UseMutationOptions<any, any, { id: string; data: any }>) => {
  return useMutation({
    mutationFn: ({ id, data }) => api.api.orderControllerUpdate(id, data),
    ...options,
  });
};

export const useCancelOrder = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (id) => api.api.orderControllerRemove(id),
    ...options,
  });
};

// ==========================================
// MENU HOOKS
// ==========================================

export const useGetMenus = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: () => api.api.menuControllerFindAll(),
    ...options,
  });
};

export const useGetMenu = (id: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['menu', id],
    queryFn: () => api.api.menuControllerFindOne(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateMenu = (options?: UseMutationOptions<any, any, any>) => {
  return useMutation({
    mutationFn: (data) => api.api.menuControllerCreate(data),
    ...options,
  });
};

export const useUpdateMenu = (options?: UseMutationOptions<any, any, { id: string; data: any }>) => {
  return useMutation({
    mutationFn: ({ id, data }) => api.api.menuControllerUpdate(id, data),
    ...options,
  });
};

export const useDeleteMenu = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (id) => api.api.menuControllerRemove(id),
    ...options,
  });
};

// ==========================================
// PARTNER HOOKS
// ==========================================

export const useGetPartner = (id: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: () => api.api.partnerControllerFindOne(id),
    enabled: !!id,
    ...options,
  });
};

export const useUpdatePartner = (options?: UseMutationOptions<any, any, { id: string; data: any }>) => {
  return useMutation({
    mutationFn: ({ id, data }) => api.api.partnerControllerUpdate(id, data),
    ...options,
  });
};

// ==========================================
// REVIEW HOOKS
// ==========================================

export const useGetRestaurantReviews = (restaurantId: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['reviews', 'restaurant', restaurantId],
    queryFn: () => api.api.reviewControllerGetRestaurantReviews(restaurantId),
    enabled: !!restaurantId,
    ...options,
  });
};

export const useCreateReview = (options?: UseMutationOptions<any, any, { restaurantId: string; data: any }>) => {
  return useMutation({
    mutationFn: ({ restaurantId, data }) => api.api.reviewControllerCreateRestaurantReview(restaurantId, data),
    ...options,
  });
};

// Add more hooks as needed for other endpoints...

export default api;

