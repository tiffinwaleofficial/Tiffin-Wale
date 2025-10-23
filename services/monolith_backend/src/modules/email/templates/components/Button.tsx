import React from 'react';
import { Button as ReactEmailButton, ButtonProps } from '@react-email/components';

interface CustomButtonProps extends Omit<ButtonProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  ...props
}) => {
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      color: '#ffffff',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: '#f97316',
      border: '2px solid #f97316',
    },
    success: {
      background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
      color: '#ffffff',
      border: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      color: '#ffffff',
      border: 'none',
    },
  };
  
  const sizeStyles = {
    sm: {
      padding: '10px 20px',
      fontSize: '14px',
    },
    md: {
      padding: '14px 28px',
      fontSize: '16px',
    },
    lg: {
      padding: '18px 36px',
      fontSize: '18px',
    },
  };

  const buttonStyle = {
    display: 'inline-block',
    textDecoration: 'none',
    textAlign: 'center' as const,
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    boxShadow: variant !== 'outline' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
    transition: 'all 0.2s ease',
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <ReactEmailButton href={href} style={buttonStyle} {...props}>
      {icon ? (
        <table cellPadding="0" cellSpacing="0" border={0} style={{ margin: '0 auto' }}>
          <tr>
            <td style={{ paddingRight: '8px', verticalAlign: 'middle' }}>
              {icon}
            </td>
            <td style={{ verticalAlign: 'middle' }}>
              {children}
            </td>
          </tr>
        </table>
      ) : (
        children
      )}
    </ReactEmailButton>
  );
};

export default Button;
