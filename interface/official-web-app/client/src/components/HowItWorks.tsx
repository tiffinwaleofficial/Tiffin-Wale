import { Search, Star, Calendar, Smartphone, CheckCircle, TruckIcon, MessageCircle } from "lucide-react";

interface StepCardProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

const StepCard = ({ number, icon, title, description, isLast = false }: StepCardProps) => {
  return (
    <div className="relative pt-10 px-4 md:pt-0 md:px-0">
      {/* Step Number */}
      <div className="absolute -top-0 left-0 md:-top-7 md:-left-7 bg-gradient-to-r from-primary to-accent text-white w-16 h-16 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-xl transform transition-all duration-500 hover:rotate-12 hover:scale-110">
        {number}
      </div>
      
      {/* Step Card */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 md:p-8 h-full transition-all duration-500 relative z-0 mt-8 ml-8 md:mt-0 md:ml-0 hover:translate-y-[-8px] border border-gray-100 group">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <h3 className="font-bold text-xl mb-3 text-center text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground text-center leading-relaxed">{description}</p>
        </div>
      </div>
      
      {/* Desktop Connector - Animated Arrow */}
      {!isLast && (
        <div className="hidden md:block absolute top-1/2 -right-6 z-0">
          <div className="flex items-center">
            <div className="w-8 h-1 bg-gradient-to-r from-primary to-accent animate-pulse-slow"></div>
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-accent border-b-[6px] border-b-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-16 w-16 text-primary" />,
      title: "Browse Tiffin Centers",
      description: "Explore 100+ verified tiffin centers sorted by ratings, location, and cuisine type on our marketplace."
    },
    {
      icon: <Star className="h-16 w-16 text-primary" />,
      title: "Check Ratings & Reviews",
      description: "Read authentic reviews from real customers and choose centers with the highest ratings."
    },
    {
      icon: <Calendar className="h-16 w-16 text-primary" />,
      title: "Compare Plans",
      description: "View subscription plans, pricing, and menu options from multiple tiffin centers side-by-side."
    },
    {
      icon: <Smartphone className="h-16 w-16 text-primary" />,
      title: "Download App",
      description: "Get our mobile app for iOS or Android to subscribe to your favorite tiffin center instantly."
    },
    {
      icon: <CheckCircle className="h-16 w-16 text-primary" />,
      title: "Subscribe & Enjoy",
      description: "Complete your subscription with secure payment and start receiving fresh daily meals."
    },
    {
      icon: <TruckIcon className="h-16 w-16 text-primary" />,
      title: "Track Delivery",
      description: "Real-time order tracking and live chat support ensure your tiffin arrives on time, every time."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-white via-secondary/10 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Simple Process
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How TiffinWale Works
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your journey from browsing to enjoying delicious home-cooked meals.
            <span className="text-primary font-medium"> Simple, transparent, and hassle-free!</span>
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-10 max-w-4xl mx-auto border border-primary/20 shadow-xl">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Need Help Getting Started?</h3>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
              Our support team is available 24/7 to help you find the perfect tiffin center and subscription plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#download" className="inline-block">
                <button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base">
                  Download App Now
                </button>
              </a>
              <a href="/contact-us" className="inline-block">
                <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 text-base">
                  Contact Support
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
