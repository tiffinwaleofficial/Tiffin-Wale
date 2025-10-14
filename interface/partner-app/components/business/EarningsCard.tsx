import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Card from '../layout/Card';
import Text from '../ui/Text';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

export interface EarningsPeriod {
  label: string;
  value: number;
  change?: number;
  isPositive?: boolean;
}

export interface EarningsCardProps {
  totalEarnings: number;
  todayEarnings: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  periods: EarningsPeriod[];
  onViewDetails?: () => void;
  onWithdraw?: () => void;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const EarningsCard: React.FC<EarningsCardProps> = ({
  totalEarnings,
  todayEarnings,
  thisWeekEarnings,
  thisMonthEarnings,
  periods,
  onViewDetails,
  onWithdraw,
  style,
  theme: customTheme,
}: EarningsCardProps) => {
  const { theme } = useTheme();

  const cardStyles: ViewStyle = {
    marginBottom: 16,
    ...style,
  };

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  };

  const totalStyles: ViewStyle = {
    alignItems: 'flex-start',
  };

  const actionsStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };

  const periodGridStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  };

  const periodItemStyles: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  };

  const periodDividerStyles: ViewStyle = {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  };

  const periodsListStyles: ViewStyle = {
    marginBottom: 16,
  };

  const periodRowStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  };

  const periodLabelStyles: ViewStyle = {
    flex: 1,
  };

  const periodValueStyles: ViewStyle = {
    alignItems: 'flex-end',
  };

  const getChangeColor = (isPositive?: boolean) => {
    return isPositive ? theme.colors.success : theme.colors.error;
  };

  const getChangeIcon = (isPositive?: boolean) => {
    return isPositive ? 'trending-up' : 'trending-down';
  };

  return (
    <Card style={cardStyles} theme={customTheme}>
      {/* Header */}
      <View style={headerStyles}>
        <View style={totalStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 4,
            }}
          >
            Total Earnings
          </Text>
          <Text
            variant="title"
            style={{
              color: theme.colors.primary,
              fontSize: 28,
              fontWeight: '700',
            }}
          >
            ₹{totalEarnings.toLocaleString()}
          </Text>
        </View>

        <View style={actionsStyles}>
          {onWithdraw && (
            <Button
              variant="outline"
              size="sm"
              title="Withdraw"
              onPress={onWithdraw}
              style={{ marginRight: 8 }}
            />
          )}
          
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              title="Details"
              onPress={onViewDetails}
            />
          )}
        </View>
      </View>

      {/* Period Grid */}
      <View style={periodGridStyles}>
        <View style={periodItemStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            Today
          </Text>
          <Text
            variant="title"
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            ₹{todayEarnings.toLocaleString()}
          </Text>
        </View>

        <View style={periodDividerStyles} />

        <View style={periodItemStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            This Week
          </Text>
          <Text
            variant="title"
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            ₹{thisWeekEarnings.toLocaleString()}
          </Text>
        </View>

        <View style={periodDividerStyles} />

        <View style={periodItemStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            This Month
          </Text>
          <Text
            variant="title"
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            ₹{thisMonthEarnings.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Periods List */}
      {periods.length > 0 && (
        <View style={periodsListStyles}>
          <Text
            variant="caption"
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 8,
            }}
          >
            Earnings Breakdown
          </Text>
          
          {periods.map((period, index) => (
            <View key={index} style={periodRowStyles}>
              <View style={periodLabelStyles}>
                <Text
                  variant="body"
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                  }}
                >
                  {period.label}
                </Text>
              </View>
              
              <View style={periodValueStyles}>
                <Text
                  variant="body"
                  style={{
                    color: theme.colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  ₹{period.value.toLocaleString()}
                </Text>
                
                {period.change !== undefined && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Icon
                      name={getChangeIcon(period.isPositive)}
                      size={12}
                      color={getChangeColor(period.isPositive)}
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      variant="caption"
                      style={{
                        color: getChangeColor(period.isPositive),
                        fontSize: 11,
                        fontWeight: '600',
                      }}
                    >
                      {Math.abs(period.change)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

export default EarningsCard;

