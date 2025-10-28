import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
import TiffinWaleServicePage from "@/pages/tiffin-wale-service";
import FoodDeliveryServicePage from "@/pages/food-delivery-service";
import DailyMealServicePage from "@/pages/daily-meal-service";
import ContactUsPage from "@/pages/contact-us";
import RiyaTiwariPage from "@/pages/riya-tiwari";
import RahulVishwakarmaPage from "@/pages/rahul-vishwakarma";
import { logApiConfig, checkBackendHealth } from "./lib/api";

// This component ensures the page scrolls to top on route changes
function ScrollResetter() {
  const [location] = useLocation();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Delay scroll to allow page to render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }

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

// Component to check backend connectivity
function BackendConnectivityChecker() {
  useEffect(() => {
    // Log API configuration and check backend connectivity
    logApiConfig();
    
    // Check backend connectivity every 30 seconds
    const intervalId = setInterval(() => {
      import('./lib/api').then(({ checkApiHealth }) => {
        checkApiHealth().then(health => {
          console.log(`Backend health check: ${health.status}`, health);
        }).catch(err => {
          console.error('Backend connectivity check failed:', err);
        });
      });
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollResetter />
      <BackendConnectivityChecker />
      <main id="main-content" tabIndex={-1}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/how-it-works" component={HowItWorksPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/testimonials" component={TestimonialsPage} />
          <Route path="/submit-testimonial" component={SubmitTestimonialPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/riya-tiwari" component={RiyaTiwariPage} />
          <Route path="/rahul-vishwakarma" component={RahulVishwakarmaPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/refund-policy" component={RefundPolicyPage} />
          <Route path="/corporate-plans" component={CorporatePlansPage} />
          <Route path="/meal-delivery" component={MealDeliveryPage} />
          <Route path="/tiffin-service" component={TiffinServicePage} />
          <Route path="/tiffin-wale-service" component={TiffinWaleServicePage} />
          <Route path="/food-delivery-service" component={FoodDeliveryServicePage} />
          <Route path="/daily-meal-service" component={DailyMealServicePage} />
          <Route path="/contact-us" component={ContactUsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SEOHead />
      <Router />
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
}

export default App;
