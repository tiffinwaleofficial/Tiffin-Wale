import React from 'react';
import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { useTheme } from '../store/themeStore';

interface RefreshableScreenProps extends Omit<ScrollViewProps, 'refreshControl'> {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  enabled?: boolean;
  containerStyle?: ViewStyle;
  scrollEnabled?: boolean;
}

/**
 * Universal RefreshableScreen wrapper component
 * Provides consistent pull-to-refresh functionality across all screens
 */
export const RefreshableScreen: React.FC<RefreshableScreenProps> = ({
  onRefresh,
  children,
  enabled = true,
  containerStyle,
  scrollEnabled = true,
  style,
  ...scrollViewProps
}) => {
  const { theme } = useTheme();
  const { refreshControl } = usePullToRefresh({ onRefresh, enabled });

  const defaultContainerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const defaultScrollViewStyle: ViewStyle = {
    flex: 1,
  };

  if (!scrollEnabled) {
    // For screens that don't need scrolling but still want pull-to-refresh
    return (
      <ScrollView
        style={[defaultScrollViewStyle, style]}
        contentContainerStyle={[defaultContainerStyle, containerStyle]}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
        {...scrollViewProps}
      >
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[defaultScrollViewStyle, style]}
      contentContainerStyle={containerStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      bounces={true}
      alwaysBounceVertical={true}
      {...scrollViewProps}
    >
      <View style={defaultContainerStyle}>
        {children}
      </View>
    </ScrollView>
  );
};

export default RefreshableScreen;

