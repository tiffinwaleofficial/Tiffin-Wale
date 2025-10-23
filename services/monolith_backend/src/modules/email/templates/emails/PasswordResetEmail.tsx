import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { AlertIcon, ClockIcon, SettingsIcon } from '../components/Icons';

interface PasswordResetEmailProps {
  user: {
    name: string;
    email: string;
  };
  resetLink: string;
  expiryTime?: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const PasswordResetEmail = ({
  user,
  resetLink,
  expiryTime = '1 hour',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support',
}: PasswordResetEmailProps) => {
  const preview = `Reset your ${appName} password - Secure link inside`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
    >
      {/* Security Alert Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <AlertIcon size={56} color="#ef4444" />
            <Text style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Password Reset Request 🔐
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {user.name}, we received a request to reset your password.
            </Text>
          </td>
        </tr>
      </table>

      {/* Instructions */}
      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
        textAlign: 'center',
      }}>
        Click the button below to reset your password. If you didn't make this request, you can safely ignore this email.
      </Text>

      {/* Reset Button */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={resetLink} 
              variant="danger" 
              size="lg"
              icon={<SettingsIcon size={20} color="#ffffff" />}
            >
              🔑 Reset My Password
            </Button>
          </td>
        </tr>
      </table>

      {/* Expiry Warning */}
      <InfoCard 
        title="⏰ Time-Sensitive Link"
        icon={<ClockIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          This password reset link will expire in <strong>{expiryTime}</strong>. After that, you'll need to request a new one.
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Alternative Link */}
      <Text style={{
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 16px 0',
        lineHeight: '1.6',
        textAlign: 'center',
      }}>
        If the button doesn't work, copy and paste this link into your browser:
      </Text>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '32px',
      }}>
        <tr>
          <td>
            <Text style={{
              fontSize: '12px',
              color: '#4b5563',
              margin: 0,
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              lineHeight: '1.5',
            }}>
              {resetLink}
            </Text>
          </td>
        </tr>
      </table>

      {/* Security Tips */}
      <InfoCard 
        title="🛡️ Security Tips"
        bgColor="#eff6ff"
        borderColor="#3b82f6"
      >
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Choose a strong, unique password
        </Text>
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Never share your password with anyone
        </Text>
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: 0, lineHeight: '1.6' }}>
          • Enable two-factor authentication for extra security
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Didn't Request */}
      <InfoCard 
        bgColor="#fef2f2"
        borderColor="#ef4444"
      >
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          <strong>Didn't request this?</strong> Your account may be at risk. Please{' '}
          <a href={supportUrl} style={{ color: '#ef4444', textDecoration: 'underline' }}>contact support</a> immediately.
        </Text>
      </InfoCard>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
        <tr>
          <td align="center">
            <Text style={{
              fontSize: '15px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Stay secure,<br />
              <strong style={{ color: '#ef4444' }}>The {appName} Security Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

PasswordResetEmail.PreviewProps = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  resetLink: 'http://localhost:3000/reset-password?token=test-token',
  expiryTime: '1 hour',
  supportUrl: 'http://localhost:3000/support',
};

export default PasswordResetEmail;
