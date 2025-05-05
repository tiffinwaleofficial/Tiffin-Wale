import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  blurhash?: string; // Optional blurhash placeholder
  sizes?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  blurhash,
  sizes = '100vw',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Convert Unsplash URLs to use their image CDN optimization
  const optimizedSrc = src.includes('unsplash.com') 
    ? optimizeUnsplashUrl(src, width, height) 
    : src;
  
  // Generate WebP URL if source isn't already WebP
  const webpSrc = !optimizedSrc.endsWith('.webp') && !optimizedSrc.includes('format=webp')
    ? generateWebPUrl(optimizedSrc)
    : optimizedSrc;
  
  // Fallback in case of error
  const fallbackSrc = optimizedSrc.includes('unsplash.com') 
    ? optimizedSrc.split('&')[0] // Use base Unsplash URL without params
    : optimizedSrc;
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // Handle image error
  const handleError = () => {
    setIsError(true);
  };
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Blur hash or placeholder while loading */}
      {!isLoaded && blurhash && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundColor: '#f0f0f0' }}
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <picture>
        {/* WebP format */}
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
        />
        
        {/* Original format fallback */}
        <img
          src={isError ? fallbackSrc : optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          sizes={sizes}
        />
      </picture>
    </div>
  );
};

// Optimize Unsplash URLs for better performance
function optimizeUnsplashUrl(url: string, width: number, height: number): string {
  if (!url.includes('unsplash.com')) return url;
  
  // If URL already has parameters, parse them
  const [baseUrl, params] = url.includes('?') ? url.split('?') : [url, ''];
  const searchParams = new URLSearchParams(params);
  
  // Set quality and format parameters
  searchParams.set('q', '80'); // 80% quality
  searchParams.set('auto', 'format'); // Let Unsplash determine best format
  
  // Only override width/height if they're not already set
  if (!searchParams.has('w')) searchParams.set('w', width.toString());
  if (!searchParams.has('h')) searchParams.set('h', height.toString());
  
  // Return optimized URL
  return `${baseUrl}?${searchParams.toString()}`;
}

// Generate WebP URL for non-WebP images
function generateWebPUrl(url: string): string {
  if (url.includes('unsplash.com')) {
    // For Unsplash, use their format parameter
    const [baseUrl, params] = url.includes('?') ? url.split('?') : [url, ''];
    const searchParams = new URLSearchParams(params);
    searchParams.set('fm', 'webp');
    return `${baseUrl}?${searchParams.toString()}`;
  }
  
  // For other URLs, we can't reliably generate WebP
  // In a real app, you'd use a server component or API to convert images
  return url;
}

export default OptimizedImage; 