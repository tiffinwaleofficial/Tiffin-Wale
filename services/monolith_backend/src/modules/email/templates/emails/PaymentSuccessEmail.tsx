import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { CheckCircleIcon, CreditCardIcon, CalendarIcon } from '../components/Icons';

interface PaymentSuccessEmailProps {
  payment: {
    customerName: string;
    amount: number;
    paymentId: string;
    orderNumber?: string;
    subscriptionId?: string;
    paymentMethod?: string;
    transactionDate?: string;
  };
  receiptUrl?: string;
  supportUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const PaymentSuccessEmail = ({
  payment,
  receiptUrl = '#',
  supportUrl = 'https://tiffin-wale.com/support',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}: PaymentSuccessEmailProps) => {
  const preview = `Payment successful! Your transaction of ₹${payment.amount} has been processed.`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-IN');
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <CheckCircleIcon size={72} color="#22c55e" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Payment Successful! ✅
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {payment.customerName}, your payment has been processed successfully.
            </Text>
          </td>
        </tr>
      </table>

      {/* Amount Highlight */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <Text style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.9)', 
              margin: '0 0 8px 0',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              Amount Paid
            </Text>
            <Text style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              margin: 0,
              lineHeight: '1',
            }}>
              {formatCurrency(payment.amount)}
            </Text>
          </td>
        </tr>
      </table>

      {/* Receipt */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e5e7eb',
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
              margin: '0 0 24px 0',
              textAlign: 'center',
            }}>
              📄 Transaction Receipt
            </Text>

            {/* Transaction ID */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
              <tr>
                <td width="40%" style={{ verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Transaction ID:
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
                    {payment.paymentId}
                  </Text>
                </td>
              </tr>
            </table>

            {/* Date */}
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
              <tr>
                <td width="40%" style={{ verticalAlign: 'top' }}>
                  <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    Date & Time:
                  </Text>
                </td>
                <td>
                  <table cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                        <CalendarIcon size={16} color="#8b5cf6" />
                      </td>
                      <td>
                        <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                          {formatDate(payment.transactionDate)}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* Payment Method */}
            {payment.paymentMethod && (
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
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
                          <CreditCardIcon size={16} color="#8b5cf6" />
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
            )}

            {/* Order Number */}
            {payment.orderNumber && (
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
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
            )}

            {/* Subscription ID */}
            {payment.subscriptionId && (
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="40%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      Subscription ID:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {payment.subscriptionId}
                    </Text>
                  </td>
                </tr>
              </table>
            )}
          </td>
        </tr>
      </table>

      {/* Download Receipt Button */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <Button href={receiptUrl} variant="primary" size="lg">
              📥 Download Receipt
            </Button>
          </td>
        </tr>
      </table>

      {/* Important Info */}
      <InfoCard 
        bgColor="#fef3c7"
        borderColor="#fbbf24"
      >
        <Text style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          💡 <strong>Keep this receipt</strong> for your records. A copy has also been saved to your account.
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Support Section */}
      <table width="100%" cellPadding="0" cellSpacing="0">
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }}>
              Questions about this transaction?
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
              fontSize: '16px',
              color: '#1f2937',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Thank you for your payment!<br />
              <strong style={{ color: '#8b5cf6' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

PaymentSuccessEmail.PreviewProps = {
  payment: {
    customerName: 'John Doe',
    amount: 550,
    paymentId: 'payment-123',
    orderNumber: '12345',
    paymentMethod: 'Credit Card ending in 1234',
    transactionDate: new Date().toISOString(),
  },
  receiptUrl: 'http://localhost:3000/receipt/payment-123',
  supportUrl: 'http://localhost:3000/support',
};

export default PaymentSuccessEmail;
