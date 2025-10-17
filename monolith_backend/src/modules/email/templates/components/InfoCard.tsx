import React from 'react';
import { Section, Text } from '@react-email/components';

interface InfoCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  children,
  title,
  icon,
  bgColor = '#fef3c7',
  borderColor = '#fbbf24',
}) => {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" style={{
      backgroundColor: bgColor,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '12px',
      marginBottom: '24px',
      overflow: 'hidden',
    }}>
      <tr>
        <td style={{ padding: '24px' }}>
          {(title || icon) && (
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: title ? '16px' : 0 }}>
              <tr>
                {icon && (
                  <td width="40" style={{ verticalAlign: 'middle', paddingRight: '12px' }}>
                    {icon}
                  </td>
                )}
                {title && (
                  <td style={{ verticalAlign: 'middle' }}>
                    <Text style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0,
                      lineHeight: '1.4',
                    }}>
                      {title}
                    </Text>
                  </td>
                )}
              </tr>
            </table>
          )}
          <div style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
            {children}
          </div>
        </td>
      </tr>
    </table>
  );
};

export default InfoCard;

