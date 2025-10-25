import { Check, Star, MapPin, ChefHat, Clock, TrendingUp, Filter, Search, Smartphone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";

interface TiffinCenter {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  cuisineTypes: string[];
  startingPrice: string;
  image: string;
  verified: boolean;
  features: string[];
  isFeatured?: boolean;
}

interface TiffinCenterCardProps {
  center: TiffinCenter;
  index: number;
}

const TiffinCenterCard = ({ center, index }: TiffinCenterCardProps) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:border-primary/30 group
      ${center.isFeatured ? 'ring-2 ring-primary/50' : 'border-gray-200'}`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={center.image}
          alt={center.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Featured Badge */}
        {center.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <TrendingUp className="h-3 w-3" />
            Top Rated
          </div>
        )}
        
        {/* Verified Badge */}
        {center.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
            <Check className="h-4 w-4" />
            </div>
          )}
        
        {/* Rating & Reviews */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-sm">{center.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({center.reviews})</span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Center Name */}
        <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
          {center.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{center.location}</span>
        </div>
        
        {/* Cuisine Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {center.cuisineTypes.map((cuisine, idx) => (
            <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
              {cuisine}
            </span>
          ))}
        </div>
        
        {/* Features */}
        <div className="space-y-2 mb-4">
          {center.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
                </div>
            ))}
        </div>
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-muted-foreground">Starting at</span>
            <div className="font-bold text-2xl text-primary">{center.startingPrice}</div>
          </div>
        <Link href="#download">
            <Button className="bg-primary hover:bg-accent text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              View Plans
          </Button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default function Pricing() {
  const [priceFilter, setPriceFilter] = useState<string>("all");
  
  // Sample featured tiffin centers (will be replaced with API data)
  const tiffinCenters: TiffinCenter[] = [
    {
      id: "1",
      name: "Maa Ka Khana",
      rating: 4.8,
      reviews: 1240,
      location: "Vijay Nagar, Indore",
      cuisineTypes: ["North Indian", "Home-style"],
      startingPrice: "₹80/day",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
      verified: true,
      features: ["Fresh Daily", "No Preservatives", "Customizable Menu"],
      isFeatured: true
    },
    {
      id: "2",
      name: "Ghar Jaisa Tiffin",
      rating: 4.7,
      reviews: 980,
      location: "Sapna Sangeeta, Indore",
      cuisineTypes: ["North Indian", "Punjabi"],
      startingPrice: "₹75/day",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80",
      verified: true,
      features: ["2 Meals/Day", "Weekend Delivery", "Healthy Options"],
      isFeatured: true
    },
    {
      id: "3",
      name: "South Indian Delights",
      rating: 4.6,
      reviews: 756,
      location: "MG Road, Indore",
      cuisineTypes: ["South Indian", "Traditional"],
      startingPrice: "₹65/day",
      image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
      verified: true,
      features: ["Authentic Taste", "Oil-free Options", "Daily Variety"]
    },
    {
      id: "4",
      name: "Student's Choice Tiffin",
      rating: 4.5,
      reviews: 654,
      location: "Palasia Square, Indore",
      cuisineTypes: ["Multi-Cuisine", "Budget-friendly"],
      startingPrice: "₹50/day",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80",
      verified: true,
      features: ["Affordable", "Large Portions", "Student Special"]
    },
    {
      id: "5",
      name: "Premium Home Kitchen",
      rating: 4.9,
      reviews: 420,
      location: "AB Road, Indore",
      cuisineTypes: ["Multi-Cuisine", "Gourmet"],
      startingPrice: "₹120/day",
      image: "https://images.unsplash.com/photo-1606491956807-a6c3e01ee5a7?w=600&q=80",
      verified: true,
      features: ["Premium Ingredients", "Chef Special", "Exotic Dishes"],
      isFeatured: true
    },
    {
      id: "6",
      name: "Healthy Bites",
      rating: 4.7,
      reviews: 512,
      location: "Rau, Indore",
      cuisineTypes: ["Health Food", "Protein-Rich"],
      startingPrice: "₹95/day",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      verified: true,
      features: ["Low-Calorie", "High-Protein", "Dietitian Approved"]
    }
  ];

  const priceRanges = [
    { label: "All", value: "all" },
    { label: "₹50-80/day", value: "50-80" },
    { label: "₹80-120/day", value: "80-120" },
    { label: "₹120+/day", value: "120+" }
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
              <ChefHat className="inline h-4 w-4 mr-2" />
              Browse Our Marketplace
            </span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Top-Rated Tiffin Centers
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover 100+ verified tiffin centers sorted by ratings. 
            <span className="text-primary font-medium"> Compare plans and subscribe to your favorite!</span>
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceFilter(range.value)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                priceFilter === range.value
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                  : 'bg-white text-muted-foreground hover:bg-primary/10 hover:text-primary border border-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* How It Works - Quick Guide */}
        <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 mb-12 border border-primary/20">
          <h3 className="font-bold text-2xl text-center mb-8 text-foreground">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">1. Browse Centers</h4>
              <p className="text-sm text-muted-foreground">Explore top-rated tiffin centers by location and rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">2. Check Ratings</h4>
              <p className="text-sm text-muted-foreground">Read reviews from real customers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">3. View Plans</h4>
              <p className="text-sm text-muted-foreground">Compare subscription plans and prices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="h-8 w-8 text-white" />
          </div>
              <h4 className="font-semibold mb-2">4. Subscribe</h4>
              <p className="text-sm text-muted-foreground">Download app and start your subscription</p>
          </div>
          </div>
        </div>
        
        {/* Tiffin Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tiffinCenters.map((center, index) => (
            <TiffinCenterCard key={center.id} center={center} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="#download">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg">
              <Smartphone className="mr-2 h-6 w-6" />
              Download App to View All Centers
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">100+ verified tiffin centers available on our app</p>
        </div>

        {/* Corporate Plans CTA */}
        <div className="text-center mt-20 max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-10 rounded-3xl border-2 border-primary/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left flex-1">
              <h3 className="text-3xl font-bold text-foreground mb-3">Corporate Meal Plans</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Need bulk tiffin services for your office? Get special corporate pricing and customized meal options for your team.
              </p>
            </div>
            <Link href="/corporate-plans">
              <Button className="bg-primary hover:bg-accent text-white px-10 py-7 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap group">
                Get Corporate Pricing
                <TrendingUp className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
