import React from 'react';
import { Section, Row, Column, Text, Hr } from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

interface OrderSummaryProps {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
  currency?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderNumber,
  items,
  subtotal,
  deliveryFee = 0,
  tax = 0,
  total,
  currency = 'INR',
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Section className="bg-gray-50 rounded-lg p-6 my-6">
      <Text className="text-lg font-semibold text-gray-800 m-0 mb-4">
        Order #{orderNumber}
      </Text>
      
      {/* Order Items */}
      {items.map((item, index) => (
        <div key={index}>
          <Row className="mb-3">
            <Column className="w-3/4">
              <Text className="font-medium text-gray-800 m-0">
                {item.name}
              </Text>
              {item.description && (
                <Text className="text-sm text-gray-600 m-0 mt-1">
                  {item.description}
                </Text>
              )}
              <Text className="text-sm text-gray-600 m-0 mt-1">
                Qty: {item.quantity}
              </Text>
            </Column>
            <Column className="w-1/4 text-right">
              <Text className="font-medium text-gray-800 m-0">
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </Column>
          </Row>
          {index < items.length - 1 && <Hr className="border-gray-200 my-2" />}
        </div>
      ))}
      
      <Hr className="border-gray-300 my-4" />
      
      {/* Order Totals */}
      <Row className="mb-2">
        <Column className="w-3/4">
          <Text className="text-gray-600 m-0">Subtotal</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-gray-600 m-0">{formatCurrency(subtotal)}</Text>
        </Column>
      </Row>
      
      {deliveryFee > 0 && (
        <Row className="mb-2">
          <Column className="w-3/4">
            <Text className="text-gray-600 m-0">Delivery Fee</Text>
          </Column>
          <Column className="w-1/4 text-right">
            <Text className="text-gray-600 m-0">{formatCurrency(deliveryFee)}</Text>
          </Column>
        </Row>
      )}
      
      {tax > 0 && (
        <Row className="mb-2">
          <Column className="w-3/4">
            <Text className="text-gray-600 m-0">Tax</Text>
          </Column>
          <Column className="w-1/4 text-right">
            <Text className="text-gray-600 m-0">{formatCurrency(tax)}</Text>
          </Column>
        </Row>
      )}
      
      <Hr className="border-gray-300 my-3" />
      
      <Row>
        <Column className="w-3/4">
          <Text className="text-lg font-bold text-gray-800 m-0">Total</Text>
        </Column>
        <Column className="w-1/4 text-right">
          <Text className="text-lg font-bold text-orange-500 m-0">
            {formatCurrency(total)}
          </Text>
        </Column>
      </Row>
    </Section>
  );
};

export default OrderSummary;
