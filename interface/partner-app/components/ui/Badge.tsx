import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
  theme: customTheme,
}: BadgeProps) => {
  const { theme } = useTheme();

  const getBadgeStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      alignSelf: 'flex-start',
      borderRadius: 12, // Match existing design
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingHorizontal: 6,
        paddingVertical: 2,
      },
      md: {
        paddingHorizontal: 8,
        paddingVertical: 4,
      },
      lg: {
        paddingHorizontal: 10,
        paddingVertical: 6,
      },
    };

    // Variant styles - matching existing status colors
    const variantStyles: Record<string, ViewStyle> = {
      success: {
        backgroundColor: customTheme?.backgroundColor || '#DCFCE7',
      },
      warning: {
        backgroundColor: customTheme?.backgroundColor || '#FEF3C7',
      },
      error: {
        backgroundColor: customTheme?.backgroundColor || '#FEE2E2',
      },
      info: {
        backgroundColor: customTheme?.backgroundColor || '#EBF5FF',
      },
      default: {
        backgroundColor: customTheme?.backgroundColor || '#F3F4F6',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      sm: {
        fontSize: 10,
      },
      md: {
        fontSize: 12,
      },
      lg: {
        fontSize: 14,
      },
    };

    // Variant text styles - matching existing design
    const variantTextStyles: Record<string, TextStyle> = {
      success: {
        color: customTheme?.textColor || '#10B981',
      },
      warning: {
        color: customTheme?.textColor || '#F59E0B',
      },
      error: {
        color: customTheme?.textColor || '#EF4444',
      },
      info: {
        color: customTheme?.textColor || '#3B82F6',
      },
      default: {
        color: customTheme?.textColor || '#6B7280',
      },
    };

    return {
      ...baseStyles,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  return (
    <View style={getBadgeStyles()}>
      <Text style={getTextStyles()}>
        {children}
      </Text>
    </View>
  );
};

export default Badge;

