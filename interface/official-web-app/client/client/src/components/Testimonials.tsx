import { useState, useEffect } from "react";
import { StarIcon, Loader2 } from "lucide-react";
import { getTestimonials, Testimonial } from "@/lib/api";

interface TestimonialCardProps {
  name: string;
  profession?: string;
  rating: number;
  quote: string;
  imageUrl?: string;
  createdAt: string;
}

const TestimonialCard = ({ name, profession, rating, quote, imageUrl, createdAt }: TestimonialCardProps) => {
  // Default image to use if none provided
  const defaultImage = "https://api.dicebear.com/6.x/initials/svg?seed=" + encodeURIComponent(name);
  const displayImage = imageUrl || defaultImage;
  
  // Format date to show duration since
  const formatDuration = (dateString: string): string => {
    try {
      const testimonialDate = new Date(dateString);
      const now = new Date();
      const diffMonths = (now.getFullYear() - testimonialDate.getFullYear()) * 12 + 
                        (now.getMonth() - testimonialDate.getMonth());
      
      if (diffMonths < 1) return "Joined recently";
      if (diffMonths === 1) return "Subscribed for 1 month";
      if (diffMonths < 12) return `Subscribed for ${diffMonths} months`;
      
      const years = Math.floor(diffMonths / 12);
      return `Subscribed for ${years} ${years === 1 ? 'year' : 'years'}`;
    } catch (error) {
      return "Loyal customer";
    }
  };

  return (
    <div className="testimonial-card bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={displayImage} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{profession || "TiffinWale Customer"}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
            />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{quote}</p>
      <p className="text-sm text-primary font-medium">{formatDuration(createdAt)}</p>
    </div>
  );
};

// Fallback testimonials in case backend API is unavailable
const fallbackTestimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    profession: "Medical Student",
    rating: 5,
    testimonial: "TiffinWale has been a lifesaver during my hectic exam periods. The food is authentic, nutritious, and reminds me of home cooking. Their flexible subscription makes it perfect for my changing schedule.",
    createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // ~6 months ago
    updatedAt: new Date().toISOString(),
    status: "approved" as const,
    isApproved: true,
  },
  {
    id: "2",
    name: "Rahul Mehra",
    profession: "Software Engineer",
    rating: 5,
    testimonial: "As someone who works long hours, I don't have time to cook healthy meals. TiffinWale delivers delicious, varied food right to my office. Their app makes it easy to manage my subscription and the food quality is consistently excellent.",
    createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(), // ~1 year ago
    updatedAt: new Date().toISOString(),
    status: "approved" as const,
    isApproved: true,
  },
  {
    id: "3",
    name: "Neha Kapoor",
    profession: "MBA Student",
    rating: 5,
    testimonial: "I love that I can customize my meals based on my dietary preferences. The food is always fresh, well-portioned, and delicious. Their eco-friendly packaging is a huge plus for me!",
    createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(), // ~8 months ago
    updatedAt: new Date().toISOString(),
    status: "approved" as const,
    isApproved: true,
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        // Fetch testimonials from the API
        const response = await getTestimonials(1, 6, 'createdAt', 'desc');
        
        // If no testimonials returned or there's a message, use fallbacks
        if (response.testimonials.length === 0 || response.message) {
          console.log('Using fallback testimonials due to:', response.message || 'No data returned');
          setTestimonials(fallbackTestimonials);
        } else {
          setTestimonials(response.testimonials);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
        // Use fallback data in case of error
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TiffinWale for their daily meals.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading testimonials...</span>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
            <p className="text-muted-foreground mt-2">We're showing you some of our favorite testimonials instead.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                profession={testimonial.profession}
                rating={testimonial.rating}
                quote={testimonial.testimonial}
                imageUrl={testimonial.imageUrl}
                createdAt={testimonial.createdAt}
              />
            ))}
          </div>
        )}
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="mb-4">Love our service? Share your experience with us!</p>
          <a 
            href="/testimonials#testimonial-form" 
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit Your Testimonial
          </a>
        </div>
      </div>
    </section>
  );
}
