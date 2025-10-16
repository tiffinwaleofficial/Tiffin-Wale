import React from 'react';
import { Text, Section, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';

interface WelcomeEmailProps {
  user: {
    name: string;
    email: string;
  };
  appName?: string;
  appUrl?: string;
  loginUrl?: string;
  dashboardUrl?: string;
  supportUrl?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  user,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  loginUrl = 'https://tiffin-wale.com/login',
  dashboardUrl = 'https://tiffin-wale.com/dashboard',
  supportUrl = 'https://tiffin-wale.com/support',
}) => {
  const preview = `Welcome to ${appName}, ${user.name}! Start your delicious journey today.`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
    >
      <Heading className="text-2xl font-bold text-gray-800 mb-6">
        Welcome to {appName}, {user.name}! 🎉
      </Heading>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        We're thrilled to have you join our community of food lovers! {appName} connects you with the best local food providers, delivering fresh, delicious meals right to your doorstep.
      </Text>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-6">
        Your account has been created with the email address: <strong>{user.email}</strong>
      </Text>
      
      <Section className="bg-orange-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          🚀 Get Started in 3 Easy Steps:
        </Heading>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">1. Browse Local Partners</Text>
          <Text className="text-gray-600 text-sm">
            Discover amazing local food providers in your area and explore their delicious offerings.
          </Text>
        </div>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">2. Choose Your Plan</Text>
          <Text className="text-gray-600 text-sm">
            Select from daily, weekly, or monthly subscription plans that fit your lifestyle.
          </Text>
        </div>
        
        <div className="mb-0">
          <Text className="font-medium text-gray-800 mb-1">3. Enjoy Fresh Meals</Text>
          <Text className="text-gray-600 text-sm">
            Sit back and enjoy fresh, home-cooked meals delivered on time, every time.
          </Text>
        </div>
      </Section>
      
      <div className="text-center mb-6">
        <Button href={dashboardUrl} variant="primary" size="lg">
          Explore Food Partners
        </Button>
      </div>
      
      <Section className="bg-green-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-3">
          💡 Pro Tips for New Users:
        </Heading>
        
        <Text className="text-gray-600 text-sm mb-2">
          • <strong>Set your preferences:</strong> Let us know about dietary restrictions and favorite cuisines
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          • <strong>Schedule deliveries:</strong> Choose convenient delivery times that work for you
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          • <strong>Rate your meals:</strong> Help us improve by rating your experience
        </Text>
        <Text className="text-gray-600 text-sm mb-0">
          • <strong>Refer friends:</strong> Share the love and earn rewards for successful referrals
        </Text>
      </Section>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        If you have any questions or need assistance getting started, our friendly support team is here to help. Just reply to this email or visit our support center.
      </Text>
      
      <div className="text-center mb-6">
        <Button href={supportUrl} variant="outline" size="md">
          Get Help & Support
        </Button>
      </div>
      
      <Text className="text-gray-600 text-base leading-relaxed">
        Welcome aboard, and we can't wait to serve you delicious meals!
      </Text>
      
      <Text className="text-gray-800 font-medium mt-4">
        Best regards,<br />
        The {appName} Team
      </Text>
    </EmailLayout>
  );
};

export default WelcomeEmail;
