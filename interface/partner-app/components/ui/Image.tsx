import React from 'react';
import { Image as RNImage, ImageProps, ViewStyle } from 'react-native';

export interface ImageComponentProps extends ImageProps {
  source: string | { uri: string };
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Image: React.FC<ImageComponentProps> = ({
  source,
  width,
  height,
  borderRadius,
  style,
  ...props
}) => {
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <RNImage
      source={imageSource}
      style={[
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      {...props}
    />
  );
};