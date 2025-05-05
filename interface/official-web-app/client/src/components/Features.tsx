import { Heart, Calendar, Leaf, Shield } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <div 
      className="feature-card bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-center transition-all duration-500 hover:translate-y-[-10px]"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.2}s backwards`
      }}
    >
      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110 hover:rotate-6">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default function Features() {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Made with Love",
      description: "Every meal prepared like home-cooked with care and attention to detail."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Flexible Plans",
      description: "Pause, upgrade, or modify your subscription anytime to fit your changing needs."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Local Ingredients",
      description: "Fresh, seasonal produce from trusted local farmers for the best quality meals."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Eco Packaging",
      description: "Sustainable and reusable containers that are good for you and the environment."
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">Why TiffinWale?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're more than just food delivery. We bring the comfort of home-cooked meals to your doorstep.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
