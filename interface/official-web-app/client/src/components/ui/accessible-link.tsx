import React from 'react';
import { Link, useRoute } from 'wouter';

type AccessibleLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  href,
  children,
  className = '',
  ariaLabel,
  onClick,
}) => {
  const [isActive] = useRoute(href);
  const computedAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);
  
  // Ensure links have a discernible name for screen readers
  return (
    <Link 
      href={href}
      onClick={onClick}
    >
      <a 
        className={`${className} ${isActive ? 'active' : ''}`}
        aria-label={computedAriaLabel}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </a>
    </Link>
  );
};

export default AccessibleLink; 