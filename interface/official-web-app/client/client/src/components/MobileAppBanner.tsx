import React from "react";
import { X } from "lucide-react";

const MobileAppBanner = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-primary text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Get the TiffinWale App</p>
            <p className="text-sm text-white/80">Order faster, track meals, and earn rewards</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="#download-app" 
            className="bg-white text-primary px-4 py-2 rounded-md font-medium text-sm"
          >
            Download Now
          </a>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-white hover:text-white/80"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppBanner;
