import React from 'react';
import { Img, Text } from '@react-email/components';

interface CfoAvatarProps {
  photoUrl: string;
  name: string;
  title: string;
  companyName: string;
}

export const CfoAvatar: React.FC<CfoAvatarProps> = ({
  photoUrl,
  name,
  title,
  companyName,
}) => {
  return (
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: '32px' }}>
      <tr>
        <td align="center">
          <table cellPadding="0" cellSpacing="0">
            <tr>
              <td width="80" style={{ paddingRight: '20px' }}>
                <Img
                  src={photoUrl}
                  alt={name}
                  width="80"
                  height="80"
                  style={{ borderRadius: '50%' }}
                />
              </td>
              <td>
                <Text style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 4px 0',
                }}>
                  {name}
                </Text>
                <Text style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                }}>
                  {title}
                </Text>
                <Text style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#f97316',
                  margin: '4px 0 0 0',
                }}>
                  {companyName}
                </Text>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

export default CfoAvatar;
