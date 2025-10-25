import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, RefreshCw, DollarSign, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Phone } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function RefundPolicyPage() {
  const sections = [
    { id: "cancellation", title: "Subscription Cancellation", icon: XCircle },
    { id: "meal-skip", title: "Meal Skipping", icon: Calendar },
    { id: "refunds", title: "Refund Eligibility", icon: RefreshCw },
    { id: "process", title: "Refund Process", icon: DollarSign },
    { id: "timelines", title: "Processing Timelines", icon: Clock },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-accent to-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm font-semibold">Hassle-Free Refunds</span>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl mb-6 text-white">Refund & Cancellation Policy</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Transparent policies for subscription management and refunds
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
            <span className="text-primary font-medium">Refund Policy</span>
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl mb-3 text-foreground">Customer-First Approach</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At <strong>TiffinWale</strong>, we understand that plans change. This Refund & Cancellation Policy outlines our commitment to providing flexible subscription management and fair refund processes for our marketplace platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This policy applies to subscriptions from all tiffin centers listed on our platform. Individual centers may have additional policies, which will be clearly displayed on their respective pages.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">24h</div>
                <div className="text-sm text-muted-foreground">Meal Skip Notice</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">48h</div>
                <div className="text-sm text-muted-foreground">Refund Review</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">5-7</div>
                <div className="text-sm text-muted-foreground">Days to Refund</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Quality Issues</div>
              </div>
            </div>

            {/* Section 1: Subscription Cancellation */}
            <div id="cancellation" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">1. Subscription Cancellation</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg font-medium text-primary">
                  You can cancel your subscription anytime through the Student App or by contacting customer support.
                </p>

                <div>
                  <h3 className="font-bold text-xl mb-3">1.1 How to Cancel</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-bold mb-4 text-blue-900">Cancellation Methods:</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h5 className="font-bold text-sm mb-2">Via Student App</h5>
                        <p className="text-xs text-gray-600">
                          Profile → My Subscriptions → Select Subscription → Cancel
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h5 className="font-bold text-sm mb-2">Via Website</h5>
                        <p className="text-xs text-gray-600">
                          Login → Account Settings → Subscriptions → Manage
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h5 className="font-bold text-sm mb-2">Contact Support</h5>
                        <p className="text-xs text-gray-600">
                          Call +91 98765 43210 or email support@tiffinwale.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">1.2 Cancellation Terms by Plan Type</h3>
                  <div className="space-y-4">
                    {/* Daily Plans */}
                    <div className="border-l-4 border-green-500 bg-green-50 p-5 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <h4 className="font-bold text-lg text-green-900">Daily/Pay-Per-Meal Plans</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✓ Cancel anytime without penalty</li>
                        <li>✓ Must cancel at least <strong>24 hours</strong> before next scheduled delivery</li>
                        <li>✓ No refunds for meals already delivered</li>
                        <li>✓ Unused credits remain valid for <strong>30 days</strong></li>
                      </ul>
                    </div>

                    {/* Weekly Plans */}
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-5 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h4 className="font-bold text-lg text-blue-900">Weekly Plans (5-7 Days)</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✓ Cancel within <strong>48 hours of purchase</strong> for 100% refund (minus payment gateway fees)</li>
                        <li>✓ After 48 hours: Continue receiving meals until end of week</li>
                        <li>✓ Prorated refund for unused days (minus 10% administrative fee)</li>
                        <li>✓ Emergency cancellations considered on case-by-case basis</li>
                      </ul>
                    </div>

                    {/* Monthly Plans */}
                    <div className="border-l-4 border-purple-500 bg-purple-50 p-5 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <h4 className="font-bold text-lg text-purple-900">Monthly Plans (20-30 Days)</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✓ Cancel within <strong>3 days of purchase</strong> for 90% refund</li>
                        <li>✓ After 3 days: Service continues until month-end, no auto-renewal</li>
                        <li>✓ Prorated refund available if unused portion exceeds 50% (minus 15% admin fee)</li>
                        <li>✓ Medical/relocation emergencies: Full prorated refund with documentation</li>
                      </ul>
                    </div>

                    {/* Quarterly/Annual Plans */}
                    <div className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-r-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        <h4 className="font-bold text-lg text-orange-900">Quarterly/Annual Plans</h4>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✓ Cancel within <strong>7 days</strong> of purchase for 85% refund</li>
                        <li>✓ After 7 days: Prorated refund minus discount received for long-term commitment</li>
                        <li>✓ Minimum retention of <strong>1 month</strong> fee applies</li>
                        <li>✓ Emergency situations: Contact support for special consideration</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Important Notes on Cancellation</h4>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Cancellation must be completed <strong>before the auto-renewal date</strong></li>
                        <li>• Auto-renewal is disabled automatically upon cancellation</li>
                        <li>• Corporate/bulk subscriptions have separate cancellation terms (see Corporate page)</li>
                        <li>• Promotional/discounted subscriptions may have modified cancellation terms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Meal Skipping */}
            <div id="meal-skip" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">2. Meal Skipping & Pausing</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg">
                  Don't want to cancel entirely? Skip individual meals or pause your subscription temporarily!
                </p>

                <div>
                  <h3 className="font-bold text-xl mb-3">2.1 How Meal Skipping Works</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-3 text-blue-900">✓ Skip Options:</h4>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li>• Skip individual meals (lunch or dinner)</li>
                          <li>• Skip entire days</li>
                          <li>• Skip specific date ranges (e.g., vacation)</li>
                          <li>• Set recurring skip patterns (e.g., every Sunday)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-3 text-blue-900">⏰ Timing Requirements:</h4>
                        <ul className="text-sm space-y-2 text-gray-700">
                          <li>• Must skip at least <strong>24 hours in advance</strong></li>
                          <li>• For next-day meals: Skip before 9:00 PM</li>
                          <li>• Bulk date skips: Anytime before first skipped date</li>
                          <li>• Emergency skips: Contact support (fees may apply)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">2.2 Meal Credits & Refunds</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-900 mb-3">Credit System:</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>• <strong>Successfully skipped meals</strong> are credited to your account</li>
                        <li>• Credits can be used for future orders or additional meals</li>
                        <li>• Credits expire <strong>60 days</strong> from issue date</li>
                        <li>• Automatic credit application at checkout</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-3">Refund Option (Instead of Credits):</h4>
                      <ul className="text-sm space-y-2 text-gray-700">
                        <li>• Available for subscriptions with <strong>5+ skipped meals</strong></li>
                        <li>• Request refund instead of credits via Support</li>
                        <li>• Refund amount: Full meal value minus 5% processing fee</li>
                        <li>• Processed within 7-10 business days</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">2.3 Subscription Pausing</h3>
                  <p>Need a longer break? Pause your entire subscription:</p>
                  <div className="bg-gray-50 p-5 rounded-xl mt-3">
                    <ul className="text-sm space-y-2 text-gray-700">
                      <li>✓ <strong>Pause Duration:</strong> 7 days to 90 days</li>
                      <li>✓ <strong>No Charges:</strong> No fees during pause period</li>
                      <li>✓ <strong>Resume Anytime:</strong> Reactivate early via app/website</li>
                      <li>✓ <strong>Auto-Resume:</strong> Subscription resumes automatically after pause period</li>
                      <li>✓ <strong>Limitations:</strong> Maximum 2 pauses per subscription cycle</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Refund Eligibility */}
            <div id="refunds" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">3. Refund Eligibility</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <p className="text-lg font-medium text-primary">
                  We offer refunds or credits in the following circumstances:
                </p>

                <div className="space-y-4">
                  {/* Quality Issues */}
                  <div className="border-2 border-red-200 bg-red-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-red-900">Quality Issues</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      If you receive a meal that does not meet quality standards:
                    </p>
                    <ul className="text-sm space-y-2 text-gray-700">
                      <li>✓ <strong>Spoiled/Stale Food:</strong> 100% refund + replacement meal</li>
                      <li>✓ <strong>Foreign Objects:</strong> 100% refund + investigation initiated</li>
                      <li>✓ <strong>Wrong Temperature:</strong> 50% refund or credit</li>
                      <li>✓ <strong>Poor Taste/Preparation:</strong> Credit for future order (case-by-case)</li>
                    </ul>
                    <div className="mt-4 bg-white p-3 rounded-lg">
                      <p className="text-xs font-semibold text-red-800">
                        ⏰ Must report within <strong>2 hours of delivery</strong> with photo evidence
                      </p>
                    </div>
                  </div>

                  {/* Delivery Issues */}
                  <div className="border-2 border-blue-200 bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-blue-900">Delivery Issues</h3>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-700">
                      <li>✓ <strong>Not Delivered:</strong> 100% refund or replacement</li>
                      <li>✓ <strong>Wrong Address (our error):</strong> 100% refund + re-delivery</li>
                      <li>✓ <strong>Significantly Late (&gt;45 min):</strong> 50% refund or credit</li>
                      <li>✓ <strong>Packaging Issues:</strong> 25-50% refund depending on severity</li>
                    </ul>
                  </div>

                  {/* Order Errors */}
                  <div className="border-2 border-purple-200 bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-purple-900">Incorrect Orders</h3>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-700">
                      <li>✓ <strong>Wrong Meal Delivered:</strong> 100% refund + correct meal re-delivery</li>
                      <li>✓ <strong>Missing Items:</strong> Refund for missing items</li>
                      <li>✓ <strong>Dietary Restrictions Ignored:</strong> 100% refund + incident report</li>
                      <li>✓ <strong>Incorrect Portion Size:</strong> 30-50% refund or credit</li>
                    </ul>
                  </div>

                  {/* Platform/Technical Issues */}
                  <div className="border-2 border-orange-200 bg-orange-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-xl text-orange-900">Platform/Technical Issues</h3>
                    </div>
                    <ul className="text-sm space-y-2 text-gray-700">
                      <li>✓ <strong>Double Billing:</strong> Full refund of duplicate charge</li>
                      <li>✓ <strong>Payment Gateway Error:</strong> Investigation + refund if confirmed</li>
                      <li>✓ <strong>App/Website Malfunction:</strong> Credit + issue resolution priority</li>
                      <li>✓ <strong>Unauthorized Charges:</strong> Immediate reversal + security review</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                  <h4 className="font-bold text-red-900 mb-3">❌ Non-Refundable Situations:</h4>
                  <ul className="text-sm space-y-2 text-red-800">
                    <li>• Consumed meals or complaints made after the 2-hour window</li>
                    <li>• Delivery failures due to incorrect address provided by customer</li>
                    <li>• Subjective taste preferences (unless severe quality issue)</li>
                    <li>• Delivery unavailability due to customer's absence (without prior notice)</li>
                    <li>• Promotional/discounted items (unless quality/delivery issue)</li>
                    <li>• Delivery delays due to force majeure (natural disasters, strikes, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Refund Process */}
            <div id="process" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">4. Refund Request Process</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="font-bold text-xl mb-4 text-purple-900">Step-by-Step Refund Request:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl flex-1">
                        <h4 className="font-bold text-sm mb-2">Submit Request</h4>
                        <p className="text-xs text-gray-700">
                          Via Student App: Order History → Select Order → Report Issue → Request Refund<br />
                          Or email: <strong>support@tiffinwale.com</strong> or call <strong>+91 98765 43210</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl flex-1">
                        <h4 className="font-bold text-sm mb-2">Provide Details</h4>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• Your name and contact information</li>
                          <li>• Order number and delivery date</li>
                          <li>• Detailed description of the issue</li>
                          <li>• Photo/video evidence (if applicable)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl flex-1">
                        <h4 className="font-bold text-sm mb-2">Review & Verification</h4>
                        <p className="text-xs text-gray-700">
                          Our team reviews your request within <strong>24-48 hours</strong>. We may contact you for additional information or photos.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl flex-1">
                        <h4 className="font-bold text-sm mb-2">Decision & Notification</h4>
                        <p className="text-xs text-gray-700">
                          You'll receive an email/SMS notification with our decision. If approved, refund will be processed immediately.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">5</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl flex-1">
                        <h4 className="font-bold text-sm mb-2">Refund Completion</h4>
                        <p className="text-xs text-gray-700">
                          Refund appears in your original payment method within <strong>5-7 business days</strong> (depending on your bank).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">4.1 Refund Methods</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                      <h4 className="font-bold text-green-900 mb-3">Original Payment Method</h4>
                      <p className="text-sm text-gray-700 mb-3">Refund to the card/UPI/wallet used for payment:</p>
                      <ul className="text-xs space-y-1 text-gray-700">
                        <li>• Credit/Debit Cards: 5-7 business days</li>
                        <li>• UPI: 3-5 business days</li>
                        <li>• Net Banking: 5-7 business days</li>
                        <li>• Wallets: 2-3 business days</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3">TiffinWale Wallet</h4>
                      <p className="text-sm text-gray-700 mb-3">Instant credit to your TiffinWale account:</p>
                      <ul className="text-xs space-y-1 text-gray-700">
                        <li>• Immediate availability</li>
                        <li>• Use for future orders</li>
                        <li>• No expiry on wallet balance</li>
                        <li>• Withdraw anytime (2-3 days processing)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Processing Timelines */}
            <div id="timelines" className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="font-bold text-3xl text-foreground">5. Processing Timelines</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left font-bold">Scenario</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Review Time</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Refund Processing</th>
                        <th className="border border-gray-300 p-3 text-left font-bold">Total Timeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-gray-300 p-3">Quality Issue (with photo)</td>
                        <td className="border border-gray-300 p-3">12-24 hours</td>
                        <td className="border border-gray-300 p-3">2-3 days</td>
                        <td className="border border-gray-300 p-3 font-semibold text-green-600">3-4 days</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3">Delivery Issue</td>
                        <td className="border border-gray-300 p-3">24-48 hours</td>
                        <td className="border border-gray-300 p-3">3-5 days</td>
                        <td className="border border-gray-300 p-3 font-semibold text-blue-600">4-7 days</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border border-gray-300 p-3">Subscription Cancellation</td>
                        <td className="border border-gray-300 p-3">48 hours</td>
                        <td className="border border-gray-300 p-3">5-7 days</td>
                        <td className="border border-gray-300 p-3 font-semibold text-purple-600">7-9 days</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3">Payment Error/Double Charge</td>
                        <td className="border border-gray-300 p-3">24 hours</td>
                        <td className="border border-gray-300 p-3">3-5 days</td>
                        <td className="border border-gray-300 p-3 font-semibold text-orange-600">4-6 days</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border border-gray-300 p-3">TiffinWale Wallet Credit</td>
                        <td className="border border-gray-300 p-3">12-24 hours</td>
                        <td className="border border-gray-300 p-3">Instant</td>
                        <td className="border border-gray-300 p-3 font-semibold text-green-600">1-2 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tip: Faster Refunds</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Choose TiffinWale Wallet for <strong>instant credits</strong></li>
                    <li>• Provide clear photo evidence with your refund request</li>
                    <li>• Report issues within the 2-hour window</li>
                    <li>• Ensure your payment details are up-to-date</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Force Majeure */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <h3 className="font-bold text-xl text-foreground">6. Force Majeure</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  TiffinWale and partner tiffin centers are not liable for delays or failures due to circumstances beyond reasonable control, including natural disasters, pandemics, civil unrest, strikes, or government actions. In such cases, we will work to find reasonable solutions on a case-by-case basis, which may include:
                </p>
                <ul className="text-sm text-gray-700 mt-3 space-y-1">
                  <li>• Subscription pause without penalty</li>
                  <li>• Extended credit validity</li>
                  <li>• Partial refunds for extended disruptions</li>
                </ul>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-6 w-6 text-purple-600" />
                  <h3 className="font-bold text-xl text-foreground">7. Dispute Resolution</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  If you're unsatisfied with our refund decision:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Step 1:</strong> Contact our escalation team at <span className="text-primary">escalations@tiffinwale.com</span></li>
                  <li><strong>Step 2:</strong> Senior manager will review within 48 hours</li>
                  <li><strong>Step 3:</strong> If still unresolved, formal arbitration as per Terms of Service</li>
                </ul>
              </div>

              {/* Corporate Refunds */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <h3 className="font-bold text-xl text-foreground">8. Corporate Refunds</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Corporate subscriptions have separate refund policies due to customized contracts and volume commitments. Please refer to your corporate agreement or contact your dedicated account manager at <span className="text-primary">corporate@tiffinwale.com</span> for specific refund terms.
                </p>
              </div>

              {/* Policy Updates */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                  <h3 className="font-bold text-xl text-foreground">9. Policy Updates</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We may update this Refund Policy periodically. Material changes will be notified via email and app notifications 15 days before taking effect. Existing subscriptions will honor the policy in effect at the time of purchase for their current billing cycle.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
              <h2 className="font-bold text-3xl mb-4">Need Help with a Refund?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Our customer support team is available 24/7 to assist with refund requests and answer your questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:support@tiffinwale.com" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                  <DollarSign className="h-5 w-5" />
                  support@tiffinwale.com
                </a>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  <Phone className="h-5 w-5" />
                  +91 98765 43210
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  Available: Monday - Sunday, 8:00 AM - 10:00 PM IST<br />
                  Average Response Time: &lt; 30 minutes
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
