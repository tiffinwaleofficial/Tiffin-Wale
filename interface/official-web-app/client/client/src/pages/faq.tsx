import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { ChevronRight, MessageCircle, Mail, Phone, X, Send } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function FAQPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{type: 'user' | 'support', text: string}[]>([
    {type: 'support', text: 'Hello! How can I help you today?'}
  ]);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  // Handle chat message submission
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {type: 'user', text: chatInput}]);
    
    // Simulate response after a short delay
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        {
          type: 'support', 
          text: 'Thanks for your message! Our team will get back to you shortly.'
        }
      ]);
    }, 1000);
    
    setChatInput('');
  };
  
  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this to a server
    setEmailSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmailSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      // Hide the dialog
      document.getElementById('email-support-dialog')?.classList.add('hidden');
    }, 3000);
  };
  
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
            <span className="text-primary font-medium">FAQ</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Page Header */}
        <div className="bg-primary/10 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about TiffinWale's service, delivery, and subscriptions.
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search for answers..." 
                  className="pl-10 py-6"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories */}
        <section className="py-4 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-2 md:gap-3">
              <Button 
                variant="outline" 
                className="rounded-full" 
                size="sm"
                onClick={() => document.getElementById('allQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                All Questions
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full bg-primary/10 text-primary" 
                size="sm"
                onClick={() => document.getElementById('subscriptionQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Subscription
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full" 
                size="sm"
                onClick={() => document.getElementById('deliveryQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Delivery
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full" 
                size="sm"
                onClick={() => document.getElementById('foodQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Food & Menu
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full" 
                size="sm"
                onClick={() => document.getElementById('paymentQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Payment
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full" 
                size="sm"
                onClick={() => document.getElementById('appQuestions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                App & Account
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Component */}
        <FAQ />
        
        {/* Additional Questions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-bold text-2xl md:text-3xl mb-8 text-center">More Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold text-xl mb-6">About Our Service</h3>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">What areas do you currently serve?</h4>
                    <p className="text-muted-foreground">
                      We currently serve major metro areas including Delhi NCR, Mumbai, Bangalore, Hyderabad, Pune, and Chennai. We're expanding to new cities regularly!
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">How fresh are your meals?</h4>
                    <p className="text-muted-foreground">
                      All our meals are prepared fresh on the day of delivery using quality ingredients. We never use preservatives or artificial flavors.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">Do you accommodate allergies?</h4>
                    <p className="text-muted-foreground">
                      Yes, we mark common allergens in our menu and can accommodate most dietary restrictions. Please specify your allergies in your profile.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">What if I don't like a meal?</h4>
                    <p className="text-muted-foreground">
                      We have a satisfaction guarantee. If you're unhappy with a meal, contact us within 2 hours of delivery and we'll credit your account.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-6">Subscription & Delivery</h3>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">What are the delivery hours?</h4>
                    <p className="text-muted-foreground">
                      Our standard delivery windows are 11:30 AM - 1:30 PM for lunch and 6:30 PM - 8:30 PM for dinner. Premium subscribers can select specific time slots.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">Can I get a partial refund if I cancel mid-month?</h4>
                    <p className="text-muted-foreground">
                      Yes, if you cancel mid-month, we'll refund the unused portion of your subscription minus any applicable service charges.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h4 className="font-medium mb-2">How do I update my delivery address?</h4>
                    <p className="text-muted-foreground">
                      You can update your delivery address anytime through the app under Profile &gt; Addresses. Changes take effect the next business day.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Can I order additional items with my subscription?</h4>
                    <p className="text-muted-foreground">
                      Yes, you can add extra items like desserts, snacks, or beverages to any delivery through the Add-ons section in the app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-bold text-3xl mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Can't find the answer you're looking for? Please contact our friendly support team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Talk to our support team in real-time through the app or website.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Show the chat dialog
                    document.getElementById('chat-dialog')?.classList.remove('hidden');
                  }}
                >
                  Start Chat
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Show the email contact form
                    document.getElementById('email-support-dialog')?.classList.remove('hidden');
                  }}
                >
                  Email Us
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Call us directly at our customer support hotline.
                </p>
                <a 
                  href="tel:+919876543210" 
                  className="inline-block w-full"
                >
                  <Button variant="outline" className="w-full">+91 98765 43210</Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
      
      {/* Chat Dialog */}
      <div 
        id="chat-dialog" 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          // Close dialog when clicking the backdrop
          if (e.target === e.currentTarget) {
            document.getElementById('chat-dialog')?.classList.add('hidden');
          }
        }}
      >
        <div className="bg-white rounded-xl w-full max-w-md h-[500px] flex flex-col overflow-hidden">
          <div className="bg-primary px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-white mr-2" />
              <h3 className="font-semibold text-white">TiffinWale Support</h3>
            </div>
            <button 
              onClick={() => document.getElementById('chat-dialog')?.classList.add('hidden')}
              className="text-white hover:bg-primary-dark rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t px-4 py-3 flex items-center">
            <Input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-grow"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendChatMessage();
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 text-primary"
              onClick={handleSendChatMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Email Support Dialog */}
      <div 
        id="email-support-dialog" 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          // Close dialog when clicking the backdrop
          if (e.target === e.currentTarget) {
            document.getElementById('email-support-dialog')?.classList.add('hidden');
          }
        }}
      >
        <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
          <div className="bg-primary px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-white mr-2" />
              <h3 className="font-semibold text-white">Email Support</h3>
            </div>
            <button 
              onClick={() => document.getElementById('email-support-dialog')?.classList.add('hidden')}
              className="text-white hover:bg-primary-dark rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message</label>
                  <Textarea 
                    id="message" 
                    className="min-h-[120px]" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl text-green-800">Message Sent!</h3>
                <p className="text-green-700">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}