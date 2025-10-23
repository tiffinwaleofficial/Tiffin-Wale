import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { AlertIcon, ClockIcon, StarIcon, CreditCardIcon } from '../components/Icons';

interface SubscriptionExpiringEmailProps {
  subscription: {
    customerName: string;
    planName: string;
    expiryDate: string;
    daysLeft: number;
  };
  renewUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const SubscriptionExpiringEmail = ({
  subscription,
  renewUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com'
}: SubscriptionExpiringEmailProps) => {
  const preview = `Your ${subscription.planName} expires in ${subscription.daysLeft} days - Renew now!`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUrgencyColor = () => {
    if (subscription.daysLeft <= 3) return '#ef4444'; // Red
    if (subscription.daysLeft <= 7) return '#f59e0b'; // Yellow
    return '#3b82f6'; // Blue
  };

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
    >
      {/* Expiry Warning Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#fffbeb',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <AlertIcon size={64} color={getUrgencyColor()} />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Subscription Expiring Soon! ⚠️
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {subscription.customerName}, your {subscription.planName} expires soon.
            </Text>
          </td>
        </tr>
      </table>

      {/* Days Left Counter */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: subscription.daysLeft <= 3 ? '#fef2f2' : '#fef3c7',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
              Days Remaining
            </Text>
            <Text style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: getUrgencyColor(),
              margin: '0 0 8px 0',
              lineHeight: '1.2',
            }}>
              {subscription.daysLeft}
            </Text>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Expires on {formatDate(subscription.expiryDate)}
            </Text>
          </td>
        </tr>
      </table>

      {/* Renew CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={renewUrl} 
              variant={subscription.daysLeft <= 3 ? "danger" : "primary"} 
              size="lg"
              icon={<CreditCardIcon size={20} color="#ffffff" />}
            >
              🔄 Renew Subscription Now
            </Button>
          </td>
        </tr>
      </table>

      {/* What You'll Lose */}
      <InfoCard 
        title="😢 What You'll Miss Without Renewal"
        icon={<StarIcon size={28} color="#ef4444" />}
        bgColor="#fef2f2"
        borderColor="#ef4444"
      >
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ❌ <strong>Free Delivery:</strong> You'll pay delivery charges on all orders
        </Text>
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ❌ <strong>Priority Support:</strong> Standard support response times
        </Text>
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ❌ <strong>Exclusive Discounts:</strong> No access to member-only deals
        </Text>
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: '1.6' }}>
          ❌ <strong>Early Access:</strong> Miss out on new restaurant launches
        </Text>
      </InfoCard>

      {/* Renewal Benefits */}
      <InfoCard 
        title="✨ Keep Your Benefits Active"
        icon={<StarIcon size={28} color="#10b981" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Uninterrupted Service:</strong> Keep all your premium benefits
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Same Great Price:</strong> No price increases for existing members
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Instant Activation:</strong> Seamless continuation of service
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: '1.6' }}>
          ✅ <strong>Loyalty Rewards:</strong> Earn points for continued membership
        </Text>
      </InfoCard>

      {/* Urgency Notice */}
      <InfoCard 
        title="⏰ Act Fast!"
        icon={<ClockIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          Renew before {formatDate(subscription.expiryDate)} to avoid service interruption. 
          <strong>Don't lose your premium benefits!</strong>
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Final CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
              textAlign: 'center',
            }}>
              Don't wait - renew your <strong style={{ color: getUrgencyColor() }}>{subscription.planName}</strong> today!
            </Text>
            <Button href={renewUrl} variant="primary" size="lg">
              💳 Renew Now - Keep Benefits
            </Button>
          </td>
        </tr>
      </table>

      {/* Footer */}
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Questions about renewal?<br />
              <strong style={{ color: '#f59e0b' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

SubscriptionExpiringEmail.PreviewProps = {
  subscription: {
    customerName: 'John Doe',
    planName: 'Monthly Plan',
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    daysLeft: 7,
  },
  renewUrl: 'http://localhost:3000/renew',
};

export default SubscriptionExpiringEmail;
