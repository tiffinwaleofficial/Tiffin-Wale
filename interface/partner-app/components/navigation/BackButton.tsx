import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Icon from '../ui/Icon';

export interface BackButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  theme?: {
    color?: string;
  };
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  size = 24,
  color,
  style,
  theme: customTheme,
}: BackButtonProps) => {
  const { theme } = useTheme();

  const buttonColor = customTheme?.color || color || theme.colors.text;

  const buttonStyles: ViewStyle = {
    padding: 8,
    ...style,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      activeOpacity={0.7}
    >
      <Icon
        name="back"
        size={size}
        color={buttonColor}
      />
    </TouchableOpacity>
  );
};

export default BackButton;


