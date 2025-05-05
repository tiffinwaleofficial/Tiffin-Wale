import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import AppStoreButtons from "@/components/AppStoreButtons";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-medium">How It Works</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Page Header */}
        <div className="bg-primary/10 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">How TiffinWale Works</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get delicious, home-cooked meals delivered right to your doorstep.
            </p>
          </div>
        </div>
        
        {/* How It Works Component */}
        <HowItWorks />
        
        {/* Additional Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-bold text-2xl md:text-3xl mb-6">Our Delivery Process</h2>
                <p className="text-muted-foreground mb-6">
                  At TiffinWale, we take pride in our efficient and reliable delivery process that ensures your meals arrive fresh and on time, every day.
                </p>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Early Morning Preparation</h3>
                      <p className="text-muted-foreground">Our chefs start early to prepare fresh meals using locally sourced ingredients.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Quality Control</h3>
                      <p className="text-muted-foreground">Each meal goes through a rigorous quality check before packaging.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Insulated Packaging</h3>
                      <p className="text-muted-foreground">Meals are packed in eco-friendly, insulated containers to maintain freshness.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">GPS-Tracked Delivery</h3>
                      <p className="text-muted-foreground">Our delivery partners use GPS tracking so you can follow your tiffin in real-time.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="font-bold text-2xl md:text-3xl mb-6">Subscription Management</h2>
                <p className="text-muted-foreground mb-6">
                  We make it easy for you to manage your subscription with our user-friendly app and flexible options.
                </p>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Change Plans Anytime</h3>
                      <p className="text-muted-foreground">Upgrade, downgrade, or modify your meal plan based on your changing needs.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Pause Subscription</h3>
                      <p className="text-muted-foreground">Going on vacation? Easily pause your subscription and resume when you return.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Custom Delivery Instructions</h3>
                      <p className="text-muted-foreground">Set specific delivery instructions for your home or office location.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Weekly Menu Selection</h3>
                      <p className="text-muted-foreground">Preview and select your meals for the upcoming week from our rotating menu.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bold text-3xl mb-6">Ready to Start Your TiffinWale Journey?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Download our app today and enjoy delicious home-cooked meals delivered to your doorstep.
            </p>
            <AppStoreButtons />
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}