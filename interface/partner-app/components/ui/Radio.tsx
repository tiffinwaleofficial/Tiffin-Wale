import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface RadioProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
    selectedColor?: string;
  };
}

const Radio: React.FC<RadioProps> = ({
  selected,
  onPress,
  disabled = false,
  size = 'md',
  style,
  theme: customTheme,
}: RadioProps) => {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    const sizes: Record<string, ViewStyle> = {
      sm: { width: 16, height: 16, borderRadius: 8 },
      md: { width: 20, height: 20, borderRadius: 10 },
      lg: { width: 24, height: 24, borderRadius: 12 },
    };
    return sizes[size];
  };

  const getInnerSizeStyles = () => {
    const sizes: Record<string, ViewStyle> = {
      sm: { width: 8, height: 8, borderRadius: 4 },
      md: { width: 10, height: 10, borderRadius: 5 },
      lg: { width: 12, height: 12, borderRadius: 6 },
    };
    return sizes[size];
  };

  const radioStyles: ViewStyle = {
    ...getSizeStyles(),
    borderWidth: 2,
    borderColor: customTheme?.borderColor || '#D1D5DB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    ...(disabled && { opacity: 0.5 }),
    ...style,
  };

  const innerStyles: ViewStyle = {
    ...getInnerSizeStyles(),
    backgroundColor: selected 
      ? (customTheme?.selectedColor || '#FF9F43')
      : 'transparent',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={radioStyles}>
        {selected && <View style={innerStyles} />}
      </View>
    </TouchableOpacity>
  );
};

export default Radio;

