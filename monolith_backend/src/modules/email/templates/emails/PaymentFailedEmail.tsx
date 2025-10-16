import React from 'react';
import { Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

interface PaymentFailedEmailProps {
  payment: { customerName: string; amount: number; reason: string; retryUrl: string };
  appName?: string;
  appUrl?: string;
}

export const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({
  payment, appName = 'Tiffin-Wale', appUrl = 'https://tiffin-wale.com'
}) => {
  return (
    <EmailLayout preview="Payment failed - action required" appName={appName} appUrl={appUrl}>
      <div className="text-center mb-6"><StatusBadge status="failed" /></div>
      <Heading className="text-2xl font-bold text-gray-800 mb-6 text-center">Payment Failed ⚠️</Heading>
      <Text className="text-gray-600 text-base leading-relaxed mb-4">Hi {payment.customerName}, we couldn't process your payment of ₹{payment.amount}. Reason: {payment.reason}</Text>
      <div className="text-center mb-6"><Button href={payment.retryUrl} variant="primary" size="lg">Retry Payment</Button></div>
    </EmailLayout>
  );
};

export default PaymentFailedEmail;
