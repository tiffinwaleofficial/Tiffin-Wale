import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
  Row,
  Column,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  appName?: string;
  appUrl?: string;
  supportEmail?: string;
  currentYear?: number;
  headerGradient?: string;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
  preview = '',
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  supportEmail = 'support@tiffin-wale.com',
  currentYear = new Date().getFullYear(),
  headerGradient = 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
}) => {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 16px !important; }
            .mobile-text-sm { font-size: 14px !important; }
            .mobile-hidden { display: none !important; }
          }
        `}</style>
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Tailwind>
        <Body style={{ backgroundColor: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', margin: 0, padding: 0 }}>
          {/* Full-width wrapper */}
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <td align="center" style={{ padding: '40px 20px' }}>
                {/* Main container - 600px */}
                <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', width: '100%' }}>
                  
                  {/* Header with gradient */}
                  <tr>
                    <td style={{ 
                      background: headerGradient,
                      borderRadius: '16px 16px 0 0',
                      padding: '40px 32px',
                      textAlign: 'center'
                    }}>
                      <table width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                          <td align="center">
                            <Img
                              src={`${appUrl}/assets/logo-white.png`}
                              alt={`${appName} Logo`}
                              width="140"
                              height="45"
                              style={{ display: 'block', margin: '0 auto 16px' }}
                            />
                            <Text style={{ 
                              color: '#ffffff',
                              fontSize: '28px',
                              fontWeight: 'bold',
                              margin: '0 0 8px',
                              lineHeight: '1.2'
                            }}>
                              🍱 {appName}
                            </Text>
                            <Text style={{ 
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '15px',
                              margin: 0,
                              lineHeight: '1.5'
                            }}>
                              Delicious meals delivered fresh to your doorstep
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  {/* Main Content */}
                  <tr>
                    <td style={{ 
                      backgroundColor: '#ffffff',
                      padding: '48px 40px',
                    }} className="mobile-padding">
                      {children}
                    </td>
                  </tr>

                  {/* Footer */}
                  <tr>
                    <td style={{ 
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0 0 16px 16px',
                      padding: '40px 40px 32px'
                    }} className="mobile-padding">
                      
                      {/* Social Media Icons */}
                      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
                        <tr>
                          <td align="center">
                            <table cellPadding="0" cellSpacing="0">
                              <tr>
                                <td style={{ padding: '0 8px' }}>
                                  <Link href={`${appUrl}/facebook`} style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '50%', 
                                      backgroundColor: '#1877f2',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Text style={{ color: '#ffffff', fontSize: '20px', margin: 0 }}>f</Text>
                                    </div>
                                  </Link>
                                </td>
                                <td style={{ padding: '0 8px' }}>
                                  <Link href={`${appUrl}/instagram`} style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '50%', 
                                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Text style={{ color: '#ffffff', fontSize: '20px', margin: 0 }}>📷</Text>
                                    </div>
                                  </Link>
                                </td>
                                <td style={{ padding: '0 8px' }}>
                                  <Link href={`${appUrl}/twitter`} style={{ textDecoration: 'none' }}>
                                    <div style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '50%', 
                                      backgroundColor: '#1da1f2',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      <Text style={{ color: '#ffffff', fontSize: '20px', margin: 0 }}>🐦</Text>
                                    </div>
                                  </Link>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <Hr style={{ borderColor: '#d1d5db', margin: '24px 0' }} />
                      
                      <Text style={{ 
                        color: '#6b7280',
                        fontSize: '14px',
                        textAlign: 'center',
                        margin: '0 0 16px',
                        lineHeight: '1.6'
                      }}>
                        You're receiving this email because you have an account with {appName}.
                      </Text>
                      
                      <Text style={{ 
                        color: '#6b7280',
                        fontSize: '14px',
                        textAlign: 'center',
                        margin: '0 0 24px',
                        lineHeight: '1.6'
                      }}>
                        Need help? Contact us at{' '}
                        <Link
                          href={`mailto:${supportEmail}`}
                          style={{ color: '#f97316', textDecoration: 'underline' }}
                        >
                          {supportEmail}
                        </Link>
                      </Text>
                      
                      <Text style={{ 
                        color: '#9ca3af',
                        fontSize: '12px',
                        textAlign: 'center',
                        margin: '0 0 12px',
                        lineHeight: '1.5'
                      }}>
                        © {currentYear} {appName}. All rights reserved.
                      </Text>
                      
                      <Text style={{ 
                        color: '#9ca3af',
                        fontSize: '12px',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        <Link href={`${appUrl}/unsubscribe`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>
                          Unsubscribe
                        </Link>
                        {' | '}
                        <Link href={`${appUrl}/privacy`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>
                          Privacy Policy
                        </Link>
                        {' | '}
                        <Link href={`${appUrl}/terms`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>
                          Terms of Service
                        </Link>
                      </Text>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
