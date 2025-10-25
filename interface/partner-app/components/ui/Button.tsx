import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../store/themeStore';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

/**
 * Theme-based Button component
 * All styling comes from the theme store - no hardcoded values
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.white,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        };
      
      case 'secondary':
        return {
          container: {
            backgroundColor: disabled ? theme.colors.border : theme.colors.secondary,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.white,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        };
      
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: disabled ? theme.colors.border : theme.colors.primary,
          },
          text: {
            color: disabled ? theme.colors.textTertiary : theme.colors.primary,
            fontFamily: theme.typography.fontFamily.medium,
          },
        };
      
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: disabled ? theme.colors.textTertiary : theme.colors.primary,
            fontFamily: theme.typography.fontFamily.medium,
          },
        };
      
      case 'danger':
        return {
          container: {
            backgroundColor: disabled ? theme.colors.border : theme.colors.error,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.white,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        };
      
      default:
        return {
          container: {
            backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.white,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    const componentConfig = theme.components.button;
    
    switch (size) {
      case 'small':
        return {
          container: {
            height: componentConfig.height.small,
            paddingHorizontal: componentConfig.padding.small.horizontal,
            paddingVertical: componentConfig.padding.small.vertical,
            borderRadius: theme.borderRadius.sm,
          },
          text: {
            fontSize: theme.typography.fontSize.sm,
            lineHeight: theme.typography.lineHeight.sm,
          },
        };
      
      case 'medium':
        return {
          container: {
            height: componentConfig.height.medium,
            paddingHorizontal: componentConfig.padding.medium.horizontal,
            paddingVertical: componentConfig.padding.medium.vertical,
            borderRadius: theme.borderRadius.md,
          },
          text: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          },
        };
      
      case 'large':
        return {
          container: {
            height: componentConfig.height.large,
            paddingHorizontal: componentConfig.padding.large.horizontal,
            paddingVertical: componentConfig.padding.large.vertical,
            borderRadius: theme.borderRadius.lg,
          },
          text: {
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
          },
        };
      
      default:
        return {
          container: {
            height: componentConfig.height.medium,
            paddingHorizontal: componentConfig.padding.medium.horizontal,
            paddingVertical: componentConfig.padding.medium.vertical,
            borderRadius: theme.borderRadius.md,
          },
          text: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle: ViewStyle = {
    ...styles.baseContainer,
    ...variantStyles.container,
    ...sizeStyles.container,
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { opacity: 0.6 }),
    ...style,
  };

  const textStyleCombined: TextStyle = {
    ...styles.baseText,
    ...variantStyles.text,
    ...sizeStyles.text,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
        />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  baseText: {
    textAlign: 'center',
  },
});

export default Button;