import React from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type AccessibleHeadingProps = {
  level: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const AccessibleHeading: React.FC<AccessibleHeadingProps> = ({
  level,
  children,
  className = '',
  id,
}) => {
  // Dynamically render the appropriate heading level
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag className={className} id={id}>
      {children}
    </HeadingTag>
  );
};

export default AccessibleHeading; 