import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import InfoCard from '../components/InfoCard';
import { CheckIcon, ShieldIcon } from '../components/Icons';

interface PasswordChangeConfirmationEmailProps {
  user: {
    name: string;
    email: string;
  };
  timestamp: string;
  appName?: string;
  appUrl?: string;
  supportUrl?: string;
}

export const PasswordChangeConfirmationEmail = ({
  user,
  timestamp,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportUrl = 'https://tiffin-wale.com/support',
}: PasswordChangeConfirmationEmailProps) => {
  const preview = `Your ${appName} password has been changed successfully`;

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      appUrl={appUrl}
      headerGradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    >
      {/* Success Banner */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ 
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        <tr>
          <td align="center">
            <CheckIcon size={56} color="#10b981" />
            <Text style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '16px 0 8px 0',
              lineHeight: '1.2',
            }}>
              Password Changed Successfully ✅
            </Text>
            <Text style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Hi {user.name}, your password has been updated successfully.
            </Text>
          </td>
        </tr>
      </table>

      {/* Change Details */}
      <InfoCard 
        title="🔐 Security Update"
        icon={<ShieldIcon size={28} color="#10b981" />}
        bgColor="#f0fdf4"
        borderColor="#10b981"
      >
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          <strong>Account:</strong> {user.email}
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          <strong>Changed:</strong> {new Date(timestamp).toLocaleString()}
        </Text>
        <Text style={{ fontSize: '14px', color: '#065f46', margin: 0, lineHeight: '1.6' }}>
          <strong>Status:</strong> Password successfully updated
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Next Steps */}
      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
        textAlign: 'center',
      }}>
        You can now use your new password to log in to your account. If you didn't make this change, please contact our support team immediately.
      </Text>

      {/* Security Tips */}
      <InfoCard 
        title="🛡️ Security Tips"
        icon={<ShieldIcon size={28} color="#3b82f6" />}
        bgColor="#eff6ff"
        borderColor="#3b82f6"
      >
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Use a unique password for each account
        </Text>
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Enable two-factor authentication if available
        </Text>
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: '0 0 8px 0', lineHeight: '1.6' }}>
          • Never share your password with anyone
        </Text>
        <Text style={{ fontSize: '14px', color: '#1e3a8a', margin: 0, lineHeight: '1.6' }}>
          • Log out from shared devices
        </Text>
      </InfoCard>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      {/* Didn't Make This Change */}
      <InfoCard 
        bgColor="#fef2f2"
        borderColor="#ef4444"
      >
        <Text style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, lineHeight: '1.6', textAlign: 'center' }}>
          <strong>Didn't make this change?</strong> Your account may be compromised. Please{' '}
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
              <strong style={{ color: '#10b981' }}>The {appName} Security Team</strong>
            </Text>
          </td>
        </tr>
      </table>
    </EmailLayout>
  );
};

PasswordChangeConfirmationEmail.PreviewProps = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  timestamp: new Date().toISOString(),
  supportUrl: 'http://localhost:3000/support',
};

export default PasswordChangeConfirmationEmail;
