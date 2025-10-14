import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/themeStore';

interface DateTimePickerProps {
  label?: string;
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
}

export const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  mode,
  onChange,
  placeholder,
  error,
  disabled = false,
  minimumDate,
  maximumDate,
  style,
}) => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);

  const formatValue = (date: Date) => {
    if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (mode === 'date') {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleString();
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showPicker = () => {
    if (!disabled) {
      setShow(true);
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'time':
        return 'time-outline';
      case 'date':
        return 'calendar-outline';
      default:
        return 'calendar-outline';
    }
  };

  return (
    <View style={[{ marginBottom: theme.spacing.md }, style]}>
      {label && (
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
        }}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={showPicker}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          backgroundColor: disabled ? theme.colors.surface : theme.colors.background,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Ionicons 
          name={getIcon()} 
          size={20} 
          color={disabled ? theme.colors.textSecondary : theme.colors.primary} 
          style={{ marginRight: theme.spacing.sm }}
        />
        
        <Text style={{
          flex: 1,
          fontSize: 16,
          color: value ? theme.colors.text : theme.colors.textSecondary,
        }}>
          {value ? formatValue(value) : placeholder || `Select ${mode}`}
        </Text>
        
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      {error && (
        <Text style={{
          fontSize: 12,
          color: theme.colors.error,
          marginTop: theme.spacing.xs,
        }}>
          {error}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          style={Platform.OS === 'ios' ? { backgroundColor: theme.colors.background } : undefined}
        />
      )}
    </View>
  );
};

export default CustomDateTimePicker;
