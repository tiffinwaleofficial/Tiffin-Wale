import React from 'react';
import { Button as EmailButton, Link } from '@react-email/components';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}) => {
  const baseClasses = 'inline-block text-center font-semibold rounded-lg no-underline transition-colors';
  
  const variantClasses = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'bg-transparent text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const className = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
  ].filter(Boolean).join(' ');

  return (
    <EmailButton
      href={href}
      className={className}
      style={{
        display: fullWidth ? 'block' : 'inline-block',
        textDecoration: 'none',
      }}
    >
      {children}
    </EmailButton>
  );
};

export default Button;
