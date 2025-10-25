import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../store/themeStore';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'filled' | 'outline';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

/**
 * Theme-based Input component
 * All styling comes from the theme store - no hardcoded values
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  size = 'medium',
  variant = 'outline',
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getVariantStyles = (): { container: ViewStyle; input: TextStyle } => {
    const borderColor = error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.border;

    switch (variant) {
      case 'filled':
        return {
          container: {
            backgroundColor: theme.colors.backgroundSecondary,
            borderWidth: 0,
            borderBottomWidth: 2,
            borderBottomColor: borderColor,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
      
      case 'outline':
        return {
          container: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: borderColor,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
      
      case 'default':
      default:
        return {
          container: {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: borderColor,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; input: TextStyle } => {
    const componentConfig = theme.components.input;
    
    switch (size) {
      case 'small':
        return {
          container: {
            height: componentConfig.height.small,
            borderRadius: theme.borderRadius.sm,
          },
          input: {
            fontSize: theme.typography.fontSize.sm,
            lineHeight: theme.typography.lineHeight.sm,
            paddingHorizontal: componentConfig.padding.horizontal,
            paddingVertical: componentConfig.padding.vertical,
          },
        };
      
      case 'medium':
        return {
          container: {
            height: componentConfig.height.medium,
            borderRadius: theme.borderRadius.md,
          },
          input: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
            paddingHorizontal: componentConfig.padding.horizontal,
            paddingVertical: componentConfig.padding.vertical,
          },
        };
      
      case 'large':
        return {
          container: {
            height: componentConfig.height.large,
            borderRadius: theme.borderRadius.lg,
          },
          input: {
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
            paddingHorizontal: componentConfig.padding.horizontal,
            paddingVertical: componentConfig.padding.vertical,
          },
        };
      
      default:
        return {
          container: {
            height: componentConfig.height.medium,
            borderRadius: theme.borderRadius.md,
          },
          input: {
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
            paddingHorizontal: componentConfig.padding.horizontal,
            paddingVertical: componentConfig.padding.vertical,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyleCombined: ViewStyle = {
    ...styles.container,
    ...variantStyles.container,
    ...sizeStyles.container,
    ...(disabled && { opacity: 0.6 }),
    ...containerStyle,
  };

  const inputStyleCombined: TextStyle = {
    ...styles.input,
    ...variantStyles.input,
    ...sizeStyles.input,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.regular,
    ...inputStyle,
  };

  const labelStyleCombined: TextStyle = {
    ...styles.label,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
    ...labelStyle,
  };

  const errorStyleCombined: TextStyle = {
    ...styles.error,
    color: theme.colors.error,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  };

  const hintStyleCombined: TextStyle = {
    ...styles.hint,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={labelStyleCombined}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={containerStyleCombined}>
        <TextInput
          {...textInputProps}
          style={inputStyleCombined}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.textTertiary}
        />
      </View>
      
      {error && <Text style={errorStyleCombined}>{error}</Text>}
      {hint && !error && <Text style={hintStyleCombined}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    justifyContent: 'center',
  },
  input: {
    flex: 1,
  },
  label: {
    // Styles come from theme
  },
  error: {
    // Styles come from theme
  },
  hint: {
    // Styles come from theme
  },
});

export default Input;