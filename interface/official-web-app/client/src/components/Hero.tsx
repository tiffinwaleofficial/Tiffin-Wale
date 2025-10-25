import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppStoreButtons from "@/components/AppStoreButtons";
import { OptimizedImage } from "@/components/ui";
import { Star, Users, Clock, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-secondary/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-12">
          {/* Left Content (Text) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse-slow">
              <Award className="h-4 w-4" />
              #1 Tiffin Service in India
            </div>

            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight">
              <span className="text-primary block animate-fadeInUp">Delicious</span>
              <span className="text-foreground block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>Home-Cooked</span>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                Meals Daily
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              Nutritious, affordable monthly plans perfect for students & busy professionals. 
              <span className="text-primary font-medium"> Fresh ingredients, authentic flavors, delivered daily.</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">50,000+</span> Happy Customers
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold text-foreground">4.8/5</span> Rating
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">On-Time</span> Delivery
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fadeInUp" style={{ animationDelay: '1s' }}>
              <Button size="lg" className="bg-primary hover:bg-accent text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Order Now - ₹99/day
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300">
                View Menu
              </Button>
            </div>
          </div>
          
          {/* Right Content (Image) */}
          <div className="w-full lg:w-1/2 relative z-10">
            <div className="relative animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-700">
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
                <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                  ₹99/day
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
