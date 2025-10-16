import React from 'react';
import { Text, Section, Heading, Row, Column } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import OrderSummary from '../components/OrderSummary';
import StatusBadge from '../components/StatusBadge';

interface OrderConfirmationEmailProps {
  order: {
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      description?: string;
    }>;
    totalAmount: number;
    subtotal: number;
    deliveryFee?: number;
    tax?: number;
    deliveryAddress: string;
    estimatedDeliveryTime: string;
    partnerName: string;
    partnerPhone?: string;
  };
  trackingUrl?: string;
  supportUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  order,
  trackingUrl = '#',
  supportUrl = 'https://tiffin-wale.com/support',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}) => {
  const preview = `Order confirmed! Your delicious meal from ${order.partnerName} is on its way.`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
    >
      <div className="text-center mb-6">
        <StatusBadge status="confirmed" />
      </div>
      
      <Heading className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Order Confirmed! 🎉
      </Heading>
      
      <Text className="text-gray-600 text-base text-center mb-6">
        Hi {order.customerName}, your order has been confirmed and is being prepared by {order.partnerName}.
      </Text>
      
      {/* Order Details */}
      <OrderSummary
        orderNumber={order.orderNumber}
        items={order.items}
        subtotal={order.subtotal}
        deliveryFee={order.deliveryFee}
        tax={order.tax}
        total={order.totalAmount}
      />
      
      {/* Delivery Information */}
      <Section className="bg-blue-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          📍 Delivery Information
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="font-medium text-gray-700 m-0">Delivery Address:</Text>
          </Column>
          <Column className="w-2/3">
            <Text className="text-gray-600 m-0">{order.deliveryAddress}</Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/3">
            <Text className="font-medium text-gray-700 m-0">Estimated Time:</Text>
          </Column>
          <Column className="w-2/3">
            <Text className="text-gray-600 m-0">{order.estimatedDeliveryTime}</Text>
          </Column>
        </Row>
        
        <Row className="mb-0">
          <Column className="w-1/3">
            <Text className="font-medium text-gray-700 m-0">Partner:</Text>
          </Column>
          <Column className="w-2/3">
            <Text className="text-gray-600 m-0">
              {order.partnerName}
              {order.partnerPhone && (
                <span className="block text-sm">📞 {order.partnerPhone}</span>
              )}
            </Text>
          </Column>
        </Row>
      </Section>
      
      {/* What's Next */}
      <Section className="bg-green-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          ⏰ What Happens Next?
        </Heading>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">1. Order Preparation</Text>
          <Text className="text-gray-600 text-sm">
            {order.partnerName} is now preparing your fresh meal with care.
          </Text>
        </div>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">2. Quality Check</Text>
          <Text className="text-gray-600 text-sm">
            We ensure your meal meets our quality standards before dispatch.
          </Text>
        </div>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">3. On the Way</Text>
          <Text className="text-gray-600 text-sm">
            You'll receive a notification when your order is out for delivery.
          </Text>
        </div>
        
        <div className="mb-0">
          <Text className="font-medium text-gray-800 mb-1">4. Enjoy!</Text>
          <Text className="text-gray-600 text-sm">
            Receive your delicious meal and don't forget to rate your experience.
          </Text>
        </div>
      </Section>
      
      {/* Action Buttons */}
      <div className="text-center mb-6">
        <Button href={trackingUrl} variant="primary" size="lg" fullWidth>
          Track Your Order
        </Button>
      </div>
      
      <div className="text-center mb-6">
        <Button href={supportUrl} variant="outline" size="md">
          Need Help?
        </Button>
      </div>
      
      <Text className="text-gray-600 text-sm text-center mb-4">
        We'll send you updates as your order progresses. You can also track your order anytime using the button above.
      </Text>
      
      <Text className="text-gray-800 font-medium">
        Thank you for choosing {appName}!<br />
        The {appName} Team
      </Text>
    </EmailLayout>
  );
};

export default OrderConfirmationEmail;
