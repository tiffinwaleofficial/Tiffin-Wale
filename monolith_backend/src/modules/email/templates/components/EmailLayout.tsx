import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  appName?: string;
  appUrl?: string;
  supportEmail?: string;
  currentYear?: number;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
  preview = '',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportEmail = 'support@tiffin-wale.com',
  currentYear = new Date().getFullYear(),
}) => {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            {/* Header */}
            <Section className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-lg p-8 text-center">
              <Img
                src={`${appUrl}/assets/logo-white.png`}
                alt={`${appName} Logo`}
                className="mx-auto mb-4"
                width="120"
                height="40"
              />
              <Text className="text-white text-2xl font-bold m-0">
                🍱 {appName}
              </Text>
              <Text className="text-orange-100 text-sm m-0 mt-2">
                Delicious meals delivered fresh to your doorstep
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              {children}
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 px-8 py-6 rounded-b-lg">
              <Hr className="border-gray-300 my-4" />
              
              <Text className="text-gray-600 text-sm text-center m-0 mb-4">
                You're receiving this email because you have an account with {appName}.
              </Text>
              
              <Text className="text-gray-600 text-sm text-center m-0 mb-4">
                Need help? Contact us at{' '}
                <Link
                  href={`mailto:${supportEmail}`}
                  className="text-orange-500 underline"
                >
                  {supportEmail}
                </Link>
              </Text>
              
              <Text className="text-gray-500 text-xs text-center m-0">
                © {currentYear} {appName}. All rights reserved.
              </Text>
              
              <Text className="text-gray-500 text-xs text-center m-0 mt-2">
                <Link
                  href={`${appUrl}/unsubscribe`}
                  className="text-gray-500 underline"
                >
                  Unsubscribe
                </Link>
                {' | '}
                <Link
                  href={`${appUrl}/privacy`}
                  className="text-gray-500 underline"
                >
                  Privacy Policy
                </Link>
                {' | '}
                <Link
                  href={`${appUrl}/terms`}
                  className="text-gray-500 underline"
                >
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
