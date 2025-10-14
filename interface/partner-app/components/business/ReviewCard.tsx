import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';

export interface ReviewCardProps {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  orderId?: string;
  itemName?: string;
  timestamp: string;
  isVerified: boolean;
  onReply?: (id: string) => void;
  onViewOrder?: (orderId: string) => void;
  onReport?: (id: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  customerName,
  customerAvatar,
  rating,
  comment,
  orderId,
  itemName,
  timestamp,
  isVerified,
  onReply,
  onViewOrder,
  onReport,
  style,
  theme: customTheme,
}: ReviewCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    marginBottom: 12,
    ...style,
  };

  const contentStyles: ViewStyle = {
    padding: 12,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  };

  const customerInfoStyles: ViewStyle = {
    flex: 1,
    marginLeft: 12,
  };

  const ratingContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  };

  const commentStyles: ViewStyle = {
    marginBottom: 12,
  };

  const orderInfoStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: theme.colors.border + '20',
    borderRadius: 6,
  };

  const actionsStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const leftActionsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={16}
          color={i <= ratingValue ? theme.colors.warning : theme.colors.border}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (ratingValue: number) => {
    if (ratingValue >= 4) return theme.colors.success;
    if (ratingValue >= 3) return theme.colors.warning;
    return theme.colors.error;
  };

  const getRatingLabel = (ratingValue: number) => {
    if (ratingValue >= 4.5) return 'Excellent';
    if (ratingValue >= 4) return 'Very Good';
    if (ratingValue >= 3.5) return 'Good';
    if (ratingValue >= 3) return 'Average';
    if (ratingValue >= 2) return 'Poor';
    return 'Very Poor';
  };

  return (
    <Card style={cardStyles} theme={customTheme}>
      <View style={contentStyles}>
        {/* Header */}
        <View style={headerStyles}>
          <Avatar
            source={customerAvatar ? { uri: customerAvatar } : undefined}
            name={customerName}
            size={40}
          />
          
          <View style={customerInfoStyles}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text
                variant="body"
                style={{
                  color: theme.colors.text,
                  fontSize: 14,
                  fontWeight: '600',
                  marginRight: 8,
                }}
              >
                {customerName}
              </Text>
              
              {isVerified && (
                <Badge
                  variant="filled"
                  style={{
                    backgroundColor: theme.colors.success,
                  }}
                >
                  <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 9 }}>
                    Verified
                  </Text>
                </Badge>
              )}
            </View>

            <View style={ratingContainerStyles}>
              <View style={{ flexDirection: 'row', marginRight: 8 }}>
                {renderStars(rating)}
              </View>
              
              <Text
                variant="caption"
                style={{
                  color: getRatingColor(rating),
                  fontSize: 12,
                  fontWeight: '600',
                  marginRight: 8,
                }}
              >
                {rating.toFixed(1)}
              </Text>
              
              <Text
                variant="caption"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 11,
                }}
              >
                {getRatingLabel(rating)}
              </Text>
            </View>

            <Text
              variant="caption"
              style={{
                color: theme.colors.textSecondary,
                fontSize: 11,
              }}
            >
              {timestamp}
            </Text>
          </View>
        </View>

        {/* Comment */}
        <View style={commentStyles}>
          <Text
            variant="body"
            style={{
              color: theme.colors.text,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {comment}
          </Text>
        </View>

        {/* Order Info */}
        {(orderId || itemName) && (
          <View style={orderInfoStyles}>
            <Icon name="shopping-bag" size={16} color={theme.colors.textSecondary} />
            
            <View style={{ marginLeft: 8, flex: 1 }}>
              {itemName && (
                <Text
                  variant="body"
                  style={{
                    color: theme.colors.text,
                    fontSize: 13,
                    fontWeight: '500',
                  }}
                >
                  {itemName}
                </Text>
              )}
              
              {orderId && (
                <Text
                  variant="caption"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 11,
                  }}
                >
                  Order #{orderId.slice(-6)}
                </Text>
              )}
            </View>

            {orderId && onViewOrder && (
              <Button
                variant="ghost"
                size="sm"
                title="View Order"
                onPress={() => onViewOrder(orderId)}
              />
            )}
          </View>
        )}

        {/* Actions */}
        <View style={actionsStyles}>
          <View style={leftActionsStyles}>
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                title="Reply"
                leftIcon={<Icon name="message-circle" size={16} color={theme.colors.primary} />}
                onPress={() => onReply(id)}
                style={{ marginRight: 8 }}
              />
            )}
          </View>

          {onReport && (
            <Button
              variant="ghost"
              size="sm"
              title="Report"
              leftIcon={<Icon name="flag" size={16} color={theme.colors.error} />}
              onPress={() => onReport(id)}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

export default ReviewCard;

