import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// Check Mark Icon
export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = '#22c55e' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Food/Tiffin Icon
export const TiffinIcon: React.FC<IconProps> = ({ size = 24, color = '#f97316' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="3" y="11" width="18" height="10" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M3 13h18" stroke={color} strokeWidth="2"/>
    <path d="M12 11V3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="2" fill={color}/>
  </svg>
);

// Delivery/Truck Icon
export const DeliveryIcon: React.FC<IconProps> = ({ size = 24, color = '#3b82f6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M1 3h15v13H1z" stroke={color} strokeWidth="2"/>
    <path d="M16 8h2.5L21 11v5h-5" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/>
    <circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/>
  </svg>
);

// Credit Card/Payment Icon
export const CreditCardIcon: React.FC<IconProps> = ({ size = 24, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M2 10h20" stroke={color} strokeWidth="2"/>
  </svg>
);

// Star Rating Icon
export const StarIcon: React.FC<IconProps> = ({ size = 24, color = '#fbbf24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// Clock/Time Icon
export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Location/Map Pin Icon
export const LocationIcon: React.FC<IconProps> = ({ size = 24, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </svg>
);

// User/Profile Icon
export const UserIcon: React.FC<IconProps> = ({ size = 24, color = '#06b6d4' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M4 20v-2a6 6 0 0112 0v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Bell/Notification Icon
export const BellIcon: React.FC<IconProps> = ({ size = 24, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Package/Box Icon
export const PackageIcon: React.FC<IconProps> = ({ size = 24, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="2"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke={color} strokeWidth="2"/>
  </svg>
);

// Calendar Icon
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Email/Mail Icon
export const MailIcon: React.FC<IconProps> = ({ size = 24, color = '#6366f1' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M22 7l-10 7L2 7" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// Phone Icon
export const PhoneIcon: React.FC<IconProps> = ({ size = 24, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2"/>
  </svg>
);

// Gift/Reward Icon
export const GiftIcon: React.FC<IconProps> = ({ size = 24, color = '#ec4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="3" y="8" width="18" height="4" stroke={color} strokeWidth="2"/>
    <rect x="3" y="12" width="18" height="9" stroke={color} strokeWidth="2"/>
    <path d="M12 8V21M7.5 8a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 1 0 0-5C13 3 12 8 12 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Alert/Warning Icon
export const AlertIcon: React.FC<IconProps> = ({ size = 24, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2"/>
    <path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Success/Circle Check Icon
export const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, color = '#22c55e' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Heart Icon
export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// Trophy/Achievement Icon
export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = '#fbbf24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 4v5a6 6 0 1 1-12 0V4h12z" stroke={color} strokeWidth="2"/>
    <path d="M12 17v5M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Settings/Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default {
  Check: CheckIcon,
  Tiffin: TiffinIcon,
  Delivery: DeliveryIcon,
  CreditCard: CreditCardIcon,
  Star: StarIcon,
  Clock: ClockIcon,
  Location: LocationIcon,
  User: UserIcon,
  Bell: BellIcon,
  Package: PackageIcon,
  Calendar: CalendarIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  Gift: GiftIcon,
  Alert: AlertIcon,
  CheckCircle: CheckCircleIcon,
  Heart: HeartIcon,
  Trophy: TrophyIcon,
  Settings: SettingsIcon,
};

