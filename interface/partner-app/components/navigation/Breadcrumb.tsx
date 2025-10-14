import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface BreadcrumbItem {
  key: string;
  label: string;
  onPress?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
  style?: ViewStyle;
  theme?: {
    textColor?: string;
    separatorColor?: string;
    activeColor?: string;
  };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  maxItems = 3,
  style,
  theme: customTheme,
}: BreadcrumbProps) => {
  const { theme } = useTheme();

  const breadcrumbStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...style,
  };

  const itemStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const textStyles = {
    color: customTheme?.textColor || theme.colors.textSecondary,
    fontSize: 14,
  };

  const activeTextStyles = {
    color: customTheme?.activeColor || theme.colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  };

  const separatorStyles = {
    color: customTheme?.separatorColor || theme.colors.textSecondary,
    fontSize: 14,
    marginHorizontal: 8,
  };

  // Handle max items by showing first, last, and ellipsis
  const getDisplayItems = () => {
    if (items.length <= maxItems) {
      return items;
    }

    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const ellipsisItem: BreadcrumbItem = {
      key: 'ellipsis',
      label: '...',
    };

    return [firstItem, ellipsisItem, lastItem];
  };

  const displayItems = getDisplayItems();

  return (
    <View style={breadcrumbStyles}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.key === 'ellipsis';
        const isFirst = index === 0;

        return (
          <View key={item.key} style={itemStyles}>
            {!isFirst && (
              <Text style={separatorStyles}>
                {separator}
              </Text>
            )}

            {isEllipsis ? (
              <Text style={textStyles}>
                {item.label}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={isLast ? undefined : item.onPress}
                disabled={isLast}
                activeOpacity={0.7}
              >
                <Text
                  style={isLast ? activeTextStyles : textStyles}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Breadcrumb;

