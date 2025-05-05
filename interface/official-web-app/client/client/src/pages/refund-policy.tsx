import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function RefundPolicyPage() {
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
            <span className="text-primary font-medium">Refund Policy</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-bold text-3xl md:text-4xl mb-6">Refund & Cancellation Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: May 1, 2025</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At TiffinWale, we strive to provide the best possible meal subscription experience. We understand that circumstances may arise that require changes to your plans. This Refund & Cancellation Policy outlines the terms and conditions for refunds, cancellations, and modifications to your subscription.
              </p>
              
              <h2>1. Subscription Cancellation</h2>
              <p>
                You may cancel your subscription at any time through your account settings on our website or mobile app, or by contacting our customer service at support@tiffinwale.com. The following conditions apply:
              </p>
              <ul>
                <li>
                  <strong>Monthly Subscriptions:</strong> If you cancel a monthly subscription, you will continue to receive meals until the end of your current billing cycle, after which no further charges will be made. No refunds will be provided for the remainder of the current billing cycle.
                </li>
                <li>
                  <strong>Quarterly or Annual Subscriptions:</strong> If you cancel a quarterly or annual subscription, you will continue to receive meals until the end of your current billing cycle. A prorated refund may be issued for the unused portion of your subscription, minus any discounts received for the longer commitment period.
                </li>
              </ul>
              
              <h2>2. Meal Skipping</h2>
              <p>
                Individual meals can be skipped through your account settings without cancelling your entire subscription. The following conditions apply:
              </p>
              <ul>
                <li>
                  <strong>Notification Period:</strong> Meal skipping must be completed at least 24 hours before the scheduled delivery time. Any changes made after this cutoff time cannot be accommodated.
                </li>
                <li>
                  <strong>Credits:</strong> Successfully skipped meals will result in a credit to your account, which can be applied to future orders or additional meals.
                </li>
                <li>
                  <strong>Expiry:</strong> Meal credits expire 60 days from the date they are issued.
                </li>
              </ul>
              
              <h2>3. Refund Eligibility</h2>
              <p>
                We offer refunds or credits in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>Quality Issues:</strong> If you receive a meal that does not meet our quality standards, you may be eligible for a refund or credit. Please contact customer service within 2 hours of delivery and provide details of the issue, including photos if possible.
                </li>
                <li>
                  <strong>Delivery Issues:</strong> If your meal is not delivered, is delivered to the wrong address despite correct information provided, or is delivered significantly later than the promised time window, you may be eligible for a refund or credit.
                </li>
                <li>
                  <strong>Incorrect Orders:</strong> If you receive the wrong meal or if items are missing from your order, you may be eligible for a refund or credit for the affected items.
                </li>
              </ul>
              
              <h2>4. Refund Process</h2>
              <p>
                To request a refund, please contact our customer service at support@tiffinwale.com or through the "Help" section in our mobile app. Please include the following information:
              </p>
              <ul>
                <li>Your name and contact information</li>
                <li>Order number or date of delivery</li>
                <li>Description of the issue</li>
                <li>Photos (if applicable)</li>
              </ul>
              <p>
                We will review your request and respond within 48 hours. If your refund is approved, it will be processed within 5-7 business days to the original payment method used for the purchase.
              </p>
              
              <h2>5. Non-Refundable Items</h2>
              <p>
                The following are not eligible for refunds:
              </p>
              <ul>
                <li>Consumed meals or meals reported after the 2-hour window following delivery</li>
                <li>Delivery fees</li>
                <li>Promotional or discounted items</li>
                <li>Special dietary preferences that were correctly fulfilled as requested</li>
              </ul>
              
              <h2>6. Changes to Subscription Plans</h2>
              <p>
                You may upgrade or downgrade your subscription plan at any time. Changes will take effect at the start of your next billing cycle. If you upgrade mid-cycle, the price difference will be prorated and charged immediately. If you downgrade mid-cycle, a credit will be applied to your account for future use.
              </p>
              
              <h2>7. Force Majeure</h2>
              <p>
                TiffinWale is not liable for delays or failures in delivery due to circumstances beyond our reasonable control, including but not limited to natural disasters, extreme weather conditions, civil unrest, or government actions. In such cases, we will work to find a reasonable solution on a case-by-case basis.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about our Refund & Cancellation Policy, please contact us at support@tiffinwale.com.
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