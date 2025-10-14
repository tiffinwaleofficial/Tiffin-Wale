import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderCardProps {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderTime: string;
  deliveryAddress?: string;
  specialInstructions?: string;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
  onViewDetails?: (orderId: string) => void;
  onCallCustomer?: (phone: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  customerName,
  customerPhone,
  items,
  totalAmount,
  status,
  orderTime,
  deliveryAddress,
  specialInstructions,
  onStatusUpdate,
  onViewDetails,
  onCallCustomer,
  style,
  theme: customTheme,
}: OrderCardProps) => {
  const { theme } = useTheme();

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.info;
      case 'preparing':
        return theme.colors.primary;
      case 'ready':
        return theme.colors.success;
      case 'delivered':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (orderStatus: string) => {
    switch (orderStatus) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return orderStatus;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(status);
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  const cardStyles: ViewStyle = {
    marginBottom: 12,
    ...style,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  };

  const customerInfoStyles: ViewStyle = {
    flex: 1,
    marginRight: 12,
  };

  const statusStyles: ViewStyle = {
    alignItems: 'flex-end',
  };

  const itemsContainerStyles: ViewStyle = {
    marginBottom: 12,
  };

  const itemStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  };

  const actionsStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  };

  const leftActionsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  return (
    <Card style={cardStyles} theme={customTheme}>
      {/* Header */}
      <View style={headerStyles}>
        <View style={customerInfoStyles}>
          <Text variant="title" style={{ fontSize: 16, fontWeight: '600' }}>
            Order #{orderId.slice(-6)}
          </Text>
          <Text variant="body" style={{ color: theme.colors.text, marginTop: 2 }}>
            {customerName}
          </Text>
          <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 1 }}>
            {orderTime}
          </Text>
        </View>
        
        <View style={statusStyles}>
          <Badge
            variant="filled"
            style={{
              backgroundColor: statusColor,
              marginBottom: 4,
            }}
          >
            {statusLabel}
          </Badge>
        </View>
      </View>

      {/* Items */}
      <View style={itemsContainerStyles}>
        {items.map((item, index) => (
          <View key={index} style={itemStyles}>
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ color: theme.colors.text }}>
                {item.quantity}x {item.name}
              </Text>
            </View>
            <Text variant="body" style={{ color: theme.colors.text, fontWeight: '600' }}>
              ₹{item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={itemStyles}>
        <Text variant="title" style={{ color: theme.colors.text, fontWeight: '600' }}>
          Total
        </Text>
        <Text variant="title" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          ₹{totalAmount.toFixed(2)}
        </Text>
      </View>

      {/* Delivery Address */}
      {deliveryAddress && (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Icon name="location" size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" style={{ color: theme.colors.textSecondary, marginLeft: 4 }}>
              Delivery Address
            </Text>
          </View>
          <Text variant="body" style={{ color: theme.colors.text, fontSize: 13 }}>
            {deliveryAddress}
          </Text>
        </View>
      )}

      {/* Special Instructions */}
      {specialInstructions && (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Icon name="message" size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" style={{ color: theme.colors.textSecondary, marginLeft: 4 }}>
              Special Instructions
            </Text>
          </View>
          <Text variant="body" style={{ color: theme.colors.text, fontSize: 13 }}>
            {specialInstructions}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={actionsStyles}>
        <View style={leftActionsStyles}>
          {customerPhone && onCallCustomer && (
            <Button
              variant="ghost"
              size="sm"
              title="Call"
              leftIcon={<Icon name="phone" size={16} color={theme.colors.primary} />}
              onPress={() => onCallCustomer(customerPhone)}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              title="Details"
              onPress={() => onViewDetails(orderId)}
            />
          )}
        </View>

        {nextStatus && onStatusUpdate && (
          <Button
            variant="primary"
            size="sm"
            title={`Mark as ${getStatusLabel(nextStatus)}`}
            onPress={() => onStatusUpdate(orderId, nextStatus)}
          />
        )}
      </View>
    </Card>
  );
};

export default OrderCard;

