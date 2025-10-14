import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Image from './Image';

export interface AvatarProps {
  source?: string | { uri: string };
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'md',
  style,
  textStyle,
  theme: customTheme,
}: AvatarProps) => {
  const { theme } = useTheme();

  // Generate initials from name
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getSizeStyles = () => {
    if (typeof size === 'number') {
      return {
        width: size,
        height: size,
        borderRadius: size / 2,
      };
    }
    
    const sizes: Record<string, ViewStyle> = {
      sm: { width: 32, height: 32, borderRadius: 16 },
      md: { width: 48, height: 48, borderRadius: 24 },
      lg: { width: 64, height: 64, borderRadius: 32 },
      xl: { width: 80, height: 80, borderRadius: 40 },
    };
    return sizes[size];
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontFamily: 'Poppins-SemiBold',
      color: customTheme?.textColor || '#FFF',
      textAlign: 'center',
    };

    if (typeof size === 'number') {
      return {
        ...baseStyles,
        fontSize: size * 0.4,
        ...textStyle,
      };
    }

    const sizeTextStyles: Record<string, TextStyle> = {
      sm: { fontSize: 12 },
      md: { fontSize: 16 },
      lg: { fontSize: 20 },
      xl: { fontSize: 24 },
    };

    return {
      ...baseStyles,
      ...sizeTextStyles[size],
      ...textStyle,
    };
  };

  const avatarStyles: ViewStyle = {
    ...getSizeStyles(),
    backgroundColor: customTheme?.backgroundColor || '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  if (source) {
    const imageSource = typeof source === 'string' ? source : source.uri;
    return (
      <Image
        source={imageSource}
        width={getSizeStyles().width}
        height={getSizeStyles().height}
        borderRadius={getSizeStyles().borderRadius}
        style={style}
      />
    );
  }

  return (
    <View style={avatarStyles}>
      <Text style={getTextStyles()}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

export default Avatar;

