import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function PrivacyPolicyPage() {
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
            <span className="text-primary font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-bold text-3xl md:text-4xl mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: May 1, 2025</p>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At TiffinWale, we take your privacy seriously. This Privacy Policy describes how we collect, use, and share your personal information when you use our website, mobile application, and services.
              </p>
              
              <h2>1. Information We Collect</h2>
              <p>
                We collect the following types of information:
              </p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> This includes your name, email address, phone number, delivery address, payment information, and any other information you provide when creating an account, placing an order, or contacting our customer service.
                </li>
                <li>
                  <strong>Usage Information:</strong> We automatically collect information about how you interact with our platform, including your browsing history, the pages you view, the time and duration of your visits, and the links you click.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information about the devices you use to access our services, including device type, operating system, browser type, IP address, and mobile device identifiers.
                </li>
                <li>
                  <strong>Location Information:</strong> With your consent, we may collect precise location information from your device to provide location-based services, such as delivery tracking and finding nearby food options.
                </li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>
                We use your information for the following purposes:
              </p>
              <ul>
                <li>To provide and improve our services</li>
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your account and orders</li>
                <li>To personalize your experience and provide customized content</li>
                <li>To develop new products and services</li>
                <li>To conduct research and analysis</li>
                <li>To protect the security and integrity of our platform</li>
                <li>To comply with legal obligations</li>
              </ul>
              
              <h2>3. How We Share Your Information</h2>
              <p>
                We may share your information with the following third parties:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party service providers who help us operate our platform, process payments, deliver orders, and provide customer support.
                </li>
                <li>
                  <strong>Business Partners:</strong> We may share your information with our business partners for marketing, advertising, and other business purposes.
                </li>
                <li>
                  <strong>Legal Authorities:</strong> We may share your information if required by law, legal process, or government request.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of the transaction.
                </li>
              </ul>
              
              <h2>4. Your Choices and Rights</h2>
              <p>
                You have the following rights regarding your personal information:
              </p>
              <ul>
                <li>Right to access and receive a copy of your personal information</li>
                <li>Right to correct or update your personal information</li>
                <li>Right to request deletion of your personal information</li>
                <li>Right to object to or restrict the processing of your personal information</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent at any time</li>
              </ul>
              
              <p>
                To exercise these rights, please contact us at privacy@tiffinwale.com.
              </p>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
              
              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              
              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our platform before the changes become effective.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at privacy@tiffinwale.com.
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