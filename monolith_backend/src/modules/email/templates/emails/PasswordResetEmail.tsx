import React from 'react';
import { Text, Section, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';

interface PasswordResetEmailProps {
  user: {
    name: string;
    email?: string;
  };
  resetUrl: string;
  expiresIn?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  user,
  resetUrl,
  expiresIn = '1 hour',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support',
}) => {
  const preview = `Reset your ${appName} password - secure link inside`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
    >
      <Heading className="text-2xl font-bold text-gray-800 mb-6">
        Reset Your Password 🔐
      </Heading>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Hi {user.name},
      </Text>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        We received a request to reset the password for your {appName} account. If you made this request, click the button below to create a new password.
      </Text>
      
      <div className="text-center mb-6">
        <Button href={resetUrl} variant="primary" size="lg">
          Reset My Password
        </Button>
      </div>
      
      <Section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
        <Text className="text-yellow-800 font-medium mb-2">
          ⚠️ Important Security Information
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          • This password reset link will expire in <strong>{expiresIn}</strong>
        </Text>
        <Text className="text-yellow-700 text-sm mb-2">
          • The link can only be used once
        </Text>
        <Text className="text-yellow-700 text-sm mb-0">
          • If you didn't request this reset, you can safely ignore this email
        </Text>
      </Section>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        If the button above doesn't work, you can copy and paste this link into your browser:
      </Text>
      
      <Section className="bg-gray-100 rounded p-4 mb-6">
        <Text className="text-sm text-gray-700 break-all font-mono">
          {resetUrl}
        </Text>
      </Section>
      
      <Section className="bg-red-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-red-800 mb-3">
          🛡️ Didn't Request This?
        </Heading>
        <Text className="text-red-700 text-sm mb-2">
          If you didn't request a password reset, your account is still secure. Here's what you should do:
        </Text>
        <Text className="text-red-700 text-sm mb-2">
          • Simply ignore this email - no action is required
        </Text>
        <Text className="text-red-700 text-sm mb-2">
          • Consider changing your password if you're concerned about account security
        </Text>
        <Text className="text-red-700 text-sm mb-0">
          • Contact our support team if you have any concerns
        </Text>
      </Section>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        For your security, we recommend choosing a strong password that:
      </Text>
      
      <Text className="text-gray-600 text-sm mb-2">
        • Is at least 8 characters long
      </Text>
      <Text className="text-gray-600 text-sm mb-2">
        • Contains a mix of uppercase and lowercase letters
      </Text>
      <Text className="text-gray-600 text-sm mb-2">
        • Includes numbers and special characters
      </Text>
      <Text className="text-gray-600 text-sm mb-6">
        • Is unique to your {appName} account
      </Text>
      
      <div className="text-center mb-6">
        <Button href={supportUrl} variant="outline" size="md">
          Contact Support
        </Button>
      </div>
      
      <Text className="text-gray-600 text-base leading-relaxed">
        If you continue to have trouble accessing your account, please don't hesitate to reach out to our support team. We're here to help!
      </Text>
      
      <Text className="text-gray-800 font-medium mt-4">
        Best regards,<br />
        The {appName} Security Team
      </Text>
    </EmailLayout>
  );
};

export default PasswordResetEmail;
