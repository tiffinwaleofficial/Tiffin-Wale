import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';
import Badge from '../ui/Badge';
import Text from '../ui/Text';
import Icon from '../ui/Icon';

export interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'delivery' | 'general';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  style?: ViewStyle;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'general',
  size = 'md',
  showIcon = true,
  style,
  theme: customTheme,
}: StatusBadgeProps) => {
  const { theme } = useTheme();

  const getStatusConfig = (statusValue: string, statusType: string) => {
    const configs = {
      order: {
        pending: {
          label: 'Pending',
          color: theme.colors.warning,
          backgroundColor: theme.colors.warning + '20',
          icon: 'clock',
        },
        confirmed: {
          label: 'Confirmed',
          color: theme.colors.info,
          backgroundColor: theme.colors.info + '20',
          icon: 'check-circle',
        },
        preparing: {
          label: 'Preparing',
          color: theme.colors.primary,
          backgroundColor: theme.colors.primary + '20',
          icon: 'chef-hat',
        },
        ready: {
          label: 'Ready',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'check',
        },
        delivered: {
          label: 'Delivered',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'truck',
        },
        cancelled: {
          label: 'Cancelled',
          color: theme.colors.error,
          backgroundColor: theme.colors.error + '20',
          icon: 'x-circle',
        },
      },
      payment: {
        pending: {
          label: 'Pending',
          color: theme.colors.warning,
          backgroundColor: theme.colors.warning + '20',
          icon: 'clock',
        },
        processing: {
          label: 'Processing',
          color: theme.colors.info,
          backgroundColor: theme.colors.info + '20',
          icon: 'loader',
        },
        completed: {
          label: 'Paid',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'check-circle',
        },
        failed: {
          label: 'Failed',
          color: theme.colors.error,
          backgroundColor: theme.colors.error + '20',
          icon: 'x-circle',
        },
        refunded: {
          label: 'Refunded',
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.border,
          icon: 'rotate-ccw',
        },
      },
      delivery: {
        scheduled: {
          label: 'Scheduled',
          color: theme.colors.info,
          backgroundColor: theme.colors.info + '20',
          icon: 'calendar',
        },
        picked_up: {
          label: 'Picked Up',
          color: theme.colors.primary,
          backgroundColor: theme.colors.primary + '20',
          icon: 'package',
        },
        in_transit: {
          label: 'In Transit',
          color: theme.colors.warning,
          backgroundColor: theme.colors.warning + '20',
          icon: 'truck',
        },
        delivered: {
          label: 'Delivered',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'check-circle',
        },
        failed: {
          label: 'Failed',
          color: theme.colors.error,
          backgroundColor: theme.colors.error + '20',
          icon: 'x-circle',
        },
      },
      general: {
        active: {
          label: 'Active',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'check-circle',
        },
        inactive: {
          label: 'Inactive',
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.border,
          icon: 'pause-circle',
        },
        available: {
          label: 'Available',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'check',
        },
        unavailable: {
          label: 'Unavailable',
          color: theme.colors.error,
          backgroundColor: theme.colors.error + '20',
          icon: 'x',
        },
        online: {
          label: 'Online',
          color: theme.colors.success,
          backgroundColor: theme.colors.success + '20',
          icon: 'wifi',
        },
        offline: {
          label: 'Offline',
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.border,
          icon: 'wifi-off',
        },
      },
    };

    const typeConfigs = configs[statusType as keyof typeof configs];
    const statusConfig = typeConfigs?.[statusValue as keyof typeof typeConfigs];
    
    if (statusConfig) {
      return statusConfig;
    }
    
    return {
      label: statusValue,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.border,
      icon: 'circle',
    };
  };

  const statusConfig = getStatusConfig(status, type);

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          fontSize: 10,
          iconSize: 10,
        };
      case 'lg':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 14,
          iconSize: 16,
        };
      default:
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 12,
          iconSize: 12,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const badgeStyles: ViewStyle = {
    backgroundColor: customTheme?.backgroundColor || statusConfig.backgroundColor,
    borderColor: customTheme?.borderColor || statusConfig.color,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    ...style,
  };

  return (
    <View style={badgeStyles}>
      {showIcon && (
        <Icon
          name={statusConfig.icon}
          size={sizeConfig.iconSize}
          color={customTheme?.textColor || statusConfig.color}
          style={{ marginRight: 4 }}
        />
      )}
      
      <Text
        variant="caption"
        style={{
          color: customTheme?.textColor || statusConfig.color,
          fontSize: sizeConfig.fontSize,
          fontWeight: '600',
        }}
      >
        {statusConfig.label}
      </Text>
    </View>
  );
};

export default StatusBadge;
