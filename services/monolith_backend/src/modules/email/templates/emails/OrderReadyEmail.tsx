import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import ProgressTracker from '../components/ProgressTracker';
import { TiffinIcon, LocationIcon, ClockIcon, UserIcon } from '../components/Icons';

interface OrderReadyEmailProps {
  order: {
    orderNumber: string;
    customerName: string;
    partnerName: string;
    deliveryAddress?: string;
    estimatedDeliveryTime?: string;
  };
  trackingUrl?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const OrderReadyEmail: React.FC<OrderReadyEmailProps> = ({
  order,
  trackingUrl = '#',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}) => {
  const preview = `Your order #${order.orderNumber} is ready and on its way!`;

  const orderSteps = [
    {
      label: 'Order Confirmed',
      description: 'We received your order successfully',
      completed: true,
    },
    {
      label: 'Preparing Your Meal',
      description: `${order.partnerName} cooked your food with care`,
      completed: true,
    },
    {
      label: 'Quality Check',
      description: 'Ensured everything meets our standards',
      completed: true,
    },
    {
      label: 'Ready for Delivery',
      description: 'Your meal is on its way to you!',
      completed: false,
      current: true,
    },
  ];

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
    >
      {/* Ready Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#ecfdf5',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <TiffinIcon size={64} color="#22c55e" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Your Order is Ready! 🍽️
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {order.customerName}, your delicious meal is on its way!
            </Text>
          </td>
        </tr>
      </table>

      {/* Order Number */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 4px 0' }}>
              Order Number
            </Text>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#22c55e',
              fontFamily: 'monospace',
              margin: 0,
              letterSpacing: '1px',
            }}>
              #{order.orderNumber}
            </Text>
          </td>
        </tr>
      </table>

      {/* Order Progress */}
      <ProgressTracker steps={orderSteps} currentStep={3} />

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Partner Info */}
      <InfoCard 
        title="👨‍🍳 Prepared By"
        icon={<UserIcon size={28} color="#22c55e" />}
        bgColor="#ecfdf5"
        borderColor="#22c55e"
      >
        <Text style={{ fontSize: '16px', color: '#065f46', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          <strong>{order.partnerName}</strong> has prepared your meal with love and care.
        </Text>
      </InfoCard>

      {/* Delivery Info */}
      {order.deliveryAddress && (
        <InfoCard 
          title="📍 Delivery Address"
          icon={<LocationIcon size={28} color="#3b82f6" />}
          bgColor="#eff6ff"
          borderColor="#3b82f6"
        >
          <Text style={{ fontSize: '14px', color: '#1e40af', margin: 0, lineHeight: '1.6' }}>
            {order.deliveryAddress}
          </Text>
        </InfoCard>
      )}

      {/* Estimated Delivery Time */}
      {order.estimatedDeliveryTime && (
        <InfoCard 
          title="⏰ Estimated Delivery Time"
          icon={<ClockIcon size={28} color="#f59e0b" />}
          bgColor="#fffbeb"
          borderColor="#f59e0b"
        >
          <Text style={{ fontSize: '16px', color: '#92400e', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
            Your order will arrive in approximately <strong>{order.estimatedDeliveryTime}</strong>
          </Text>
        </InfoCard>
      )}

      {/* Track Delivery CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={trackingUrl} 
              variant="primary" 
              size="lg"
              icon={<LocationIcon size={20} color="#ffffff" />}
            >
              🚚 Track Delivery
            </Button>
          </td>
        </tr>
      </table>

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
              Questions about your delivery?
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
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Enjoy your meal!<br />
              <strong style={{ color: '#22c55e' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default OrderReadyEmail;
