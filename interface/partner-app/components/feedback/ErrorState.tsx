import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
  theme?: {
    textColor?: string;
  };
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry,
  retryText = 'Try Again',
  style,
  theme: customTheme,
}: ErrorStateProps) => {
  const { theme } = useTheme();

  const containerStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    ...style,
  };

  return (
    <View style={containerStyles}>
      <Icon
        name="close"
        size={64}
        color={customTheme?.textColor || theme.colors.error}
      />
      
      <Text
        variant="title"
        style={{
          marginTop: 16,
          marginBottom: 8,
          color: customTheme?.textColor || theme.colors.text,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      
      <Text
        variant="body"
        style={{
          marginBottom: 24,
          color: customTheme?.textColor || theme.colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
      
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="primary"
        />
      )}
    </View>
  );
};

export default ErrorState;


