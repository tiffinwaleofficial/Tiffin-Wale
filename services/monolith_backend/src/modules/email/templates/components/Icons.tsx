import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const TiffinIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.21.9 4.21 2.34 5.66" />
      <path d="M4 12h16" />
      <path d="M12 4v8" />
      <path d="M12 20a4 4 0 0 1-4-4" />
      <path d="M12 20a4 4 0 0 0 4-4" />
    </svg>
);
  

export const GiftIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export const AlertIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.78a2 2 0 0 1-1.11 1.79l-.55.34a2 2 0 0 0-1.11 1.79v4.56a2 2 0 0 0 1.11 1.79l.55.34a2 2 0 0 1 1.11 1.79v.78a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.78a2 2 0 0 1 1.11-1.79l.55-.34a2 2 0 0 0 1.11-1.79v-4.56a2 2 0 0 0-1.11-1.79l-.55-.34a2 2 0 0 1-1.11-1.79V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

export const LocationIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export const DollarSignIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
    </svg>
);

export const MealIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        imageRendering: 'optimizeQuality',
        fillRule: 'evenodd',
        clipRule: 'evenodd'
      }}
      viewBox="0 0 6.827 6.827"
      className={className}
    >
      <g>
        <path style={{fill: color, fillRule: 'nonzero'}} d="M3.413 1.6c.501 0 .954.203 1.283.531.328.328.53.782.53 1.282a1.808 1.808 0 0 1-1.813 1.813A1.808 1.808 0 0 1 1.6 3.414c0-.5.203-.954.531-1.282A1.808 1.808 0 0 1 3.413 1.6zm1.132.682c-.29-.29-.69-.469-1.132-.469-.442 0-.842.18-1.131.469a1.595 1.595 0 0 0 0 2.263c.29.29.69.468 1.131.468a1.595 1.595 0 0 0 1.6-1.6c0-.442-.179-.842-.468-1.131z"/>
        <path style={{fill: color, fillRule: 'nonzero'}} d="M3.413 2.169a1.24 1.24 0 0 1 1.245 1.244 1.24 1.24 0 0 1-1.245 1.245A1.24 1.24 0 0 1 2.17 3.413 1.24 1.24 0 0 1 3.413 2.17zm.73.515a1.028 1.028 0 0 0-1.459 0 1.028 1.028 0 0 0 0 1.458 1.028 1.028 0 0 0 1.458 0 1.028 1.028 0 0 0 0-1.458zM1.376 2.507a.107.107 0 0 0-.213 0v1.28a.107.107 0 0 0 .213 0v-1.28z"/>
        <path style={{fill: color, fillRule: 'nonzero'}} d="M1.27 1.227c.137 0 .254.109.33.286.066.15.107.355.107.578 0 .5-.178.498-.405.496h-.065c-.227.002-.405.004-.405-.496 0-.223.04-.428.106-.578.077-.177.194-.286.331-.286zm.136.37c-.043-.097-.092-.157-.137-.157-.045 0-.093.06-.136.158a1.276 1.276 0 0 0-.088.493c0 .286.084.285.19.284l.034-.001h.034c.107.002.19.003.19-.283 0-.195-.033-.37-.087-.493zM1.27 3.745a.294.294 0 0 1 .295.295v1.265a.294.294 0 0 1-.296.295.294.294 0 0 1-.295-.295V4.04a.294.294 0 0 1 .295-.295zm0 .213a.082.082 0 0 0-.058.024.082.082 0 0 0-.024.058v1.265a.082.082 0 0 0 .082.082.082.082 0 0 0 .082-.082V4.04a.082.082 0 0 0-.025-.058.082.082 0 0 0-.058-.024zM5.681 2.507a.107.107 0 0 0-.213 0v1.28a.107.107 0 0 0 .213 0v-1.28z"/>
        <path style={{fill: color, fillRule: 'nonzero'}} d="M5.932 1.58a.106.106 0 0 0-.2.07c.02.06.037.129.049.204.011.074.017.154.017.237 0 .286-.083.285-.19.284l-.034-.001H5.54c-.106.002-.19.003-.19-.283 0-.079.006-.154.016-.223.01-.071.025-.137.044-.196a.106.106 0 0 0-.202-.066c-.023.07-.04.148-.053.232-.012.08-.018.166-.018.253 0 .5.178.498.405.496h.065c.227.002.405.004.405-.496a1.77 1.77 0 0 0-.02-.268 1.357 1.357 0 0 0-.06-.243zM5.574 3.745a.294.294 0 0 1 .296.295v1.265a.294.294 0 0 1-.296.295.294.294 0 0 1-.295-.295V4.04a.294.294 0 0 1 .295-.295zm0 .213a.082.082 0 0 0-.057.024.082.082 0 0 0-.024.058v1.265a.082.082 0 0 0 .082.082.082.082 0 0 0 .082-.082V4.04a.082.082 0 0 0-.025-.058.082.082 0 0 0-.058-.024z"/>
        <path style={{fill: color, fillRule: 'nonzero'}} d="M5.681 1.493a.107.107 0 0 0-.213 0v.96a.107.107 0 0 0 .213 0v-.96z"/>
      </g>
    </svg>
  );