import React from 'react';
import { Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

interface OrderDeliveredEmailProps {
  order: { orderNumber: string; customerName: string };
  ratingUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const OrderDeliveredEmail: React.FC<OrderDeliveredEmailProps> = ({
  order, ratingUrl = '#', appName = 'Tiffin-Wale', appUrl = 'https://tiffin-wale.com'
}) => {
  return (
    <EmailLayout preview={`Order #${order.orderNumber} delivered! Rate your experience`} appName={appName} appUrl={appUrl}>
      <div className="text-center mb-6"><StatusBadge status="delivered" /></div>
      <Heading className="text-2xl font-bold text-gray-800 mb-6 text-center">Order Delivered! 🎉</Heading>
      <Text className="text-gray-600 text-base leading-relaxed mb-4">Hi {order.customerName}, your order has been delivered! We hope you enjoyed your meal.</Text>
      <div className="text-center mb-6"><Button href={ratingUrl} variant="primary" size="lg">Rate Your Experience</Button></div>
    </EmailLayout>
  );
};

export default OrderDeliveredEmail;
