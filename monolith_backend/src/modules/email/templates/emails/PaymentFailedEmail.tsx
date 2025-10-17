import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { AlertIcon, CreditCardIcon, ClockIcon, PhoneIcon } from '../components/Icons';

interface PaymentFailedEmailProps {
  payment: { 
    customerName: string; 
    amount: number; 
    reason: string; 
    retryUrl: string;
    orderNumber?: string;
    paymentMethod?: string;
  };
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const PaymentFailedEmail: React.FC<PaymentFailedEmailProps> = ({
  payment, 
  appName = 'Tiffin-Wale', 
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}) => {
  const preview = `Payment failed - action required for your ${appName} order`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
    >
      {/* Failure Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <AlertIcon size={64} color="#ef4444" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Payment Failed ⚠️
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {payment.customerName}, we couldn't process your payment.
            </Text>
          </td>
        </tr>
      </table>

      {/* Payment Details */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <tr>
          <td>
            <Text style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
              textAlign: 'center',
            }}>
              💳 Payment Details
            </Text>

            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ paddingBottom: '12px' }}>
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td width="40%" style={{ verticalAlign: 'top' }}>
                        <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          Amount:
                        </Text>
                      </td>
                      <td>
                        <Text style={{ 
                          fontSize: '16px', 
                          color: '#ef4444', 
                          fontWeight: 'bold',
                          margin: 0,
                        }}>
                          {formatCurrency(payment.amount)}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              {payment.orderNumber && (
                <tr>
                  <td style={{ paddingBottom: '12px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td width="40%" style={{ verticalAlign: 'top' }}>
                          <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Order Number:
                          </Text>
                        </td>
                        <td>
                          <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                            #{payment.orderNumber}
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )}

              {payment.paymentMethod && (
                <tr>
                  <td style={{ paddingBottom: '12px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td width="40%" style={{ verticalAlign: 'top' }}>
                          <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Payment Method:
                          </Text>
                        </td>
                        <td>
                          <table cellPadding="0" cellSpacing="0">
                            <tr>
                              <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                                <CreditCardIcon size={16} color="#6b7280" />
                              </td>
                              <td>
                                <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                                  {payment.paymentMethod}
                                </Text>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td width="40%" style={{ verticalAlign: 'top' }}>
                        <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          Reason:
                        </Text>
                      </td>
                      <td>
                        <Text style={{ fontSize: '14px', color: '#ef4444', fontWeight: '600', margin: 0 }}>
                          {payment.reason}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      {/* Retry Payment CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={payment.retryUrl} 
              variant="danger" 
              size="lg"
              icon={<CreditCardIcon size={20} color="#ffffff" />}
            >
              🔄 Retry Payment Now
            </Button>
          </td>
        </tr>
      </table>

      {/* Common Reasons */}
      <InfoCard 
        title="💡 Common Payment Issues"
        bgColor="#fef3c7"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • <strong>Insufficient funds:</strong> Check your account balance
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • <strong>Expired card:</strong> Update your payment method
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • <strong>Bank restrictions:</strong> Contact your bank to allow online payments
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          • <strong>Network issues:</strong> Try again in a few minutes
        </Text>
      </InfoCard>

      {/* Time-sensitive Notice */}
      <InfoCard 
        title="⏰ Important Notice"
        icon={<ClockIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          Your order will be automatically cancelled if payment is not completed within <strong>24 hours</strong>. Please retry your payment as soon as possible to avoid order cancellation.
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
              Still having trouble with payment?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Support
            </Button>
          </td>
        </tr>
      </table>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.6',
            }}>
              We're here to help!<br />
              <strong style={{ color: '#ef4444' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default PaymentFailedEmail;
