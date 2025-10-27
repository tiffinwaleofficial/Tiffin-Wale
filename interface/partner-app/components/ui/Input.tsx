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
 * Input component with hardcoded theme values
 * Matches the styling pattern used in otp-verification and welcome screens
 */
export default function Input({
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
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? '#EF4444' : isFocused ? '#FF9B42' : '#E5E7EB';

  // Get container styles based on size and variant
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: size === 'small' ? 36 : size === 'large' ? 52 : 44,
      borderRadius: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      borderWidth: 1,
      borderColor,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };

    // Variant-specific styles
    if (variant === 'filled') {
      return {
        ...baseStyle,
        borderWidth: 0,
        borderBottomWidth: 2,
        backgroundColor: '#F9FAFB',
      };
    }

    return baseStyle;
  };

  // Get input styles based on size
  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      lineHeight: size === 'small' ? 20 : size === 'large' ? 26 : 22,
      paddingHorizontal: 12,
      paddingVertical: 8,
      color: '#1A1A1A',
      fontFamily: 'Poppins-Regular',
    };
  };

  const containerStyleCombined: ViewStyle = {
    ...getContainerStyle(),
    ...containerStyle,
  };

  const inputStyleCombined: TextStyle = {
    ...getInputStyle(),
    ...inputStyle,
  };

  const labelStyleCombined: TextStyle = {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1A1A1A',
    marginBottom: 8,
    ...labelStyle,
  };

  const errorStyleCombined: TextStyle = {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginTop: 4,
  };

  const hintStyleCombined: TextStyle = {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 4,
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={labelStyleCombined}>
          {label}
          {required && <Text style={styles.requiredMark}> *</Text>}
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
          placeholderTextColor="#9CA3AF"
        />
      </View>
      
      {error && <Text style={errorStyleCombined}>{error}</Text>}
      {hint && !error && <Text style={hintStyleCombined}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  requiredMark: {
    color: '#EF4444',
  },
});
