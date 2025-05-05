import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm';
import FeedbackForm from '@/components/FeedbackForm';
import TestimonialForm from '@/components/TestimonialForm';

export default function ContactUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | TiffinWale</title>
        <meta name="description" content="Contact TiffinWale for delicious home-cooked meal subscription services in your area." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ContactForm />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FeedbackForm />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Our Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p>123 Tiffin Street, Foodville, CA 94123</p>
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p>contact@tiffinwale.com</p>
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p>(123) 456-7890</p>
                </div>
                <div>
                  <h3 className="font-bold">Hours</h3>
                  <p>Mon-Fri: 9am - 6pm</p>
                  <p>Sat-Sun: 10am - 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <TestimonialForm />
        </div>
      </div>
    </div>
  );
}