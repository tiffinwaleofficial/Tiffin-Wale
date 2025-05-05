import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * A hook that scrolls the window to the top when the route changes
 */
export default function useScrollTop() {
  // Get the current location from wouter
  const [location] = useLocation();
  
  // Scroll to top when location changes
  useEffect(() => {
    // Use both approaches for maximum compatibility across browsers
    // First, try the smooth approach
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Then use a more direct approach as a fallback
    // This needs to be in a setTimeout to ensure it runs after the smooth scroll attempt
    setTimeout(() => {
      // Also scroll the document element and body for cross-browser compatibility
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [location]);
  
  return null;
}