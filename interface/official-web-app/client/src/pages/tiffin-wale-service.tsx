import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';

export default function TiffinWaleServicePage() {
  return (
    <>
      <Helmet>
        <title>Tiffin Wale - #1 Home Food Delivery Service in Bangalore | Daily Meals</title>
        <meta name="description" content="Tiffin Wale delivers authentic homemade meals in Bangalore with our premium tiffin service. Enjoy fresh, nutritious Indian food delivered to your doorstep daily. Best meal subscription plans at affordable prices." />
        <meta name="keywords" content="tiffin wale, tiffin wale bangalore, tiffin-wale, tiffinwale, home food service, daily food delivery, tiffin service near me, best tiffin service, healthy meal delivery, indian food subscription" />
        <link rel="canonical" href="https://www.tiffin-wale.com/tiffin-wale-service" />
        
        <meta property="og:title" content="Tiffin Wale - #1 Home Food Delivery Service in Bangalore" />
        <meta property="og:description" content="Order from Tiffin Wale - Bangalore's best homemade tiffin service. Fresh, delicious meals delivered daily to your doorstep." />
        <meta property="og:image" content="/assets/images/tiffin-wale-share.jpg" />
        <meta property="og:url" content="https://www.tiffin-wale.com/tiffin-wale-service" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tiffin Wale - #1 Home Food Delivery Service in Bangalore" />
        <meta name="twitter:description" content="Order from Tiffin Wale - Bangalore's best homemade tiffin service. Fresh, delicious meals delivered daily to your doorstep." />
        <meta name="twitter:image" content="/assets/images/tiffin-wale-share.jpg" />

        {/* Specialized Schema for Tiffin Wale */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FoodService',
            'name': 'Tiffin Wale - Premium Meal Delivery',
            'alternateName': 'TiffinWale',
            'description': 'Tiffin Wale delivers homemade meals with daily delivery of fresh, authentic Indian food',
            'url': 'https://www.tiffin-wale.com/tiffin-wale-service',
            'logo': 'https://www.tiffin-wale.com/logo.png',
            'image': 'https://www.tiffin-wale.com/assets/images/tiffin-wale-image.jpg',
            'telephone': '+91-1234567890',
            'email': 'tiffinwaleofficial@gmail.com',
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
            'areaServed': [
              "Bangalore", 
              "Whitefield", 
              "Electronic City", 
              "Koramangala", 
              "Indiranagar", 
              "HSR Layout", 
              "Marathahalli"
            ],
            'servesCuisine': [
              'Indian',
              'Home-cooked',
              'North Indian',
              'South Indian',
              'Vegetarian',
              'Healthy'
            ],
            'potentialAction': {
              '@type': 'OrderAction',
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://www.tiffin-wale.com/pricing',
                'inLanguage': 'en-US',
                'actionPlatform': [
                  'http://schema.org/DesktopWebPlatform',
                  'http://schema.org/MobileWebPlatform'
                ]
              },
              'deliveryMethod': [
                'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet'
              ]
            },
            'mainEntityOfPage': 'https://www.tiffin-wale.com',
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.9',
              'reviewCount': '425',
              'bestRating': '5',
              'worstRating': '1'
            },
            'review': [
              {
                '@type': 'Review',
                'author': {
                  '@type': 'Person',
                  'name': 'Amit Kumar'
                },
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5'
                },
                'datePublished': '2024-04-12',
                'reviewBody': 'Tiffin Wale provides the best homemade food in Bangalore. I\'ve been their customer for over a year and never had any complaints. Highly recommended!'
              },
              {
                '@type': 'Review',
                'author': {
                  '@type': 'Person',
                  'name': 'Deepa Mehta'
                },
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': '5',
                  'bestRating': '5'
                },
                'datePublished': '2024-03-25',
                'reviewBody': 'The quality and taste of Tiffin Wale\'s food reminds me of home. Their monthly subscription is worth every penny!'
              }
            ]
          })}
        </script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is Tiffin Wale?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Tiffin Wale is Bangalore\'s premier home food delivery service that provides daily, fresh, homemade meals through subscription plans. We deliver authentic Indian cuisine made with quality ingredients right to your doorstep.'
                }
              },
              {
                '@type': 'Question',
                'name': 'How does Tiffin Wale delivery work?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'When you subscribe to Tiffin Wale, you choose your preferred meal plan (Basic, Standard, or Premium) and delivery schedule. Our team prepares fresh meals daily and delivers them to your location at your chosen time. You can track your delivery through our mobile app.'
                }
              },
              {
                '@type': 'Question',
                'name': 'What makes Tiffin Wale different from other tiffin services?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Tiffin Wale stands out for our commitment to quality, taste, and consistency. We use fresh, locally-sourced ingredients, maintain strict hygiene standards, offer flexible subscription options, provide timely delivery, and have a diverse menu rotation that prevents meal fatigue.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Why choose Tiffin Wale for daily meals?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Tiffin Wale provides nutritious, home-style meals that save you time and effort of daily cooking. Our affordable subscription plans offer great value, and our diverse menu ensures you enjoy a variety of delicious meals. We are trusted by thousands of satisfied customers across Bangalore.'
                }
              }
            ]
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://www.tiffin-wale.com'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Tiffin Wale Service',
                'item': 'https://www.tiffin-wale.com/tiffin-wale-service'
              }
            ]
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
                  India's #1 Tiffin Service
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Welcome to <span className="text-primary">Tiffin Wale</span> - Home Food Delivered
                </h1>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8">
                  Experience the authentic taste of home with Tiffin Wale's premium meal delivery service. Fresh, delicious, and nutritious meals delivered to your doorstep daily.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pricing">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg shadow-md">
                      Subscribe Now
                    </Button>
                  </Link>
                  <Link href="#why-tiffin-wale">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg group relative overflow-hidden">
                      <span className="relative z-10">Why Tiffin Wale?</span>
                      <span className="absolute inset-0 bg-primary/5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-6">
                  <div className="flex items-center">
                    <span className="text-primary text-4xl font-bold">4.9</span>
                    <div className="ml-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">425+ reviews</p>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium">Trusted by</p>
                    <p className="text-gray-700 font-bold">5000+ Happy Customers</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-blue-100 rounded-full blur-3xl -z-10"></div>
                <img 
                  src="/assets/images/tiffin-wale-hero.jpg" 
                  alt="Tiffin Wale Home Food Delivery" 
                  className="w-full h-auto rounded-3xl shadow-xl object-cover z-10"
                />
                <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg z-20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Daily Delivery</p>
                      <p className="font-semibold">On-Time Guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="why-tiffin-wale" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="text-primary">Tiffin Wale?</span></h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the best home food delivery service in Bangalore with these exclusive benefits
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🍲",
                  title: "Home-Style Cooking",
                  description: "Authentic recipes prepared just like home cooking with proper balance of spices and nutrients"
                },
                {
                  icon: "🌱",
                  title: "Fresh Ingredients",
                  description: "We use only fresh, locally sourced ingredients for maximum flavor and nutrition"
                },
                {
                  icon: "🕒",
                  title: "Timely Delivery",
                  description: "On-time delivery guaranteed to ensure your meals arrive fresh and hot"
                },
                {
                  icon: "📆",
                  title: "Flexible Plans",
                  description: "Choose from a variety of subscription plans to fit your schedule and budget"
                },
                {
                  icon: "🥗",
                  title: "Balanced Nutrition",
                  description: "Each meal is nutritionally balanced with the right mix of proteins, carbs, and vegetables"
                },
                {
                  icon: "💯",
                  title: "Quality Assurance",
                  description: "Strict quality control at every step from ingredient selection to delivery"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Tiffin Wale Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Getting delicious home-style food delivered is just 3 simple steps away
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Plan",
                  description: "Select from our Basic, Standard, or Premium subscription plans based on your preferences and needs"
                },
                {
                  step: "02",
                  title: "Customize Your Meals",
                  description: "Specify your dietary preferences, delivery time, and any special instructions"
                },
                {
                  step: "03",
                  title: "Enjoy Daily Delivery",
                  description: "Receive fresh, hot meals at your doorstep at your preferred time, every day"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-xl shadow-md h-full">
                    <div className="bg-primary/10 text-primary font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center mb-6">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      
        {/* Our Most Popular Plans */}
        <section id="plans" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Tiffin Plans</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Choose the perfect plan for your lifestyle and preferences
              </p>
            </div>
            
            <Pricing />
          </div>
        </section>
        
        {/* Testimonials section */}
        <Testimonials />
        
        {/* FAQ section */}
        <section id="faq" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about Tiffin Wale services
              </p>
            </div>
            
            <FAQ />
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 px-6 sm:px-10 md:px-16 lg:px-20 bg-primary/10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Enjoy Home-Style Food?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who enjoy Tiffin Wale's delicious meals daily
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 py-7 text-xl shadow-lg">
                Start Your Subscription Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
} 