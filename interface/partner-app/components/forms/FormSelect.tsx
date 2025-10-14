import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface FormSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  variant?: 'default' | 'error' | 'success';
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

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onSelect,
  options,
  variant = 'default',
  disabled = false,
  error,
  helperText,
  required = false,
  style,
  theme: customTheme,
}: FormSelectProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  const getVariant = () => {
    if (error) return 'error';
    return variant;
  };

  const getSelectedLabel = () => {
    const selectedOption = options.find(option => option.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (variant === 'success') return theme.colors.success;
    return customTheme?.borderColor || theme.colors.border;
  };

  const selectStyles: ViewStyle = {
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

  const dropdownStyles: ViewStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };

  const optionStyles: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
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
      
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={selectStyles}
          onPress={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Text
            style={{
              flex: 1,
              color: value ? theme.colors.text : theme.colors.textTertiary,
            }}
          >
            {getSelectedLabel()}
          </Text>
          <Icon
            name="arrow"
            size={16}
            color={theme.colors.textTertiary}
            style={{
              transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
            }}
          />
        </TouchableOpacity>

        {isOpen && (
          <View style={dropdownStyles}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  optionStyles,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={{
                    color: value === option.value ? theme.colors.primary : theme.colors.text,
                    fontWeight: value === option.value ? '600' : '400',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

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

export default FormSelect;


