import React from 'react';
import { Link } from "wouter";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChefHat,
  Store,
  FileText,
  HelpCircle,
  Award,
  Shield,
  CreditCard
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 relative overflow-hidden" role="contentinfo">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">TiffinWale</h2>
            </div>
            <p className="mb-6 text-gray-300 leading-relaxed">
              India's #1 Tiffin Marketplace connecting you with 100+ verified tiffin centers. Browse by ratings, compare plans, and enjoy delicious home-cooked meals delivered daily.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
                <Award className="h-3 w-3 text-primary" />
                <span>4.6★ Rated</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
                <Shield className="h-3 w-3 text-green-400" />
                <span>100+ Verified Centers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
                <Store className="h-3 w-3 text-primary" />
                <span>200+ Locations</span>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/tiffinwale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/tiffinwale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/tiffinwale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="w-10 h-10 bg-white/10 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/tiffinwale" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn page"
                  className="w-10 h-10 bg-white/10 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* For Customers */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-primary" />
              For Customers
            </h3>
            <nav aria-label="Footer Navigation - Customers">
              <ul className="space-y-3">
                <li>
                  <Link href="/#how-it-works" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Browse Centers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* For Partners */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              For Partners
            </h3>
            <nav aria-label="Footer Navigation - Partners">
              <ul className="space-y-3">
                <li>
                  <Link href="/partner-with-us" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Become a Partner
                  </Link>
                </li>
                <li>
                  <Link href="/corporate-plans" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Corporate Plans
                  </Link>
                </li>
                <li>
                  <Link href="/partner-benefits" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Partner Benefits
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              Support & Legal
            </h3>
            <nav aria-label="Footer Navigation - Support">
              <ul className="space-y-3">
                <li>
                  <Link href="/contact-us" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contact Info */}
            <div className="mt-6">
              <address className="not-italic space-y-2">
                <a href="mailto:tiffinwaleofficial@gmail.com" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm group">
                  <Mail className="h-4 w-4" />
                  <span className="group-hover:underline">tiffinwaleofficial@gmail.com</span>
                </a>
                <a href="tel:+911234567890" className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors text-sm group">
                  <Phone className="h-4 w-4" />
                  <span className="group-hover:underline">+91 12345 67890</span>
                </a>
              </address>
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700/50 my-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">
              &copy; {new Date().getFullYear()} TiffinWale. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Made with ❤️ in India | Connecting you with the best home-cooked meals
            </p>
          </div>
          
          {/* Payment Methods */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-xs mb-2 flex items-center justify-center md:justify-end gap-2">
              <CreditCard className="h-3 w-3 text-primary" />
              Secure Payments via RazorPay
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-xs text-gray-300">UPI</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-xs text-gray-300">Cards</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-xs text-gray-300">Wallets</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <span className="text-xs text-gray-300">Net Banking</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Download Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border border-primary/30 text-center">
          <p className="text-white font-semibold mb-2">📱 Download our app for the best experience!</p>
          <p className="text-gray-300 text-sm">Available on iOS & Android | Browse 100+ tiffin centers on the go</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
