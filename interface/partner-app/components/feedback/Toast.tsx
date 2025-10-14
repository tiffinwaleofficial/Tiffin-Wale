import React, { useEffect, useRef } from 'react';
import { View, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000,
  style,
  theme: customTheme,
}: ToastProps) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getTypeStyles = () => {
    const typeStyles = {
      success: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.successLight,
        borderColor: theme.colors.success,
      },
      error: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.errorLight,
        borderColor: theme.colors.error,
      },
      warning: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.warningLight,
        borderColor: theme.colors.warning,
      },
      info: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.infoLight,
        borderColor: theme.colors.info,
      },
    };
    return typeStyles[type];
  };

  const getIconName = () => {
    const iconMap = {
      success: 'check',
      error: 'close',
      warning: 'settings',
      info: 'settings',
    };
    return iconMap[type];
  };

  const getTextColor = () => {
    const colorMap = {
      success: theme.colors.success,
      error: theme.colors.error,
      warning: theme.colors.warning,
      info: theme.colors.info,
    };
    return customTheme?.textColor || colorMap[type];
  };

  if (!visible) return null;

  const toastStyles: ViewStyle = {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: getTypeStyles().backgroundColor,
    borderWidth: 1,
    borderColor: getTypeStyles().borderColor,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    ...style,
  };

  return (
    <Animated.View
      style={[
        toastStyles,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Icon
        name={getIconName()}
        size={20}
        color={getTextColor()}
      />
      <Text
        variant="body"
        style={{
          flex: 1,
          marginLeft: 12,
          color: getTextColor(),
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export default Toast;


