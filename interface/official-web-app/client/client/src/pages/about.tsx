import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import AppStoreButtons from "@/components/AppStoreButtons";

export default function AboutPage() {
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
            <span className="text-primary font-medium">About Us</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <h1 className="font-bold text-4xl md:text-5xl mb-4">Our Story</h1>
                <p className="text-lg mb-6">
                  TiffinWale began with a simple mission: to bring the comfort and nutrition of home-cooked meals to busy individuals who have little time to cook but value healthy eating.
                </p>
                <p className="text-muted-foreground mb-6">
                  Founded in 2020 by a group of food enthusiasts who were tired of unhealthy takeout options, TiffinWale has grown from a small kitchen serving a few dozen customers to a beloved meal service with thousands of satisfied subscribers across major Indian cities.
                </p>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1625242662167-a1bba209b1b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="TiffinWale team" 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on the quality of ingredients or the preparation methods. Every meal is cooked with care, just like at home.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Customer Focused</h3>
                <p className="text-muted-foreground">
                  Everything we do is centered around making our customers happy and healthy. Your feedback shapes our menu and service.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl mb-3">Sustainable Practices</h3>
                <p className="text-muted-foreground">
                  We're committed to eco-friendly packaging, reducing food waste, and supporting local farmers and communities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Journey */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-12 text-center">Our Journey</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform md:-translate-x-1/2"></div>
                
                {/* Timeline Items */}
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-5 h-5 rounded-full bg-primary transform md:-translate-x-1/2"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right order-2 md:order-1">
                        <h3 className="font-semibold text-xl mb-2">2020: The Beginning</h3>
                        <p className="text-muted-foreground">
                          Started in a single kitchen with 3 chefs serving 50 customers in Bangalore.
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-16 md:pl-12 order-1 md:order-2 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" 
                          alt="TiffinWale beginning" 
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-5 h-5 rounded-full bg-primary transform md:-translate-x-1/2"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right order-2">
                        <h3 className="font-semibold text-xl mb-2">2022: Expansion</h3>
                        <p className="text-muted-foreground">
                          Expanded to 5 cities with over 1,000 daily subscribers and launched our mobile app.
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-16 md:pl-12 order-1 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1650367310179-e1b69c0e4485?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" 
                          alt="TiffinWale expansion" 
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-5 h-5 rounded-full bg-primary transform md:-translate-x-1/2"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right order-2 md:order-1">
                        <h3 className="font-semibold text-xl mb-2">2024: Innovation</h3>
                        <p className="text-muted-foreground">
                          Introduced AI-powered meal planning and fully compostable packaging across all locations.
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-16 md:pl-12 order-1 md:order-2 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" 
                          alt="TiffinWale innovation" 
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-5 h-5 rounded-full bg-primary transform md:-translate-x-1/2"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-16 md:pl-0 md:pr-12 md:text-right order-2">
                        <h3 className="font-semibold text-xl mb-2">2025: Today & Beyond</h3>
                        <p className="text-muted-foreground">
                          Serving 10,000+ happy customers daily across 10 cities with plans to launch internationally.
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-16 md:pl-12 order-1 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" 
                          alt="TiffinWale today" 
                          className="rounded-lg shadow-md w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Rohit Sharma, CEO" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="font-semibold text-lg">Rohit Sharma</h3>
                <p className="text-primary font-medium">CEO & Founder</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Priya Patel, COO" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="font-semibold text-lg">Priya Patel</h3>
                <p className="text-primary font-medium">COO</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Vikram Mehta, CTO" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="font-semibold text-lg">Vikram Mehta</h3>
                <p className="text-primary font-medium">CTO</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Neha Singh, Head Chef" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                />
                <h3 className="font-semibold text-lg">Neha Singh</h3>
                <p className="text-primary font-medium">Head Chef</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bold text-3xl mb-4">Join the TiffinWale Family</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Download our app today and become part of the TiffinWale community. Enjoy delicious, home-cooked meals delivered to your doorstep.
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