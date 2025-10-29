/**
 * Centralized API exports - 100% Auto-Generated!
 * 
 * Import from @/lib/api or @tiffinwale/api
 */

// Export the configured client (with Firebase auth)
export { client as apiClient, default as client } from './client';

// Re-export ALL auto-generated React Query hooks
export * from './generated/@tanstack/react-query.gen';

// Re-export all generated types
export type * from './generated/types.gen';

// Re-export SDK functions (for direct API calls without hooks)
export * from './generated/sdk.gen';

