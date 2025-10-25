import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppStoreButtons from "@/components/AppStoreButtons";
import { OptimizedImage } from "@/components/ui";
import { Star, Users, Clock, Award, ChefHat, MapPin, TrendingUp, Shield } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Food Icons Animation (Optional) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-10 opacity-10 animate-pulse-slow">
          <ChefHat className="h-16 w-16 text-primary" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28 relative">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-12">
          {/* Left Content (Text) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-6 animate-pulse-slow shadow-lg backdrop-blur-sm">
              <Award className="h-5 w-5" />
              India's #1 Tiffin Marketplace
            </div>

            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight">
              <span className="text-foreground block animate-fadeInUp">Discover</span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                100+ Verified
              </span>
              <span className="text-foreground block animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                Tiffin Centers
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fadeInUp leading-relaxed" style={{ animationDelay: '0.6s' }}>
              Browse by <span className="text-primary font-semibold">ratings</span>, compare plans, and subscribe to your favorite tiffin center. 
              <span className="text-foreground font-medium"> Home-cooked meals from trusted kitchens, delivered daily.</span>
            </p>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary/10">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <span className="font-bold text-xl text-foreground">50K+</span>
                  <span className="text-xs text-muted-foreground">Happy Users</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary/10">
                <div className="flex flex-col items-center text-center">
                  <ChefHat className="h-6 w-6 text-primary mb-2" />
                  <span className="font-bold text-xl text-foreground">100+</span>
                  <span className="text-xs text-muted-foreground">Tiffin Centers</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary/10">
                <div className="flex flex-col items-center text-center">
                  <Star className="h-6 w-6 text-yellow-500 mb-2" />
                  <span className="font-bold text-xl text-foreground">4.6★</span>
                  <span className="text-xs text-muted-foreground">Avg Rating</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary/10">
                <div className="flex flex-col items-center text-center">
                  <MapPin className="h-6 w-6 text-primary mb-2" />
                  <span className="font-bold text-xl text-foreground">200+</span>
                  <span className="text-xs text-muted-foreground">Locations</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fadeInUp" style={{ animationDelay: '1s' }}>
              <Link href="#pricing">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Browse Tiffin Centers
                </Button>
              </Link>
              <Link href="#download">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-6 rounded-full transition-all duration-300 text-base">
                  Download App
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Verified Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Best Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>On-Time Delivery</span>
              </div>
            </div>
          </div>
          
          {/* Right Content (Image) */}
          <div className="w-full lg:w-1/2 relative z-10">
            <div className="relative animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700 border-4 border-white/50">
                <OptimizedImage 
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Delicious Indian tiffin meals with curry, rice, and vegetables" 
                  className="w-full h-auto object-cover"
                  width={800}
                  height={600}
                  loading="eager"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating price tag */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-full font-bold shadow-xl">
                  From ₹50/day
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/20 rounded-full animate-pulse-slow hidden lg:block"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-accent/20 rounded-full animate-pulse-slow hidden lg:block" style={{ animationDelay: '1s' }}></div>
              
              {/* Feature cards floating around image */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl p-4 shadow-lg hidden xl:block animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fresh Daily</p>
                    <p className="text-xs text-muted-foreground">Made every morning</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-4 shadow-lg hidden xl:block animate-fadeInUp" style={{ animationDelay: '1.4s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">On Time</p>
                    <p className="text-xs text-muted-foreground">11:30 AM - 1:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* App Store Buttons */}
        <div className="text-center animate-fadeInUp" style={{ animationDelay: '1.6s' }}>
          <p className="text-muted-foreground mb-4 font-medium">Download our mobile app for the best experience</p>
          <div className="max-w-md mx-auto">
            <AppStoreButtons className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
