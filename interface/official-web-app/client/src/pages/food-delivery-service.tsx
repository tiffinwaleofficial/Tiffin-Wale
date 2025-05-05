import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';

export default function FoodDeliveryServicePage() {
  return (
    <>
      <Helmet>
        <title>Premium Food Delivery Service in India | TiffinWale</title>
        <meta name="description" content="TiffinWale offers the best food delivery service with fresh homemade meals delivered daily. Enjoy restaurant-quality food at affordable subscription prices." />
        <meta name="keywords" content="food delivery service, food delivery, online food delivery, best food delivery, homemade food delivery, tiffin food delivery, indian food delivery service" />
        <link rel="canonical" href="https://tiffinwale.in/food-delivery-service" />

        {/* Schema Markup for Food Delivery Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FoodDeliveryService',
            name: 'TiffinWale Food Delivery Service',
            description: 'Premium food delivery service with fresh, home-cooked meals delivered to your doorstep daily',
            url: 'https://tiffinwale.in/food-delivery-service',
            logo: 'https://tiffinwale.in/logo.png',
            image: 'https://tiffinwale.in/food-delivery-image.jpg',
            telephone: '+91-1234567890',
            priceRange: '₹₹',
            servesCuisine: [
              'Indian',
              'Home-cooked',
              'Vegetarian',
              'Non-vegetarian'
            ],
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Main Street',
              addressLocality: 'Bangalore',
              addressRegion: 'Karnataka',
              postalCode: '560001',
              addressCountry: 'IN'
            },
            areaServed: {
              '@type': 'City',
              name: 'Bangalore'
            },
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
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1024',
              bestRating: '5',
              worstRating: '1'
            },
            review: [
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Rahul Sharma'
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                  worstRating: '1'
                },
                datePublished: '2023-06-15',
                reviewBody: 'The food from TiffinWale reminds me of my mom\'s cooking. It\'s fresh, delicious, and delivered right on time every day.'
              }
            ]
          })}
        </script>
      </Helmet>

      <Navbar />
      
      <main>
        <section className="bg-gradient-to-br from-primary/10 via-white to-primary/5 py-20 md:py-28 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Premium Food Delivery
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Premium <span className="text-primary">Food Delivery Service</span> For Your Daily Meals
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  TiffinWale delivers fresh, homemade meals right to your doorstep. Experience restaurant-quality food without the hassle of cooking or high costs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg shadow-md">
                      Order Food Now
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg group relative overflow-hidden">
                      <span className="relative z-10">See How It Works</span>
                      <span className="absolute inset-0 bg-primary/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center text-primary font-bold mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Safe, Contactless Delivery
                  </div>
                  <p className="text-gray-600">Your food is prepared and delivered following the highest hygiene standards with temperature-controlled packaging.</p>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <div className="relative z-10 p-3 bg-white rounded-2xl shadow-xl border-8 border-white/90">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1596797038530-2c107dc48fa6?q=80&w=1374&auto=format&fit=crop" 
                        alt="Delicious home-cooked meal" 
                        className="w-full h-[300px] object-cover"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-3">
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1414&auto=format&fit=crop" 
                          alt="Food delivery package" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1545093352-79f499be0fcc?q=80&w=1470&auto=format&fit=crop" 
                          alt="Indian cuisine" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-6 -right-6 bg-white p-4 rounded-xl shadow-lg transform rotate-3 z-20">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-800 font-bold">4.9/5 Rating</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-6 bg-white p-4 rounded-xl shadow-lg transform -rotate-3 z-20">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-800 font-bold">30 min delivery</span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Our Food Delivery Different</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlike typical food delivery apps, TiffinWale offers homemade meals that are not only delicious but also nutritious and affordable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Customizable Meal Plans</h3>
                <p className="text-gray-600 text-center">
                  Choose from a variety of meal plans tailored to your preferences and dietary requirements. We accommodate various dietary needs including vegetarian, vegan, and gluten-free options.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Personalized meal selection</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Dietary preference options</span>
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
                <h3 className="text-xl font-bold text-center mb-4">Consistent Daily Delivery</h3>
                <p className="text-gray-600 text-center">
                  Enjoy your meals delivered at your preferred time, every day, without fail. Our punctual delivery system ensures you never have to worry about your next meal.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>On-time delivery guarantee</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Flexible delivery windows</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl"></div>
                <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-6 mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Cost-Effective Subscription</h3>
                <p className="text-gray-600 text-center">
                  Save money with our subscription plans compared to ordering from restaurants daily. Our meal plans offer exceptional value without compromising on quality.
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Up to 40% cheaper than restaurants</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>No delivery fees on subscriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-20 bg-gray-50 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div className="text-center mb-16">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our Food Delivery Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We've made ordering and receiving your meals simple and hassle-free.
              </p>
            </div>
            
            <div className="relative">
              {/* Progress line */}
              <div className="hidden md:block absolute top-[4.5rem] left-0 right-0 h-2 bg-gray-100 rounded-full z-0">
                <div className="h-full w-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full transform origin-left scale-x-75"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 max-w-6xl mx-auto relative z-10">
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Choose Your Plan</h3>
                      <p className="text-gray-600 text-center">
                        Select the meal subscription that fits your needs and budget.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Place Your Order</h3>
                      <p className="text-gray-600 text-center">
                        Easily place your order through our website or mobile app.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">We Prepare Meals</h3>
                      <p className="text-gray-600 text-center">
                        Our chefs prepare fresh, homemade meals just for you.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">4</div>
                    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-md w-full group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-3 text-center">Daily Delivery</h3>
                      <p className="text-gray-600 text-center">
                        Receive your meals at your doorstep at your preferred time.
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
        
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose TiffinWale for Food Delivery?</h2>
                <p className="text-gray-600 mb-6">
                  Unlike restaurant food delivery services, TiffinWale offers:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-bold block">Healthier Alternatives</span>
                      <p className="text-gray-600">Home-cooked meals with balanced nutrition, not fast food.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-bold block">Consistent Quality</span>
                      <p className="text-gray-600">Same high quality every day, unlike varying restaurant experiences.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-bold block">Cost-Effective</span>
                      <p className="text-gray-600">Save up to 40% compared to ordering restaurant food daily.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-bold block">No Delivery Charges</span>
                      <p className="text-gray-600">Free delivery included in all our subscription plans.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link href="/pricing">
                    <Button className="bg-primary hover:bg-primary/90">
                      View Our Meal Plans
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Home chef preparing meal" 
                  className="relative z-10 rounded-xl shadow-xl w-full object-cover h-[500px]"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-primary/5 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden">
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
                    Get Started Today
                  </span>
                  <h2 className="text-3xl font-bold mb-4">Ready to try our food delivery service?</h2>
                  <p className="text-gray-600 mb-8">
                    Join thousands of satisfied customers who enjoy delicious homemade meals delivered daily to their doorstep.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Free delivery</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Easy cancelation</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link href="/pricing">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
                        View Pricing
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" size="lg" className="group relative overflow-hidden">
                        <span className="relative z-10">Common Questions</span>
                        <span className="absolute inset-0 bg-primary/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="md:w-auto relative">
                  <div className="relative bg-white p-2 rounded-xl shadow-lg border-4 border-white transform rotate-2 z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" 
                      alt="Delicious plated meal" 
                      className="rounded-lg w-full md:w-64 h-56 object-cover"
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 p-3 bg-white rounded-full shadow-md z-20">
                    <div className="bg-primary/10 rounded-full p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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