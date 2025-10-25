import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../store/themeStore';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardShadow = 'none' | 'small' | 'medium' | 'large' | 'xl';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  shadow?: CardShadow;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * Theme-based Card component
 * All styling comes from the theme store - no hardcoded values
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  shadow = 'small',
  onPress,
  style,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
          ...theme.shadows.medium,
        };
      
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.none,
        };
      
      case 'filled':
        return {
          backgroundColor: theme.colors.backgroundSecondary,
          borderWidth: 0,
          ...theme.shadows.none,
        };
      
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 0,
          ...theme.shadows[shadow],
        };
    }
  };

  const cardStyle: ViewStyle = {
    ...styles.baseCard,
    ...getVariantStyles(),
    padding: theme.components.card.padding,
    margin: theme.components.card.margin,
    borderRadius: theme.borderRadius.lg,
    ...(disabled && { opacity: 0.6 }),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    // Base styles - everything else comes from theme
  },
});

export default Card;

