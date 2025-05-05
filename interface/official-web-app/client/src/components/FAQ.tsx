import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
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
  const subscriptionItems: FAQItemProps[] = [
    {
      question: "How do I pause or cancel my subscription?",
      answer: "You can easily pause or cancel your subscription anytime through the TiffinWale app. Go to 'My Subscription', select 'Manage Plan', and choose either 'Pause' or 'Cancel'. Pausing allows you to resume later without losing your preferences.",
      value: "sub-1"
    },
    {
      question: "Can I change my meal plan mid-subscription?",
      answer: "Yes, you can upgrade, downgrade, or modify your meal plan at any time. Changes will be reflected in your next billing cycle. To change your plan, go to 'My Subscription' in the app and select 'Change Plan'.",
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
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our service.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {/* All Questions section as anchor */}
          <div id="allQuestions"></div>
          
          {/* Subscription Questions */}
          <div id="subscriptionQuestions">
            <h3 className="font-semibold text-xl mb-4 px-4">Subscription</h3>
            <Accordion type="single" collapsible className="w-full">
              {subscriptionItems.map((item, index) => (
                <AccordionItem key={index} value={item.value}>
                  <AccordionTrigger className="text-left font-medium p-4 bg-gray-50 hover:bg-gray-100">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Delivery Questions */}
          <div id="deliveryQuestions">
            <h3 className="font-semibold text-xl mb-4 px-4">Delivery</h3>
            <Accordion type="single" collapsible className="w-full">
              {deliveryItems.map((item, index) => (
                <AccordionItem key={index} value={item.value}>
                  <AccordionTrigger className="text-left font-medium p-4 bg-gray-50 hover:bg-gray-100">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Food Questions */}
          <div id="foodQuestions">
            <h3 className="font-semibold text-xl mb-4 px-4">Food & Menu</h3>
            <Accordion type="single" collapsible className="w-full">
              {foodItems.map((item, index) => (
                <AccordionItem key={index} value={item.value}>
                  <AccordionTrigger className="text-left font-medium p-4 bg-gray-50 hover:bg-gray-100">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Payment Questions */}
          <div id="paymentQuestions">
            <h3 className="font-semibold text-xl mb-4 px-4">Payment</h3>
            <Accordion type="single" collapsible className="w-full">
              {paymentItems.map((item, index) => (
                <AccordionItem key={index} value={item.value}>
                  <AccordionTrigger className="text-left font-medium p-4 bg-gray-50 hover:bg-gray-100">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* App Questions */}
          <div id="appQuestions">
            <h3 className="font-semibold text-xl mb-4 px-4">App & Account</h3>
            <Accordion type="single" collapsible className="w-full">
              {appItems.map((item, index) => (
                <AccordionItem key={index} value={item.value}>
                  <AccordionTrigger className="text-left font-medium p-4 bg-gray-50 hover:bg-gray-100">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link 
            href="#contact" 
            className="inline-flex items-center text-primary font-medium hover:underline"
            onClick={() => {
              document.querySelector('.bg-gray-50.py-16')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact our support team
            <ChevronDown className="h-5 w-5 ml-1 rotate-270" />
          </Link>
        </div>
      </div>
    </section>
  );
}
