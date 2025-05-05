import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Users, Building2, Utensils, CalendarDays } from "lucide-react";

export default function CorporatePlansPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would send this data to the server
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-medium">Corporate Plans</span>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="font-bold text-3xl md:text-5xl mb-6">Corporate Meal Solutions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Boost productivity and employee satisfaction with delicious, nutritious meals delivered right to your workplace.
            </p>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="font-bold text-3xl md:text-4xl mb-12 text-center">Why Choose TiffinWale for Your Business</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Boost Employee Satisfaction</h3>
              <p className="text-muted-foreground">
                Keep your team happy and energized with delicious, home-style meals.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Flexible Workplace Solutions</h3>
              <p className="text-muted-foreground">
                From small startups to large corporations, we scale to meet your needs.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Customizable Menu Options</h3>
              <p className="text-muted-foreground">
                Accommodate dietary restrictions and preferences across your entire team.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">Simple Administration</h3>
              <p className="text-muted-foreground">
                Easy ordering and management systems that save you time and resources.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bold text-3xl md:text-4xl mb-12 text-center">Corporate Plan Options</h2>
            
            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h3 className="font-bold text-2xl mb-4">Small Team Plan</h3>
              <p className="text-lg mb-4">Perfect for startups and small businesses with 5-20 employees.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Daily lunch delivery for your entire team</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Weekly rotating menu with 3 daily options</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Individual packaging with employee names</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span>Simple monthly billing</span>
                </li>
              </ul>
              <p className="text-lg font-medium mb-2">Starting at ₹3,499 per employee/month</p>
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
      
      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-3xl mb-8 text-center">Get a Custom Quote</h2>
            
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" required placeholder="Your company name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Person</Label>
                    <Input id="name" required placeholder="Full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required placeholder="your@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" required placeholder="Your contact number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <select id="employees" className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="5-20">5-20 employees</option>
                    <option value="21-50">21-50 employees</option>
                    <option value="51-100">51-100 employees</option>
                    <option value="101-500">101-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requirements">Additional Requirements</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Tell us about any specific dietary restrictions, meal preferences, or other requirements."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full">Request Corporate Quote</Button>
              </form>
            ) : (
              <div className="bg-green-50 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
                <p className="text-green-700 mb-4">
                  We've received your corporate inquiry and will get back to you within 24 hours with a customized quote.
                </p>
                <p className="text-green-600 mb-6">
                  One of our corporate solutions specialists will reach out to discuss your specific requirements.
                </p>
                <Link href="/">
                  <Button variant="outline">Return to Home</Button>
                </Link>
              </div>
            )}
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