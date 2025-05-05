import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-medium">Terms of Service</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-bold text-3xl md:text-4xl mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: May 1, 2025</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Welcome to TiffinWale. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the TiffinWale platform, you agree to comply with and be bound by these Terms.
              </p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you confirm that you accept these Terms and agree to comply with them. If you do not agree to these Terms, you must not use our services.
              </p>
              
              <h2>2. Changes to Terms</h2>
              <p>
                We may revise these Terms at any time by amending this page. Please check this page from time to time to take notice of any changes we made, as they are binding on you.
              </p>
              
              <h2>3. Account Registration</h2>
              <p>
                To access certain features of our platform, you may be required to register for an account. You must provide accurate, current, and complete information during the registration process and keep your account information up-to-date.
              </p>
              <p>
                You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2>4. Subscription and Payments</h2>
              <p>
                By subscribing to any of our meal plans, you agree to pay the fees indicated for your selected plan. All fees are in Indian Rupees and are inclusive of applicable taxes unless stated otherwise.
              </p>
              <p>
                Subscription fees are charged at the beginning of each billing cycle. You may cancel your subscription at any time, but no refunds will be provided for the current billing period.
              </p>
              
              <h2>5. Delivery Terms</h2>
              <p>
                TiffinWale will deliver meals according to the schedule indicated in your subscription plan. Delivery times are approximate and may vary based on traffic, weather conditions, and other factors beyond our control.
              </p>
              <p>
                You are responsible for ensuring that someone is available to receive the delivery or providing specific delivery instructions. If we're unable to deliver due to your unavailability or incorrect delivery information, you may still be charged for the meal.
              </p>
              
              <h2>6. Food Quality and Safety</h2>
              <p>
                TiffinWale strives to use fresh, high-quality ingredients and to prepare meals in a safe and hygienic environment. However, we cannot guarantee that our meals will meet your individual taste preferences or dietary requirements.
              </p>
              <p>
                If you have specific allergies or dietary restrictions, please inform us through your account settings. While we will make reasonable efforts to accommodate your requests, we cannot guarantee that our meals will be free from specific allergens.
              </p>
              
              <h2>7. Limitation of Liability</h2>
              <p>
                TiffinWale will not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
              
              <h2>8. Termination</h2>
              <p>
                TiffinWale reserves the right to terminate or suspend your account and refuse any and all current or future use of the service, for any reason at any time, including if you violate these Terms.
              </p>
              
              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
              
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@tiffinwale.com.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}