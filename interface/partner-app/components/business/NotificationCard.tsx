import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Badge from '../ui/Badge';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';

export interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'review' | 'system' | 'promotion';
  isRead: boolean;
  timestamp: string;
  avatar?: string;
  actionData?: {
    orderId?: string;
    amount?: number;
    rating?: number;
  };
  onPress?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  isRead,
  timestamp,
  avatar,
  actionData,
  onPress,
  onMarkAsRead,
  onDismiss,
  style,
  theme: customTheme,
}: NotificationCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    marginBottom: 8,
    opacity: isRead ? 0.7 : 1,
    ...style,
  };

  const contentStyles: ViewStyle = {
    flexDirection: 'row',
    padding: 12,
  };

  const iconContainerStyles: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  };

  const infoStyles: ViewStyle = {
    flex: 1,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  };

  const titleContainerStyles: ViewStyle = {
    flex: 1,
    marginRight: 8,
  };

  const actionsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'order':
        return {
          icon: 'shopping-bag',
          color: theme.colors.primary,
          backgroundColor: theme.colors.primary + '20',
        };
      case 'payment':
        return {
          icon: 'credit-card',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
        };
      case 'review':
        return {
          icon: 'star',
          color: theme.colors.warning,
          backgroundColor: theme.colors.warning + '20',
        };
      case 'system':
        return {
          icon: 'settings',
          color: theme.colors.info,
          backgroundColor: theme.colors.info + '20',
        };
      case 'promotion':
        return {
          icon: 'gift',
          color: theme.colors.error,
          backgroundColor: theme.colors.error + '20',
        };
      default:
        return {
          icon: 'bell',
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.border,
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Card theme={customTheme}>
        <View style={contentStyles}>
          {/* Icon/Avatar */}
          <View style={iconContainerStyles}>
            {avatar ? (
              <Avatar
                source={{ uri: avatar }}
                name={title}
                size={40}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: typeConfig.backgroundColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={typeConfig.icon}
                  size={20}
                  color={typeConfig.color}
                />
              </View>
            )}
          </View>

          {/* Info */}
          <View style={infoStyles}>
            {/* Header */}
            <View style={headerStyles}>
              <View style={titleContainerStyles}>
                <Text
                  variant="body"
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    fontWeight: isRead ? '400' : '600',
                    marginBottom: 2,
                  }}
                >
                  {title}
                </Text>
                <Text
                  variant="caption"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  {message}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  variant="caption"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {timestamp}
                </Text>
                {!isRead && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.colors.primary,
                      marginTop: 4,
                    }}
                  />
                )}
              </View>
            </View>

            {/* Action Data */}
            {actionData && (
              <View style={actionsStyles}>
                {actionData.orderId && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: theme.colors.primary,
                      marginRight: 8,
                    }}
                  >
                    <Text variant="caption" style={{ color: theme.colors.primary, fontSize: 10 }}>
                      Order #{actionData.orderId.slice(-6)}
                    </Text>
                  </Badge>
                )}

                {actionData.amount && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: theme.colors.success,
                      marginRight: 8,
                    }}
                  >
                    <Text variant="caption" style={{ color: theme.colors.success, fontSize: 10 }}>
                      ₹{actionData.amount.toFixed(2)}
                    </Text>
                  </Badge>
                )}

                {actionData.rating && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="star" size={12} color={theme.colors.warning} />
                    <Text
                      variant="caption"
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 10,
                        marginLeft: 2,
                      }}
                    >
                      {actionData.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default NotificationCard;

