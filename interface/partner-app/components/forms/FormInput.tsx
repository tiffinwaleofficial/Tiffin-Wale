import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Input from '../ui/Input';
import Text from '../ui/Text';

export interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'password' | 'email' | 'number' | 'phone';
  variant?: 'default' | 'error' | 'success';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  theme?: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  variant = 'default',
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  error,
  helperText,
  required = false,
  style,
  inputStyle,
  theme: customTheme,
}: FormInputProps) => {
  const { theme } = useTheme();

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  const getVariant = () => {
    if (error) return 'error';
    return variant;
  };

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text 
          variant="label" 
          style={{ 
            marginBottom: 8,
            color: error ? theme.colors.error : theme.colors.text,
          }}
        >
          {getLabelText()}
        </Text>
      )}
      
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        type={type}
        variant={getVariant()}
        disabled={disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        error={error}
        helperText={helperText}
        style={inputStyle}
        theme={customTheme}
      />
    </View>
  );
};

export default FormInput;


