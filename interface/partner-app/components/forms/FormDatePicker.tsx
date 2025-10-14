import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface FormDatePickerProps {
  label?: string;
  placeholder?: string;
  value: Date | null;
  onSelect: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  disabled?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  style?: ViewStyle;
  theme?: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  placeholder = 'Select date',
  value,
  onSelect,
  mode = 'date',
  disabled = false,
  error,
  helperText,
  required = false,
  style,
  theme: customTheme,
}: FormDatePickerProps) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    if (mode === 'time') {
      return value.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }

    if (mode === 'datetime') {
      return value.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return value.toLocaleDateString('en-US', options);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    return customTheme?.borderColor || theme.colors.border;
  };

  const handleDatePress = () => {
    if (disabled) return;
    
    // For now, we'll use a simple date selection
    // In a real app, you'd use a proper date picker library
    const newDate = new Date();
    onSelect(newDate);
  };

  const pickerStyles: ViewStyle = {
    borderWidth: 1,
    borderColor: getBorderColor(),
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  return (
    <View style={{ marginBottom: 16 }}>
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

      <TouchableOpacity
        style={pickerStyles}
        onPress={handleDatePress}
        disabled={disabled}
      >
        <Text
          style={{
            flex: 1,
            color: value ? theme.colors.text : theme.colors.textTertiary,
          }}
        >
          {getDisplayValue()}
        </Text>
        <Icon
          name="settings"
          size={16}
          color={theme.colors.textTertiary}
        />
      </TouchableOpacity>

      {(error || helperText) && (
        <Text
          variant="caption"
          style={{
            marginTop: 4,
            color: error ? theme.colors.error : theme.colors.textSecondary,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default FormDatePicker;


