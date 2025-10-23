import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { HeartIcon, GiftIcon, AlertIcon, SettingsIcon } from '../components/Icons';

interface SubscriptionCancelledEmailProps {
  subscription: {
    customerName: string;
    planName: string;
    cancellationDate: string;
    endDate: string;
    reason?: string;
  };
  reactivateUrl?: string;
  feedbackUrl?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const SubscriptionCancelledEmail = ({
  subscription,
  reactivateUrl = '#',
  feedbackUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}: SubscriptionCancelledEmailProps) => {
  const preview = `Your ${subscription.planName} subscription has been cancelled - We'll miss you!`;

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
      headerGradient="linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)"
    >
      {/* Cancellation Notice */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <HeartIcon size={64} color="#6b7280" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Subscription Cancelled 💔
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {subscription.customerName}, we're sorry to see you go.
            </Text>
          </td>
        </tr>
      </table>

      {/* Cancellation Details */}
      <InfoCard 
        title="📋 Cancellation Details"
        icon={<SettingsIcon size={28} color="#6b7280" />}
        bgColor="#f9fafb"
        borderColor="#6b7280"
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
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
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
                      Cancelled On:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {formatDate(subscription.cancellationDate)}
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
                      Service Ends:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#ef4444', fontWeight: '600', margin: 0 }}>
                      {formatDate(subscription.endDate)}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* What Happens Next */}
      <InfoCard 
        title="📅 What Happens Next"
        icon={<AlertIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Your subscription benefits will continue until <strong>{formatDate(subscription.endDate)}</strong>
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • After that date, you'll lose access to premium features
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • You can still use {appName} with our free features
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          • You can reactivate your subscription anytime before {formatDate(subscription.endDate)}
        </Text>
      </InfoCard>

      {/* We'll Miss You */}
      <InfoCard 
        bgColor="#fef2f2"
        borderColor="#ef4444"
      >
        <Text style={{ fontSize: '16px', color: '#7f1d1d', margin: '0 0 8px 0', lineHeight: '1.6', textAlign: 'center' }}>
          💔 <strong>We'll Miss You!</strong>
        </Text>
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          Thank you for being part of the {appName} family. We hope to serve you again in the future!
        </Text>
      </InfoCard>

      {/* Win-Back Offer */}
      <InfoCard 
        title="🎁 Special Offer - Come Back!"
        icon={<GiftIcon size={28} color="#10b981" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '16px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6', textAlign: 'center' }}>
          <strong>Get 30% OFF if you reactivate within 30 days!</strong>
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 16px 0', lineHeight: '1.6', textAlign: 'center' }}>
          Use code: <strong style={{ 
            backgroundColor: '#d1fae5', 
            padding: '4px 8px', 
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '16px'
          }}>COMEBACK30</strong>
        </Text>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td align="center">
              <Button href={reactivateUrl} variant="success" size="lg">
                🔄 Reactivate Subscription
              </Button>
            </td>
          </tr>
        </table>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Feedback Request */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }}>
              Help us improve - share your feedback
            </Text>
            <Button href={feedbackUrl} variant="outline" size="md">
              💬 Give Feedback
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
              Questions about your cancellation?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Support
            </Button>
          </td>
        </tr>
      </table>

      {/* Thank You */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f9fafb',
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
              Thank you for choosing {appName}
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              textAlign: 'center',
              lineHeight: '1.5',
            }}>
              We hope to serve you again soon!<br />
              <strong style={{ color: '#6b7280' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

SubscriptionCancelledEmail.PreviewProps = {
  subscription: {
    customerName: 'John Doe',
    planName: 'Monthly Plan',
    cancellationDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    reason: 'No longer needed',
  },
  reactivateUrl: 'http://localhost:3000/reactivate',
  feedbackUrl: 'http://localhost:3000/feedback',
  supportUrl: 'http://localhost:3000/support',
};

export default SubscriptionCancelledEmail;
