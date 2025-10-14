import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Image from '../ui/Image';

export interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number; // in minutes
  rating?: number;
  totalOrders?: number;
  onEdit?: (id: string) => void;
  onToggleAvailability?: (id: string, isAvailable: boolean) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  category,
  isAvailable,
  isVegetarian,
  isSpicy,
  preparationTime,
  rating,
  totalOrders,
  onEdit,
  onToggleAvailability,
  onDelete,
  onViewDetails,
  style,
  theme: customTheme,
}: MenuItemCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    marginBottom: 12,
    ...style,
  };

  const contentStyles: ViewStyle = {
    flexDirection: 'row',
    padding: 12,
  };

  const imageContainerStyles: ViewStyle = {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
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

  const titleStyles: ViewStyle = {
    flex: 1,
    marginRight: 8,
  };

  const badgesContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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

  const statsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  };

  return (
    <Card style={cardStyles} theme={customTheme}>
      <View style={contentStyles}>
        {/* Image */}
        <View style={imageContainerStyles}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              width={80}
              height={80}
              borderRadius={8}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: theme.colors.border,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="image" size={32} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={infoStyles}>
          {/* Header */}
          <View style={headerStyles}>
            <View style={titleStyles}>
              <Text variant="title" style={{ fontSize: 16, fontWeight: '600' }}>
                {name}
              </Text>
              {category && (
                <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                  {category}
                </Text>
              )}
            </View>
            
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="title" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                ₹{price.toFixed(2)}
              </Text>
              {preparationTime && (
                <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                  {preparationTime} min
                </Text>
              )}
            </View>
          </View>

          {/* Description */}
          {description && (
            <Text
              variant="body"
              style={{
                color: theme.colors.textSecondary,
                fontSize: 13,
                marginTop: 4,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          {/* Badges */}
          <View style={badgesContainerStyles}>
            {isVegetarian && (
              <Badge
                variant="outline"
                style={{
                  borderColor: theme.colors.success,
                  marginRight: 6,
                }}
              >
                <Text variant="caption" style={{ color: theme.colors.success, fontSize: 10 }}>
                  Veg
                </Text>
              </Badge>
            )}
            
            {isSpicy && (
              <Badge
                variant="outline"
                style={{
                  borderColor: theme.colors.error,
                  marginRight: 6,
                }}
              >
                <Text variant="caption" style={{ color: theme.colors.error, fontSize: 10 }}>
                  Spicy
                </Text>
              </Badge>
            )}

            {!isAvailable && (
              <Badge
                variant="filled"
                style={{
                  backgroundColor: theme.colors.error,
                }}
              >
                <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>
                  Unavailable
                </Text>
              </Badge>
            )}
          </View>

          {/* Stats */}
          {(rating || totalOrders) && (
            <View style={statsStyles}>
              {rating && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                  <Icon name="star" size={14} color={theme.colors.warning} />
                  <Text variant="caption" style={{ color: theme.colors.textSecondary, marginLeft: 2 }}>
                    {rating.toFixed(1)}
                  </Text>
                </View>
              )}
              
              {totalOrders && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="shopping-bag" size={14} color={theme.colors.textSecondary} />
                  <Text variant="caption" style={{ color: theme.colors.textSecondary, marginLeft: 2 }}>
                    {totalOrders} orders
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={actionsStyles}>
        <View style={leftActionsStyles}>
          {onToggleAvailability && (
            <Button
              variant="ghost"
              size="sm"
              title={isAvailable ? 'Disable' : 'Enable'}
              onPress={() => onToggleAvailability(id, !isAvailable)}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              title="Details"
              onPress={() => onViewDetails(id)}
            />
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              title="Edit"
              onPress={() => onEdit(id)}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              title="Delete"
              onPress={() => onDelete(id)}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

export default MenuItemCard;

