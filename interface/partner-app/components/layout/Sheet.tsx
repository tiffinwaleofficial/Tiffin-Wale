import React from 'react';
import { View, ViewStyle, Animated, PanGestureHandler } from 'react-native';
import { useTheme } from '../../store/themeStore';

export interface SheetProps {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  height?: number | string;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
  };
}

const Sheet: React.FC<SheetProps> = ({
  children,
  visible,
  onClose,
  height = '50%',
  style,
  theme: customTheme,
}: SheetProps) => {
  const { theme } = useTheme();
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  const sheetStyles: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: typeof height === 'number' ? height : height,
    backgroundColor: customTheme?.backgroundColor || theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    ...style,
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Animated.View
        style={[
          sheetStyles,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

export default Sheet;


