import React from 'react';
import { View, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
  };
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  theme: customTheme,
}: SkeletonProps) => {
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      customTheme?.backgroundColor || theme.colors.surfaceSecondary,
      customTheme?.backgroundColor || theme.colors.borderLight,
    ],
  });

  const skeletonStyles: ViewStyle = {
    width,
    height,
    borderRadius,
    ...style,
  };

  return (
    <Animated.View
      style={[
        skeletonStyles,
        {
          backgroundColor,
        },
      ]}
    />
  );
};

export default Skeleton;


