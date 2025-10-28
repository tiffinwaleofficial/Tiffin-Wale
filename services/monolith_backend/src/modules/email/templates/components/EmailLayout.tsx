import React from 'react';
import { Html, Head, Body, Container, Section, Img, Text, Link } from '@react-email/components';

interface EmailLayoutProps {
  preview: string;
  appName?: string;
  appUrl?: string;
  headerGradient?: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  preview,
  appName = 'Tiffin-Wale',
  appUrl = 'https://tiffin-wale.com',
  headerGradient = 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  children,
}) => {
  const iconUrl = `/static/icon.png`;
  const logoUrl = `/static/logo.png`;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
        <title>{preview}</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .main-content {
            background-color: #ffffff;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .header {
            padding: 32px 0;
            text-align: center;
          }
          .footer {
            padding: 32px 0;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
          .logo-bg {
            background-color: #ffffff;
          }
          @media (prefers-color-scheme: dark) {
            .logo-bg {
              background-color: #ffffff !important;
            }
          }
        `}</style>
      </Head>
      <Body>
        <Container className="container">
          <Section className="header" style={{ background: headerGradient, borderRadius: '16px 16px 0 0' }}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 24px' }}>
              <tr>
                <td className="logo-bg" style={{
                  borderRadius: '50%',
                  width: '96px',
                  height: '96px',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}>
                  <Img
                    src={'https://res.cloudinary.com/dols3w27e/image/upload/v1761226264/wdqhh9yupfrhxvp4yxzv.png'}
                    alt={`${appName} Icon`}
                    width="80"
                    height="80"
                    style={{ margin: 'auto' }}
                  />
                </td>
              </tr>
            </table>

            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
              <tr>
                <td className="logo-bg" style={{
                  borderRadius: '12px',
                }}>
                  <Img
                    src={'https://res.cloudinary.com/dols3w27e/image/upload/v1761226264/cbvsj2wkius4l0lu6vf3.png'}
                    alt={`${appName} Logo`}
                    width="240"
                    style={{ margin: '0 auto', display: 'block' }}
                  />
                </td>
              </tr>
            </table>
          </Section>

          <Section className="main-content">
            {children}
          </Section>

          <Section className="footer">
            <Text style={{ margin: '0 0 8px 0' }}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
            <Text style={{ margin: '0 0 8px 0' }}>
              <Link href={`${appUrl}/privacy`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>Privacy Policy</Link> | 
              <Link href={`${appUrl}/terms`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>Terms of Service</Link>
            </Text>
            <Text style={{ margin: 0 }}>
              If you have any questions, please visit our <Link href={`${appUrl}/support`} style={{ color: '#9ca3af', textDecoration: 'underline' }}>Support Center</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;
