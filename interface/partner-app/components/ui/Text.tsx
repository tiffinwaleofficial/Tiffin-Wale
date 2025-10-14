import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'error';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight,
  color,
  style,
  numberOfLines,
  onPress,
}) => {
  const { theme } = useTheme();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: color || theme.colors.text,
    };

    // Variant styles
    switch (variant) {
      case 'h1':
        baseStyle.fontSize = theme.typography.fontSize.xxxl;
        baseStyle.lineHeight = theme.typography.lineHeight.xxxl;
        baseStyle.fontFamily = theme.typography.fontFamily.bold;
        break;
      case 'h2':
        baseStyle.fontSize = theme.typography.fontSize.xxl;
        baseStyle.lineHeight = theme.typography.lineHeight.xxl;
        baseStyle.fontFamily = theme.typography.fontFamily.bold;
        break;
      case 'h3':
        baseStyle.fontSize = theme.typography.fontSize.xl;
        baseStyle.lineHeight = theme.typography.lineHeight.xl;
        baseStyle.fontFamily = theme.typography.fontFamily.semiBold;
        break;
      case 'h4':
        baseStyle.fontSize = theme.typography.fontSize.lg;
        baseStyle.lineHeight = theme.typography.lineHeight.lg;
        baseStyle.fontFamily = theme.typography.fontFamily.semiBold;
        break;
      case 'h5':
        baseStyle.fontSize = theme.typography.fontSize.md;
        baseStyle.lineHeight = theme.typography.lineHeight.md;
        baseStyle.fontFamily = theme.typography.fontFamily.semiBold;
        break;
      case 'h6':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.lineHeight = theme.typography.lineHeight.sm;
        baseStyle.fontFamily = theme.typography.fontFamily.semiBold;
        break;
      case 'title':
        baseStyle.fontSize = theme.typography.fontSize.xxl;
        baseStyle.lineHeight = theme.typography.lineHeight.xxl;
        baseStyle.fontFamily = theme.typography.fontFamily.bold;
        break;
      case 'subtitle':
        baseStyle.fontSize = theme.typography.fontSize.lg;
        baseStyle.lineHeight = theme.typography.lineHeight.lg;
        baseStyle.fontFamily = theme.typography.fontFamily.medium;
        break;
      case 'body':
        baseStyle.fontSize = theme.typography.fontSize.md;
        baseStyle.lineHeight = theme.typography.lineHeight.md;
        baseStyle.fontFamily = theme.typography.fontFamily.regular;
        break;
      case 'caption':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.lineHeight = theme.typography.lineHeight.sm;
        baseStyle.fontFamily = theme.typography.fontFamily.regular;
        break;
      case 'label':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.lineHeight = theme.typography.lineHeight.sm;
        baseStyle.fontFamily = theme.typography.fontFamily.medium;
        break;
      case 'error':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.lineHeight = theme.typography.lineHeight.sm;
        baseStyle.fontFamily = theme.typography.fontFamily.regular;
        baseStyle.color = theme.colors.error;
        break;
    }

    // Weight override
    if (weight) {
      baseStyle.fontFamily = theme.typography.fontFamily[weight];
    }

    return baseStyle;
  };

  return (
    <RNText
      style={[getTextStyle(), style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};