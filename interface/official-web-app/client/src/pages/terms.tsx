import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Shield, FileText, AlertCircle, CheckCircle, Scale, Users, Clock } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function TermsPage() {
  const sections = [
    { id: "acceptance", title: "Acceptance of Terms", icon: CheckCircle },
    { id: "definitions", title: "Definitions", icon: FileText },
    { id: "accounts", title: "User Accounts", icon: Users },
    { id: "marketplace", title: "Marketplace Model", icon: Scale },
    { id: "subscriptions", title: "Subscriptions & Payments", icon: Clock },
    { id: "delivery", title: "Delivery Terms", icon: Shield },
    { id: "liability", title: "Limitation of Liability", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-accent to-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
              <Scale className="h-4 w-4" />
              <span className="text-sm font-semibold">Legal Documentation</span>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-white">Terms of Service</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Please read these terms carefully before using TiffinWale's marketplace platform
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Last updated: October 25, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer transition-colors">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-medium">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <section className="bg-white py-8 border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap mr-2">Quick Navigation:</span>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {section.title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl mb-3 text-foreground">Important Notice</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Welcome to <strong>TiffinWale</strong>, India's premier tiffin marketplace platform. By accessing or using our website, mobile applications (Student App & Partner App), or services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Acceptance of Terms */}
            <div id="acceptance" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">1. Acceptance of Terms</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  By creating an account, browsing tiffin centers, placing orders, or using any feature of the TiffinWale platform, you confirm that:
                </p>
                <ul className="space-y-2">
                  <li>You are at least 18 years old or have parental/guardian consent</li>
                  <li>You have the legal capacity to enter into binding contracts</li>
                  <li>You accept and agree to comply with these Terms and our Privacy Policy</li>
                  <li>All information provided during registration is accurate and current</li>
                </ul>
                <p className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <strong>Note:</strong> Continued use of the platform after any modifications to these Terms constitutes your acceptance of such changes.
                </p>
              </div>
            </div>

            {/* Section 2: Definitions */}
            <div id="definitions" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">2. Definitions</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Platform</h4>
                    <p className="text-sm">TiffinWale's website, Student App, Partner App, and all related services</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Marketplace</h4>
                    <p className="text-sm">The ecosystem connecting customers with multiple verified tiffin service providers</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Tiffin Centers</h4>
                    <p className="text-sm">Independent food service providers listed on our marketplace platform</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Customers/Users</h4>
                    <p className="text-sm">Individuals or organizations subscribing to tiffin services through our platform</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Partners</h4>
                    <p className="text-sm">Tiffin center owners and operators registered on our Partner App</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-primary">Subscription</h4>
                    <p className="text-sm">A recurring meal delivery plan from a specific tiffin center</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: User Accounts */}
            <div id="accounts" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">3. User Accounts</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">3.1 Account Creation</h3>
                  <p>To access our marketplace services, you must create an account by providing:</p>
                  <ul className="space-y-2">
                    <li>Full name and valid email address</li>
                    <li>Phone number for order notifications and delivery coordination</li>
                    <li>Accurate delivery address(es)</li>
                    <li>Payment information for subscription processing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.2 Account Security</h3>
                  <p>You are responsible for:</p>
                  <ul className="space-y-2">
                    <li>Maintaining the confidentiality of your login credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized access or security breach</li>
                    <li>Logging out from shared or public devices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.3 Account Types</h3>
                  <ul className="space-y-2">
                    <li><strong>Individual Accounts:</strong> Personal use for individual customers</li>
                    <li><strong>Corporate Accounts:</strong> Business accounts with multiple user management</li>
                    <li><strong>Partner Accounts:</strong> For tiffin center operators (separate Partner App)</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="font-semibold text-red-800">Account Termination:</p>
                  <p className="text-red-700 text-sm mt-1">
                    We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or abuse the platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Marketplace Model */}
            <div id="marketplace" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Scale className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">4. Marketplace Model</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">4.1 Platform Role</h3>
                  <p>
                    TiffinWale operates as a <strong>marketplace platform</strong> that connects customers with independent tiffin service providers. We do not prepare, package, or directly provide the food services. Instead, we:
                  </p>
                  <ul className="space-y-2">
                    <li>Facilitate discovery and comparison of tiffin centers</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Provide customer support and dispute resolution</li>
                    <li>Verify and audit tiffin center quality standards</li>
                    <li>Track deliveries and manage logistics coordination</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">4.2 Tiffin Center Independence</h3>
                  <p>
                    Each tiffin center is an <strong>independent service provider</strong> responsible for:
                  </p>
                  <ul className="space-y-2">
                    <li>Food preparation, quality, and hygiene standards</li>
                    <li>Menu planning and dietary accommodation</li>
                    <li>Packaging and meal preparation timing</li>
                    <li>Delivery execution (in coordination with our logistics)</li>
                    <li>Compliance with local food safety regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">4.3 Rating & Review System</h3>
                  <p>Our platform features a transparent rating system where:</p>
                  <ul className="space-y-2">
                    <li>Customers can rate and review tiffin centers after each order</li>
                    <li>Ratings are displayed to help other customers make informed decisions</li>
                    <li>Reviews must be honest, non-defamatory, and based on actual experiences</li>
                    <li>We reserve the right to remove fake, abusive, or inappropriate reviews</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-blue-800">Important:</p>
                  <p className="text-blue-700 text-sm mt-1">
                    While we verify and audit tiffin centers, the contractual relationship for food delivery is between you and the individual tiffin center. TiffinWale acts as a facilitator and technology platform provider.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Subscriptions & Payments */}
            <div id="subscriptions" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">5. Subscriptions & Payments</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">5.1 Subscription Plans</h3>
                  <p>Each tiffin center offers various subscription plans, which may include:</p>
                  <ul className="space-y-2">
                    <li><strong>Daily Plans:</strong> Pay-per-meal basis</li>
                    <li><strong>Weekly Plans:</strong> 5-7 day subscriptions</li>
                    <li><strong>Monthly Plans:</strong> 20-30 day subscriptions</li>
                    <li><strong>Custom Corporate Plans:</strong> Tailored for businesses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.2 Pricing & Billing</h3>
                  <ul className="space-y-2">
                    <li>All prices are in Indian Rupees (₹) and inclusive of GST unless stated otherwise</li>
                    <li>Subscription fees are charged at the beginning of each billing cycle</li>
                    <li>Platform service fee (if applicable) will be clearly disclosed at checkout</li>
                    <li>Delivery charges may apply based on location and tiffin center policies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.3 Payment Methods</h3>
                  <p>We accept the following payment methods:</p>
                  <ul className="space-y-2">
                    <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
                    <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Net Banking</li>
                    <li>Digital Wallets (Paytm, PhonePe, Amazon Pay)</li>
                    <li>Corporate Payment Accounts (for business subscriptions)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.4 Auto-Renewal</h3>
                  <p>
                    Subscriptions automatically renew at the end of each billing cycle unless cancelled. You will receive a reminder email 3 days before renewal. You can disable auto-renewal at any time from your account settings.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.5 Failed Payments</h3>
                  <p>If payment fails during renewal:</p>
                  <ul className="space-y-2">
                    <li>We will attempt to process payment 3 times over 7 days</li>
                    <li>You will receive email and SMS notifications for failed attempts</li>
                    <li>Your subscription will be paused after 3 failed attempts</li>
                    <li>Service resumes immediately upon successful payment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Delivery Terms */}
            <div id="delivery" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">6. Delivery Terms</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">6.1 Delivery Schedule</h3>
                  <p>Delivery times vary by tiffin center and are displayed on each center's page. Standard delivery windows:</p>
                  <ul className="space-y-2">
                    <li><strong>Lunch:</strong> 12:00 PM - 1:30 PM</li>
                    <li><strong>Dinner:</strong> 7:00 PM - 8:30 PM</li>
                    <li><strong>Custom Times:</strong> Available for corporate accounts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">6.2 Delivery Tracking</h3>
                  <p>You can track your order in real-time through our Student App:</p>
                  <ul className="space-y-2">
                    <li>Order confirmation and preparation status</li>
                    <li>Live delivery partner location</li>
                    <li>Estimated time of arrival (ETA)</li>
                    <li>Delivery completion notification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">6.3 Delivery Responsibilities</h3>
                  <p>You agree to:</p>
                  <ul className="space-y-2">
                    <li>Provide accurate and complete delivery address</li>
                    <li>Be available to receive delivery during the specified window</li>
                    <li>Provide clear delivery instructions (gate codes, building numbers, etc.)</li>
                    <li>Contact the delivery partner immediately if issues arise</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">6.4 Missed Deliveries</h3>
                  <p>If you're unavailable during delivery:</p>
                  <ul className="space-y-2">
                    <li>Delivery partner will attempt to contact you via phone/app</li>
                    <li>Order may be left at a safe location per your instructions</li>
                    <li>If delivery cannot be completed, you may still be charged</li>
                    <li>Repeated missed deliveries may result in subscription review</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">6.5 Delivery Delays</h3>
                  <p>Delays may occur due to:</p>
                  <ul className="space-y-2">
                    <li>Traffic conditions and road closures</li>
                    <li>Adverse weather conditions</li>
                    <li>High-volume order days (festivals, holidays)</li>
                    <li>Force majeure events</li>
                  </ul>
                  <p className="text-sm mt-2">
                    We will notify you via app/SMS of significant delays. Refunds or credits may be issued for unreasonable delays.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: Limitation of Liability */}
            <div id="liability" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">7. Limitation of Liability</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                  <p className="font-bold text-lg mb-2 text-amber-900">IMPORTANT LEGAL NOTICE</p>
                  <p className="text-amber-800">
                    Please read this section carefully as it limits TiffinWale's liability to you.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.1 Platform Provider Role</h3>
                  <p>
                    As a marketplace platform, TiffinWale's liability is limited to facilitating transactions between customers and tiffin centers. We are not liable for:
                  </p>
                  <ul className="space-y-2">
                    <li>Food quality, taste, or preparation by independent tiffin centers</li>
                    <li>Allergic reactions or food-borne illnesses (unless due to platform negligence)</li>
                    <li>Nutritional content or dietary suitability of meals</li>
                    <li>Actions or omissions of third-party tiffin centers</li>
                    <li>Delivery delays caused by factors beyond our control</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.2 Maximum Liability Cap</h3>
                  <p>
                    To the maximum extent permitted by law, TiffinWale's total liability for any claims arising from your use of the platform shall not exceed the total amount paid by you to us in the 3 months preceding the claim.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.3 Exclusion of Consequential Damages</h3>
                  <p>
                    TiffinWale shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                  </p>
                  <ul className="space-y-2">
                    <li>Loss of profits, revenue, or business opportunities</li>
                    <li>Loss of data or goodwill</li>
                    <li>Cost of substitute services</li>
                    <li>Personal injury or property damage (except in cases of proven negligence)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.4 Quality Assurance</h3>
                  <p>
                    While we implement verification and quality auditing processes for all tiffin centers, we cannot guarantee:
                  </p>
                  <ul className="space-y-2">
                    <li>Continuous quality across all meals</li>
                    <li>100% accuracy of menu descriptions and images</li>
                    <li>Complete absence of errors in food preparation</li>
                  </ul>
                  <p className="text-sm mt-2">
                    We encourage you to report quality issues immediately so we can work with the tiffin center to resolve them.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Sections Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Intellectual Property */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">8. Intellectual Property</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  All content on the TiffinWale platform, including logos, trademarks, text, graphics, and software, is owned by TiffinWale or its licensors and protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without prior written consent.
                </p>
              </div>

              {/* User Conduct */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">9. User Conduct</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">You agree not to:</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Use the platform for illegal purposes</li>
                  <li>• Submit false or fraudulent orders</li>
                  <li>• Harass or abuse tiffin centers or delivery partners</li>
                  <li>• Attempt to hack or disrupt platform operations</li>
                  <li>• Post fake reviews or manipulate ratings</li>
                </ul>
              </div>

              {/* Privacy & Data Protection */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">10. Privacy & Data Protection</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Your use of the platform is also governed by our <Link href="/privacy-policy"><span className="text-primary hover:underline cursor-pointer">Privacy Policy</span></Link>, which explains how we collect, use, and protect your personal information. By using our platform, you consent to data processing as described in our Privacy Policy.
                </p>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">11. Dispute Resolution</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be subject to arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996, in Indore, India.
                </p>
              </div>

              {/* Modifications to Terms */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">12. Modifications to Terms</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We reserve the right to modify these Terms at any time. Material changes will be notified via email and displayed prominently on the platform. Continued use after modifications indicates acceptance of updated Terms.
                </p>
              </div>

              {/* Termination */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">13. Termination</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  TiffinWale may terminate or suspend your account immediately, without notice, for conduct that violates these Terms or is harmful to other users, the platform, or third parties. Upon termination, your right to use the platform will immediately cease.
                </p>
              </div>

              {/* Governing Law */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">14. Governing Law</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. You agree to submit to the exclusive jurisdiction of courts in Indore, Madhya Pradesh, India for resolution of any disputes.
                </p>
              </div>

              {/* Severability */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">15. Severability</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
              <h2 className="font-bold text-3xl mb-4">Questions About Our Terms?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Our legal team is here to help clarify any questions you may have about these Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:legal@tiffinwale.com" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  <FileText className="h-5 w-5" />
                  legal@tiffinwale.com
                </a>
                <Link href="/contact-us">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all cursor-pointer">
                    Contact Support
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}
