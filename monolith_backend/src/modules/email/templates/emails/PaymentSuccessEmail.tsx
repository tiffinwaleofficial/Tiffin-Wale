import React from 'react';
import { Text, Section, Heading, Row, Column } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

interface PaymentSuccessEmailProps {
  payment: {
    customerName: string;
    amount: number;
    paymentId: string;
    orderNumber?: string;
    subscriptionId?: string;
    paymentMethod?: string;
    transactionDate?: string;
  };
  receiptUrl?: string;
  supportUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const PaymentSuccessEmail: React.FC<PaymentSuccessEmailProps> = ({
  payment,
  receiptUrl = '#',
  supportUrl = 'https://tiffin-wale.com/support',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}) => {
  const preview = `Payment successful! Your transaction of ₹${payment.amount} has been processed.`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-IN');
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
    >
      <div className="text-center mb-6">
        <StatusBadge status="success">Payment Successful</StatusBadge>
      </div>
      
      <Heading className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Payment Confirmed! ✅
      </Heading>
      
      <Text className="text-gray-600 text-base text-center mb-6">
        Hi {payment.customerName}, your payment has been successfully processed.
      </Text>
      
      {/* Payment Details */}
      <Section className="bg-green-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          💳 Payment Details
        </Heading>
        
        <Row className="mb-3">
          <Column className="w-1/2">
            <Text className="font-medium text-gray-700 m-0">Amount Paid:</Text>
          </Column>
          <Column className="w-1/2 text-right">
            <Text className="text-xl font-bold text-green-600 m-0">
              {formatCurrency(payment.amount)}
            </Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/2">
            <Text className="font-medium text-gray-700 m-0">Transaction ID:</Text>
          </Column>
          <Column className="w-1/2 text-right">
            <Text className="text-gray-600 font-mono text-sm m-0">
              {payment.paymentId}
            </Text>
          </Column>
        </Row>
        
        <Row className="mb-3">
          <Column className="w-1/2">
            <Text className="font-medium text-gray-700 m-0">Date & Time:</Text>
          </Column>
          <Column className="w-1/2 text-right">
            <Text className="text-gray-600 m-0">
              {formatDate(payment.transactionDate)}
            </Text>
          </Column>
        </Row>
        
        {payment.paymentMethod && (
          <Row className="mb-3">
            <Column className="w-1/2">
              <Text className="font-medium text-gray-700 m-0">Payment Method:</Text>
            </Column>
            <Column className="w-1/2 text-right">
              <Text className="text-gray-600 m-0">{payment.paymentMethod}</Text>
            </Column>
          </Row>
        )}
        
        {payment.orderNumber && (
          <Row className="mb-3">
            <Column className="w-1/2">
              <Text className="font-medium text-gray-700 m-0">Order Number:</Text>
            </Column>
            <Column className="w-1/2 text-right">
              <Text className="text-gray-600 m-0">#{payment.orderNumber}</Text>
            </Column>
          </Row>
        )}
        
        {payment.subscriptionId && (
          <Row className="mb-0">
            <Column className="w-1/2">
              <Text className="font-medium text-gray-700 m-0">Subscription:</Text>
            </Column>
            <Column className="w-1/2 text-right">
              <Text className="text-gray-600 m-0">{payment.subscriptionId}</Text>
            </Column>
          </Row>
        )}
      </Section>
      
      {/* What's Next */}
      {payment.orderNumber && (
        <Section className="bg-blue-50 rounded-lg p-6 mb-6">
          <Heading className="text-lg font-semibold text-gray-800 mb-4">
            🍽️ What's Next?
          </Heading>
          
          <Text className="text-gray-600 text-sm mb-3">
            Your payment for order #{payment.orderNumber} has been confirmed. Here's what happens next:
          </Text>
          
          <div className="mb-2">
            <Text className="font-medium text-gray-800 mb-1">✓ Payment Processed</Text>
            <Text className="text-gray-600 text-sm">Your payment has been successfully charged and confirmed.</Text>
          </div>
          
          <div className="mb-2">
            <Text className="font-medium text-gray-800 mb-1">🍳 Order Preparation</Text>
            <Text className="text-gray-600 text-sm">Your order is now being prepared by our partner restaurant.</Text>
          </div>
          
          <div className="mb-0">
            <Text className="font-medium text-gray-800 mb-1">🚚 Delivery Updates</Text>
            <Text className="text-gray-600 text-sm">You'll receive notifications as your order progresses to delivery.</Text>
          </div>
        </Section>
      )}
      
      {payment.subscriptionId && (
        <Section className="bg-purple-50 rounded-lg p-6 mb-6">
          <Heading className="text-lg font-semibold text-gray-800 mb-4">
            🔄 Subscription Active
          </Heading>
          
          <Text className="text-gray-600 text-sm mb-3">
            Your subscription payment has been processed successfully. Your subscription is now active and you can:
          </Text>
          
          <Text className="text-gray-600 text-sm mb-2">
            • Browse and order from partner restaurants
          </Text>
          <Text className="text-gray-600 text-sm mb-2">
            • Enjoy exclusive subscriber benefits and discounts
          </Text>
          <Text className="text-gray-600 text-sm mb-0">
            • Manage your subscription anytime from your account
          </Text>
        </Section>
      )}
      
      {/* Action Buttons */}
      <div className="text-center mb-4">
        <Button href={receiptUrl} variant="primary" size="lg">
          Download Receipt
        </Button>
      </div>
      
      <div className="text-center mb-6">
        <Button href={`${appUrl}/orders`} variant="outline" size="md">
          View My Orders
        </Button>
      </div>
      
      <Section className="bg-gray-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-3">
          📄 Need a Receipt?
        </Heading>
        <Text className="text-gray-600 text-sm mb-3">
          You can download your payment receipt anytime from your account dashboard or by clicking the button above.
        </Text>
        <Text className="text-gray-600 text-sm mb-0">
          For tax purposes, all receipts include your transaction details and can be used for expense reporting.
        </Text>
      </Section>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Thank you for your payment! If you have any questions about this transaction or need assistance, our support team is here to help.
      </Text>
      
      <div className="text-center mb-6">
        <Button href={supportUrl} variant="outline" size="md">
          Contact Support
        </Button>
      </div>
      
      <Text className="text-gray-800 font-medium">
        Thank you for choosing {appName}!<br />
        The {appName} Team
      </Text>
    </EmailLayout>
  );
};

export default PaymentSuccessEmail;
