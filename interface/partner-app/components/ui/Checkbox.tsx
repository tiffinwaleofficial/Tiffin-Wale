import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  children,
  style,
  disabled = false,
  error,
}) => {
  const { theme } = useTheme();

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: error 
              ? theme.colors.error 
              : checked 
                ? theme.colors.primary 
                : theme.colors.border,
            backgroundColor: checked ? theme.colors.primary : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: theme.spacing.sm,
            marginTop: 2,
          }}
        >
          {checked && (
            <Check size={12} color={theme.colors.white} />
          )}
        </View>
        
        {children && (
          <View style={{ flex: 1 }}>
            {children}
          </View>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text variant="error" style={{ marginTop: theme.spacing.xs, marginLeft: 32 }}>
          {error}
        </Text>
      )}
    </View>
  );
};