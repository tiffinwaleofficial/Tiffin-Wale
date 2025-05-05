// Export all accessibility components
export { default as AccessibleLink } from './accessible-link';
export { default as AccessibleImage } from './accessible-image';
export { default as AccessibleHeading } from './accessible-heading';

// Utility function to convert colors with poor contrast to accessible alternatives
export const getAccessibleColor = (color: string, background: string = '#FFFFFF'): string => {
  // This is a simplified implementation - in production you'd use a color contrast library
  const colorMap: Record<string, string> = {
    // Orange/Primary colors with better contrast
    '#FF9F43': '#d35400',
    '#FFA94D': '#d35400',
    '#FFB366': '#c05000',
    
    // Gray colors with better contrast
    '#CCCCCC': '#767676',
    '#AAAAAA': '#707070',
    '#999999': '#666666',
    '#777777': '#555555',
  };
  
  return colorMap[color] || color;
};

// Skip to content link - can be added at the top of pages
export const SkipToContent = () => (
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:z-50 focus:text-primary"
  >
    Skip to main content
  </a>
); 