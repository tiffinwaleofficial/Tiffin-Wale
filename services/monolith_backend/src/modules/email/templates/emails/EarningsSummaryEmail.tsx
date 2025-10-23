import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { DollarSignIcon, TrendingUpIcon, CalendarIcon } from '../components/Icons';

interface EarningsSummaryEmailProps {
  partner: {
    name: string;
    email: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  earnings: {
    totalEarnings: number;
    totalOrders: number;
    averageOrderValue: number;
    commission: number;
  };
  appName?: string;
  appUrl?: string;
  dashboardUrl?: string;
}

export const EarningsSummaryEmail = ({
  partner,
  period,
  earnings,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  dashboardUrl = 'https://tiffin-wale.com/partner/dashboard',
}: EarningsSummaryEmailProps) => {
  const preview = `Your earnings summary for ${period.startDate} - ${period.endDate}`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)"
    >
      {/* Header */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 16px 0',
              lineHeight: '1.2',
            }}>
              💰 Earnings Summary
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {partner.name}, here's your earnings report for {period.startDate} - {period.endDate}
            </Text>
          </td>
        </tr>
      </table>

      {/* Earnings Cards */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td width="48%" style={{ verticalAlign: 'top', paddingRight: '8px' }}>
            <InfoCard
              title="Total Earnings"
              icon={<DollarSignIcon size={24} color="#10b981" />}
              bgColor="#ecfdf5"
              borderColor="#10b981"
            >
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#10b981',
                margin: 0,
                textAlign: 'center',
              }}>
                ₹{earnings.totalEarnings.toLocaleString()}
              </Text>
            </InfoCard>
          </td>
          <td width="4%"></td>
          <td width="48%" style={{ verticalAlign: 'top', paddingLeft: '8px' }}>
            <InfoCard
              title="Total Orders"
              icon={<TrendingUpIcon size={24} color="#3b82f6" />}
              bgColor="#eff6ff"
              borderColor="#3b82f6"
            >
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#3b82f6',
                margin: 0,
                textAlign: 'center',
              }}>
                {earnings.totalOrders}
              </Text>
            </InfoCard>
          </td>
        </tr>
      </table>

      {/* Performance Metrics */}
      <InfoCard
        title="📊 Performance Metrics"
        bgColor="#fefce8"
        borderColor="#eab308"
      >
        <table width="100%" cellPadding="0" cellSpacing="0">
          <tr>
            <td style={{ paddingBottom: '12px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                Average Order Value
              </Text>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                ₹{earnings.averageOrderValue.toLocaleString()}
              </Text>
            </td>
          </tr>
          <tr>
            <td>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                Commission Earned
              </Text>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                ₹{earnings.commission.toLocaleString()}
              </Text>
            </td>
          </tr>
        </table>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* CTA */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={dashboardUrl} 
              variant="primary" 
              size="lg"
              icon={<CalendarIcon size={20} color="#ffffff" />}
            >
              View Detailed Report
            </Button>
          </td>
        </tr>
      </table>

      {/* Footer Message */}
      <Text style={{
        fontSize: '15px',
        color: '#6b7280',
        textAlign: 'center',
        margin: 0,
        lineHeight: '1.6',
      }}>
        Keep up the great work! Your delicious food is making customers happy.
      </Text>
    </EmailLayout>
  );
};

EarningsSummaryEmail.PreviewProps = {
  partner: {
    name: 'Partner Name',
    email: 'partner@example.com',
  },
  period: {
    startDate: '2023-10-01',
    endDate: '2023-10-31',
  },
  earnings: {
    totalEarnings: 50000,
    totalOrders: 250,
    averageOrderValue: 200,
    commission: 5000,
  },
};

export default EarningsSummaryEmail;
