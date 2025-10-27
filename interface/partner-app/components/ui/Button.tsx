import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

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
 * Button component with hardcoded theme values
 * Matches the styling pattern used in otp-verification and welcome screens
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; loadingColor: string } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: disabled ? '#CCC' : '#FF9B42',
            borderWidth: 0,
          },
          text: {
            color: '#FFF',
            fontFamily: 'Poppins-SemiBold',
          },
          loadingColor: '#FFF',
        };
      
      case 'secondary':
        return {
          container: {
            backgroundColor: disabled ? '#CCC' : '#10B981',
            borderWidth: 0,
          },
          text: {
            color: '#FFF',
            fontFamily: 'Poppins-SemiBold',
          },
          loadingColor: '#FFF',
        };
      
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: disabled ? '#CCC' : '#FF9B42',
          },
          text: {
            color: disabled ? '#999' : '#FF9B42',
            fontFamily: 'Poppins-Medium',
          },
          loadingColor: disabled ? '#999' : '#FF9B42',
        };
      
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: disabled ? '#999' : '#FF9B42',
            fontFamily: 'Poppins-Medium',
          },
          loadingColor: disabled ? '#999' : '#FF9B42',
        };
      
      case 'danger':
        return {
          container: {
            backgroundColor: disabled ? '#CCC' : '#EF4444',
            borderWidth: 0,
          },
          text: {
            color: '#FFF',
            fontFamily: 'Poppins-SemiBold',
          },
          loadingColor: '#FFF',
        };
      
      default:
        return {
          container: {
            backgroundColor: disabled ? '#CCC' : '#FF9B42',
            borderWidth: 0,
          },
          text: {
            color: '#FFF',
            fontFamily: 'Poppins-SemiBold',
          },
          loadingColor: '#FFF',
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: {
            height: 32,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
          },
          text: {
            fontSize: 14,
            lineHeight: 20,
          },
        };
      
      case 'medium':
        return {
          container: {
            height: 44,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          },
          text: {
            fontSize: 16,
            lineHeight: 22,
          },
        };
      
      case 'large':
        return {
          container: {
            height: 52,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 16,
          },
          text: {
            fontSize: 18,
            lineHeight: 24,
          },
        };
      
      default:
        return {
          container: {
            height: 44,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          },
          text: {
            fontSize: 16,
            lineHeight: 22,
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
          color={variantStyles.loadingColor}
        />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

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
