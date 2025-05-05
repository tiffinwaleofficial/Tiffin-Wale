import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function PricingPage() {
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
            <span className="text-primary font-medium">Pricing</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Page Header */}
        <div className="bg-primary/10 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Simple & Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that works best for your lifestyle. No hidden fees, cancel anytime.
            </p>
          </div>
        </div>
        
        {/* Pricing Component */}
        <Pricing />
        
        {/* Pricing FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">Frequently Asked Questions About Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">Can I change my plan later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade, downgrade, or change your meal plan at any time. Changes will take effect on your next billing cycle.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">Are there any long-term commitments?</h3>
                <p className="text-muted-foreground">
                  No long-term contracts. All plans are month-to-month and you can cancel anytime without penalties.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, UPI, net banking, and mobile wallets for convenient payment options.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">Do you offer any discounts?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer student discounts, referral bonuses, and special discounts for quarterly or annual subscription payments.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">What if I need to skip a delivery?</h3>
                <p className="text-muted-foreground">
                  You can easily skip individual deliveries through the app up to 24 hours in advance and receive a credit for future use.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-xl mb-3">Do you offer family plans?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer family plans with multiple portions. Contact our customer service for customized family packages.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Compare Plans */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-8 text-center">Plan Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left bg-gray-50 rounded-tl-xl">Features</th>
                    <th className="p-4 text-center bg-gray-50">Basic</th>
                    <th className="p-4 text-center bg-primary/10 font-semibold">Standard</th>
                    <th className="p-4 text-center bg-gray-50 rounded-tr-xl">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Meals per day</td>
                    <td className="p-4 text-center">1 (Lunch)</td>
                    <td className="p-4 text-center bg-primary/5">2 (Lunch & Dinner)</td>
                    <td className="p-4 text-center">3 (All meals)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Menu rotation</td>
                    <td className="p-4 text-center">Weekly</td>
                    <td className="p-4 text-center bg-primary/5">Weekly + Weekends</td>
                    <td className="p-4 text-center">Daily options</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Customization</td>
                    <td className="p-4 text-center">Basic</td>
                    <td className="p-4 text-center bg-primary/5">Advanced</td>
                    <td className="p-4 text-center">Complete</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Dietary preferences</td>
                    <td className="p-4 text-center">Limited</td>
                    <td className="p-4 text-center bg-primary/5">Multiple options</td>
                    <td className="p-4 text-center">Fully customizable</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Delivery priority</td>
                    <td className="p-4 text-center">Standard</td>
                    <td className="p-4 text-center bg-primary/5">Priority</td>
                    <td className="p-4 text-center">Premium (Choose time)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Add-ons</td>
                    <td className="p-4 text-center">Available at cost</td>
                    <td className="p-4 text-center bg-primary/5">Discounted</td>
                    <td className="p-4 text-center">Some included</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium rounded-bl-xl">Price per month</td>
                    <td className="p-4 text-center">₹3,999</td>
                    <td className="p-4 text-center bg-primary/5 font-semibold">₹5,999</td>
                    <td className="p-4 text-center rounded-br-xl">₹7,999</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Corporate Plans */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-primary/10 rounded-xl p-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h2 className="font-bold text-2xl md:text-3xl mb-4">Corporate & Group Plans</h2>
                  <p className="text-muted-foreground mb-4">
                    Looking for corporate meal solutions for your office? We offer customized meal plans for teams of all sizes with special bulk pricing and dedicated account management.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Bulk discounts based on team size</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Simplified consolidated billing</span>
                    </li>
                  </ul>
                  <Link href="#" className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200">
                    Contact for Corporate Plans
                  </Link>
                </div>
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80" 
                    alt="Corporate catering" 
                    className="rounded-lg shadow-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}