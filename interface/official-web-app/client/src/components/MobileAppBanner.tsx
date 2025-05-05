import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MobileAppBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('app_banner_closed') === 'true';
    if (bannerClosed) {
      setIsVisible(false);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    // Set local storage to remember the user closed the banner
    localStorage.setItem('app_banner_closed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 bg-white p-4 shadow-lg border-t border-gray-200 md:hidden z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TW</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm">TiffinWale App</h4>
            <p className="text-xs text-gray-500">Get meals delivered daily</p>
          </div>
        </div>
        <div className="flex items-center">
          <Link href="#download">
            <Button size="sm" className="text-xs">Download</Button>
          </Link>
          <button 
            className="ml-2 text-gray-400 hover:text-gray-600"
            onClick={closeBanner}
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
