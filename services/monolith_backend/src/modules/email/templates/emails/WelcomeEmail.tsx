import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { TiffinIcon, GiftIcon, StarIcon, HeartIcon } from '../components/Icons';

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
      headerGradient="linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)"
    >
      {/* Hero Section */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 16px 0',
              lineHeight: '1.2',
            }}>
              Welcome to {appName}! 🎉
            </Text>
            <Text style={{
              fontSize: '18px',
              color: '#6b7280',
              margin: '0 0 8px 0',
              lineHeight: '1.6',
            }}>
              Hi {user.name}, we're thrilled to have you here!
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#9ca3af',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Account: <strong style={{ color: '#f97316' }}>{user.email}</strong>
            </Text>
          </td>
        </tr>
      </table>

      {/* Welcome Message */}
      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
        textAlign: 'center',
      }}>
        {appName} connects you with the best local food providers, delivering fresh, delicious meals right to your doorstep. Get ready for an amazing food experience!
      </Text>

      {/* CTA Button */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '40px' }}>
        <tr>
          <td align="center">
            <Button 
              href={dashboardUrl} 
              variant="primary" 
              size="lg"
              icon={<TiffinIcon size={20} color="#ffffff" />}
            >
              🚀 Start Exploring Food Partners
            </Button>
          </td>
        </tr>
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Getting Started Steps */}
      <InfoCard 
        title="🎯 Get Started in 3 Easy Steps"
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
                      Browse Local Partners
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Discover amazing local food providers in your area and explore their delicious offerings.
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
                      Choose Your Plan
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Select from daily, weekly, or monthly subscription plans that fit your lifestyle.
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
                    }}>3</div>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Enjoy Fresh Meals
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      Sit back and enjoy fresh, home-cooked meals delivered on time, every time.
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* Pro Tips */}
      <InfoCard 
        title="💡 Pro Tips for Success"
        icon={<StarIcon size={28} color="#fbbf24" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ⭐ <strong>Set your preferences:</strong> Let us know about dietary restrictions and favorite cuisines
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          📅 <strong>Schedule deliveries:</strong> Choose convenient delivery times that work for you
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ⭐ <strong>Rate your meals:</strong> Help us improve by rating your experience
        </Text>
        <Text style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6' }}>
          🎁 <strong>Refer friends:</strong> Share the love and earn rewards for successful referrals
        </Text>
      </InfoCard>

      {/* Special Offer */}
      <InfoCard 
        title="🎁 Special Welcome Offer!"
        icon={<GiftIcon size={28} color="#ec4899" />}
        bgColor="#fdf2f8"
        borderColor="#ec4899"
      >
        <Text style={{ fontSize: '15px', color: '#374151', margin: 0, lineHeight: '1.6' }}>
          Get <strong style={{ color: '#ec4899' }}>20% OFF</strong> on your first order! Use code <strong style={{ 
            backgroundColor: '#fce7f3',
            padding: '4px 12px',
            borderRadius: '6px',
            color: '#be185d',
            fontFamily: 'monospace',
            fontSize: '16px',
          }}>WELCOME20</strong> at checkout.
        </Text>
      </InfoCard>

      {/* Support Section */}
      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      <Text style={{
        fontSize: '15px',
        color: '#6b7280',
        textAlign: 'center',
        margin: '0 0 24px 0',
        lineHeight: '1.6',
      }}>
        If you have any questions or need assistance getting started, our friendly support team is here to help 24/7.
      </Text>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button href={supportUrl} variant="outline" size="md">
              💬 Get Help & Support
            </Button>
          </td>
        </tr>
      </table>

      {/* Closing */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#fef3c7',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '32px',
      }}>
        <tr>
          <td align="center">
            <HeartIcon size={40} color="#ef4444" />
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.6',
              textAlign: 'center',
            }}>
              Welcome aboard! We can't wait to serve you delicious meals.
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              textAlign: 'center',
              lineHeight: '1.5',
            }}>
              Best regards,<br />
              <strong style={{ color: '#f97316' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default WelcomeEmail;
