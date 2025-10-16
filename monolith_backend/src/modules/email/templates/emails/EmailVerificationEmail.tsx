import React from 'react';
import { Text, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';

interface EmailVerificationEmailProps {
  user: { name: string; email: string };
  verificationUrl: string;
  appName?: string;
  appUrl?: string;
}

export const EmailVerificationEmail: React.FC<EmailVerificationEmailProps> = ({
  user,
  verificationUrl,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}) => {
  return (
    <EmailLayout preview={`Verify your email address for ${appName}`} appName={appName} appUrl={appUrl}>
      <Heading className="text-2xl font-bold text-gray-800 mb-6">
        Verify Your Email Address 📧
      </Heading>
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Hi {user.name}, please click the button below to verify your email address.
      </Text>
      <div className="text-center mb-6">
        <Button href={verificationUrl} variant="primary" size="lg">
          Verify Email Address
        </Button>
      </div>
    </EmailLayout>
  );
};

export default EmailVerificationEmail;
