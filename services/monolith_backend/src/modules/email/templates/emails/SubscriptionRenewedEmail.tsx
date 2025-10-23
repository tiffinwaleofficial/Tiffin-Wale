import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { CheckCircleIcon, TrophyIcon, GiftIcon, HeartIcon } from '../components/Icons';

interface SubscriptionRenewedEmailProps {
  subscription: {
    customerName: string;
    planName: string;
    renewalDate: string;
    nextBillingDate: string;
    amount: number;
    loyaltyYears?: number;
  };
  manageUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const SubscriptionRenewedEmail = ({
  subscription,
  manageUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com'
}: SubscriptionRenewedEmailProps) => {
  const preview = `Your ${subscription.planName} subscription has been renewed successfully!`;

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
      headerGradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    >
      {/* Renewal Success Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#ecfdf5',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <CheckCircleIcon size={72} color="#10b981" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Subscription Renewed! 🎉
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {subscription.customerName}, your {subscription.planName} continues!
            </Text>
          </td>
        </tr>
      </table>

      {/* Renewal Details */}
      <InfoCard 
        title="📋 Renewal Details"
        icon={<TrophyIcon size={28} color="#10b981" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
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
                    <Text style={{ fontSize: '16px', color: '#10b981', fontWeight: 'bold', margin: 0 }}>
                      {subscription.planName}
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
                  <td width="40%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Renewed On:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {formatDate(subscription.renewalDate)}
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
                  <td width="40%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Amount:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '16px', color: '#1f2937', fontWeight: 'bold', margin: 0 }}>
                      {formatCurrency(subscription.amount)}
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
        </table>
      </InfoCard>

      {/* Loyalty Reward */}
      {subscription.loyaltyYears && subscription.loyaltyYears > 0 && (
        <InfoCard 
          title="🏆 Loyalty Reward!"
          icon={<HeartIcon size={28} color="#ef4444" />}
          bgColor="#fef2f2"
          borderColor="#ef4444"
        >
          <Text style={{ fontSize: '16px', color: '#7f1d1d', margin: '0 0 8px 0', lineHeight: '1.6', textAlign: 'center' }}>
            <strong>Thank you for {subscription.loyaltyYears} year{subscription.loyaltyYears > 1 ? 's' : ''} of loyalty!</strong>
          </Text>
          <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 16px 0', lineHeight: '1.6', textAlign: 'center' }}>
            As a token of appreciation, enjoy <strong>15% OFF</strong> your next order!
          </Text>
          <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: '0 0 16px 0', lineHeight: '1.6', textAlign: 'center' }}>
            Use code: <strong style={{ 
              backgroundColor: '#fecaca', 
              padding: '4px 8px', 
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '16px'
            }}>LOYAL15</strong>
          </Text>
          
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tr>
              <td align="center">
                <Button href={appUrl} variant="outline" size="md">
                  🛒 Use Reward Now
                </Button>
              </td>
            </tr>
          </table>
        </InfoCard>
      )}

      {/* Special Offer */}
      <InfoCard 
        title="🎁 Exclusive Member Benefits"
        icon={<GiftIcon size={28} color="#8b5cf6" />}
        bgColor="#f3f4f6"
        borderColor="#8b5cf6"
      >
        <Text style={{ fontSize: '14px', color: '#581c87', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Free Delivery:</strong> No delivery charges on all orders
        </Text>
        <Text style={{ fontSize: '14px', color: '#581c87', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Priority Support:</strong> Get help faster with dedicated support
        </Text>
        <Text style={{ fontSize: '14px', color: '#581c87', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          ✅ <strong>Exclusive Discounts:</strong> Member-only deals and offers
        </Text>
        <Text style={{ fontSize: '14px', color: '#581c87', margin: 0, lineHeight: '1.6' }}>
          ✅ <strong>Early Access:</strong> Be first to try new restaurants
        </Text>
      </InfoCard>

      {/* Manage Subscription CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button href={manageUrl} variant="primary" size="lg">
              ⚙️ Manage Subscription
            </Button>
          </td>
        </tr>
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Thank You */}
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Thank you for continuing with <strong style={{ color: '#10b981' }}>{subscription.planName}</strong>!<br />
              <strong style={{ color: '#10b981' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

SubscriptionRenewedEmail.PreviewProps = {
  subscription: {
    customerName: 'John Doe',
    planName: 'Monthly Plan',
    renewalDate: new Date().toISOString(),
    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    amount: 5000,
    loyaltyYears: 2,
  },
  manageUrl: 'http://localhost:3000/manage-subscription',
};

export default SubscriptionRenewedEmail;
