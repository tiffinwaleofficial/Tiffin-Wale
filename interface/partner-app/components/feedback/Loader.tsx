import React from 'react';
import { View, ViewStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';

export interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  style?: ViewStyle;
  theme?: {
    color?: string;
  };
}

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color,
  message,
  style,
  theme: customTheme,
}: LoaderProps) => {
  const { theme } = useTheme();

  const loaderColor = customTheme?.color || color || theme.colors.primary;

  const containerStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    ...style,
  };

  return (
    <View style={containerStyles}>
      <ActivityIndicator
        size={size}
        color={loaderColor}
      />
      {message && (
        <Text
          variant="body"
          style={{
            marginTop: 12,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

export default Loader;


