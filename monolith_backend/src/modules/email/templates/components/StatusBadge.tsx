import React from 'react';
import { Text } from '@react-email/components';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'success' | 'failed';
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Confirmed',
    },
    preparing: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Preparing',
    },
    ready: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Ready',
    },
    delivered: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Delivered',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Success',
    },
    failed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Failed',
    },
  };

  const config = statusConfig[status];
  const displayText = children || config.label;

  return (
    <Text
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${config.bg} ${config.text} m-0`}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        margin: 0,
      }}
    >
      {displayText}
    </Text>
  );
};

export default StatusBadge;
