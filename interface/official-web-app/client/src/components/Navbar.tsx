import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkipToContent } from "@/components/ui/a11y-index";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for the mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <SkipToContent />
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`} role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <a href="https://www.tiffin-wale.com" className="flex items-center group" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <img src="/icon.png" alt="TiffinWale Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-primary font-bold text-2xl group-hover:text-accent transition-colors duration-300">Tiffin Wale</span>
            </div>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            <Link href="/how-it-works" className="nav-link font-medium text-foreground hover:text-primary transition-all duration-300 relative group">
              How It Works
            </Link>
            <Link href="/pricing" className="nav-link font-medium text-foreground hover:text-primary transition-all duration-300 relative group">
              Pricing
            </Link>
            <Link href="/testimonials" className="nav-link font-medium text-foreground hover:text-primary transition-all duration-300 relative group">
              Testimonials
            </Link>
            <Link href="/faq" className="nav-link font-medium text-foreground hover:text-primary transition-all duration-300 relative group">
              FAQ
            </Link>
            <Link href="/about" className="nav-link font-medium text-foreground hover:text-primary transition-all duration-300 relative group">
              About
            </Link>
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/contact-us" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </Link>
            <Link href="#download" className="hidden sm:block">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Order Now
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-foreground hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-all duration-300"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div 
              id="mobile-menu"
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out"
              role="navigation" 
              aria-label="Mobile Navigation"
              onKeyDown={handleKeyDown}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center">
                    <img src="/icon.png" alt="TiffinWale Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-primary font-bold text-lg">TiffinWale</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex flex-col h-full">
                <div className="flex-1 px-6 py-4 space-y-2">
                  <Link 
                    href="/how-it-works" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="/testimonials" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link 
                    href="/faq" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact-us" 
                    className="flex items-center gap-3 font-medium text-foreground hover:text-primary hover:bg-primary/10 py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Link>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                  <Link 
                    href="#download" 
                    className="block w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Order Now
                  </Link>
                  
                  {/* Contact Info */}
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>hello@tiffinwale.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
