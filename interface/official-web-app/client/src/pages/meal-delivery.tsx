import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';

export default function MealDeliveryPage() {
  return (
    <>
      <Helmet>
        <title>Best Meal Delivery Service in India | TiffinWale</title>
        <meta name="description" content="TiffinWale delivers fresh, home-cooked meals straight to your door. Choose from daily, weekly, or monthly subscription plans. Get affordable meal delivery now!" />
        <meta name="keywords" content="meal delivery, food delivery service, homemade food delivery, tiffin delivery service, healthy meal delivery, indian food delivery" />
        <link rel="canonical" href="https://tiffinwale.in/meal-delivery" />

        {/* Additional Schema for Meal Delivery Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FoodDeliveryService',
            name: 'TiffinWale Meal Delivery',
            description: 'Premium meal delivery service with home-cooked food delivered daily',
            url: 'https://tiffinwale.in/meal-delivery',
            logo: 'https://tiffinwale.in/logo.png',
            image: 'https://tiffinwale.in/meal-delivery-image.jpg',
            telephone: '+91-1234567890',
            priceRange: '₹₹',
            serviceArea: {
              '@type': 'GeoCircle',
              geoMidpoint: {
                '@type': 'GeoCoordinates',
                latitude: 12.9716,
                longitude: 77.5946
              },
              geoRadius: 15000
            },
            areaServed: {
              '@type': 'City',
              name: 'Bangalore'
            },
            servesCuisine: [
              'Indian',
              'Home-cooked',
              'Vegetarian',
              'Non-vegetarian'
            ],
            potentialAction: {
              '@type': 'OrderAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://tiffinwale.in/pricing',
                inLanguage: 'en-IN',
                actionPlatform: [
                  'http://schema.org/DesktopWebPlatform',
                  'http://schema.org/IOSPlatform',
                  'http://schema.org/AndroidPlatform'
                ]
              },
              deliveryMethod: [
                'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'
              ]
            }
          })}
        </script>
      </Helmet>

      <Navbar />
      
      <main>
        <section className="bg-gradient-to-br from-primary/10 to-white py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Premium Food Delivery
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Delicious Meals <span className="text-primary">Delivered</span> Daily To Your Door
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  Enjoy fresh, home-cooked meals delivered daily to your doorstep. Never worry about cooking again with our flexible subscription plans.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                      View Our Meal Plans
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                      How It Works
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">No Commitment</span>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                {/* Image frame with proper styling */}
                <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden border-8 border-white/80 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1374&auto=format&fit=crop" 
                    alt="Delicious meal delivery" 
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute top-8 -right-6 bg-white p-4 rounded-xl shadow-lg transform rotate-3 z-20">
                  <p className="text-primary font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Fresh Ingredients
                  </p>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 z-20">
                  <p className="text-green-600 font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    On-time Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Our Advantages
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TiffinWale Meal Delivery?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make meal time easy with delicious, home-cooked food delivered to your door every day.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Daily Delivery</h3>
                <p className="text-gray-600 text-center">
                  Fresh meals delivered daily at your preferred time, ensuring you never miss a meal. Our delivery team follows strict standards to ensure your food arrives hot and on time.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Customizable delivery times</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Temperature controlled packaging</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Home-Cooked Quality</h3>
                <p className="text-gray-600 text-center">
                  Authentic home-style recipes prepared with fresh ingredients and love. Each meal is crafted by experienced cooks who specialize in traditional recipes.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Fresh ingredients sourced daily</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>No artificial preservatives</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Flexible Plans</h3>
                <p className="text-gray-600 text-center">
                  Choose from a variety of subscription plans to suit your needs and budget. Pause, modify, or cancel your subscription anytime with no hassle.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>No long-term commitments</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Customize meal frequency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <section className="py-20 bg-primary/5 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Pricing Plans
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Most Popular Meal Delivery Plans</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Flexible meal delivery subscriptions to suit your lifestyle and budget. Choose the plan that works best for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <div className="relative group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
                
                <div className="w-20 h-20 mx-auto bg-white shadow-md rounded-full flex items-center justify-center mb-6 border-4 border-gray-50 group-hover:border-gray-100 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-2">Basic Plan</h3>
                <p className="text-gray-500 text-center text-sm mb-6">Perfect for solo professionals</p>
                
                <div className="text-center mb-6 py-4 border-y border-gray-100">
                  <span className="text-5xl font-bold">₹3,999</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-gray-500 text-sm mt-1">Billed monthly</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>1 Meal/Day (Lunch)</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Weekly Menu Rotation</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Free Delivery</span>
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Dietary Customization</span>
                  </li>
                </ul>
                
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full py-6 text-base group-hover:bg-gray-50 transition-colors">View Details</Button>
                </Link>
              </div>
              
              {/* Standard Plan - Featured */}
              <div className="relative group bg-white rounded-2xl shadow-xl p-8 transform md:scale-105 md:-translate-y-2 hover:scale-105 hover:-translate-y-2 transition-all duration-300 z-10 overflow-hidden border-2 border-primary/20">
                {/* Popular badge */}
                <div className="absolute -right-12 top-7 bg-primary text-white text-xs font-bold px-12 py-1 transform rotate-45">
                  MOST POPULAR
                </div>
                
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/10 to-white -z-10"></div>
                
                <div className="w-20 h-20 mx-auto bg-primary/10 shadow-md rounded-full flex items-center justify-center mb-6 border-4 border-primary/5 group-hover:border-primary/10 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-primary mb-2">Standard Plan</h3>
                <p className="text-gray-500 text-center text-sm mb-6">Ideal for working professionals</p>
                
                <div className="text-center mb-6 py-4 border-y border-primary/10">
                  <span className="text-5xl font-bold">₹5,999</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-gray-500 text-sm mt-1">Billed monthly</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>2 Meals/Day (Lunch & Dinner)</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dietary Preferences</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Priority Delivery</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Weekend Special Meals</span>
                  </li>
                </ul>
                
                <Link href="/pricing" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base">View Details</Button>
                </Link>
              </div>
              
              {/* Premium Plan */}
              <div className="relative group bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
                
                <div className="w-20 h-20 mx-auto bg-white shadow-md rounded-full flex items-center justify-center mb-6 border-4 border-gray-50 group-hover:border-gray-100 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-2">Premium Plan</h3>
                <p className="text-gray-500 text-center text-sm mb-6">Complete meal solution</p>
                
                <div className="text-center mb-6 py-4 border-y border-gray-100">
                  <span className="text-5xl font-bold">₹7,999</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-gray-500 text-sm mt-1">Billed monthly</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>3 Meals/Day (All Meals)</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Custom Menu Selection</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Flexible Delivery Times</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Premium Menu Items</span>
                  </li>
                </ul>
                
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full py-6 text-base group-hover:bg-gray-50 transition-colors">View Details</Button>
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-12 text-gray-500">
              <p>All plans include free delivery. See our <Link href="/pricing" className="text-primary underline underline-offset-2">pricing page</Link> for more details.</p>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-white px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 via-white to-primary/5 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
              <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
                <div className="md:max-w-md">
                  <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    Start Today
                  </span>
                  <h2 className="text-3xl font-bold mb-4">Ready to simplify your meals?</h2>
                  <p className="text-gray-600 mb-8">
                    Start your TiffinWale subscription today and experience the convenience of daily homemade meal delivery with our no-commitment plans.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">No contracts</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Free delivery</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link href="/pricing">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" size="lg" className="group relative overflow-hidden">
                        <span className="relative z-10">Learn More</span>
                        <span className="absolute inset-0 bg-primary/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="md:w-auto relative">
                  <div className="relative bg-white p-2 rounded-xl shadow-lg border-4 border-white transform rotate-2 z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1374&auto=format&fit=crop" 
                      alt="Delicious meal" 
                      className="rounded-lg w-full md:w-64 h-56 object-cover"
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 p-3 bg-white rounded-full shadow-md z-20">
                    <div className="bg-primary/10 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}