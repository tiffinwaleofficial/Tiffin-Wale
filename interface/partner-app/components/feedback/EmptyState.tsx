import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  style?: ViewStyle;
  theme?: {
    textColor?: string;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'settings',
  actionText,
  onAction,
  style,
  theme: customTheme,
}: EmptyStateProps) => {
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
        name={icon}
        size={64}
        color={customTheme?.textColor || theme.colors.textTertiary}
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
      
      {message && (
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
      )}
      
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
        />
      )}
    </View>
  );
};

export default EmptyState;


