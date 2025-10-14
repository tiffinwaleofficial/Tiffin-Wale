import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
  };
}

const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  spacing = 'md',
  align = 'start',
  justify = 'start',
  wrap = false,
  style,
  theme: customTheme,
}: StackProps) => {
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

  const getAlignment = () => {
    const alignMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };
    return alignMap[align];
  };

  const getJustification = () => {
    const justifyMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      'space-between': 'space-between',
      'space-around': 'space-around',
      'space-evenly': 'space-evenly',
    };
    return justifyMap[justify];
  };

  const stackStyles: ViewStyle = {
    flexDirection: direction,
    alignItems: getAlignment() as any,
    justifyContent: getJustification() as any,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    backgroundColor: customTheme?.backgroundColor || 'transparent',
    ...style,
  };

  // Add spacing between children
  const childrenWithSpacing = React.Children.toArray(children).map((child, index) => {
    if (index === 0) return child;
    
    const spacingStyle: ViewStyle = direction === 'row' 
      ? { marginLeft: getSpacing() }
      : { marginTop: getSpacing() };

    return (
      <View key={index} style={spacingStyle}>
        {child}
      </View>
    );
  });

  return (
    <View style={stackStyles}>
      {childrenWithSpacing}
    </View>
  );
};

export default Stack;


