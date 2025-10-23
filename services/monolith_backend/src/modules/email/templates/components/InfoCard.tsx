import React from 'react';
import { Section, Text } from '@react-email/components';

interface InfoCardProps {
  title?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  bgColor = '#f9fafb',
  borderColor = '#e5e7eb',
  children,
}) => {
  return (
    <Section style={{
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    }}>
      {title && (
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '16px' }}>
          <tr>
            {icon && (
              <td width="40" style={{ verticalAlign: 'top', paddingRight: '16px' }}>
                {icon}
              </td>
            )}
            <td>
              <Text style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
              }}>
                {title}
              </Text>
            </td>
          </tr>
        </table>
      )}
      {children}
    </Section>
  );
};

export default InfoCard;
