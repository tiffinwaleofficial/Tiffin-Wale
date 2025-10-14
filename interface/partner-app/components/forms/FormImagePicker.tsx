import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Image as RNImage } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Image from '../ui/Image';

export interface FormImagePickerProps {
  label?: string;
  value: string | null;
  onSelect: (uri: string) => void;
  onRemove?: () => void;
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

const FormImagePicker: React.FC<FormImagePickerProps> = ({
  label,
  value,
  onSelect,
  onRemove,
  disabled = false,
  error,
  helperText,
  required = false,
  style,
  theme: customTheme,
}: FormImagePickerProps) => {
  const { theme } = useTheme();

  const getLabelText = () => {
    if (!label) return '';
    return required ? `${label} *` : label;
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    return customTheme?.borderColor || theme.colors.border;
  };

  const handleImagePress = () => {
    if (disabled) return;
    
    // For now, we'll simulate image selection
    // In a real app, you'd use expo-image-picker
    const mockImageUri = 'https://via.placeholder.com/300x200';
    onSelect(mockImageUri);
  };

  const pickerStyles: ViewStyle = {
    borderWidth: 2,
    borderColor: getBorderColor(),
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  const imageContainerStyles: ViewStyle = {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  };

  const removeButtonStyles: ViewStyle = {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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

      {value ? (
        <View style={imageContainerStyles}>
          <Image
            source={value}
            width="100%"
            height={120}
            borderRadius={8}
          />
          {onRemove && (
            <TouchableOpacity
              style={removeButtonStyles}
              onPress={onRemove}
            >
              <Text style={{ color: '#FFF', fontSize: 12 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={pickerStyles}
          onPress={handleImagePress}
          disabled={disabled}
        >
          <Icon
            name="plus"
            size={32}
            color={theme.colors.textTertiary}
          />
          <Text
            variant="body"
            style={{
              marginTop: 8,
              color: theme.colors.textTertiary,
              textAlign: 'center',
            }}
          >
            Tap to select image
          </Text>
        </TouchableOpacity>
      )}

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

export default FormImagePicker;


