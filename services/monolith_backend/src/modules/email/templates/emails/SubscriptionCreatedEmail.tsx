import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { CheckCircleIcon, StarIcon, GiftIcon, TrophyIcon, SettingsIcon } from '../components/Icons';

interface SubscriptionCreatedEmailProps {
  subscription: { 
    customerName: string; 
    planName: string;
    price?: number;
    billingCycle?: string;
    startDate?: string;
    nextBillingDate?: string;
  };
  manageUrl?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const SubscriptionCreatedEmail: React.FC<SubscriptionCreatedEmailProps> = ({
  subscription, 
  manageUrl = '#', 
  appName = 'Tiffin-Wale', 
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}) => {
  const preview = `Your ${subscription.planName} subscription is now active!`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
    >
      {/* Success Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#f3f4f6',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <CheckCircleIcon size={72} color="#8b5cf6" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Subscription Activated! 🎉
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {subscription.customerName}, welcome to {subscription.planName}!
            </Text>
          </td>
        </tr>
      </table>

      {/* Plan Details */}
      <InfoCard 
        title="📋 Your Subscription Details"
        icon={<TrophyIcon size={28} color="#8b5cf6" />}
        bgColor="#f3f4f6"
        borderColor="#8b5cf6"
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td style={{ paddingBottom: '12px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Plan:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: '#8b5cf6', 
                      fontWeight: 'bold',
                      margin: 0,
                    }}>
                      {subscription.planName}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          {subscription.price && (
            <tr>
              <td style={{ paddingBottom: '12px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="40%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Price:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '16px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                        {formatCurrency(subscription.price)}{subscription.billingCycle && ` / ${subscription.billingCycle}`}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}

          {subscription.startDate && (
            <tr>
              <td style={{ paddingBottom: '12px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="40%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Started:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                        {formatDate(subscription.startDate)}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}

          {subscription.nextBillingDate && (
            <tr>
              <td>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="40%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Next Billing:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                        {formatDate(subscription.nextBillingDate)}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
        </table>
      </InfoCard>

      {/* Manage Subscription CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={manageUrl} 
              variant="primary" 
              size="lg"
              icon={<SettingsIcon size={20} color="#ffffff" />}
            >
              ⚙️ Manage Subscription
            </Button>
          </td>
        </tr>
      </table>

      {/* Benefits */}
      <InfoCard 
        title="🌟 Your Plan Benefits"
        icon={<StarIcon size={28} color="#fbbf24" />}
        bgColor="#fffbeb"
        borderColor="#fbbf24"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Priority Support:</strong> Get help faster with dedicated support
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Exclusive Discounts:</strong> Save more on your favorite meals
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Free Delivery:</strong> No delivery charges on all orders
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          ✅ <strong>Early Access:</strong> Be the first to try new restaurants and dishes
        </Text>
      </InfoCard>

      {/* Welcome Offer */}
      <InfoCard 
        title="🎁 Welcome Bonus!"
        icon={<GiftIcon size={28} color="#f97316" />}
        bgColor="#fff7ed"
        borderColor="#f97316"
      >
        <Text style={{ fontSize: '16px', color: '#9a3412', margin: '0 0 8px 0', lineHeight: '1.6', textAlign: 'center' }}>
          <strong>Get 20% OFF your first order</strong>
        </Text>
        <Text style={{ fontSize: '14px', color: '#9a3412', margin: '0 0 16px 0', lineHeight: '1.6', textAlign: 'center' }}>
          Use code: <strong style={{ 
            backgroundColor: '#fed7aa', 
            padding: '4px 8px', 
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '16px'
          }}>WELCOME20</strong>
        </Text>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td align="center">
              <Button href={appUrl} variant="outline" size="md">
                🛒 Start Ordering
              </Button>
            </td>
          </tr>
        </table>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

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
              Questions about your subscription?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Support
            </Button>
          </td>
        </tr>
      </table>

      {/* Thank You */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Thank you for choosing <strong style={{ color: '#8b5cf6' }}>{subscription.planName}</strong>!<br />
              <strong style={{ color: '#8b5cf6' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default SubscriptionCreatedEmail;