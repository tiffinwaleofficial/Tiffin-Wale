import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

export interface AlertProps {
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  type = 'info',
  visible,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  style,
  theme: customTheme,
}: AlertProps) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const getTypeStyles = () => {
    const typeStyles = {
      success: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.successLight,
        borderColor: theme.colors.success,
        iconColor: theme.colors.success,
      },
      error: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.errorLight,
        borderColor: theme.colors.error,
        iconColor: theme.colors.error,
      },
      warning: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.warningLight,
        borderColor: theme.colors.warning,
        iconColor: theme.colors.warning,
      },
      info: {
        backgroundColor: customTheme?.backgroundColor || theme.colors.infoLight,
        borderColor: theme.colors.info,
        iconColor: theme.colors.info,
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

  const overlayStyles: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const alertStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: '90%',
    minWidth: 300,
    ...style,
  };

  const typeStyles = getTypeStyles();

  return (
    <View style={overlayStyles}>
      <View style={alertStyles}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: message ? 16 : 0,
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: typeStyles.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Icon
              name={getIconName()}
              size={20}
              color={typeStyles.iconColor}
            />
          </View>
          
          <Text
            variant="title"
            style={{
              flex: 1,
              color: theme.colors.text,
            }}
          >
            {title}
          </Text>
        </View>

        {message && (
          <Text
            variant="body"
            style={{
              marginBottom: 24,
              color: theme.colors.textSecondary,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
        )}

        <View style={{
          flexDirection: 'row',
          justifyContent: showCancel ? 'space-between' : 'flex-end',
          gap: 12,
        }}>
          {showCancel && (
            <Button
              title={cancelText}
              onPress={onClose}
              variant="outline"
              style={{ flex: 1 }}
            />
          )}
          
          <Button
            title={confirmText}
            onPress={() => {
              onConfirm?.();
              onClose();
            }}
            style={{ flex: showCancel ? 1 : undefined }}
          />
        </View>
      </View>
    </View>
  );
};

export default Alert;


