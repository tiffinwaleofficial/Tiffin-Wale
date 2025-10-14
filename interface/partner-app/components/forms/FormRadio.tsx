import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Radio from '../ui/Radio';
import Text from '../ui/Text';

export interface FormRadioProps {
  label?: string;
  options: Array<{ label: string; value: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
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

const FormRadio: React.FC<FormRadioProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  disabled = false,
  error,
  helperText,
  required = false,
  style,
  theme: customTheme,
}: FormRadioProps) => {
  const { theme } = useTheme();

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text
          variant="label"
          style={{
            marginBottom: 12,
            color: error ? theme.colors.error : theme.colors.text,
          }}
        >
          {getLabelText()}
        </Text>
      )}

      <View style={{ opacity: disabled ? 0.5 : 1 }}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
            onPress={disabled ? undefined : () => onSelect(option.value)}
            disabled={disabled}
          >
            <Radio
              selected={selectedValue === option.value}
              onPress={() => onSelect(option.value)}
              disabled={disabled}
              theme={customTheme}
            />
            
            <Text
              variant="body"
              style={{
                marginLeft: 12,
                color: theme.colors.text,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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

export default FormRadio;


