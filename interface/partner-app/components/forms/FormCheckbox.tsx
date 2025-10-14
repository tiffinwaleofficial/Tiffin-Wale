import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Checkbox from '../ui/Checkbox';
import Text from '../ui/Text';

export interface FormCheckboxProps {
  label?: string;
  checked: boolean;
  onPress: () => void;
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

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  checked,
  onPress,
  disabled = false,
  error,
  helperText,
  required = false,
  style,
  theme: customTheme,
}: FormCheckboxProps) => {
  const { theme } = useTheme();

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  return (
    <View style={[{ marginBottom: 16 }, style]}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <Checkbox
          checked={checked}
          onPress={onPress}
          disabled={disabled}
          theme={customTheme}
        />
        
        {label && (
          <Text
            variant="body"
            style={{
              marginLeft: 12,
              color: error ? theme.colors.error : theme.colors.text,
            }}
          >
            {getLabelText()}
          </Text>
        )}
      </TouchableOpacity>

      {(error || helperText) && (
        <Text
          variant="caption"
          style={{
            marginTop: 4,
            marginLeft: 32,
            color: error ? theme.colors.error : theme.colors.textSecondary,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

export default FormCheckbox;


