import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Pricing from '@/components/Pricing';

export default function TiffinServicePage() {
  return (
    <>
      <Helmet>
        <title>Best Homemade Tiffin Service in India | TiffinWale</title>
        <meta name="description" content="TiffinWale offers authentic homemade tiffin service with daily delivery. Choose from variety of meal plans for breakfast, lunch, and dinner. Order your tiffin now!" />
        <meta name="keywords" content="tiffin service, tiffin near me, homemade tiffin, daily tiffin service, indian tiffin, lunch box service, tiffin subscription, best tiffin service" />
        <link rel="canonical" href="https://tiffinwale.in/tiffin-service" />

        {/* Additional Schema for Tiffin Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FoodService',
            name: 'TiffinWale - Premium Tiffin Service',
            description: 'Homemade tiffin service with daily delivery of fresh, authentic Indian meals',
            url: 'https://tiffinwale.in/tiffin-service',
            logo: 'https://tiffinwale.in/logo.png',
            image: 'https://tiffinwale.in/tiffin-service-image.jpg',
            telephone: '+91-1234567890',
            priceRange: '₹₹',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Main Street',
              addressLocality: 'Bangalore',
              addressRegion: 'Karnataka',
              postalCode: '560001',
              addressCountry: 'IN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 12.9716,
              longitude: 77.5946
            },
            servesCuisine: [
              'Indian',
              'Home-cooked',
              'North Indian',
              'South Indian'
            ],
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '08:00',
                closes: '20:00'
              }
            ],
            menu: 'https://tiffinwale.in/menu',
            hasMenu: {
              '@type': 'Menu',
              hasMenuSection: [
                {
                  '@type': 'MenuSection',
                  name: 'Veg Tiffin',
                  hasMenuItem: [
                    {
                      '@type': 'MenuItem',
                      name: 'Standard Veg Tiffin',
                      description: 'Daily balanced vegetarian meal with roti, rice, dal, sabzi and salad'
                    }
                  ]
                },
                {
                  '@type': 'MenuSection',
                  name: 'Non-Veg Tiffin',
                  hasMenuItem: [
                    {
                      '@type': 'MenuItem',
                      name: 'Standard Non-Veg Tiffin',
                      description: 'Daily balanced non-vegetarian meal with chicken/mutton dish, roti, rice and salad'
                    }
                  ]
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <Navbar />
      
      <main>
        <section className="bg-gradient-to-br from-primary/20 via-white to-primary/10 py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Homemade Tiffin
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  India's Finest Home-Style <span className="text-primary">Tiffin Service</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  Delicious, home-cooked meals delivered to your doorstep every day. Experience the authentic taste of home without the hassle of cooking.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg shadow-md">
                      Order Tiffin Now
                    </Button>
                  </Link>
                  <Link href="#plans">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg group relative overflow-hidden">
                      <span className="relative z-10">View Tiffin Plans</span>
                      <span className="absolute inset-0 bg-primary/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1587&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1587&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1470&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">Trusted by over 5,000+ customers</p>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <div className="relative z-10 p-3 bg-white rounded-2xl shadow-xl border-8 border-white">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1606491048802-8342506d6471?q=80&w=1374&auto=format&fit=crop" 
                        alt="Tiffin box with delicious food" 
                        className="h-[300px] w-full object-cover transform transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-3">
                      <div className="overflow-hidden rounded-lg shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1630&auto=format&fit=crop" 
                          alt="Chef preparing food" 
                          className="h-full w-full object-cover transform transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?q=80&w=1374&auto=format&fit=crop" 
                          alt="Indian cuisine" 
                          className="h-full w-full object-cover transform transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-6 -right-6 bg-white p-4 rounded-xl shadow-lg transform rotate-3 z-20">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-800 font-bold">Daily Delivery</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-6 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 z-20">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-800 font-bold">Homemade Food</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-white px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Our Advantages
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Tiffin Service?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're committed to delivering the highest quality homemade meals directly to your doorstep.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Authentic Home-Style Food</h3>
                <p className="text-gray-600 text-center">
                  Our meals are prepared by experienced home chefs using authentic recipes and fresh ingredients. Every dish captures the essence of traditional cooking.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Locally sourced ingredients</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Traditional cooking methods</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Daily On-Time Delivery</h3>
                <p className="text-gray-600 text-center">
                  Our dedicated delivery team ensures your tiffin arrives fresh and on time, every day. We understand the importance of punctuality in your busy schedule.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Customize delivery timing</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Insulated packaging</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Balanced & Nutritious</h3>
                <p className="text-gray-600 text-center">
                  Each tiffin is carefully balanced with the right nutrients to keep you healthy and energized. Our nutrition experts ensure each meal is wholesome and satisfying.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Balanced macronutrients</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Dietary options available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-primary/5 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our Tiffin Service Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ordering your daily tiffin is simple and convenient with our easy 3-step process.
              </p>
            </div>
            
            <div className="relative">
              {/* Progress line */}
              <div className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-2 bg-gray-100 rounded-full z-0">
                <div className="h-full w-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full transform origin-left scale-x-75"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-6xl mx-auto relative z-10">
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Choose Your Plan</h3>
                      <p className="text-gray-600 text-center">
                        Select from our variety of meal plans based on your preferences and dietary needs.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Schedule Delivery</h3>
                      <p className="text-gray-600 text-center">
                        Let us know your preferred delivery time and location for seamless service.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Enjoy Your Meals</h3>
                      <p className="text-gray-600 text-center">
                        Receive freshly prepared tiffin daily and enjoy homemade goodness without any hassle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-16">
              <Link href="/how-it-works">
                <Button variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm group relative overflow-hidden">
                  <span className="relative z-10">Learn More About Our Process</span>
                  <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <div id="plans">
          <Pricing />
        </div>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what customers love about our tiffin service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The food from TiffinWale reminds me of my mom's cooking. It's fresh, delicious, and delivered right on time every day. Couldn't be happier with the service!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop" 
                    alt="Customer" 
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">Rahul Sharma</h4>
                    <p className="text-sm text-gray-500">Software Engineer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "As a busy professional, I don't have time to cook daily. TiffinWale has been a lifesaver! Healthy, tasty meals that save me so much time and energy."
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop" 
                    alt="Customer" 
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">Priya Patel</h4>
                    <p className="text-sm text-gray-500">Marketing Manager</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "I've tried several tiffin services, but TiffinWale stands out for its variety and consistency. Each day brings a new menu but the same great quality!"
                </p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=2080&auto=format&fit=crop" 
                    alt="Customer" 
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">Vijay Mehta</h4>
                    <p className="text-sm text-gray-500">College Student</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link href="/testimonials">
                <Button variant="outline" className="bg-white">
                  Read More Testimonials
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to try our tiffin service?</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who enjoy delicious homemade meals delivered daily to their doorstep.
                </p>
                <Link href="/pricing">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 py-6 text-lg">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}