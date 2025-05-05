import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HowItWorksPage from "@/pages/how-it-works";
import PricingPage from "@/pages/pricing";
import TestimonialsPage from "@/pages/testimonials";
import FAQPage from "@/pages/faq";
import AboutPage from "@/pages/about";
import TermsPage from "@/pages/terms";
import SubmitTestimonialPage from "@/pages/submit-testimonial";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import RefundPolicyPage from "@/pages/refund-policy";
import CorporatePlansPage from "@/pages/corporate-plans";
import MealDeliveryPage from "@/pages/meal-delivery";
import TiffinServicePage from "@/pages/tiffin-service";
import FoodDeliveryServicePage from "@/pages/food-delivery-service";
import DailyMealServicePage from "@/pages/daily-meal-service";
import ContactUsPage from "@/pages/contact-us";

// This component ensures the page scrolls to top on route changes
function ScrollResetter() {
  const [location] = useLocation();
  
  useEffect(() => {
    // First, try the smooth approach with behavior option
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
    
    // Also ensure document body and element are scrolled (for cross-browser compatibility)
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollResetter />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/testimonials" component={TestimonialsPage} />
        <Route path="/submit-testimonial" component={SubmitTestimonialPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
        <Route path="/refund-policy" component={RefundPolicyPage} />
        <Route path="/corporate-plans" component={CorporatePlansPage} />
        <Route path="/meal-delivery" component={MealDeliveryPage} />
        <Route path="/tiffin-service" component={TiffinServicePage} />
        <Route path="/food-delivery-service" component={FoodDeliveryServicePage} />
        <Route path="/daily-meal-service" component={DailyMealServicePage} />
        <Route path="/contact-us" component={ContactUsPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SEOHead />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
