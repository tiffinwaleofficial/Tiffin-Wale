import React from 'react';
import { Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';

interface SubscriptionCreatedEmailProps {
  subscription: { customerName: string; planName: string };
  manageUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const SubscriptionCreatedEmail: React.FC<SubscriptionCreatedEmailProps> = ({
  subscription, manageUrl = '#', appName = 'Tiffin-Wale', appUrl = 'https://tiffin-wale.com'
}) => {
  return (
    <EmailLayout preview="Subscription activated successfully!" appName={appName} appUrl={appUrl}>
      <Heading className="text-2xl font-bold text-gray-800 mb-6 text-center">Subscription Activated! 🎉</Heading>
      <Text className="text-gray-600 text-base leading-relaxed mb-4">Hi {subscription.customerName}, your {subscription.planName} subscription is now active!</Text>
      <div className="text-center mb-6"><Button href={manageUrl} variant="primary" size="lg">Manage Subscription</Button></div>
    </EmailLayout>
  );
};

export default SubscriptionCreatedEmail;
