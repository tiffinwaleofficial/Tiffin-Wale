import { Heart, Calendar, Leaf, Shield, ChefHat, Star, Smartphone, MessageCircle, CreditCard, TrendingUp, MapPin, Clock } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  gradient?: string;
}

const FeatureCard = ({ icon, title, description, index, gradient = "from-primary/10 to-accent/10" }: FeatureCardProps) => {
  return (
    <div 
      className="feature-card bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 text-center transition-all duration-500 hover:translate-y-[-12px] border border-gray-100 group relative overflow-hidden"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`
      }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-md">
        {icon}
      </div>
        <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default function Features() {
  const features = [
    {
      icon: <Star className="h-10 w-10 text-primary" />,
      title: "Rating-Based Browse",
      description: "Discover top-rated tiffin centers sorted by customer reviews and ratings.",
      gradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: <ChefHat className="h-10 w-10 text-primary" />,
      title: "100+ Verified Centers",
      description: "Choose from a wide variety of trusted, quality-certified tiffin providers.",
      gradient: "from-primary/10 to-accent/10"
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Flexible Plans",
      description: "Pause, upgrade, or modify your subscription anytime with any tiffin center.",
      gradient: "from-blue-50 to-purple-50"
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Secure Payments",
      description: "Multiple payment options with RazorPay integration for safe transactions.",
      gradient: "from-green-50 to-emerald-50"
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Real-Time Tracking",
      description: "Track your order in real-time from kitchen to doorstep with live updates.",
      gradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Live Chat Support",
      description: "Get instant help with our 24/7 live chat support for any queries.",
      gradient: "from-pink-50 to-rose-50"
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "200+ Locations",
      description: "Service available across 200+ locations with expanding coverage daily.",
      gradient: "from-cyan-50 to-teal-50"
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Quality Guarantee",
      description: "Hygiene certified kitchens with regular quality audits and standards.",
      gradient: "from-purple-50 to-violet-50"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white via-secondary/20 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Why Choose TiffinWale?
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Trusted Tiffin Marketplace
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            India's first and largest tiffin marketplace connecting you with verified home chefs and tiffin centers. 
            <span className="text-primary font-medium"> Compare, choose, and enjoy the best home-cooked meals.</span>
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              gradient={feature.gradient}
            />
          ))}
        </div>

        {/* Additional Trust Section */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center border border-primary/20 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-bold text-2xl md:text-3xl mb-6 text-foreground">
              Trusted by 50,000+ Happy Customers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.6★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Tiffin Centers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
