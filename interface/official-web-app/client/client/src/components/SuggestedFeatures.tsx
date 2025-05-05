import { Link } from "wouter";

const features = [
  {
    title: "Personalized meal recommendation engine",
    description: "Get personalized meal suggestions based on your preferences, previous orders, and dietary restrictions.",
    href: "/features/personalized-recommendations"
  },
  {
    title: "Geolocation-based service availability checker",
    description: "Check if TiffinWale delivers to your location and get estimated delivery times based on your current address.",
    href: "/features/service-availability"
  },
  {
    title: "Responsive contact form with field validation",
    description: "Easily get in touch with our team through our form with built-in validation to ensure your message reaches us correctly.",
    href: "/contact"
  },
  {
    title: "Intelligent chat support widget with pre-filled context",
    description: "Get faster support with our chat system that automatically includes your order details and subscription information.",
    href: "/support"
  },
  {
    title: "Animated hover effects for pricing cards",
    description: "Interactive pricing cards that highlight key features and help you compare plans more effectively.",
    href: "/pricing"
  },
  {
    title: "Location-based delivery estimator",
    description: "Get accurate delivery time estimates based on your location, traffic conditions, and time of day.",
    href: "/features/delivery-estimator"
  },
  {
    title: "Interactive meal preview/gallery section",
    description: "Browse our menu with high-quality images, nutritional information, and ingredients for each meal option.",
    href: "/menu"
  }
];

export default function SuggestedFeatures() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">Coming Soon</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We're constantly improving our platform. Here are some exciting features we're working on.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.href}
              className="bg-gray-800 hover:bg-gray-700 transition-colors py-3 px-5 rounded-lg text-sm md:text-base border border-gray-700"
            >
              {feature.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}