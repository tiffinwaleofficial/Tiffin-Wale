import { Link } from "wouter";
import { LightAppStoreButtons } from "@/components/AppStoreButtons"; 
import { Smartphone, Star, ChefHat, Clock, Shield, TrendingUp } from "lucide-react";

export default function DownloadCTA() {
  return (
    <section id="download" className="py-20 md:py-28 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold border border-white/30 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Available on iOS & Android
              </span>
            </div>

            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Browse 100+ Tiffin Centers
              <br />
              <span className="text-white/90">On Your Mobile</span>
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Download the TiffinWale app to explore verified tiffin centers, compare ratings, view subscription plans, and order your favorite home-cooked meals - all from your phone!
            </p>
            
            {/* App Store Buttons */}
            <div className="mb-12">
              <LightAppStoreButtons />
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80 text-sm">App Downloads</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-1">
                  4.6<Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                </div>
                <div className="text-white/80 text-sm">App Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-white/80 text-sm">Tiffin Centers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">200+</div>
                <div className="text-white/80 text-sm">Locations</div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Browse & Compare</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Explore 100+ verified tiffin centers, compare ratings, and find your perfect match
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Real-Time Tracking</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Track your order from kitchen to doorstep with live updates and notifications
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Secure Payments</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Multiple payment options with RazorPay integration for safe transactions
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-white/70 text-sm">
              🔒 Your data is safe with us. We follow industry-standard security protocols.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
