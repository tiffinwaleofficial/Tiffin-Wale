import React from 'react';
import { createRoot } from "react-dom/client";
import { lazy, Suspense, useState, useEffect } from 'react';
import "./index.css";
import { preloadCriticalResources, registerServiceWorker, runWhenIdle } from './utils/performance';

// Lazy load the main App component
const App = lazy(() => import('./App'));

// Enhanced Loading Fallback with animation and changing messages
const LoadingFallback = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Preparing your delicious meals...",
    "Gathering the freshest ingredients...",
    "Spicing up your experience...",
    "Cooking up something special...",
    "Almost ready to serve you...",
    "Packing your virtual tiffin box...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Icon/Logo */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 14.25C8.5 14.25 9.75 12 12 12C14.25 12 15.5 14.25 15.5 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 5L17.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 5L6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 21H17C17.9428 21 18.4142 21 18.7071 20.7071C19 20.4142 19 19.9428 19 19V12.2C19 11.0799 19 10.5198 18.782 10.092C18.5903 9.71569 18.2843 9.40973 17.908 9.21799C17.4802 9 16.9201 9 15.8 9H8.2C7.07989 9 6.51984 9 6.09202 9.21799C5.71569 9.40973 5.40973 9.71569 5.21799 10.092C5 10.5198 5 11.0799 5 12.2V19C5 19.9428 5 20.4142 5.29289 20.7071C5.58579 21 6.05719 21 7 21Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-primary animate-ping opacity-30"></div>
      </div>

      {/* Main loading text */}
      <div className="text-3xl font-bold text-primary mb-2">TiffinWale</div>
      
      {/* Animated food message */}
      <div className="text-gray-600 font-medium mb-6">{messages[messageIndex]}</div>
      
      {/* Loading indicator */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className="w-3 h-3 rounded-full bg-primary" 
            style={{ 
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Create an initializer function that runs only when the DOM is ready
const initialize = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  // Preconnect to important domains for faster resource loading
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    if (domain !== 'https://fonts.googleapis.com') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
  
  // Register service worker for caching
  registerServiceWorker();
  
  // Create and render the application
  createRoot(rootElement).render(
    <React.StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </React.StrictMode>
  );
  
  // After initial render, preload other critical resources
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      preloadCriticalResources();
    });
  } else {
    setTimeout(preloadCriticalResources, 1000);
  }
};

// Use requestIdleCallback for non-critical initialization
if ('requestIdleCallback' in window) {
  // Wait for the browser to be idle before initializing
  window.requestIdleCallback(() => {
    initialize();
  });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(initialize, 1);
}
