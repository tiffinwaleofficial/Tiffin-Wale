import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  theme?: {
    color?: string;
  };
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  spacing = 'md',
  style,
  theme: customTheme,
}: DividerProps) => {
  const { theme } = useTheme();

  const getSpacing = () => {
    const spacingMap: Record<string, number> = {
      none: 0,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    };
    return spacingMap[spacing];
  };

  const dividerStyles: ViewStyle = {
    backgroundColor: color || customTheme?.color || theme.colors.border,
    ...(orientation === 'horizontal' 
      ? { 
          height: thickness, 
          width: '100%',
          marginVertical: getSpacing(),
        }
      : { 
          width: thickness, 
          height: '100%',
          marginHorizontal: getSpacing(),
        }
    ),
    ...style,
  };

  return <View style={dividerStyles} />;
};

export default Divider;


