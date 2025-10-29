/**
 * Centralized API exports with configured client
 * 
 * ALWAYS import from @/lib/api (NOT @tiffinwale/sdk!)
 */

import { client as configuredClient } from './client';
import * as sdkFunctions from './generated/sdk.gen';

// Export the configured client
export { client as apiClient, default as client } from './client';

// Re-export ALL auto-generated React Query hooks
export * from './generated/@tanstack/react-query.gen';

// Re-export all generated types
export type * from './generated/types.gen';

// Wrapper to inject our configured client into SDK functions
const withClient = <TFunc extends (...args: any[]) => any>(fn: TFunc) => {
  return (options?: Parameters<TFunc>[0]) => {
    return fn({ ...options, client: configuredClient } as Parameters<TFunc>[0]);
  };
};

// Export ALL SDK functions with our configured client
export const authControllerLogin = withClient(sdkFunctions.authControllerLogin);
export const authControllerLogout = withClient(sdkFunctions.authControllerLogout);
export const authControllerRegisterSuperAdmin = withClient(sdkFunctions.authControllerRegisterSuperAdmin);
export const authControllerRefresh = withClient(sdkFunctions.authControllerRefresh);
export const authControllerChangePassword = withClient(sdkFunctions.authControllerChangePassword);
export const userControllerGetProfile = withClient(sdkFunctions.userControllerGetProfile);
export const superAdminControllerGetDashboardStats = withClient(sdkFunctions.superAdminControllerGetDashboardStats);
export const superAdminControllerGetDashboardActivities = withClient(sdkFunctions.superAdminControllerGetDashboardActivities);
export const superAdminControllerGetRevenueHistory = withClient(sdkFunctions.superAdminControllerGetRevenueHistory);
export const superAdminControllerGetActiveSubscriptions = withClient(sdkFunctions.superAdminControllerGetActiveSubscriptions);
export const superAdminControllerGetAllOrders = withClient(sdkFunctions.superAdminControllerGetAllOrders);
export const superAdminControllerGetAllPartners = withClient(sdkFunctions.superAdminControllerGetAllPartners);
export const superAdminControllerGetAllCustomers = withClient(sdkFunctions.superAdminControllerGetAllCustomers);
export const superAdminControllerGetAllSubscriptions = withClient(sdkFunctions.superAdminControllerGetAllSubscriptions);
export const superAdminControllerUpdateOrderStatus = withClient(sdkFunctions.superAdminControllerUpdateOrderStatus);
export const superAdminControllerUpdatePartnerStatus = withClient(sdkFunctions.superAdminControllerUpdatePartnerStatus);
export const superAdminControllerUpdateSubscriptionStatus = withClient(sdkFunctions.superAdminControllerUpdateSubscriptionStatus);

