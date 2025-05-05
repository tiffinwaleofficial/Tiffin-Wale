import { StarIcon } from "lucide-react";

interface TestimonialProps {
  image: string;
  name: string;
  profession: string;
  quote: string;
  duration: string;
}

const TestimonialCard = ({ image, name, profession, quote, duration }: TestimonialProps) => {
  return (
    <div className="testimonial-card bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{profession}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground mb-4">{quote}</p>
      <p className="text-sm text-primary font-medium">{duration}</p>
    </div>
  );
};

export default function Testimonials() {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      name: "Priya Sharma",
      profession: "Medical Student",
      quote: "TiffinWale has been a lifesaver during my hectic exam periods. The food is authentic, nutritious, and reminds me of home cooking. Their flexible subscription makes it perfect for my changing schedule.",
      duration: "Subscribed for 6 months"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      name: "Rahul Mehra",
      profession: "Software Engineer",
      quote: "As someone who works long hours, I don't have time to cook healthy meals. TiffinWale delivers delicious, varied food right to my office. Their app makes it easy to manage my subscription and the food quality is consistently excellent.",
      duration: "Subscribed for 1 year"
    },
    {
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      name: "Neha Kapoor",
      profession: "MBA Student",
      quote: "I love that I can customize my meals based on my dietary preferences. The food is always fresh, well-portioned, and delicious. Their eco-friendly packaging is a huge plus for me!",
      duration: "Subscribed for 8 months"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TiffinWale for their daily meals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              profession={testimonial.profession}
              quote={testimonial.quote}
              duration={testimonial.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
