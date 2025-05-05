import { Link } from "wouter";

interface AppStoreButtonsProps {
  className?: string;
  darkMode?: boolean;
}

export default function AppStoreButtons({ className = "", darkMode = true }: AppStoreButtonsProps) {
  return (
    <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${className}`}>
      {/* Google Play Button */}
      <Link href="#download">
        <button className="app-cta-btn flex items-center justify-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-3">
            <path fill="currentColor" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
          </svg>
          <div className="text-left">
            <div className="text-xs">Download on</div>
            <div className="text-sm font-medium">Google Play</div>
          </div>
        </button>
      </Link>
      
      {/* App Store Button */}
      <Link href="#download">
        <button className="app-cta-btn flex items-center justify-center bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-3">
            <path fill="currentColor" d="M11.9999 6.5098C12.9799 6.5098 14.6999 5.5098 16.0999 5.5098C19.0999 5.5098 19.9999 7.4198 19.9999 7.4198C19.9999 7.4198 18.0999 8.4098 18.0999 10.5098C18.0999 12.9998 20.4999 13.9998 20.4999 13.9998C20.4999 13.9998 18.2999 18.9998 16.0999 18.9998C14.6999 18.9998 13.9999 17.9998 11.9999 17.9998C9.9999 17.9998 9.2999 18.9998 7.8999 18.9998C5.6999 18.9998 3.0999 14.1098 3.0999 10.5098C3.0999 6.9998 5.3999 5.0998 7.3999 5.0998C9.1999 5.0998 10.9999 6.5098 11.9999 6.5098ZM14.5 4C14.5 2.8 13.5 1.8 12.5 1C11.5 0.2 10.5 0 10.5 0C10.5 0 10.4 0.9 11.4 1.8C12.4 2.7 13.5 2.8 13.5 2.8C13.5 2.8 14.5 2.8 14.5 4Z"/>
          </svg>
          <div className="text-left">
            <div className="text-xs">Download on</div>
            <div className="text-sm font-medium">App Store</div>
          </div>
        </button>
      </Link>
    </div>
  );
}

export function LightAppStoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ${className}`}>
      {/* Google Play Button */}
      <Link href="#download">
        <button className="app-cta-btn flex items-center justify-center bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-3">
            <path fill="currentColor" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
          </svg>
          <div className="text-left">
            <div className="text-xs">Download on</div>
            <div className="text-sm font-medium">Google Play</div>
          </div>
        </button>
      </Link>
      
      {/* App Store Button */}
      <Link href="#download">
        <button className="app-cta-btn flex items-center justify-center bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-3">
            <path fill="currentColor" d="M11.9999 6.5098C12.9799 6.5098 14.6999 5.5098 16.0999 5.5098C19.0999 5.5098 19.9999 7.4198 19.9999 7.4198C19.9999 7.4198 18.0999 8.4098 18.0999 10.5098C18.0999 12.9998 20.4999 13.9998 20.4999 13.9998C20.4999 13.9998 18.2999 18.9998 16.0999 18.9998C14.6999 18.9998 13.9999 17.9998 11.9999 17.9998C9.9999 17.9998 9.2999 18.9998 7.8999 18.9998C5.6999 18.9998 3.0999 14.1098 3.0999 10.5098C3.0999 6.9998 5.3999 5.0998 7.3999 5.0998C9.1999 5.0998 10.9999 6.5098 11.9999 6.5098ZM14.5 4C14.5 2.8 13.5 1.8 12.5 1C11.5 0.2 10.5 0 10.5 0C10.5 0 10.4 0.9 11.4 1.8C12.4 2.7 13.5 2.8 13.5 2.8C13.5 2.8 14.5 2.8 14.5 4Z"/>
          </svg>
          <div className="text-left">
            <div className="text-xs">Download on</div>
            <div className="text-sm font-medium">App Store</div>
          </div>
        </button>
      </Link>
    </div>
  );
}