import React from 'react';
import { Text, Hr } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import Button from '../components/Button';
import CfoAvatar from '../components/CfoAvatar';
import { UserIcon } from '../components/Icons';

interface CeoWelcomeEmailProps {
  user: {
    name: string;
  };
  appName?: string;
  dashboardUrl?: string;
}

export const CeoWelcomeEmail = ({
  user,
  appName = 'Tiffin Wale',
  dashboardUrl = 'https://www.tiffin-wale.com',
}: CeoWelcomeEmailProps) => {
  const preview = `A personal message from Rahul Vishwakarma, CEO of ${appName}`;
  const ceoPhotoUrl = 'https://res.cloudinary.com/dols3w27e/image/upload/v1762012087/wakk2qrg6hlud881nkit.jpg'; // Placeholder - Update with actual CEO photo URL

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
        Invitation to Rejoin Tiffin Wale
      </Text>


      <Text style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 8px 0',
        lineHeight: '1.5',
      }}>
        Dear Ms. Riya Tiwari,
      </Text>

      <Text style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#6b7280',
        margin: '0 0 24px 0',
        lineHeight: '1.5',
      }}>
        Chief Financial Officer
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        I hope this message finds you well. I am writing to you today in my capacity as the Chief Executive Officer of {appName} to formally extend an invitation for you to return to our organization.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        Your contributions as our Chief Financial Officer were instrumental in establishing {appName}'s financial foundation. Your strategic financial expertise, meticulous attention to detail, and commitment to excellence were critical in building the financial systems that continue to support our operations today.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        Under your leadership, {appName} established robust financial systems, implemented sound budgeting practices, and developed forecasting models that have guided our growth trajectory. Your ability to translate complex financial data into actionable insights was invaluable, and your mentorship significantly contributed to our team's professional development.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        Your role as Chief Financial Officer was fundamental to our organization's success. Your expertise in financial planning, risk management, and strategic decision-making positioned {appName} for sustainable growth. Your professional integrity and dedication to excellence set a standard that continues to influence our operational practices.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        {appName} is currently at a critical stage of growth and expansion. As we navigate the challenges ahead, we recognize that your financial leadership and strategic expertise would be valuable assets to our organization. Your professional capabilities have been instrumental in strengthening our financial foundation, and we believe your return could help accelerate our growth trajectory and ensure continued operational excellence.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 24px 0',
        lineHeight: '1.7',
      }}>
        We recognize the value you bring as a financial leader and strategic partner. Should you choose to return, your expertise would significantly enhance our financial management capabilities and contribute to our mission of revolutionizing the food delivery industry in India.
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#374151',
        margin: '0 0 32px 0',
        lineHeight: '1.7',
      }}>
        We understand that this is a personal decision, and we respect whatever choice you make. If this opportunity aligns with your professional goals, I would welcome the opportunity to discuss your potential return to {appName}. Please take your time to consider this invitation, and should you wish to explore this further, please let me know at your convenience.
      </Text>

      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '32px' }}>
        <tr>
          <td align="center">
            <Button
              href="https://www.tiffin-wale.com/contact"
              variant="primary"
              size="md"
              icon={<UserIcon size={20} color="white" />}
            >
              Kindly Onboard Us
            </Button>
          </td>
        </tr>
      </table>

      <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0' }} />

      <CfoAvatar
        photoUrl={ceoPhotoUrl}
        name="Rahul Vishwakarma"
        title="Founder & Chief Executive Officer"
        companyName={appName}
      />
    </EmailLayout>
  );
};

CeoWelcomeEmail.PreviewProps = {
  user: {
    name: 'John Doe',
  },
};

export default CeoWelcomeEmail;

