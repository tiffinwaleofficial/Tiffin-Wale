import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'numeric' | 'phone';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
}) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'numeric':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const getSecureTextEntry = () => {
    return type === 'password' && !showPassword;
  };

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text variant="label" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Text>
      )}
      
      <View style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: error ? theme.colors.error : theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: multiline ? theme.spacing.md : theme.spacing.sm,
        minHeight: multiline ? 80 : 48,
      }}>
        {leftIcon && (
          <Text style={{ marginRight: theme.spacing.sm, fontSize: 16 }}>
            {leftIcon}
          </Text>
        )}
        
        <TextInput
          style={[{
            flex: 1,
            fontSize: theme.typography.fontSize.md,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.text,
            textAlignVertical: multiline ? 'top' : 'center',
          }, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={getKeyboardType()}
          secureTextEntry={getSecureTextEntry()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          autoCorrect={type !== 'email'}
        />
        
        {type === 'password' && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: theme.spacing.xs }}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && type !== 'password' && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ padding: theme.spacing.xs }}
            disabled={!onRightIconPress}
          >
            <Text style={{ fontSize: 16 }}>
              {rightIcon}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text variant="error" style={{ marginTop: theme.spacing.xs }}>
          {error}
        </Text>
      )}
    </View>
  );
};