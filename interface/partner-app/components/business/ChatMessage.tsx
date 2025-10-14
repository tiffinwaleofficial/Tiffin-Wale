import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';

export interface ChatMessageProps {
  id: string;
  message: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
  messageType?: 'text' | 'image' | 'order' | 'system';
  imageUrl?: string;
  orderData?: {
    orderId: string;
    items: string[];
    total: number;
  };
  onImagePress?: (imageUrl: string) => void;
  onOrderPress?: (orderId: string) => void;
  style?: ViewStyle;
  theme?: {
    ownMessageColor?: string;
    otherMessageColor?: string;
    textColor?: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  message,
  senderName,
  senderAvatar,
  timestamp,
  isOwn,
  isRead,
  isDelivered,
  messageType = 'text',
  imageUrl,
  orderData,
  onImagePress,
  onOrderPress,
  style,
  theme: customTheme,
}: ChatMessageProps) => {
  const { theme } = useTheme();

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    ...(isOwn ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }),
    ...style,
  };

  const messageContainerStyles: ViewStyle = {
    maxWidth: '75%',
    ...(isOwn ? { marginLeft: 12 } : { marginRight: 12 }),
  };

  const bubbleStyles: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: isOwn
      ? (customTheme?.ownMessageColor || theme.colors.primary)
      : (customTheme?.otherMessageColor || theme.colors.surface),
    borderWidth: isOwn ? 0 : 1,
    borderColor: theme.colors.border,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  };

  const footerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  };

  const orderCardStyles: ViewStyle = {
    backgroundColor: theme.colors.border + '20',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  };

  const renderMessageContent = () => {
    switch (messageType) {
      case 'image':
        return (
          <View>
            {imageUrl && (
              <View
                style={{
                  width: 200,
                  height: 150,
                  borderRadius: 8,
                  backgroundColor: theme.colors.border,
                  marginBottom: 4,
                }}
              >
                {/* Image placeholder - would use actual Image component */}
                <View
                  style={{
                    width: 200,
                    height: 150,
                    borderRadius: 8,
                    backgroundColor: theme.colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="image" size={32} color={theme.colors.textSecondary} />
                </View>
              </View>
            )}
            {message && (
              <Text
                variant="body"
                style={{
                  color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.text),
                  fontSize: 14,
                }}
              >
                {message}
              </Text>
            )}
          </View>
        );

      case 'order':
        return (
          <View>
            {message && (
              <Text
                variant="body"
                style={{
                  color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.text),
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                {message}
              </Text>
            )}
            
            {orderData && (
              <View style={orderCardStyles}>
                <Text
                  variant="body"
                  style={{
                    color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.text),
                    fontSize: 13,
                    fontWeight: '600',
                    marginBottom: 4,
                  }}
                >
                  Order #{orderData.orderId.slice(-6)}
                </Text>
                
                {orderData.items.map((item, index) => (
                  <Text
                    key={index}
                    variant="caption"
                    style={{
                      color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.textSecondary),
                      fontSize: 12,
                      marginBottom: 2,
                    }}
                  >
                    • {item}
                  </Text>
                ))}
                
                <Text
                  variant="body"
                  style={{
                    color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.text),
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 4,
                  }}
                >
                  Total: ₹{orderData.total.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        );

      case 'system':
        return (
          <View style={{ alignItems: 'center' }}>
            <Text
              variant="caption"
              style={{
                color: theme.colors.textSecondary,
                fontSize: 12,
                fontStyle: 'italic',
              }}
            >
              {message}
            </Text>
          </View>
        );

      default:
        return (
          <Text
            variant="body"
            style={{
              color: isOwn ? '#FFFFFF' : (customTheme?.textColor || theme.colors.text),
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {message}
          </Text>
        );
    }
  };

  const renderStatusIcons = () => {
    if (!isOwn) return null;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
        {isDelivered && (
          <Icon
            name="check"
            size={12}
            color={isRead ? theme.colors.primary : theme.colors.textSecondary}
            style={{ marginRight: 2 }}
          />
        )}
        
        {isRead && (
          <Icon
            name="check"
            size={12}
            color={theme.colors.primary}
          />
        )}
      </View>
    );
  };

  if (messageType === 'system') {
    return (
      <View style={containerStyles}>
        <View style={messageContainerStyles}>
          {renderMessageContent()}
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyles}>
      {!isOwn && (
        <Avatar
          source={senderAvatar ? { uri: senderAvatar } : undefined}
          name={senderName}
          size={32}
        />
      )}

      <View style={messageContainerStyles}>
        {!isOwn && (
          <View style={headerStyles}>
            <Text
              variant="caption"
              style={{
                color: theme.colors.textSecondary,
                fontSize: 11,
                fontWeight: '600',
              }}
            >
              {senderName}
            </Text>
          </View>
        )}

        <View style={bubbleStyles}>
          {renderMessageContent()}
        </View>

        <View style={footerStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 10,
            }}
          >
            {timestamp}
          </Text>
          {renderStatusIcons()}
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;

