import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { TiffinIcon, TrophyIcon, StarIcon, GiftIcon, UserIcon } from '../components/Icons';

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
      headerGradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    >
      {/* Welcome Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#ecfdf5',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <TrophyIcon size={64} color="#10b981" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Welcome to {appName} Partner Program! 🤝
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {partner.name}, congratulations on joining our partner network!
            </Text>
          </td>
        </tr>
      </table>

      {/* Business Details */}
      <InfoCard 
        title="🏢 Your Business Details"
        icon={<UserIcon size={28} color="#10b981" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td style={{ paddingBottom: '12px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Partner ID:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ 
                      fontSize: '14px', 
                      color: '#1f2937', 
                      fontWeight: '600',
                      fontFamily: 'monospace',
                      margin: 0,
                    }}>
                      {partner.partnerId}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '12px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Business Name:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {partner.businessName}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Contact Email:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {partner.email}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* Setup Steps */}
      <InfoCard 
        title="🚀 Get Started in 4 Steps"
        bgColor="#fff7ed"
        borderColor="#f97316"
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td style={{ paddingBottom: '16px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40" style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>1</div>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Complete Your Profile
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Add your business details, photos, and operating hours to attract customers.
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '16px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40" style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>2</div>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Set Up Your Menu
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Upload your delicious offerings with descriptions, prices, and mouth-watering photos.
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ paddingBottom: '16px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40" style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>3</div>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Configure Delivery
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Set your delivery areas, timing, and preferences to optimize your operations.
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40" style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}>4</div>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Go Live!
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Start receiving orders and growing your customer base with {appName}.
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* Setup CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={onboardingUrl} 
              variant="primary" 
              size="lg"
              icon={<TiffinIcon size={20} color="#ffffff" />}
            >
              🚀 Complete Setup Now
            </Button>
          </td>
        </tr>
      </table>

      {/* Partner Benefits */}
      <InfoCard 
        title="💰 Partner Benefits & Features"
        icon={<StarIcon size={28} color="#fbbf24" />}
        bgColor="#fffbeb"
        borderColor="#fbbf24"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Real-time Order Management:</strong> Receive and manage orders instantly
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Analytics Dashboard:</strong> Track your performance and earnings
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Customer Reviews:</strong> Build your reputation with customer feedback
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Marketing Support:</strong> Get featured in our promotional campaigns
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Weekly Payouts:</strong> Reliable and timely payment processing
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          ✅ <strong>24/7 Support:</strong> Dedicated partner support team
        </Text>
      </InfoCard>

      {/* Mobile App */}
      <InfoCard 
        title="📱 Download the Partner App"
        bgColor="#f3f4f6"
        borderColor="#6b7280"
      >
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 16px 0', lineHeight: '1.6' }}>
          Manage your orders on the go with our mobile partner app. Available for both iOS and Android.
        </Text>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td width="50%" style={{ paddingRight: '8px' }}>
              <Button href="#" variant="outline" size="sm" fullWidth>
                📱 Download for iOS
              </Button>
            </td>
            <td width="50%" style={{ paddingLeft: '8px' }}>
              <Button href="#" variant="outline" size="sm" fullWidth>
                🤖 Download for Android
              </Button>
            </td>
          </tr>
        </table>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Dashboard Access */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <Button href={dashboardUrl} variant="secondary" size="lg">
              📊 Access Partner Dashboard
            </Button>
          </td>
        </tr>
      </table>

      {/* Support */}
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }}>
              Need help getting started?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Partner Support
            </Button>
          </td>
        </tr>
      </table>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: 0,
              lineHeight: '1.6',
            }}>
              We're thrilled to have <strong style={{ color: '#10b981' }}>{partner.businessName}</strong> as part of the {appName} family!
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default PartnerWelcomeEmail;
