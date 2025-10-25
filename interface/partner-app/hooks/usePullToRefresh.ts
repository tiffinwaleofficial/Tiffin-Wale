import { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from '../store/themeStore';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  refreshing: boolean;
  onRefresh: () => void;
  refreshControl: JSX.Element;
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

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={[theme.colors.primary]} // Android
      tintColor={theme.colors.primary} // iOS
      progressBackgroundColor={theme.colors.surface} // Android
      style={{ backgroundColor: theme.colors.background }}
      enabled={enabled}
    />
  );

  return {
    refreshing,
    onRefresh: handleRefresh,
    refreshControl,
  };
};

export default usePullToRefresh;

