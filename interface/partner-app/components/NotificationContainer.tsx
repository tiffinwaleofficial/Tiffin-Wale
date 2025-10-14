import React from 'react';

interface NotificationContainerProps {
  children?: React.ReactNode;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ children }) => {
  // Simplified notification container - just render children for now
  return <>{children}</>;
};

export default NotificationContainer;
