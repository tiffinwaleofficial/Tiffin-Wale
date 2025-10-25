import { Star, Quote, CheckCircle, MapPin, Calendar, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface TestimonialProps {
  image: string;
  name: string;
  profession: string;
  location: string;
  quote: string;
  duration: string;
  rating: number;
  verified?: boolean;
  index: number;
}

const TestimonialCard = ({ image, name, profession, location, quote, duration, rating, verified = true, index }: TestimonialProps) => {
  return (
    <div 
      className="testimonial-card bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-500 border border-gray-100 relative group hover:-translate-y-2"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
      }}
    >
      {/* Quote Icon Background */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Quote className="h-16 w-16 text-primary" />
      </div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={image} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover border-4 border-primary/20" 
            />
            {verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <h4 className="font-bold text-lg text-foreground">{name}</h4>
            <p className="text-sm text-muted-foreground">{profession}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
        "{quote}"
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium">{duration}</span>
        </div>
        {verified && (
          <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-semibold">
            Verified Customer
          </span>
        )}
      </div>
    </div>
  );
};

export default function Testimonials() {
  // Sample testimonials (will be replaced with API data from /testimonials/public)
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Priya Sharma",
      profession: "Medical Student",
      location: "Indore",
      quote: "TiffinWale marketplace made it so easy to find the perfect tiffin center near my hostel. I compared 5 different centers, read reviews, and chose the one with the best ratings. The food quality is amazing!",
      duration: "6 months",
      rating: 5,
      verified: true
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Rahul Mehra",
      profession: "Software Engineer",
      location: "Pune",
      quote: "As someone who works long hours, browsing different tiffin centers by rating was a game-changer. I found a center with 4.8★ that specializes in healthy meals. Their real-time tracking feature is brilliant!",
      duration: "1 year",
      rating: 5,
      verified: true
    },
    {
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Neha Kapoor",
      profession: "MBA Student",
      location: "Indore",
      quote: "The ability to compare prices and menus from multiple tiffin centers on one platform is incredible. I switched between three centers before finding my favorite. Love the flexibility!",
      duration: "8 months",
      rating: 5,
      verified: true
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Anita Desai",
      profession: "Working Professional",
      location: "Delhi",
      quote: "TiffinWale's verified tiffin centers give me peace of mind. I can see real customer reviews and ratings before subscribing. The home-style food from my chosen center tastes just like mom's cooking!",
      duration: "5 months",
      rating: 5,
      verified: true
    },
    {
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Arjun Patel",
      profession: "College Student",
      location: "Ahmedabad",
      quote: "Being a student on a budget, I needed affordable options. TiffinWale helped me find centers with plans starting at ₹50/day! The quality is still excellent and the variety keeps me satisfied.",
      duration: "4 months",
      rating: 4,
      verified: true
    },
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      name: "Kavya Reddy",
      profession: "Content Creator",
      location: "Hyderabad",
      quote: "The live chat support helped me choose the perfect tiffin center for my dietary needs. I appreciate how transparent everything is - from pricing to reviews. Best food marketplace ever!",
      duration: "7 months",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Customer Reviews
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Loved by 50,000+ Customers
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Real reviews from real customers who found their perfect tiffin center on our marketplace.
            <span className="text-primary font-medium"> Join the TiffinWale family today!</span>
          </p>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-primary mb-2">4.6★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-primary mb-2">12K+</div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              image={testimonial.image}
              name={testimonial.name}
              profession={testimonial.profession}
              location={testimonial.location}
              quote={testimonial.quote}
              duration={testimonial.duration}
              rating={testimonial.rating}
              verified={testimonial.verified}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-10 border border-primary/20 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Want to Share Your Experience?</h3>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
            We'd love to hear about your experience with TiffinWale and your favorite tiffin center!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-testimonial">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base">
                Submit Your Review
              </Button>
            </Link>
            <Link href="/testimonials">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-10 py-6 rounded-full transition-all duration-300 text-base">
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
