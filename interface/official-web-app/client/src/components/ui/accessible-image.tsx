import React from 'react';

type AccessibleImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
};

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
}) => {
  // Ensure images have explicit width and height to prevent layout shifts
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
    />
  );
};

export default AccessibleImage; 