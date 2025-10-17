import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { CheckCircleIcon, CreditCardIcon, ClockIcon, AlertIcon } from '../components/Icons';

interface RefundProcessedEmailProps {
  refund: {
    customerName: string;
    amount: number;
    orderNumber: string;
    refundId: string;
    reason?: string;
    processingTime?: string;
    paymentMethod?: string;
  };
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const RefundProcessedEmail: React.FC<RefundProcessedEmailProps> = ({
  refund,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}) => {
  const preview = `Refund of ${formatCurrency(refund.amount)} has been processed for order #${refund.orderNumber}`;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  }

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    >
      {/* Success Banner */}
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
              Refund Processed Successfully! ✅
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {refund.customerName}, your refund has been processed.
            </Text>
          </td>
        </tr>
      </table>

      {/* Refund Amount */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
              Refund Amount
            </Text>
            <Text style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#10b981',
              margin: 0,
              lineHeight: '1.2',
            }}>
              {formatCurrency(refund.amount)}
            </Text>
          </td>
        </tr>
      </table>

      {/* Refund Details */}
      <InfoCard 
        title="📋 Refund Details"
        icon={<CreditCardIcon size={28} color="#10b981" />}
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
                      Refund ID:
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
                      {refund.refundId}
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
                      Order Number:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      #{refund.orderNumber}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {refund.paymentMethod && (
            <tr>
              <td style={{ paddingBottom: '12px' }}>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="40%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Refund Method:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                        {refund.paymentMethod}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}

          {refund.reason && (
            <tr>
              <td>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="40%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Reason:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>
                        {refund.reason}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
        </table>
      </InfoCard>

      {/* Processing Time */}
      <InfoCard 
        title="⏰ Processing Timeline"
        icon={<ClockIcon size={28} color="#3b82f6" />}
        bgColor="#eff6ff"
        borderColor="#3b82f6"
      >
        <Text style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          Your refund has been processed and should appear in your account within:
        </Text>
        <Text style={{ fontSize: '16px', color: '#1e40af', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          <strong>{refund.processingTime || '3-5 business days'}</strong>
        </Text>
      </InfoCard>

      {/* Important Notice */}
      <InfoCard 
        title="📌 Important Information"
        icon={<AlertIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • The refund will be credited to your original payment method
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Processing time may vary depending on your bank or payment provider
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • You'll receive a confirmation once the amount is credited
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          • Keep this email for your records
        </Text>
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
              Questions about your refund?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Support
            </Button>
          </td>
        </tr>
      </table>

      {/* Thank You */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '32px',
      }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '16px',
              color: '#1f2937',
              margin: '0 0 8px 0',
              lineHeight: '1.6',
              textAlign: 'center',
            }}>
              We apologize for any inconvenience caused.
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              textAlign: 'center',
              lineHeight: '1.5',
            }}>
              We hope to serve you better next time!<br />
              <strong style={{ color: '#10b981' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default RefundProcessedEmail;