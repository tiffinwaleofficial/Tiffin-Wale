import React from 'react';
import { Link } from "wouter";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">TiffinWale</h2>
            <p className="mb-4 text-gray-300">India's premier home-style meal subscription service delivering fresh, nutritious food to your doorstep daily.</p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/tiffinwale" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="a11y-focus-outline"
              >
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="https://instagram.com/tiffinwale" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="a11y-focus-outline"
              >
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="https://twitter.com/tiffinwale" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our Twitter page"
                className="a11y-focus-outline"
              >
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a 
                href="https://linkedin.com/company/tiffinwale" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
                className="a11y-focus-outline"
              >
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <nav aria-label="Footer Navigation - Quick Links">
              <ul className="space-y-2">
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <nav aria-label="Footer Navigation - Legal">
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">123 Main Street, Bangalore, Karnataka 560001</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <a href="tel:+911234567890" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    +91 12345 67890
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <a href="mailto:tiffinwaleofficial@gmail.com" className="text-gray-300 hover:text-white transition-colors a11y-focus-outline">
                    tiffinwaleofficial@gmail.com
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TiffinWale. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <img src="/assets/images/payment-methods.png" alt="Accepted payment methods" className="h-6" width="200" height="24" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
