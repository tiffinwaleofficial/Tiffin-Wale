import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppStoreButtons from "@/components/AppStoreButtons";

export default function Hero() {
  return (
    <section className="relative bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-24">
        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row items-center mb-8 md:mb-12">
          {/* Left Content (Text) */}
          <div className="w-full md:w-1/2 md:pr-8 mb-8 md:mb-0 z-10" style={{ animation: 'fadeInUp 0.8s ease-out backwards' }}>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              <span className="text-primary block" style={{ animation: 'fadeInUp 0.9s ease-out backwards' }}>Delicious Home-Cooked Meals,</span>
              <span className="text-foreground block" style={{ animation: 'fadeInUp 1.1s ease-out backwards' }}>Delivered Daily.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg" style={{ animation: 'fadeInUp 1.3s ease-out backwards' }}>
              Nutritious, affordable monthly plans—perfect for students & busy pros.
            </p>
          </div>
          
          {/* Right Content (Image) */}
          <div className="w-full md:w-1/2 z-10" style={{ animation: 'fadeIn 1.2s ease-out backwards' }}>
            <img 
              src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Delicious tiffin meals with curry and rice" 
              className="w-full h-auto rounded-lg shadow-xl object-cover transform transition-all duration-700 hover:scale-105" 
            />
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary rounded-full opacity-20 animate-pulse-slow hidden md:block"></div>
            <div className="absolute bottom-12 -left-8 w-12 h-12 bg-primary rounded-full opacity-30 animate-pulse-slow hidden md:block" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        {/* App Store Buttons Row (Below Image) */}
        <div className="flex justify-center w-full" style={{ animation: 'fadeInUp 1.5s ease-out backwards' }}>
          <div className="max-w-md w-full">
            <AppStoreButtons className="w-full" />
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-primary opacity-5 rounded-l-full hidden md:block"></div>
      </div>
    </section>
  );
}
