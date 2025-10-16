import React from 'react';
import { Text, Section, Heading } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';

interface PartnerWelcomeEmailProps {
  partner: {
    name: string;
    email: string;
    businessName: string;
    partnerId: string;
  };
  dashboardUrl?: string;
  onboardingUrl?: string;
  supportUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const PartnerWelcomeEmail: React.FC<PartnerWelcomeEmailProps> = ({
  partner,
  dashboardUrl = 'https://tiffin-wale.com/partner/dashboard',
  onboardingUrl = 'https://tiffin-wale.com/partner/onboarding',
  supportUrl = 'https://tiffin-wale.com/partner/support',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}) => {
  const preview = `Welcome to ${appName} Partner Program! Start growing your food business today.`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
    >
      <Heading className="text-2xl font-bold text-gray-800 mb-6">
        Welcome to {appName} Partner Program! 🤝
      </Heading>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Hi {partner.name},
      </Text>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Congratulations! <strong>{partner.businessName}</strong> has been approved to join the {appName} partner network. We're excited to help you grow your food business and reach more hungry customers!
      </Text>
      
      <Section className="bg-green-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          🚀 Your Partner Journey Starts Here
        </Heading>
        
        <Text className="text-gray-600 text-sm mb-3">
          <strong>Partner ID:</strong> {partner.partnerId}
        </Text>
        <Text className="text-gray-600 text-sm mb-3">
          <strong>Business Name:</strong> {partner.businessName}
        </Text>
        <Text className="text-gray-600 text-sm mb-0">
          <strong>Contact Email:</strong> {partner.email}
        </Text>
      </Section>
      
      <Section className="bg-orange-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          📋 Next Steps to Get Started:
        </Heading>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">1. Complete Your Profile</Text>
          <Text className="text-gray-600 text-sm">
            Add your business details, photos, and operating hours to attract customers.
          </Text>
        </div>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">2. Set Up Your Menu</Text>
          <Text className="text-gray-600 text-sm">
            Upload your delicious offerings with descriptions, prices, and mouth-watering photos.
          </Text>
        </div>
        
        <div className="mb-3">
          <Text className="font-medium text-gray-800 mb-1">3. Configure Delivery</Text>
          <Text className="text-gray-600 text-sm">
            Set your delivery areas, timing, and preferences to optimize your operations.
          </Text>
        </div>
        
        <div className="mb-0">
          <Text className="font-medium text-gray-800 mb-1">4. Go Live!</Text>
          <Text className="text-gray-600 text-sm">
            Start receiving orders and growing your customer base with {appName}.
          </Text>
        </div>
      </Section>
      
      <div className="text-center mb-6">
        <Button href={onboardingUrl} variant="primary" size="lg">
          Complete Setup
        </Button>
      </div>
      
      <Section className="bg-blue-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-4">
          💰 Partner Benefits & Features:
        </Heading>
        
        <Text className="text-gray-600 text-sm mb-2">
          ✅ <strong>Real-time Order Management:</strong> Receive and manage orders instantly
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          ✅ <strong>Analytics Dashboard:</strong> Track your performance and earnings
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          ✅ <strong>Customer Reviews:</strong> Build your reputation with customer feedback
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          ✅ <strong>Marketing Support:</strong> Get featured in our promotional campaigns
        </Text>
        <Text className="text-gray-600 text-sm mb-2">
          ✅ <strong>Weekly Payouts:</strong> Reliable and timely payment processing
        </Text>
        <Text className="text-gray-600 text-sm mb-0">
          ✅ <strong>24/7 Support:</strong> Dedicated partner support team
        </Text>
      </Section>
      
      <Section className="bg-purple-50 rounded-lg p-6 mb-6">
        <Heading className="text-lg font-semibold text-gray-800 mb-3">
          📱 Download the Partner App
        </Heading>
        <Text className="text-gray-600 text-sm mb-4">
          Manage your orders on the go with our mobile partner app. Available for both iOS and Android.
        </Text>
        
        <div className="text-center">
          <Button href="#" variant="outline" size="sm">
            Download for iOS
          </Button>
          <span className="mx-2"></span>
          <Button href="#" variant="outline" size="sm">
            Download for Android
          </Button>
        </div>
      </Section>
      
      <div className="text-center mb-6">
        <Button href={dashboardUrl} variant="secondary" size="lg">
          Access Partner Dashboard
        </Button>
      </div>
      
      <Text className="text-gray-600 text-base leading-relaxed mb-4">
        Our partner success team is here to help you every step of the way. If you have any questions or need assistance, don't hesitate to reach out.
      </Text>
      
      <div className="text-center mb-6">
        <Button href={supportUrl} variant="outline" size="md">
          Contact Partner Support
        </Button>
      </div>
      
      <Text className="text-gray-600 text-base leading-relaxed">
        We're thrilled to have {partner.businessName} as part of the {appName} family. Let's work together to deliver amazing food experiences to our customers!
      </Text>
      
      <Text className="text-gray-800 font-medium mt-4">
        Welcome aboard!<br />
        The {appName} Partner Team
      </Text>
    </EmailLayout>
  );
};

export default PartnerWelcomeEmail;
