import React from 'react';
import { ScrollView as RNScrollView, ScrollViewProps, ViewStyle } from 'react-native';

export interface ScrollViewComponentProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const ScrollView: React.FC<ScrollViewComponentProps> = ({
  children,
  style,
  contentContainerStyle,
  ...props
}) => {
  return (
    <RNScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
    >
      {children}
    </RNScrollView>
  );
};