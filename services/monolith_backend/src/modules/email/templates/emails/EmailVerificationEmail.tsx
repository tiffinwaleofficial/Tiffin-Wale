import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import InfoCard from '../components/InfoCard';
import { MailIcon, CheckCircleIcon, ClockIcon } from '../components/Icons';

interface EmailVerificationEmailProps {
  user: { name: string; email: string };
  verificationUrl: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const EmailVerificationEmail = ({
  user,
  verificationUrl,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support',
}: EmailVerificationEmailProps) => {
  const preview = `Verify your email address for ${appName}`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
    >
      {/* Verification Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#eff6ff',
        borderRadius: '12px',
        padding: '32px 24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <MailIcon size={64} color="#3b82f6" />
            <Text style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Verify Your Email Address 📧
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {user.name}, please verify your email to complete your account setup.
            </Text>
          </td>
        </tr>
      </table>

      {/* Email Address Display */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td>
            <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
              Email to verify:
            </Text>
            <Text style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: 0,
            }}>
              {user.email}
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
        Click the button below to verify your email address and activate your {appName} account.
      </Text>

      {/* Verify Button */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button 
              href={verificationUrl} 
              variant="primary" 
              size="lg"
              icon={<CheckCircleIcon size={20} color="#ffffff" />}
            >
              ✅ Verify Email Address
            </Button>
          </td>
        </tr>
      </table>

      {/* Time-sensitive Warning */}
      <InfoCard 
        title="⏰ Time-Sensitive"
        icon={<ClockIcon size={28} color="#f59e0b" />}
        bgColor="#fffbeb"
        borderColor="#f59e0b"
      >
        <Text style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: '1.6' }}>
          This verification link will expire in <strong>24 hours</strong>. Please verify your email as soon as possible to avoid any account restrictions.
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
              {verificationUrl}
            </Text>
          </td>
        </tr>
      </table>

      {/* Why Verify */}
      <InfoCard 
        title="🔒 Why Verify Your Email?"
        bgColor="#ecfdf5"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Secure your account and prevent unauthorized access
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Receive important order updates and notifications
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: '1.6' }}>
          • Enable password reset and account recovery features
        </Text>
      </InfoCard>

      {/* Didn't Sign Up */}
      <InfoCard 
        bgColor="#fef2f2"
        borderColor="#ef4444"
      >
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          <strong>Didn't create an account?</strong> You can safely ignore this email. If you continue to receive these emails, please{' '}
          <a href={supportUrl} style={{ color: '#ef4444', textDecoration: 'underline' }}>contact support</a>.
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
              Welcome to {appName}!<br />
              <strong style={{ color: '#3b82f6' }}>The {appName} Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

EmailVerificationEmail.PreviewProps = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  verificationUrl: 'http://localhost:3000/verify-email?token=test-token',
};

export default EmailVerificationEmail;
