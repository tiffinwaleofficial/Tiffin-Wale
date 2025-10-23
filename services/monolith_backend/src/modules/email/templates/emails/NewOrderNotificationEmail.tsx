import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { BellIcon, TiffinIcon, LocationIcon, UserIcon } from '../components/Icons';

interface NewOrderNotificationEmailProps {
  order: {
    orderNumber: string;
    customerName: string;
    items: string[];
    totalAmount: number;
    deliveryAddress: string;
    customerPhone?: string;
    specialInstructions?: string;
    estimatedPrepTime?: string;
  };
  partner: {
    name: string;
    email: string;
  };
  dashboardUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const NewOrderNotificationEmail = ({
  order,
  partner,
  dashboardUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com'
}: NewOrderNotificationEmailProps) => {
  const preview = `New order #${order.orderNumber} from ${order.customerName} - ${formatCurrency(order.totalAmount)}`;

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
      headerGradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
    >
      {/* New Order Alert */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#fffbeb',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <BellIcon size={64} color="#f59e0b" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              New Order Alert! 🔔
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {partner.name}, you have a new order to prepare!
            </Text>
          </td>
        </tr>
      </table>

      {/* Order Summary */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#fef3c7',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td>
            <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0' }}>
              Order Number
            </Text>
            <Text style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#f59e0b',
              fontFamily: 'monospace',
              margin: '0 0 16px 0',
              letterSpacing: '1px',
            }}>
              #{order.orderNumber}
            </Text>
            <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 4px 0' }}>
              Total Amount
            </Text>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#92400e',
              margin: 0,
            }}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </td>
        </tr>
      </table>

      {/* Customer Info */}
      <InfoCard 
        title="👤 Customer Details"
        icon={<UserIcon size={28} color="#3b82f6" />}
        bgColor="#eff6ff"
        borderColor="#3b82f6"
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td style={{ paddingBottom: '12px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Name:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {order.customerName}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          {order.customerPhone && (
            <tr>
              <td>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="30%" style={{ verticalAlign: 'top' }}>
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                        Phone:
                      </Text>
                    </td>
                    <td>
                      <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
                        {order.customerPhone}
                      </Text>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          )}
        </table>
      </InfoCard>

      {/* Order Items */}
      <InfoCard 
        title="🍽️ Order Items"
        icon={<TiffinIcon size={28} color="#f97316" />}
        bgColor="#fff7ed"
        borderColor="#f97316"
      >
        {order.items.map((item, index) => (
          <Text key={index} style={{ 
            fontSize: '14px', 
            color: '#9a3412', 
            margin: index === order.items.length - 1 ? 0 : '0 0 8px 0',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            • {item}
          </Text>
        ))}
      </InfoCard>

      {/* Delivery Address */}
      <InfoCard 
        title="📍 Delivery Address"
        icon={<LocationIcon size={28} color="#10b981" />}
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: '1.6' }}>
          {order.deliveryAddress}
        </Text>
      </InfoCard>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <InfoCard 
          title="📝 Special Instructions"
          bgColor="#f3f4f6"
          borderColor="#6b7280"
        >
          <Text style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
            "{order.specialInstructions}"
          </Text>
        </InfoCard>
      )}

      {/* Action Required */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td>
            <Text style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#dc2626',
              margin: '0 0 8px 0',
            }}>
              ⚡ Action Required
            </Text>
            <Text style={{
              fontSize: '14px',
              color: '#7f1d1d',
              margin: '0 0 16px 0',
              lineHeight: '1.6',
            }}>
              Please confirm this order and start preparation as soon as possible.
            </Text>
            <Button href={dashboardUrl} variant="danger" size="lg">
              🚀 View Order in Dashboard
            </Button>
          </td>
        </tr>
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

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
              Thank you for being a valued partner!<br />
              <strong style={{ color: '#f59e0b' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

NewOrderNotificationEmail.PreviewProps = {
  order: {
    orderNumber: '12345',
    customerName: 'John Doe',
    items: ['Meal 1', 'Meal 2'],
    totalAmount: 500,
    deliveryAddress: '123 Main St, Anytown, USA',
    customerPhone: '123-456-7890',
    specialInstructions: 'No onions please.',
    estimatedPrepTime: '20 minutes',
  },
  partner: {
    name: 'Partner Name',
    email: 'partner@example.com',
  },
  dashboardUrl: 'http://localhost:3000/partner/dashboard',
};

export default NewOrderNotificationEmail;
