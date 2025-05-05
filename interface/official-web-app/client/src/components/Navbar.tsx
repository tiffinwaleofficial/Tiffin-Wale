import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkipToContent } from "@/components/ui/a11y-index";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle keyboard navigation for the mobile menu
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <SkipToContent />
      <header className="sticky top-0 z-50 bg-white shadow-sm" role="banner">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-primary font-bold text-2xl a11y-text-primary">TiffinWale</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6" aria-label="Main Navigation">
            <Link href="/how-it-works" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">How It Works</span>
            </Link>
            <Link href="/pricing" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">Pricing</span>
            </Link>
            <Link href="/testimonials" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">Testimonials</span>
            </Link>
            <Link href="/faq" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">FAQ</span>
            </Link>
            <Link href="/about" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">About Us</span>
            </Link>
            <Link href="/contact-us" className="nav-link font-medium text-foreground hover:text-primary transition-colors duration-200 a11y-focus-outline">
              <span className="a11y-text-contrast">Contact Us</span>
            </Link>
          </nav>
          
          {/* CTA Button */}
          <div className="flex items-center">
            <Link href="#download">
              <Button className="hidden sm:block a11y-focus-outline">Download App</Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-foreground hover:text-primary ml-4 a11y-focus-outline"
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
          <div 
            id="mobile-menu"
            className="md:hidden bg-white shadow-md"
            role="navigation" 
            aria-label="Mobile Navigation"
            onKeyDown={handleKeyDown}
          >
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <Link 
                href="/how-it-works" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="How It Works"
              >
                <span className="a11y-text-contrast">How It Works</span>
              </Link>
              <Link 
                href="/pricing" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Pricing"
              >
                <span className="a11y-text-contrast">Pricing</span>
              </Link>
              <Link 
                href="/testimonials" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Testimonials"
              >
                <span className="a11y-text-contrast">Testimonials</span>
              </Link>
              <Link 
                href="/faq" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="FAQ"
              >
                <span className="a11y-text-contrast">FAQ</span>
              </Link>
              <Link 
                href="/about" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="About Us"
              >
                <span className="a11y-text-contrast">About Us</span>
              </Link>
              <Link 
                href="/contact-us" 
                className="font-medium text-foreground hover:text-primary py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 a11y-focus-outline"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Contact Us"
              >
                <span className="a11y-text-contrast">Contact Us</span>
              </Link>
              <Link 
                href="#download" 
                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors duration-200 a11y-focus-outline a11y-bg-primary"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Download App"
              >
                Download App
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
