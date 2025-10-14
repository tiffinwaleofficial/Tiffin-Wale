import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Badge from '../ui/Badge';

export interface QuickActionProps {
  title: string;
  description?: string;
  icon: string;
  onPress: () => void;
  badge?: number;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    iconColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onPress,
  badge,
  isDisabled = false,
  variant = 'primary',
  size = 'md',
  style,
  theme: customTheme,
}: QuickActionProps) => {
  const { theme } = useTheme();

  const getVariantConfig = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary + '20',
          iconColor: theme.colors.primary,
          textColor: theme.colors.text,
          borderColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.textSecondary + '20',
          iconColor: theme.colors.textSecondary,
          textColor: theme.colors.text,
          borderColor: theme.colors.border,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.success + '20',
          iconColor: theme.colors.success,
          textColor: theme.colors.text,
          borderColor: theme.colors.success,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning + '20',
          iconColor: theme.colors.warning,
          textColor: theme.colors.text,
          borderColor: theme.colors.warning,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error + '20',
          iconColor: theme.colors.error,
          textColor: theme.colors.text,
          borderColor: theme.colors.error,
        };
      default:
        return {
          backgroundColor: theme.colors.primary + '20',
          iconColor: theme.colors.primary,
          textColor: theme.colors.text,
          borderColor: theme.colors.primary,
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 12,
          iconSize: 20,
          titleSize: 12,
          descriptionSize: 10,
          minHeight: 60,
        };
      case 'lg':
        return {
          padding: 20,
          iconSize: 32,
          titleSize: 16,
          descriptionSize: 12,
          minHeight: 100,
        };
      default:
        return {
          padding: 16,
          iconSize: 24,
          titleSize: 14,
          descriptionSize: 11,
          minHeight: 80,
        };
    }
  };

  const variantConfig = getVariantConfig();
  const sizeConfig = getSizeConfig();

  const cardStyles: ViewStyle = {
    backgroundColor: isDisabled
      ? theme.colors.border
      : (customTheme?.backgroundColor || variantConfig.backgroundColor),
    borderColor: isDisabled
      ? theme.colors.border
      : (customTheme?.borderColor || variantConfig.borderColor),
    borderWidth: 1,
    borderRadius: 12,
    padding: sizeConfig.padding,
    minHeight: sizeConfig.minHeight,
    opacity: isDisabled ? 0.6 : 1,
    ...style,
  };

  const contentStyles: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  };

  const iconContainerStyles: ViewStyle = {
    position: 'relative',
    marginBottom: 8,
  };

  const textContainerStyles: ViewStyle = {
    alignItems: 'center',
  };

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={contentStyles}>
        {/* Icon with Badge */}
        <View style={iconContainerStyles}>
          <Icon
            name={icon}
            size={sizeConfig.iconSize}
            color={
              isDisabled
                ? theme.colors.textSecondary
                : (customTheme?.iconColor || variantConfig.iconColor)
            }
          />
          
          {badge && badge > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: theme.colors.error,
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <Text
                variant="caption"
                style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 'bold',
                }}
              >
                {badge > 99 ? '99+' : badge.toString()}
              </Text>
            </View>
          )}
        </View>

        {/* Text Content */}
        <View style={textContainerStyles}>
          <Text
            variant="body"
            style={{
              color: isDisabled
                ? theme.colors.textSecondary
                : (customTheme?.textColor || variantConfig.textColor),
              fontSize: sizeConfig.titleSize,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: description ? 2 : 0,
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
          
          {description && (
            <Text
              variant="caption"
              style={{
                color: isDisabled
                  ? theme.colors.textSecondary
                  : theme.colors.textSecondary,
                fontSize: sizeConfig.descriptionSize,
                textAlign: 'center',
                lineHeight: 14,
              }}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default QuickAction;

