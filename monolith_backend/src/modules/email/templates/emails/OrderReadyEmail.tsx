import React from 'react';
import { Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

interface OrderReadyEmailProps {
  order: {
    orderNumber: string;
    customerName: string;
    partnerName: string;
  };
  trackingUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const OrderReadyEmail: React.FC<OrderReadyEmailProps> = ({
  order,
  trackingUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}) => {
  return (
    <EmailLayout preview={`Your order #${order.orderNumber} is ready!`} appName={appName} appUrl={appUrl}>
      <div className="text-center mb-6">
        <StatusBadge status="ready" />
      </div>
      <Heading className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Order is Ready! 🍽️
      </Heading>
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Hi {order.customerName}, your delicious meal from {order.partnerName} is ready and on its way to you!
      </Text>
      <div className="text-center mb-6">
        <Button href={trackingUrl} variant="primary" size="lg">
          Track Delivery
        </Button>
      </div>
    </EmailLayout>
  );
};

export default OrderReadyEmail;
