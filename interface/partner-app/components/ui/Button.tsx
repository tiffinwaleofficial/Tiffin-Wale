import React from 'react';
import { TouchableOpacity, Text as RNText, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    };

    // Size variations
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = theme.spacing.sm;
        baseStyle.paddingVertical = theme.spacing.xs;
        break;
      case 'lg':
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.paddingVertical = theme.spacing.md;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? theme.colors.primaryLight : theme.colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled ? theme.colors.secondaryLight : theme.colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled ? theme.colors.border : theme.colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.md,
    };

    // Size variations
    switch (size) {
      case 'sm':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        break;
      case 'lg':
        baseStyle.fontSize = theme.typography.fontSize.lg;
        break;
    }

    // Variant text colors
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.color = theme.colors.white;
        break;
      case 'outline':
      case 'ghost':
        baseStyle.color = disabled ? theme.colors.textTertiary : theme.colors.primary;
        break;
    }

    if (disabled) {
      baseStyle.color = theme.colors.textTertiary;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.white}
          style={{ marginRight: theme.spacing.xs }}
        />
      )}
      <RNText style={[getTextStyle(), textStyle]}>
        {title}
      </RNText>
    </TouchableOpacity>
  );
};