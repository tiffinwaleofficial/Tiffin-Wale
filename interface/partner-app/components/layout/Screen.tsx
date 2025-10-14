import React from 'react';
import { View, ViewStyle, StatusBar } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  backgroundColor,
  style,
  statusBarStyle,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle || (theme.isDark ? 'light-content' : 'dark-content')}
        backgroundColor={backgroundColor || theme.colors.background}
      />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: backgroundColor || theme.colors.background,
          },
          style,
        ]}
      >
        {children}
      </View>
    </>
  );
};