import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  onPress?: () => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
    iconColor?: string;
    valueColor?: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onPress,
  style,
  theme: customTheme,
}: StatsCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    padding: 16,
    ...style,
  };

  const contentStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const leftContentStyles: ViewStyle = {
    flex: 1,
  };

  const rightContentStyles: ViewStyle = {
    alignItems: 'flex-end',
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  };

  const valueStyles: ViewStyle = {
    marginBottom: 4,
  };

  const trendStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  };

  const trendColor = trend?.isPositive ? theme.colors.success : theme.colors.error;
  const trendIcon = trend?.isPositive ? 'trending-up' : 'trending-down';

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={cardStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card theme={customTheme}>
        <View style={contentStyles}>
          {/* Left Content */}
          <View style={leftContentStyles}>
            {/* Header */}
            <View style={headerStyles}>
              {icon && (
                <Icon
                  name={icon}
                  size={20}
                  color={customTheme?.iconColor || theme.colors.primary}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                variant="caption"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 12,
                  fontWeight: '500',
                }}
              >
                {title}
              </Text>
            </View>

            {/* Value */}
            <View style={valueStyles}>
              <Text
                variant="title"
                style={{
                  color: customTheme?.valueColor || theme.colors.text,
                  fontSize: 24,
                  fontWeight: '700',
                }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Text>
            </View>

            {/* Subtitle */}
            {subtitle && (
              <Text
                variant="body"
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 13,
                }}
              >
                {subtitle}
              </Text>
            )}

            {/* Trend */}
            {trend && (
              <View style={trendStyles}>
                <Icon
                  name={trendIcon}
                  size={14}
                  color={trendColor}
                  style={{ marginRight: 4 }}
                />
                <Text
                  variant="caption"
                  style={{
                    color: trendColor,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {Math.abs(trend.value)}%
                </Text>
                <Text
                  variant="caption"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: 12,
                    marginLeft: 4,
                  }}
                >
                  {trend.period}
                </Text>
              </View>
            )}
          </View>

          {/* Right Content - Additional visual element */}
          {icon && (
            <View style={rightContentStyles}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: (customTheme?.iconColor || theme.colors.primary) + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name={icon}
                  size={24}
                  color={customTheme?.iconColor || theme.colors.primary}
                />
              </View>
            </View>
          )}
        </View>
      </Card>
    </CardComponent>
  );
};

export default StatsCard;

