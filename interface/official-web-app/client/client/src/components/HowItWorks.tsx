import { ClipboardList, SlidersHorizontal, TruckIcon } from "lucide-react";

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
      <div className="absolute -top-0 left-0 md:-top-7 md:-left-7 bg-primary text-white w-16 h-16 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-md transform transition-transform duration-500 hover:rotate-12">
        {number}
      </div>
      
      {/* Step Card */}
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 md:p-8 h-full transition-all duration-300 relative z-0 mt-8 ml-8 md:mt-0 md:ml-0 hover:translate-y-[-5px]">
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        <h3 className="font-semibold text-xl mb-3 text-center">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>
      
      {/* Desktop Connector */}
      {!isLast && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-2 bg-primary z-0"></div>
      )}
    </div>
  );
};

export default function HowItWorks() {
  const steps = [
    {
      icon: <ClipboardList className="h-16 w-16 text-primary" />,
      title: "Choose Your Plan",
      description: "Select the number of meals per day and subscription duration that works best for you."
    },
    {
      icon: <SlidersHorizontal className="h-16 w-16 text-primary" />,
      title: "Customize Your Menu",
      description: "Choose your favorite meals, set dietary preferences, and add extras to your order."
    },
    {
      icon: <TruckIcon className="h-16 w-16 text-primary" />,
      title: "Enjoy Daily Delivery",
      description: "Sit back as fresh tiffins arrive at your doorstep each day at your preferred time."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get delicious meals delivered to your doorstep.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </div>
    </section>
  );
}
