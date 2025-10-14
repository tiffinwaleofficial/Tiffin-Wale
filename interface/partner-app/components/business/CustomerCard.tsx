import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';

export interface CustomerCardProps {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  isRegular: boolean;
  rating?: number;
  onViewProfile?: (id: string) => void;
  onCall?: (phone: string) => void;
  onMessage?: (id: string) => void;
  onViewOrders?: (id: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  id,
  name,
  email,
  phone,
  avatar,
  totalOrders,
  totalSpent,
  lastOrderDate,
  isRegular,
  rating,
  onViewProfile,
  onCall,
  onMessage,
  onViewOrders,
  style,
  theme: customTheme,
}: CustomerCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    marginBottom: 12,
    ...style,
  };

  const contentStyles: ViewStyle = {
    flexDirection: 'row',
    padding: 12,
  };

  const avatarContainerStyles: ViewStyle = {
    marginRight: 12,
  };

  const infoStyles: ViewStyle = {
    flex: 1,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  };

  const nameContainerStyles: ViewStyle = {
    flex: 1,
    marginRight: 8,
  };

  const statsStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  };

  const statItemStyles: ViewStyle = {
    alignItems: 'center',
    flex: 1,
  };

  const actionsStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  };

  const leftActionsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const getCustomerType = () => {
    if (totalOrders >= 20) return { label: 'VIP', color: theme.colors.primary };
    if (totalOrders >= 10) return { label: 'Regular', color: theme.colors.success };
    if (totalOrders >= 5) return { label: 'Frequent', color: theme.colors.info };
    return { label: 'New', color: theme.colors.textSecondary };
  };

  const customerType = getCustomerType();

  return (
    <Card style={cardStyles} theme={customTheme}>
      <View style={contentStyles}>
        {/* Avatar */}
        <View style={avatarContainerStyles}>
          <Avatar
            source={avatar ? { uri: avatar } : undefined}
            name={name}
            size={50}
          />
        </View>

        {/* Info */}
        <View style={infoStyles}>
          {/* Header */}
          <View style={headerStyles}>
            <View style={nameContainerStyles}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text variant="title" style={{ fontSize: 16, fontWeight: '600', marginRight: 8 }}>
                  {name}
                </Text>
                <Badge
                  variant="filled"
                  style={{
                    backgroundColor: customerType.color,
                  }}
                >
                  <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>
                    {customerType.label}
                  </Text>
                </Badge>
              </View>
              
              {email && (
                <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: 1 }}>
                  {email}
                </Text>
              )}
              
              {phone && (
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  {phone}
                </Text>
              )}
            </View>

            {rating && (
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" size={14} color={theme.colors.warning} />
                  <Text variant="caption" style={{ color: theme.colors.textSecondary, marginLeft: 2 }}>
                    {rating.toFixed(1)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={statsStyles}>
            <View style={statItemStyles}>
              <Text
                variant="title"
                style={{
                  color: theme.colors.primary,
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                {totalOrders}
              </Text>
              <Text
                variant="caption"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 11,
                }}
              >
                Orders
              </Text>
            </View>

            <View style={statItemStyles}>
              <Text
                variant="title"
                style={{
                  color: theme.colors.success,
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                ₹{totalSpent.toLocaleString()}
              </Text>
              <Text
                variant="caption"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 11,
                }}
              >
                Spent
              </Text>
            </View>

            {lastOrderDate && (
              <View style={statItemStyles}>
                <Text
                  variant="body"
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {lastOrderDate}
                </Text>
                <Text
                  variant="caption"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 11,
                  }}
                >
                  Last Order
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={actionsStyles}>
        <View style={leftActionsStyles}>
          {phone && onCall && (
            <Button
              variant="ghost"
              size="sm"
              title="Call"
              leftIcon={<Icon name="phone" size={16} color={theme.colors.primary} />}
              onPress={() => onCall(phone)}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onMessage && (
            <Button
              variant="ghost"
              size="sm"
              title="Message"
              leftIcon={<Icon name="message" size={16} color={theme.colors.primary} />}
              onPress={() => onMessage(id)}
              style={{ marginRight: 8 }}
            />
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {onViewOrders && (
            <Button
              variant="outline"
              size="sm"
              title="Orders"
              onPress={() => onViewOrders(id)}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onViewProfile && (
            <Button
              variant="primary"
              size="sm"
              title="Profile"
              onPress={() => onViewProfile(id)}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

export default CustomerCard;

