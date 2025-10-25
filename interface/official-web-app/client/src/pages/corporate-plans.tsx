import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Users, Building2, Utensils, CalendarDays, TrendingUp, Shield, Star, Clock, Briefcase, Award, Target, CheckCircle, Zap } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import CorporateQuoteForm from "@/components/CorporateQuoteForm";
import { Button } from "@/components/ui/button";

export default function CorporatePlansPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-secondary/20 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer transition-colors">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-semibold">Corporate Plans</span>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                For Businesses & Enterprises
              </span>
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Empower Your Team with
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                India's Best Tiffin Marketplace
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect your organization with 100+ verified tiffin centers. Offer your employees the freedom to choose their preferred meals from top-rated providers while you manage everything from a single dashboard.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Corporate Clients</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">100+</div>
                <div className="text-sm text-muted-foreground">Tiffin Options</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>

            <Link href="#corporate-quote">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg">
                Get Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Why Choose TiffinWale for Your Business</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your workplace with India's most trusted tiffin marketplace platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-white to-primary/5 p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Employee Choice & Satisfaction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Let employees choose from 100+ tiffin centers based on ratings, cuisine, and preferences - boosting morale and productivity.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-accent/5 p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Centralized Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Single dashboard to manage subscriptions, budgets, and employee preferences across multiple tiffin centers.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-primary/5 p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">100% Verified Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                All tiffin centers are hygiene-certified and quality-verified through our rigorous auditing process.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-accent/5 p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">Flexible & Scalable</h3>
              <p className="text-muted-foreground leading-relaxed">
                From 10 to 10,000 employees - our marketplace model grows seamlessly with your organization.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">On-Time Delivery</h4>
                  <p className="text-sm text-muted-foreground">98% on-time delivery rate with real-time tracking for all orders</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">Rating System</h4>
                  <p className="text-sm text-muted-foreground">Transparent ratings and reviews help employees make informed choices</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">Dedicated Support</h4>
                  <p className="text-sm text-muted-foreground">24/7 corporate account manager for seamless service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Corporate Marketplace Plans</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Choose the perfect plan for your team size. All plans include access to our complete marketplace of 100+ verified tiffin centers.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            
            <div className="bg-gradient-to-br from-white to-primary/5 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 mb-8 group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3">STARTER</span>
                  <h3 className="font-bold text-3xl mb-2 text-foreground">Small Team Plan</h3>
                  <p className="text-lg text-muted-foreground">Perfect for startups and small businesses with 5-20 employees.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="text-4xl font-bold text-primary mb-1">₹3,499</div>
                  <div className="text-sm text-muted-foreground">per employee/month</div>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground"><strong>Full Marketplace Access:</strong> Browse 100+ tiffin centers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground"><strong>Employee Choice:</strong> Let team members select preferred centers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground"><strong>Rating-Based Selection:</strong> Choose by reviews and ratings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground"><strong>Simple Billing:</strong> Consolidated monthly invoicing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground"><strong>Dedicated Support:</strong> Email support within 24 hours</span>
                </li>
              </ul>
              <Link href="#corporate-quote">
                <Button className="w-full h-12 bg-primary hover:bg-accent text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h3 className="font-bold text-2xl mb-4">Medium Business Plan</h3>
              <p className="text-lg mb-4">Ideal for growing companies with 21-100 employees.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Lunch and optional dinner service</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>5 daily menu options with vegetarian, non-vegetarian, and special diet choices</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Employee meal preference portal</span>
                </li>
              </ul>
              <p className="text-lg font-medium mb-2">Starting at ₹3,299 per employee/month</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-2xl mb-4">Enterprise Solution</h3>
              <p className="text-lg mb-4">Custom-designed for large organizations with 100+ employees.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Fully customizable meal plans and delivery schedules</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>On-site food service available</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Integration with your company's HR systems</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Quarterly menu planning meetings with our chef</span>
                </li>
              </ul>
              <p className="text-lg font-medium mb-2">Contact us for custom pricing</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Corporate Quote Form */}
      <section id="corporate-quote" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Get Your Custom Quote</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fill out the form below and our team will create a tailored corporate plan for your organization within 24 hours.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <CorporateQuoteForm />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="font-bold text-3xl mb-12 text-center">Trusted by Leading Companies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="mb-4 text-lg italic">
                "TiffinWale's corporate meal program has significantly improved our workplace culture. Our employees love the variety and quality of meals."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">AT</span>
                </div>
                <div>
                  <p className="font-medium">Anil Tripathi</p>
                  <p className="text-sm text-muted-foreground">HR Director, TechInnovate Solutions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="mb-4 text-lg italic">
                "The flexibility of TiffinWale's enterprise solution has been perfect for our diverse team with various dietary needs and preferences."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">SP</span>
                </div>
                <div>
                  <p className="font-medium">Sanya Patel</p>
                  <p className="text-sm text-muted-foreground">Operations Manager, GlobalConnect Inc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-3xl mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">Can you accommodate various dietary restrictions?</h3>
                <p className="text-muted-foreground">
                  Yes, our corporate plans include options for vegetarian, vegan, gluten-free, and other special dietary needs. We can work with you to ensure all your employees' dietary requirements are met.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">How are meals packaged for corporate deliveries?</h3>
                <p className="text-muted-foreground">
                  Meals are individually packaged with eco-friendly containers, labeled with employee names and meal contents. For larger organizations, we also offer bulk delivery options.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">Can employees customize their individual meal preferences?</h3>
                <p className="text-muted-foreground">
                  Yes, our Medium Business and Enterprise plans include access to our employee meal preference portal, where each employee can set their dietary preferences and choose from daily menu options.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-2">How are billings handled for corporate accounts?</h3>
                <p className="text-muted-foreground">
                  We provide monthly consolidated billing with detailed reporting on meal consumption. We can also integrate with your company's expense management systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}