import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ContainerProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'md',
  style,
}) => {
  const { theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      case 'xl':
        return theme.spacing.xl;
      default:
        return theme.spacing.md;
    }
  };

  return (
    <View
      style={[
        {
          padding: getPadding(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};