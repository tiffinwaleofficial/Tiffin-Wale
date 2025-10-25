import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Shield, Database, Lock, Eye, UserCheck, Bell, Cookie, Globe } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "intro", title: "Introduction", icon: Shield },
    { id: "collection", title: "Data Collection", icon: Database },
    { id: "usage", title: "How We Use Data", icon: Eye },
    { id: "sharing", title: "Data Sharing", icon: Globe },
    { id: "rights", title: "Your Rights", icon: UserCheck },
    { id: "security", title: "Data Security", icon: Lock },
    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-accent to-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">Your Privacy Matters</span>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-white">Privacy Policy</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Understand how we collect, use, and protect your personal information
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Bell className="h-5 w-5" />
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
            <span className="text-primary font-medium">Privacy Policy</span>
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
            <div id="intro" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl mb-3 text-foreground">Our Commitment to Privacy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At <strong>TiffinWale</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our marketplace platform, including our website and mobile applications (Student App & Partner App).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By using our services, you consent to the data practices described in this policy. We comply with applicable Indian data protection laws, including the Information Technology Act, 2000 and the Personal Data Protection Bill.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Information We Collect */}
            <div id="collection" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">1. Information We Collect</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3">1.1 Personal Information You Provide</h3>
                  <p>When you create an account or use our services, we collect:</p>
                  <div className="grid md:grid-cols-2 gap-4 my-4">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-sm mb-2 text-purple-800">Account Information</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Full name</li>
                        <li>• Email address</li>
                        <li>• Phone number</li>
                        <li>• Password (encrypted)</li>
                        <li>• Profile photo (optional)</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-sm mb-2 text-purple-800">Delivery Information</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Delivery addresses</li>
                        <li>• Landmark details</li>
                        <li>• Contact preferences</li>
                        <li>• Delivery instructions</li>
                        <li>• Alternate phone numbers</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-sm mb-2 text-purple-800">Payment Information</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Payment method details</li>
                        <li>• Billing address</li>
                        <li>• Transaction history</li>
                        <li>• GST information (for businesses)</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-sm mb-2 text-purple-800">Preferences & Dietary Info</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Food preferences</li>
                        <li>• Dietary restrictions</li>
                        <li>• Allergy information</li>
                        <li>• Meal customization choices</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">1.2 Information Collected Automatically</h3>
                  <p>When you use our platform, we automatically collect:</p>
                  <ul className="space-y-2">
                    <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers, mobile network information</li>
                    <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, search queries, clicks, scrolling behavior</li>
                    <li><strong>Location Data:</strong> IP address, GPS coordinates (with permission), delivery zone information</li>
                    <li><strong>Cookies & Similar Technologies:</strong> See Section 7 for details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">1.3 Information from Third Parties</h3>
                  <p>We may receive information from:</p>
                  <ul className="space-y-2">
                    <li><strong>Payment Processors:</strong> Transaction confirmation and payment status from Razorpay, PhonePe, etc.</li>
                    <li><strong>Tiffin Centers:</strong> Order fulfillment status, delivery updates, food preparation details</li>
                    <li><strong>Social Media:</strong> If you sign up using Google/Facebook, we receive basic profile information</li>
                    <li><strong>Marketing Partners:</strong> Analytics and advertising effectiveness data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">1.4 Ratings & Reviews</h3>
                  <p>When you rate or review tiffin centers, we collect:</p>
                  <ul className="space-y-2">
                    <li>Star ratings (1-5 scale)</li>
                    <li>Written review text</li>
                    <li>Photos of meals (optional)</li>
                    <li>Order context (date, items ordered, tiffin center)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: How We Use Your Information */}
            <div id="usage" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">2. How We Use Your Information</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-lg mb-3 text-blue-900">Primary Purposes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Service Delivery</h4>
                        <p className="text-xs text-gray-700">Process orders, manage subscriptions, coordinate deliveries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Payment Processing</h4>
                        <p className="text-xs text-gray-700">Handle transactions, refunds, and billing inquiries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Communication</h4>
                        <p className="text-xs text-gray-700">Send order updates, delivery notifications, customer support</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Personalization</h4>
                        <p className="text-xs text-gray-700">Recommend tiffin centers, customize menu suggestions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">5</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Platform Improvement</h4>
                        <p className="text-xs text-gray-700">Analyze usage patterns, fix bugs, develop new features</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold text-sm">6</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">Security & Fraud</h4>
                        <p className="text-xs text-gray-700">Detect and prevent fraudulent activity, ensure platform safety</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">2.1 Marketing & Promotions</h3>
                  <p>With your consent, we may use your information to:</p>
                  <ul className="space-y-2">
                    <li>Send promotional offers and discounts</li>
                    <li>Notify you about new tiffin centers in your area</li>
                    <li>Share newsletters and platform updates</li>
                    <li>Conduct surveys and gather feedback</li>
                  </ul>
                  <p className="text-sm mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                    ✓ You can opt-out of marketing communications at any time via account settings or unsubscribe links in emails.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">2.2 Legal Compliance</h3>
                  <p>We may use your information to:</p>
                  <ul className="space-y-2">
                    <li>Comply with legal obligations and regulations</li>
                    <li>Respond to law enforcement requests</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Protect the rights and safety of TiffinWale, users, and the public</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: How We Share Your Information */}
            <div id="sharing" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">3. How We Share Your Information</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="font-semibold text-amber-900 mb-1">Important Notice</p>
                  <p className="text-amber-800 text-sm">
                    TiffinWale does not sell your personal information to third parties. We only share data as necessary to operate our marketplace platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.1 With Tiffin Centers (Partners)</h3>
                  <p>When you place an order, we share with the selected tiffin center:</p>
                  <ul className="space-y-2">
                    <li>Your name and phone number (for order confirmation)</li>
                    <li>Delivery address and instructions</li>
                    <li>Order details and dietary preferences</li>
                    <li>Any special requests or customizations</li>
              </ul>
                  <p className="text-sm mt-2">
                    Tiffin centers are contractually required to use this information only for order fulfillment and are prohibited from using it for other purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.2 With Service Providers</h3>
                  <p>We share data with trusted third-party service providers who assist us with:</p>
                  <ul className="space-y-2">
                    <li><strong>Payment Processing:</strong> Razorpay, PhonePe, Paytm (for transaction processing)</li>
                    <li><strong>Cloud Storage:</strong> AWS, Google Cloud (for data hosting)</li>
                    <li><strong>Communication:</strong> SMS gateways, email services (for notifications)</li>
                    <li><strong>Analytics:</strong> Google Analytics, Firebase (for usage insights)</li>
                    <li><strong>Customer Support:</strong> Helpdesk software providers</li>
                  </ul>
                  <p className="text-sm mt-2">
                    All service providers are bound by confidentiality agreements and can only use your data for the specific services they provide to us.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.3 For Legal Reasons</h3>
                  <p>We may disclose your information if required by law or if we believe it's necessary to:</p>
                  <ul className="space-y-2">
                    <li>Comply with legal processes (court orders, subpoenas)</li>
                    <li>Investigate potential violations of our Terms of Service</li>
                    <li>Detect, prevent, or address fraud and security issues</li>
                    <li>Protect the rights, property, or safety of TiffinWale, users, or the public</li>
              </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.4 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred to the acquiring entity. We will notify you via email and/or prominent notice on our platform before your data is transferred and becomes subject to a different privacy policy.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">3.5 With Your Consent</h3>
                  <p>
                    We may share your information for other purposes with your explicit consent, such as when you authorize us to share data with third-party apps or services that integrate with TiffinWale.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Your Rights & Choices */}
            <div id="rights" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">4. Your Rights & Choices</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-green-900">Right to Access</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Request a copy of all personal information we hold about you. Available through account settings or by contacting privacy@tiffinwale.com.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Database className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-blue-900">Right to Correction</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Update or correct inaccurate personal information directly in your account settings or by contacting support.
                    </p>
                  </div>

                  <div className="bg-red-50 p-5 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-red-900">Right to Deletion</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Request deletion of your account and associated data. Some information may be retained for legal compliance or legitimate business purposes.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-purple-900">Right to Portability</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Export your data in a machine-readable format (JSON/CSV) to transfer to another service provider.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Bell className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-orange-900">Right to Object</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Object to processing of your data for direct marketing purposes or based on legitimate interests. Opt-out anytime via settings.
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-indigo-900">Right to Restriction</h4>
                    </div>
                    <p className="text-sm text-gray-700">
                      Request that we restrict processing of your information in certain circumstances, such as during dispute resolution.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl border border-primary/20">
                  <h3 className="font-bold text-xl mb-3 text-primary">How to Exercise Your Rights</h3>
                  <p className="text-gray-700 mb-4">To exercise any of these rights:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>1. Log in to your account and navigate to <strong>Settings → Privacy & Data</strong></li>
                    <li>2. Email our Data Protection Officer at <strong>privacy@tiffinwale.com</strong></li>
                    <li>3. Call our support team at <strong>+91 98765 43210</strong></li>
              </ul>
                  <p className="text-sm text-gray-600 mt-4">
                    We will respond to your request within <strong>30 days</strong>. Identity verification may be required for security purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Data Security */}
            <div id="security" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">5. Data Security</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
                </p>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.1 Security Measures</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                      <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <h4 className="font-bold text-sm mb-2">Encryption</h4>
                      <p className="text-xs text-gray-700">SSL/TLS encryption for data transmission; AES-256 for data at rest</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                      <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <h4 className="font-bold text-sm mb-2">Access Controls</h4>
                      <p className="text-xs text-gray-700">Role-based access, multi-factor authentication for staff</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                      <Database className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <h4 className="font-bold text-sm mb-2">Regular Backups</h4>
                      <p className="text-xs text-gray-700">Daily automated backups with disaster recovery protocols</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.2 Payment Security</h3>
                  <p>
                    We do not store complete payment card details. All payment transactions are processed through PCI-DSS compliant payment gateways (Razorpay, PhonePe). We only store tokenized payment references for subscription management.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">5.3 Data Breach Protocol</h3>
                  <p>In the event of a data breach that affects your personal information:</p>
                  <ul className="space-y-2">
                    <li>We will notify you within <strong>72 hours</strong> of discovery</li>
                    <li>Notification will include the nature of the breach and data affected</li>
                    <li>We will provide guidance on protective measures you can take</li>
                    <li>Relevant authorities will be notified as required by law</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="font-semibold text-amber-900 mb-1">Important Disclaimer</p>
                  <p className="text-amber-800 text-sm">
                    While we implement robust security measures, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security but are committed to protecting your information to the best of our ability.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Data Retention */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <Database className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">6. Data Retention</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>We retain your personal information for as long as necessary to:</p>
                <ul className="space-y-2">
                  <li>Provide our services and maintain your account</li>
                  <li>Comply with legal obligations (e.g., tax records for 7 years)</li>
                  <li>Resolve disputes and enforce our agreements</li>
                  <li>Improve our services through analytics (anonymized data)</li>
                </ul>
                <div className="bg-gray-50 p-4 rounded-xl mt-4">
                  <h3 className="font-bold text-lg mb-2">Retention Periods</h3>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Active accounts:</strong> Retained while account is active</li>
                    <li>• <strong>Inactive accounts:</strong> 2 years of inactivity, then archived</li>
                    <li>• <strong>Deleted accounts:</strong> 30 days grace period, then permanently deleted</li>
                    <li>• <strong>Transaction records:</strong> 7 years (legal requirement)</li>
                    <li>• <strong>Marketing data:</strong> Deleted immediately upon opt-out</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 7: Cookies & Tracking */}
            <div id="cookies" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">7. Cookies & Tracking Technologies</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content.
                </p>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.1 Types of Cookies We Use</h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <h4 className="font-bold text-sm mb-2 text-yellow-900">Essential Cookies (Required)</h4>
                      <p className="text-sm text-gray-700">Necessary for platform functionality, login sessions, and security. Cannot be disabled.</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-sm mb-2 text-blue-900">Functional Cookies (Optional)</h4>
                      <p className="text-sm text-gray-700">Remember your preferences, language settings, and customizations.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <h4 className="font-bold text-sm mb-2 text-green-900">Analytics Cookies (Optional)</h4>
                      <p className="text-sm text-gray-700">Help us understand how you use the platform (Google Analytics, Firebase).</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                      <h4 className="font-bold text-sm mb-2 text-purple-900">Advertising Cookies (Optional)</h4>
                      <p className="text-sm text-gray-700">Deliver relevant ads and measure campaign effectiveness.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">7.2 Managing Cookies</h3>
                  <p>You can control cookies through:</p>
                  <ul className="space-y-2">
                    <li><strong>Cookie Consent Banner:</strong> Customize preferences when you first visit our website</li>
                    <li><strong>Account Settings:</strong> Manage cookie preferences in <em>Settings → Privacy → Cookies</em></li>
                    <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
                  </ul>
                  <p className="text-sm mt-2 text-amber-700 bg-amber-50 p-3 rounded">
                    ⚠️ Blocking essential cookies may affect platform functionality and your ability to use certain features.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Sections Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Children's Privacy */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">8. Children's Privacy</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  TiffinWale is not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately at <span className="text-primary font-semibold">privacy@tiffinwale.com</span> so we can delete it.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">9. Third-Party Links</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Our platform may contain links to third-party websites or services (e.g., payment gateways). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing personal information.
                </p>
              </div>

              {/* International Users */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">10. International Users</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  TiffinWale operates primarily in India. Your information is stored on servers located in India. If you access our services from outside India, your data may be transferred to and processed in India, which may have different data protection laws than your country.
                </p>
              </div>

              {/* Changes to Policy */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-xl mb-4 text-foreground">11. Changes to This Policy</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We may update this Privacy Policy periodically. Material changes will be notified via email and displayed prominently on our platform 30 days before taking effect. Continued use after changes indicates acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
              <h2 className="font-bold text-3xl mb-4">Questions About Your Privacy?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Our Data Protection Officer is here to address your privacy concerns and help you exercise your data rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:privacy@tiffinwale.com" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  <Shield className="h-5 w-5" />
                  privacy@tiffinwale.com
                </a>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  <Bell className="h-5 w-5" />
                  +91 98765 43210
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  Data Protection Officer: <strong className="text-white">Priya Sharma</strong><br />
                  Address: TiffinWale Technologies Pvt. Ltd., Indore, Madhya Pradesh 452010, India
                </p>
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
