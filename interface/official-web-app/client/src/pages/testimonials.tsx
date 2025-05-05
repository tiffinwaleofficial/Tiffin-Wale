import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { ChevronRight, Quote, StarIcon } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function TestimonialsPage() {
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
            <span className="text-primary font-medium">Testimonials</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Page Header */}
        <div className="bg-primary/10 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Customer Stories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what our customers have to say about their TiffinWale experience.
            </p>
          </div>
        </div>
        
        {/* Testimonials Component */}
        <Testimonials />
        
        {/* Featured Testimonial */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-primary/5 rounded-xl p-8 relative">
              <Quote className="h-16 w-16 text-primary/20 absolute top-4 left-4" />
              <div className="text-center relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="Vikram Mehta" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md" 
                />
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg md:text-xl italic mb-6 px-6">
                  "As a working professional with a hectic schedule, TiffinWale has been a game-changer for me. Their meals are not only delicious but also perfectly balanced nutritionally. I've been using their service for over a year now, and the consistency in quality and taste has been impressive. The app makes it super easy to manage my subscription, and their customer service is exceptional!"
                </p>
                <h3 className="font-semibold text-xl">Vikram Mehta</h3>
                <p className="text-muted-foreground">Software Engineer</p>
                <p className="text-primary font-medium mt-1">Subscribed for 14 months</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Video Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">Video Testimonials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <img 
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=280&q=80" 
                    alt="Video thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Ananya's TiffinWale Story</h3>
                  <p className="text-muted-foreground text-sm">Medical Student</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <img 
                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=280&q=80" 
                    alt="Video thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Raj on Meal Quality</h3>
                  <p className="text-muted-foreground text-sm">Marketing Executive</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=280&q=80" 
                    alt="Video thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Meera's Fitness Journey</h3>
                  <p className="text-muted-foreground text-sm">Fitness Trainer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Customer Reviews Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">More Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">2 weeks ago</span>
                </div>
                <p className="mb-4">"The variety of meals is amazing. Each day is a delightful surprise!"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-primary font-medium text-sm">SG</span>
                  </div>
                  <span className="font-medium">Sanjay G.</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">1 month ago</span>
                </div>
                <p className="mb-4">"As someone with dietary restrictions, I appreciate how accommodating they are with my needs."</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-primary font-medium text-sm">PK</span>
                  </div>
                  <span className="font-medium">Priya K.</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(4)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <StarIcon className="h-4 w-4 text-gray-300 fill-current" />
                  </div>
                  <span className="text-sm text-muted-foreground">2 months ago</span>
                </div>
                <p className="mb-4">"Great service, though sometimes I wish they had more international cuisine options."</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-primary font-medium text-sm">AD</span>
                  </div>
                  <span className="font-medium">Arjun D.</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">3 months ago</span>
                </div>
                <p className="mb-4">"Delivery is always on time and the food is still hot when it arrives. Impressive service!"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    <span className="text-primary font-medium text-sm">NJ</span>
                  </div>
                  <span className="font-medium">Nisha J.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Share Your Story */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-bold text-3xl mb-4">Share Your TiffinWale Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              We'd love to hear about your experience with TiffinWale. Share your story and it might be featured here!
            </p>
            <Link href="/submit-testimonial" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200">
              Submit Your Testimonial
            </Link>
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}