import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Pricing from '@/components/Pricing';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui';

export default function TiffinServicePage() {
  return (
    <>
      <Helmet>
        <title>TiffinWale Service - Authentic Indian Tiffin Meals | Best Tiffin Service in Bangalore</title>
        <meta name="description" content="TiffinWale offers premium tiffin delivery service with authentic home-cooked meals. Affordable monthly plans, diverse menu options. Order now for daily tiffin delivery." />
        <meta name="keywords" content="tiffin service, tiffin wale, lunch delivery, Indian food delivery, daily meal service, tiffin wale bangalore" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="TiffinWale Service - Authentic Indian Tiffin Meals" />
        <meta property="og:description" content="Premium tiffin delivery with authentic home-cooked meals. Affordable monthly plans, diverse menu options." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tiffin-wale.com/tiffin-service" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.tiffin-wale.com/tiffin-service" />
      </Helmet>

      <Navbar />
      
      <main className="bg-gray-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div 
                className="w-full md:w-1/2 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-primary">TiffinWale</span> Service - <br />
                  Your Daily Nutrition Partner
                </h1>
                <p className="text-lg text-gray-600">
                  Experience authentic home-cooked meals delivered right to your doorstep. 
                  Our service ensures you never compromise on nutrition, taste, or convenience.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Meal Plan
                  </Button>
                  <Link href="/pricing">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      View Pricing
                    </Button>
                  </Link>
                </div>
                <div className="pt-6 flex items-center space-x-6">
                  <div>
                    <div className="text-2xl font-bold text-primary">97%</div>
                    <div className="text-sm text-gray-500">Customer Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">12,000+</div>
                    <div className="text-sm text-gray-500">Monthly Meals</div>
                    </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4.8</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="w-full md:w-1/2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="relative z-10 p-3 bg-white rounded-2xl shadow-xl border-8 border-white">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <OptimizedImage 
                        src="/assets/images/tiffin-curry.jpg" 
                        alt="Delicious curry in a tiffin box" 
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                      <div className="overflow-hidden rounded-lg shadow-md">
                      <OptimizedImage 
                        src="/assets/images/tiffin-roti.jpg" 
                        alt="Fresh rotis for tiffin" 
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                        />
                      </div>
                      <div className="overflow-hidden rounded-lg shadow-md">
                      <OptimizedImage 
                        src="/assets/images/tiffin-rice.jpg" 
                        alt="Aromatic rice dish" 
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                        />
                      </div>
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <OptimizedImage 
                        src="/assets/images/tiffin-dessert.jpg" 
                        alt="Sweet dessert in tiffin" 
                        width={300}
                        height={200}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Floating decoration */}
                <div className="absolute top-1/4 -right-4 md:-right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl z-0"></div>
                <div className="absolute bottom-1/4 -left-4 md:-left-12 w-32 h-32 bg-primary/10 rounded-full blur-xl z-0"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How TiffinWale Service Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our simple 4-step process ensures you get delicious, home-cooked meals without any hassle.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: "🍲",
                  title: "Choose Your Plan",
                  description: "Select from our flexible meal plans based on your preferences and budget."
                },
                {
                  icon: "📝",
                  title: "Customize Menu",
                  description: "Personalize your weekly menu or opt for our chef's special recommendations."
                },
                {
                  icon: "🚚",
                  title: "Daily Delivery",
                  description: "Receive freshly prepared meals at your doorstep at your preferred time."
                },
                {
                  icon: "♻️",
                  title: "Return Tiffin",
                  description: "We collect the empty tiffin boxes when delivering your next meal."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
                </div>
              </div>
        </section>
        
        {/* Menu Preview Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Weekly Menu Preview</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We offer a diverse range of nutritious and delicious meals that rotate weekly. Here's a glimpse of what to expect:</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  day: "Monday",
                  items: ["Paneer Butter Masala", "Jeera Rice", "Mixed Vegetable", "Roti", "Dal"]
                },
                {
                  day: "Tuesday",
                  items: ["Chana Masala", "Pulao", "Aloo Gobi", "Roti", "Raita"]
                },
                {
                  day: "Wednesday",
                  items: ["Dal Makhani", "Steamed Rice", "Bhindi Masala", "Roti", "Salad"]
                },
                {
                  day: "Thursday",
                  items: ["Rajma Curry", "Jeera Rice", "Mixed Veg", "Roti", "Papad"]
                },
                {
                  day: "Friday",
                  items: ["Palak Paneer", "Pulao", "Aloo Matar", "Roti", "Dal Tadka"]
                },
                {
                  day: "Weekend Special",
                  items: ["Chole Bhature", "Biryani", "Raita", "Gulab Jamun", "Salad"]
                }
              ].map((menu, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold mb-3 text-primary">{menu.day}</h3>
                  <ul className="space-y-2">
                    {menu.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-700">{item}</span>
                    </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-gray-600 italic mb-6">* Menu items may vary based on seasonal availability and preferences</p>
              <Button>
                View Full Menu
              </Button>
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple & Transparent Pricing</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your lifestyle and budget. All plans include daily delivery and high-quality meals.</p>
            </motion.div>
            
            <Pricing />
            
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-gray-600 italic mb-6">* Additional customization options available at minimal extra cost</p>
              <Button>
                Get Started Now
              </Button>
            </motion.div>
              </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied customers who trust TiffinWale for their daily meals.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Arun Sharma",
                  position: "Software Engineer",
                  image: "/assets/images/testimonial-1.jpg",
                  quote: "As a busy professional, TiffinWale has been a lifesaver. The meals are delicious and I love the variety. It's like having a personal chef!"
                },
                {
                  name: "Priya Patel",
                  position: "Graduate Student",
                  image: "/assets/images/testimonial-2.jpg",
                  quote: "The affordability and quality of TiffinWale meals got me through my master's program. I never had to worry about cooking after long study sessions."
                },
                {
                  name: "Raj & Meera Kapoor",
                  position: "Working Couple",
                  image: "/assets/images/testimonial-3.jpg",
                  quote: "We've been using TiffinWale for six months now and couldn't be happier. The food is always fresh, nutritious, and reminds us of home-cooked meals."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <OptimizedImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 text-primary">★★★★★</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Get answers to commonly asked questions about our tiffin service.</p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "What areas do you deliver to?",
                  answer: "We currently deliver to most areas in Bangalore including Whitefield, Electronic City, Koramangala, Indiranagar, HSR Layout, and Marathahalli. Enter your pincode on our website to check availability in your area."
                },
                {
                  question: "How does the payment system work?",
                  answer: "We offer monthly subscription plans with payments accepted through UPI, credit/debit cards, and net banking. We also offer a pay-per-meal option for occasional customers."
                },
                {
                  question: "Can I customize my meals?",
                  answer: "Absolutely! You can customize your meals based on your dietary preferences, restrictions, and taste preferences. We offer vegetarian, vegan, gluten-free, and other specialized options."
                },
                {
                  question: "What time is the tiffin delivered?",
                  answer: "We offer flexible delivery time slots: Lunch (11:30 AM - 1:30 PM) and Dinner (6:30 PM - 8:30 PM). You can choose your preferred time slot during subscription."
                },
                {
                  question: "How fresh are the meals?",
                  answer: "All our meals are prepared fresh each day in our hygienic kitchen using quality ingredients. We never serve pre-made or frozen meals."
                },
                {
                  question: "Can I pause my subscription when I'm traveling?",
                  answer: "Yes, you can pause your subscription anytime through your account dashboard or by contacting our customer service team at least 24 hours in advance."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="py-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-gray-600 mb-6">Have more questions? We're happy to help!</p>
              <Button>
                Contact Us
                </Button>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enjoy Homemade Goodness?</h2>
              <p className="text-gray-600 mb-8">Join thousands of satisfied customers who trust TiffinWale for their daily nutrition needs. Get started with a plan that suits your needs today!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Start Your Meal Plan
                </Button>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}