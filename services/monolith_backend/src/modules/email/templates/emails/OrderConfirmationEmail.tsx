import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import OrderSummary from '../components/OrderSummary';
import InfoCard from '../components/InfoCard';
import ProgressTracker from '../components/ProgressTracker';
import { CheckCircleIcon, LocationIcon, ClockIcon, TiffinIcon, PhoneIcon } from '../components/Icons';

interface OrderConfirmationEmailProps {
  order: {
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      description?: string;
    }>;
    totalAmount: number;
    subtotal: number;
    deliveryFee?: number;
    tax?: number;
    deliveryAddress: string;
    estimatedDeliveryTime: string;
    partnerName: string;
    partnerPhone?: string;
  };
  trackingUrl?: string;
  supportUrl?: string;
  appName?: string;
  appUrl?: string;
}

export const OrderConfirmationEmail = ({
  order,
  trackingUrl = '#',
  supportUrl = 'https://tiffin-wale.com/support',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
}: OrderConfirmationEmailProps) => {
  const preview = `Your ${appName} order #${order.orderNumber} has been confirmed!`;

  const orderSteps = [
    {
      label: 'Order Confirmed',
      description: 'We received your order successfully',
      completed: true,
    },
    {
      label: 'Preparing Your Meal',
      description: `${order.partnerName} is cooking your food with care`,
      completed: false,
    },
    {
      label: 'Quality Check',
      description: 'Ensuring everything meets our standards',
      completed: false,
    },
    {
      label: 'Out for Delivery',
      description: 'Your meal is on its way to you',
      completed: false,
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
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <CheckCircleIcon size={64} color="#22c55e" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
        Order Confirmed! 🎉
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {order.customerName}, your delicious meal is being prepared!
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

      {/* Order Progress */}
      <ProgressTracker steps={orderSteps} currentStep={0} />

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />
      
      {/* Order Details */}
      <OrderSummary
        orderNumber={order.orderNumber}
        items={order.items}
        subtotal={order.subtotal}
        deliveryFee={order.deliveryFee}
        tax={order.tax}
        total={order.totalAmount}
      />
      
      {/* Delivery Information */}
      <InfoCard 
        title="📍 Delivery Information"
        icon={<LocationIcon size={28} color="#3b82f6" />}
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
                      Address:
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
                      {order.deliveryAddress}
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
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Estimated Time:
                    </Text>
                  </td>
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ paddingRight: '8px' }}>
                          <ClockIcon size={16} color="#f97316" />
                        </td>
                        <td>
                          <Text style={{ fontSize: '14px', color: '#f97316', fontWeight: '600', margin: 0 }}>
                            {order.estimatedDeliveryTime}
                          </Text>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td width="30%" style={{ verticalAlign: 'top' }}>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                      Partner:
                    </Text>
                  </td>
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                          <TiffinIcon size={16} color="#22c55e" />
                        </td>
                        <td>
                          <Text style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', margin: 0 }}>
              {order.partnerName}
                          </Text>
                        </td>
                      </tr>
                    </table>
              {order.partnerPhone && (
                      <table cellPadding="0" cellSpacing="0" style={{ marginTop: '4px' }}>
                        <tr>
                          <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
                            <PhoneIcon size={14} color="#10b981" />
                          </td>
                          <td>
                            <Text style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                              {order.partnerPhone}
                            </Text>
                          </td>
                        </tr>
                      </table>
                    )}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </InfoCard>

      {/* Track Order CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <Button 
              href={trackingUrl} 
              variant="primary" 
              size="lg"
            >
              📦 Track Your Order in Real-Time
            </Button>
          </td>
        </tr>
      </table>

      {/* Updates Notice */}
      <InfoCard 
        bgColor="#fef3c7"
        borderColor="#fbbf24"
      >
        <Text style={{ fontSize: '14px', color: '#78350f', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          📱 <strong>Stay Updated:</strong> We'll send you notifications as your order progresses through each stage.
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
              Questions about your order?
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
              Thank you for choosing <strong style={{ color: '#f97316' }}>{appName}</strong>!
      </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

OrderConfirmationEmail.PreviewProps = {
  order: {
    orderNumber: '12345',
    customerName: 'John Doe',
    items: [
      { name: 'Meal 1', quantity: 1, price: 200, description: 'A delicious meal' },
      { name: 'Meal 2', quantity: 2, price: 150, description: 'Another tasty dish' },
    ],
    totalAmount: 550,
    subtotal: 500,
    deliveryFee: 50,
    tax: 0,
    deliveryAddress: '123 Main St, Anytown, USA',
    estimatedDeliveryTime: '30-45 minutes',
    partnerName: 'Tiffin Partner',
    partnerPhone: '098-765-4321',
  },
  trackingUrl: 'http://localhost:3000/track/12345',
  supportUrl: 'http://localhost:3000/support',
};

export default OrderConfirmationEmail;
