import { useState, useCallback } from 'react';
import { useTheme } from '../store/themeStore';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  refreshing: boolean;
  onRefresh: () => void;
  refreshControlProps: {
    refreshing: boolean;
    onRefresh: () => void;
    colors: string[];
    tintColor: string;
    progressBackgroundColor: string;
    enabled: boolean;
  };
}

/**
 * Universal pull-to-refresh hook for all screens
 * Provides consistent refresh behavior across the app
 */
export const usePullToRefresh = ({
  onRefresh,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn => {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  const handleRefresh = useCallback(async () => {
    if (!enabled || refreshing) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('❌ Pull-to-refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, enabled, refreshing]);

  const refreshControlProps = {
    refreshing,
    onRefresh: handleRefresh,
    colors: [theme.colors.primary], // Android
    tintColor: theme.colors.primary, // iOS
    progressBackgroundColor: theme.colors.surface, // Android
    enabled,
  };

  return {
    refreshing,
    onRefresh: handleRefresh,
    refreshControlProps,
  };
};

export default usePullToRefresh;

