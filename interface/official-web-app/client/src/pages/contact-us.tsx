import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import FeedbackForm from '@/components/FeedbackForm';
import TestimonialForm from '@/components/TestimonialForm';
import MobileAppBanner from '@/components/MobileAppBanner';
import { ChevronRight, Mail, Phone, MapPin, Clock, MessageCircle, Star, Headphones, Globe } from 'lucide-react';
import { Link } from 'wouter';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | TiffinWale - Get in Touch</title>
        <meta name="description" content="Contact TiffinWale for India's best tiffin marketplace. Browse 100+ verified centers, compare ratings, and subscribe to home-cooked meals." />
      </Helmet>

      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-secondary/20 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer transition-colors">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-semibold">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                We're Here to Help
              </span>
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Get in Touch with
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                India's #1 Tiffin Marketplace
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Have questions about our marketplace? Need help finding the perfect tiffin center? Want to partner with us? We're here 24/7!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-12 bg-white relative -mt-10 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <a href="tel:+919876543210" className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Call Us</h3>
              <p className="text-muted-foreground text-sm mb-1">Customer Support</p>
              <p className="text-primary font-semibold">+91 98765 43210</p>
            </a>

            <a href="mailto:hello@tiffinwale.com" className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Email Us</h3>
              <p className="text-muted-foreground text-sm mb-1">General Inquiries</p>
              <p className="text-primary font-semibold">hello@tiffinwale.com</p>
            </a>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-1">24/7 Support</p>
              <p className="text-primary font-semibold">Start Chat →</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Visit Us</h3>
              <p className="text-muted-foreground text-sm mb-1">Head Office</p>
              <p className="text-primary font-semibold">Indore, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-white via-secondary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-2">
            <ContactForm />
          </div>
          
            {/* Right Column - Info & Forms */}
          <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">Head Office</h3>
                    </div>
                    <p className="text-muted-foreground ml-13">
                      TiffinWale HQ, Vijay Nagar,<br />
                      Indore, Madhya Pradesh 452010<br />
                      India
                    </p>
            </div>
            
                <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">Email</h3>
                    </div>
                    <p className="text-muted-foreground ml-13">
                      <strong>General:</strong> hello@tiffinwale.com<br />
                      <strong>Support:</strong> support@tiffinwale.com<br />
                      <strong>Partners:</strong> partners@tiffinwale.com
                    </p>
                </div>
                  
                <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">Phone</h3>
                </div>
                    <p className="text-muted-foreground ml-13">
                      <strong>Customer Care:</strong> +91 98765 43210<br />
                      <strong>Partner Support:</strong> +91 98765 43211<br />
                      <strong>Toll-Free:</strong> 1800-123-4567
                    </p>
                </div>
                  
                <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                </div>
                      <h3 className="font-bold text-foreground">Business Hours</h3>
              </div>
                    <p className="text-muted-foreground ml-13">
                      <strong>Mon-Fri:</strong> 9:00 AM - 8:00 PM<br />
                      <strong>Sat:</strong> 10:00 AM - 6:00 PM<br />
                      <strong>Sun:</strong> 10:00 AM - 4:00 PM<br />
                      <span className="text-primary font-semibold">24/7 Chat Support Available</span>
                    </p>
            </div>
          </div>
        </div>
        
              {/* Feedback Form */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <FeedbackForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Share Your Experience
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Loved TiffinWale? Tell Us About It!
              </h2>
              <p className="text-lg text-muted-foreground">
                Your testimonial helps others discover the joy of home-cooked meals
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <TestimonialForm />
        </div>
      </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Headphones className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Need Quick Answers?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Check out our comprehensive FAQ section for instant answers to common questions about browsing centers, subscriptions, and more.
            </p>
            <Link href="/faq">
              <button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Visit FAQ Section
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <MobileAppBanner />
    </div>
  );
}