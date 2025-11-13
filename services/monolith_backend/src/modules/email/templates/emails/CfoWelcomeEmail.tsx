import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import CfoAvatar from '../components/CfoAvatar';
import { UserIcon } from '../components/Icons';

interface CfoWelcomeEmailProps {
  user: {
    name: string;
  };
  appName?: string;
  dashboardUrl?: string;
}

export const CfoWelcomeEmail = ({
  user,
  appName = 'Tiffin Wale',
  dashboardUrl = 'https://www.tiffin-wale.com',
}: CfoWelcomeEmailProps) => {
  const preview = `A personal welcome from Riya Tiwari, CFO of ${appName}`;
  const cfoPhotoUrl = 'https://res.cloudinary.com/dols3w27e/image/upload/v1763070356/swkcemedmaf3wscfcubi.jpg'; // Placeholder

  return (
    <EmailLayout
      preview={preview}
      appName={appName}
      headerGradient="linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)"
    >
      <Text style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 16px 0',
        lineHeight: '1.3',
        textAlign: 'center',
      }}>
        A Special Welcome to {appName}
      </Text>
      <Text style={{
        fontSize: '16px',
        color: '#6b7280',
        margin: '0 0 24px 0',
        lineHeight: '1.6',
        textAlign: 'center',
      }}>
        Hi {user.name}, I'm Riya Tiwari, the Chief Financial Officer at {appName}. I wanted to personally welcome you to our family.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        At {appName}, we're on a mission to revolutionize the way people experience home-cooked meals. We believe that everyone deserves access to delicious, healthy, and convenient food that feels like it was made with love. We partner with talented local chefs and home cooks to bring you a taste of home, delivered right to your doorstep.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 32px 0',
        lineHeight: '1.7',
      }}>
        We're incredibly excited to have you on this journey with us. Your support helps empower local food entrepreneurs and builds a stronger community. We are committed to ensuring you have an amazing experience with us.
      </Text>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button
              href="https://www.tiffin-wale.com/riya-tiwari"
              variant="primary"
              size="md"
              icon={<UserIcon size={20} color="white" />}
            >
              About Me
            </Button>
          </td>
        </tr>
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      <CfoAvatar
        photoUrl={cfoPhotoUrl}
        name="Riya Tiwari"
        title="Founder & Chief Financial Officer"
        companyName={appName}
      />
    </EmailLayout>
  );
};

CfoWelcomeEmail.PreviewProps = {
  user: {
    name: 'John Doe',
  },
};

export default CfoWelcomeEmail;
