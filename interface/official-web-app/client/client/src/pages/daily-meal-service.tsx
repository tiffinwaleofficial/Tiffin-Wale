import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function DailyMealServicePage() {
  return (
    <>
      <Helmet>
        <title>Premium Daily Meal Service | TiffinWale | Fresh Home-Style Food</title>
        <meta name="description" content="TiffinWale's daily meal service brings fresh, homemade food to your doorstep every day. Choose from flexible subscription plans for breakfast, lunch & dinner." />
        <meta name="keywords" content="daily meal service, daily food delivery, meal subscription, daily tiffin service, regular meal delivery, homemade daily food, daily lunch service" />
        <link rel="canonical" href="https://tiffinwale.in/daily-meal-service" />

        {/* Schema Markup for Daily Meal Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FoodService',
            'name': 'TiffinWale Daily Meal Service',
            'description': 'Premium daily meal service with fresh, home-cooked food delivered to your doorstep',
            'url': 'https://tiffinwale.in/daily-meal-service',
            'logo': 'https://tiffinwale.in/logo.png',
            'image': 'https://tiffinwale.in/daily-meal-service-image.jpg',
            'telephone': '+91-1234567890',
            'priceRange': '₹₹',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': '123 Main Street',
              'addressLocality': 'Bangalore',
              'addressRegion': 'Karnataka',
              'postalCode': '560001',
              'addressCountry': 'IN'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': 12.9716,
              'longitude': 77.5946
            },
            'servesCuisine': [
              'Indian',
              'Home-cooked',
              'North Indian',
              'South Indian'
            ],
            'openingHoursSpecification': [
              {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'opens': '08:00',
                'closes': '20:00'
              }
            ],
            'offers': {
              '@type': 'Offer',
              'price': '3999',
              'priceCurrency': 'INR',
              'availability': 'https://schema.org/InStock',
              'validFrom': '2025-01-01'
            }
          })}
        </script>
      </Helmet>

      <Navbar />
      
      <main>
        <section className="bg-gradient-to-br from-primary/20 via-white to-primary/5 py-16 md:py-24 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-[10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Freshly Made Daily
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Premium <span className="text-primary">Daily Meal Service</span> For Your Busy Life
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  Say goodbye to the hassle of daily cooking. TiffinWale delivers fresh, home-cooked meals to your doorstep every day, so you can focus on what matters most.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                      Start Your Meal Plan
                    </Button>
                  </Link>
                  <Link href="#meal-plans">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                      See Meal Options
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">No Cooking</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">No Shopping</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">No Cleanup</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Image frame with proper styling */}
                <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden border-8 border-white/80 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Home-style daily meal service" 
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/20 rounded-full"></div>
                
                {/* Floating badges */}
                <div className="absolute top-6 -right-4 bg-white p-4 rounded-xl shadow-lg transform rotate-3 z-20">
                  <p className="text-primary font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Freshly Cooked
                  </p>
                </div>
                
                <div className="absolute bottom-6 -left-4 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 z-20">
                  <p className="text-green-600 font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8z" />
                      <path d="M12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                    </svg>
                    Daily Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Daily Meal Service You Deserve</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our daily meal service is designed to make your life easier with delicious, nutritious meals delivered right to your doorstep.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Consistent Daily Delivery</h3>
                <p className="text-gray-600">
                  Your meals arrive fresh at your preferred time, every single day without fail.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Weekly Menu Rotation</h3>
                <p className="text-gray-600">
                  Enjoy a variety of flavors with our rotating menu, never feel bored with your meals.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Dietary Preferences</h3>
                <p className="text-gray-600">
                  Customize your meals according to your dietary requirements and taste preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="meal-plans" className="py-16 bg-gray-50 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Flexible Options
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Daily Meal Plans</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the perfect meal plan that fits your lifestyle and needs. We've carefully designed these plans to meet different dietary requirements and budgets.
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
                  <Button variant="outline" className="w-full py-6 text-base group-hover:bg-gray-50 transition-colors">Get Started</Button>
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
                  <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base">Get Started</Button>
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
                  <Button variant="outline" className="w-full py-6 text-base group-hover:bg-gray-50 transition-colors">Get Started</Button>
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-12 text-gray-500">
              <p>All plans include free delivery. See our <Link href="/pricing" className="text-primary underline underline-offset-2">pricing page</Link> for more details.</p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our Daily Meal Service Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting started with TiffinWale's daily meal service is simple and hassle-free.
              </p>
            </div>
            
            <div className="relative">
              {/* Progress line */}
              <div className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-2 bg-gray-100 rounded-full z-0">
                <div className="h-full w-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full transform origin-left scale-x-75"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10">
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Choose Your Plan</h3>
                      <p className="text-gray-600 text-center">
                        Select the subscription that fits your needs and budget.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Customize Preferences</h3>
                      <p className="text-gray-600 text-center">
                        Tell us about your dietary preferences and restrictions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Set Delivery Times</h3>
                      <p className="text-gray-600 text-center">
                        Choose your preferred delivery timings for each meal.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">4</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Enjoy Daily Meals</h3>
                      <p className="text-gray-600 text-center">
                        Sit back and enjoy fresh, homemade meals delivered daily.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-16">
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10">Learn More About Our Process</span>
                  <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-primary/5 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100">
              {/* Decorative food icons */}
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-lg transform -rotate-6 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg transform rotate-6 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                  <path d="M7 2v20"></path>
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path>
                </svg>
              </div>
              
              <div className="text-center">
                <span className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-medium inline-block mb-4">
                  Get Started Today
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to enjoy daily fresh meals?</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                  Join thousands of satisfied customers who enjoy delicious homemade meals delivered daily to their doorstep. No cooking, no shopping, no cleanup.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <div className="flex items-center justify-center bg-gray-50 rounded-full py-3 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>From ₹133/meal</span>
                  </div>
                  
                  <div className="flex items-center justify-center bg-gray-50 rounded-full py-3 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Cancel Anytime</span>
                  </div>
                  
                  <div className="flex items-center justify-center bg-gray-50 rounded-full py-3 px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Free Delivery</span>
                  </div>
                </div>
                
                <Link href="/pricing">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 py-6 text-lg">
                    Start Your Subscription
                  </Button>
                </Link>
                
                <p className="text-gray-500 text-sm mt-4">
                  Questions? Call us at +91-1234567890
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}