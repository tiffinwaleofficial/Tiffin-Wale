import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PlanFeature {
  text: string;
}

interface PricingPlanProps {
  title: string;
  price: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

const PricingPlan = ({ title, price, features, isPopular = false }: PricingPlanProps) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden 
      ${isPopular ? 'relative z-10 transform scale-105 border-[3px] border-primary' : 'border border-gray-200 hover:border-gray-300'}`}
      style={{
        background: isPopular ? 'linear-gradient(to bottom, #fff, #fff, rgba(255, 166, 77, 0.08))' : 'white',
        boxShadow: isPopular ? '0 10px 40px -10px rgba(255, 166, 77, 0.4)' : ''
      }}
    >
      {/* No ribbon as requested */}
      
      <div className={`px-8 pt-8 pb-4 ${isPopular ? 'bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5' : ''}`}>
        <div className="flex justify-center mb-3">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isPopular ? 'bg-primary/20' : 'bg-gray-100'}`}>
            {title === "Basic" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            )}
            {title === "Standard" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {title === "Premium" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        <h3 className={`font-bold text-2xl text-center mb-2 ${isPopular ? 'text-primary' : 'text-gray-800'}`}>
          {title}
        </h3>
        <div className="text-center mb-6 relative">
          <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">{price}</span>
          <span className="text-gray-500 ml-1">/month</span>
          
          {isPopular && (
            <div className="absolute -right-2 -top-2 transform rotate-12">
              <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">Best Value</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 pt-4">
        <div className="mb-6">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${isPopular ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-green-500'}`}>
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-gray-700">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link href="#download">
          <Button 
            className={`w-full py-6 group relative overflow-hidden transition-all duration-500 
              ${isPopular 
                ? 'bg-primary hover:bg-primary/90 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`
              }
            variant={isPopular ? "default" : "outline"}
          >
            <span className="relative z-10 font-bold">Choose {title}</span>
            <span className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent"></span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function Pricing() {
  const pricingPlans = [
    {
      title: "Basic",
      price: "₹3,999",
      features: [
        { text: "1 Meal/Day (Lunch)" },
        { text: "Weekly Menu Rotation" },
        { text: "Free Delivery" },
        { text: "Eco-Friendly Packaging" }
      ]
    },
    {
      title: "Standard",
      price: "₹5,999",
      features: [
        { text: "2 Meals/Day (Lunch & Dinner)" },
        { text: "Dietary Preferences" },
        { text: "Priority Delivery" },
        { text: "Weekend Special Menu" }
      ],
      isPopular: true
    },
    {
      title: "Premium",
      price: "₹7,999",
      features: [
        { text: "3 Meals/Day (All Meals)" },
        { text: "Custom Menu Selection" },
        { text: "Premium Add-ons" },
        { text: "Flexible Delivery Times" }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary rounded-full"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary rounded-full"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary relative inline-block">
            <span className="relative">Simple & Flexible Pricing
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20 rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-6">
            Choose the plan that works best for you. All plans include free delivery.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-10">
          <div className="self-start">
            <PricingPlan
              title={pricingPlans[0].title}
              price={pricingPlans[0].price}
              features={pricingPlans[0].features}
              isPopular={pricingPlans[0].isPopular}
            />
          </div>
          <div className="self-start">
            <PricingPlan
              title={pricingPlans[1].title}
              price={pricingPlans[1].price}
              features={pricingPlans[1].features}
              isPopular={pricingPlans[1].isPopular}
            />
          </div>
          <div className="self-start">
            <PricingPlan
              title={pricingPlans[2].title}
              price={pricingPlans[2].price}
              features={pricingPlans[2].features}
              isPopular={pricingPlans[2].isPopular}
            />
          </div>
        </div>
        
        <div className="text-center mt-20 max-w-3xl mx-auto bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Need a custom plan for your office?</h3>
              <p className="text-gray-600">Get special pricing and customized meal options for your team.</p>
            </div>
            <Link href="/corporate-plans">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 whitespace-nowrap animate-pulse-slow">
                Get Corporate Pricing
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
