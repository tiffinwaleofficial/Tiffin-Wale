import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

export default function FAQ() {
  const marketplaceItems: FAQItemProps[] = [
    {
      question: "How does TiffinWale's marketplace model work?",
      answer: "TiffinWale is India's first tiffin marketplace where you can browse 100+ verified tiffin centers, compare their ratings, read reviews, view subscription plans, and choose the one that fits your needs. Simply download our app, browse centers by rating or location, and subscribe to your favorite!",
      value: "market-1"
    },
    {
      question: "How do I choose the right tiffin center?",
      answer: "Browse tiffin centers sorted by ratings (4.5★+), read authentic customer reviews, check cuisine types (North Indian, South Indian, Multi-cuisine), compare starting prices (₹50-120/day), and view their subscription plans. You can filter by location and price range to find the perfect match.",
      value: "market-2"
    },
    {
      question: "Can I switch between different tiffin centers?",
      answer: "Yes! One of the benefits of our marketplace is flexibility. You can try different tiffin centers, switch between them, or subscribe to multiple centers. Each center has its own subscription that you can manage independently through the app.",
      value: "market-3"
    }
  ];
  
  const subscriptionItems: FAQItemProps[] = [
    {
      question: "How do subscription plans work?",
      answer: "Each tiffin center on our platform offers different subscription plans (daily, weekly, monthly). Plans vary by meal type (lunch only, lunch+dinner, all meals), price (₹50-120/day), and features. You can view and compare all plans in the app before subscribing.",
      value: "sub-1"
    },
    {
      question: "Can I pause or cancel my subscription?",
      answer: "Yes! You can pause, cancel, or modify your subscription with any tiffin center anytime through the TiffinWale app. Go to 'My Subscriptions', select the center, and choose 'Manage Plan'. No cancellation fees apply.",
      value: "sub-2"
    }
  ];
  
  const deliveryItems: FAQItemProps[] = [
    {
      question: "What if I'm not home for delivery?",
      answer: "You can set delivery instructions in the app for where to leave your tiffin. Our insulated packaging keeps food at the right temperature for up to 3 hours. Alternatively, you can have it delivered to your workplace or change the delivery time through the app.",
      value: "del-1"
    },
    {
      question: "Can I track my delivery in real-time?",
      answer: "Yes, our app provides real-time tracking once your order is out for delivery. You'll receive notifications when your order is being prepared, when it leaves our kitchen, and when it's about to arrive.",
      value: "del-2"
    }
  ];
  
  const foodItems: FAQItemProps[] = [
    {
      question: "Are dietary preferences supported?",
      answer: "Yes! We cater to various dietary preferences including vegetarian, vegan, gluten-free, and low-carb options. You can set your preferences in your profile and customize each week's menu. We also mark common allergens in our menu descriptions.",
      value: "food-1"
    },
    {
      question: "How sustainable is the packaging?",
      answer: "Our containers are made from plant-based materials that are biodegradable or recyclable. We also offer a container return program where you can return your tiffin containers and get credit towards your next order. This helps reduce waste and environmental impact.",
      value: "food-2"
    }
  ];
  
  const paymentItems: FAQItemProps[] = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, digital wallets like PayTM and Google Pay, and net banking. You can manage your payment methods in the app under 'Payment Options'.",
      value: "pay-1"
    },
    {
      question: "How does billing work for subscriptions?",
      answer: "Subscriptions are billed at the start of each billing cycle (weekly or monthly, depending on your plan). You'll receive a receipt via email, and you can view all your billing history in the app.",
      value: "pay-2"
    }
  ];
  
  const appItems: FAQItemProps[] = [
    {
      question: "Can I order extras or additional items?",
      answer: "Absolutely! You can add extra portions, side dishes, desserts, or beverages to your regular order through the app. Simply go to 'Add-ons' section when selecting your weekly menu. Extra charges will apply based on the items you select.",
      value: "app-1"
    },
    {
      question: "How do I update my delivery address?",
      answer: "You can manage multiple delivery addresses in the app. Go to 'My Profile' > 'Addresses' to add, edit, or remove addresses. You can select which address to use for each delivery during checkout.",
      value: "app-2"
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-white via-secondary/10 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Got Questions?
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about browsing, comparing, and subscribing to tiffin centers.
            <span className="text-primary font-medium"> Can't find an answer? Contact us!</span>
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Marketplace Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">1</span>
              Marketplace & Browsing
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {marketplaceItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Subscription Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">2</span>
              Subscription & Plans
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {subscriptionItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Delivery Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">3</span>
              Delivery & Tracking
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {deliveryItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Food Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">4</span>
              Food & Menu
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {foodItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Payment Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">5</span>
              Payment & Billing
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {paymentItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* App Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-2xl mb-6 text-foreground flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">6</span>
              App & Account
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {appItems.map((item, index) => (
                <AccordionItem key={index} value={item.value} className="border-b border-gray-100 last:border-0">
                  <AccordionTrigger className="text-left font-semibold p-4 hover:bg-primary/5 rounded-lg transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-10 border border-primary/20 shadow-xl max-w-3xl mx-auto">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Still Have Questions?</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any queries about browsing, comparing, or subscribing to tiffin centers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-us">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base">
                Contact Support
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-10 py-6 rounded-full transition-all duration-300 text-base">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
