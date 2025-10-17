import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import ProgressTracker from '../components/ProgressTracker';
import { CheckCircleIcon, StarIcon, HeartIcon, TiffinIcon } from '../components/Icons';

interface OrderDeliveredEmailProps {
  order: { 
    orderNumber: string; 
    customerName: string;
    partnerName?: string;
    deliveryTime?: string;
  };
  ratingUrl?: string;
  reorderUrl?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const OrderDeliveredEmail: React.FC<OrderDeliveredEmailProps> = ({
  order, 
  ratingUrl = '#', 
  reorderUrl = '#',
  appName = 'Tiffin-Wale', 
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support'
}) => {
  const preview = `Order #${order.orderNumber} delivered! Rate your experience`;

  const orderSteps = [
    {
      label: 'Order Confirmed',
      description: 'We received your order successfully',
      completed: true,
    },
    {
      label: 'Preparing Your Meal',
      description: `${order.partnerName || 'Partner'} cooked your food with care`,
      completed: true,
    },
    {
      label: 'Quality Check',
      description: 'Ensured everything meets our standards',
      completed: true,
    },
    {
      label: 'Delivered Successfully',
      description: 'Your meal has been delivered!',
      completed: true,
    },
  ];

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
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
            <CheckCircleIcon size={72} color="#22c55e" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Order Delivered! 🎉
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {order.customerName}, your delicious meal has been delivered successfully!
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
              color: '#f97316',
              fontFamily: 'monospace',
              margin: 0,
              letterSpacing: '1px',
            }}>
              #{order.orderNumber}
            </Text>
          </td>
        </tr>
      </table>

      {/* Order Progress - All Complete */}
      <ProgressTracker steps={orderSteps} currentStep={3} />

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Rate Experience CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={ratingUrl} 
              variant="primary" 
              size="lg"
              icon={<StarIcon size={20} color="#ffffff" />}
            >
              ⭐ Rate Your Experience
            </Button>
          </td>
        </tr>
      </table>

      {/* Why Rate */}
      <InfoCard 
        title="💬 Help Us Improve"
        icon={<StarIcon size={28} color="#fbbf24" />}
        bgColor="#fffbeb"
        borderColor="#fbbf24"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          Your feedback helps us improve our service and helps other customers make better choices.
        </Text>
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          Rate your experience in just 30 seconds and help us serve you better!
        </Text>
      </InfoCard>

      {/* Reorder Option */}
      <InfoCard 
        title="🍱 Loved Your Meal?"
        icon={<TiffinIcon size={28} color="#f97316" />}
        bgColor="#fff7ed"
        borderColor="#f97316"
      >
        <Text style={{ fontSize: '14px', color: '#9a3412', margin: '0 0 16px 0', lineHeight: '1.6' }}>
          Order the same delicious meal again with just one click!
        </Text>
        
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td align="center">
              <Button href={reorderUrl} variant="outline" size="md">
                🔄 Reorder This Meal
              </Button>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* Delivery Details */}
      {order.deliveryTime && (
        <InfoCard 
          bgColor="#f3f4f6"
          borderColor="#6b7280"
        >
          <Text style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
            📦 <strong>Delivered at:</strong> {order.deliveryTime}
          </Text>
        </InfoCard>
      )}

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
              Any issues with your order?
            </Text>
            <Button href={supportUrl} variant="outline" size="md">
              💬 Contact Support
            </Button>
          </td>
        </tr>
      </table>

      {/* Thank You */}
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
              Thank you for choosing {appName}!
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              textAlign: 'center',
              lineHeight: '1.5',
            }}>
              We hope you enjoyed your meal and look forward to serving you again!<br />
              <strong style={{ color: '#f97316' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

export default OrderDeliveredEmail;