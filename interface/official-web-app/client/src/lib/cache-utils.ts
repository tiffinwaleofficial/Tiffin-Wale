/**
 * Utility functions for client-side resource caching and optimization
 */

/**
 * Configure the service worker for runtime caching
 * This improves performance for subsequent visits
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful:', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}

/**
 * Preload critical resources that will be needed soon
 * This should be called early in the page lifecycle
 */
export function preloadCriticalResources(): void {
  // Common image file extensions to preload
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  
  // Find all visible images that should be preloaded
  const imagesToPreload = Array.from(document.querySelectorAll('img'))
    .filter(img => {
      // Check if image is in viewport or close to it
      const rect = img.getBoundingClientRect();
      const isNearViewport = 
        rect.top < window.innerHeight + 500 && // Image is visible or 500px below viewport
        rect.bottom > -500 && // Image is visible or 500px above viewport
        rect.left < window.innerWidth + 500 && // Image is visible or 500px to the right of viewport
        rect.right > -500; // Image is visible or 500px to the left of viewport
      
      // Only preload images that are near the viewport and have a src
      return isNearViewport && !!img.getAttribute('src');
    })
    .map(img => img.getAttribute('src'))
    .filter(src => !!src) as string[];
  
  // Preload images
  imagesToPreload.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
  
  // Preload critical CSS files that haven't been loaded yet
  const stylesheets = Array.from(document.styleSheets);
  const loadedStylesheetUrls = stylesheets.map(sheet => sheet.href).filter(href => !!href);
  
  // Add any additional critical CSS files that should be preloaded
  const criticalCssFiles = [
    '/assets/index-cl1_Fy4c.css' // Main CSS file
  ].filter(href => !loadedStylesheetUrls.includes(href));
  
  criticalCssFiles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

/**
 * Implement a simple client-side cache for API responses
 * This helps reduce redundant network requests
 */
export class ClientCache {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  
  /**
   * Store data in the cache
   * @param key Cache key
   * @param data Data to store
   * @param ttl Time to live in seconds (default: 5 minutes)
   */
  set(key: string, data: any, ttl: number = 300): void {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { data, expires });
    
    // Also store in sessionStorage for persistence across page navigation
    try {
      sessionStorage.setItem(
        `cache_${key}`, 
        JSON.stringify({ data, expires })
      );
    } catch (error) {
      console.warn('Failed to store in sessionStorage:', error);
    }
  }
  
  /**
   * Get data from the cache
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get(key: string): any {
    // First try memory cache
    const cacheEntry = this.cache.get(key);
    if (cacheEntry && cacheEntry.expires > Date.now()) {
      return cacheEntry.data;
    }
    
    // Then try sessionStorage
    try {
      const storedValue = sessionStorage.getItem(`cache_${key}`);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        if (parsed.expires > Date.now()) {
          // Refresh memory cache from sessionStorage
          this.cache.set(key, parsed);
          return parsed.data;
        } else {
          // Clean up expired entry
          sessionStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve from sessionStorage:', error);
    }
    
    return null;
  }
  
  /**
   * Clear cache entries for specific keys or all entries
   * @param keys Optional keys to clear (clears all if not provided)
   */
  clear(keys?: string[]): void {
    if (keys) {
      keys.forEach(key => {
        this.cache.delete(key);
        try {
          sessionStorage.removeItem(`cache_${key}`);
        } catch (error) {
          console.warn('Failed to remove from sessionStorage:', error);
        }
      });
    } else {
      this.cache.clear();
      try {
        // Only clear cache items, not all sessionStorage
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('cache_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear sessionStorage:', error);
      }
    }
  }
}

// Export a singleton instance for app-wide use
export const appCache = new ClientCache(); 