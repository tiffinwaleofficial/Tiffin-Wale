import React from 'react';
import { Section, Text, Hr } from '@react-email/components';

interface OrderSummaryProps {
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    description?: string;
  }>;
  subtotal: number;
  deliveryFee?: number;
  tax?: number;
  total: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderNumber,
  items,
  subtotal,
  deliveryFee = 0,
  tax = 0,
  total,
}) => {
  return (
    <Section style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      marginBottom: '32px',
    }}>
      <Text style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 24px 0',
        textAlign: 'center',
      }}>
        Order Summary
      </Text>

      {/* Items */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
        {items.map((item, index) => (
          <tr key={index}>
            <td style={{ paddingBottom: '16px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td>
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {item.quantity} x {item.name}
                    </Text>
                    {item.description && (
                      <Text style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {item.description}
                      </Text>
                    )}
                  </td>
                  <td align="right">
                    <Text style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        ))}
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '0 0 24px 0' }} />

      {/* Totals */}
      <table width="100%" cellPadding="0" cellSpacing="0">
        {/* Subtotal */}
        <tr>
          <td style={{ paddingBottom: '8px' }}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td><Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Subtotal</Text></td>
                <td align="right"><Text style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>{formatCurrency(subtotal)}</Text></td>
              </tr>
            </table>
          </td>
        </tr>
        {/* Delivery Fee */}
        {deliveryFee > 0 && (
          <tr>
            <td style={{ paddingBottom: '8px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td><Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Delivery Fee</Text></td>
                  <td align="right"><Text style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>{formatCurrency(deliveryFee)}</Text></td>
                </tr>
              </table>
            </td>
          </tr>
        )}
        {/* Tax */}
        {tax > 0 && (
          <tr>
            <td style={{ paddingBottom: '8px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td><Text style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Tax</Text></td>
                  <td align="right"><Text style={{ fontSize: '14px', color: '#1f2937', margin: 0 }}>{formatCurrency(tax)}</Text></td>
                </tr>
              </table>
            </td>
          </tr>
        )}
        {/* Total */}
        <tr>
          <td style={{ paddingTop: '16px' }}>
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td><Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Total</Text></td>
                <td align="right"><Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{formatCurrency(total)}</Text></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </Section>
  );
};

export default OrderSummary;
