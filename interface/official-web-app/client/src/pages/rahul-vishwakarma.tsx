import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Award, Users, Target, Linkedin, Twitter, Zap } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function RahulVishwakarmaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-secondary/20 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <a className="text-gray-500 hover:text-primary cursor-pointer transition-colors">Home</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link href="/about">
              <a className="text-gray-500 hover:text-primary cursor-pointer transition-colors">About Us</a>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-semibold">Rahul Vishwakarma</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4" />
                Founder & CEO
              </span>
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Rahul Vishwakarma
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-3xl leading-relaxed">
              The visionary leader and driving force behind Tiffin Wale's mission to revolutionize India's home-cooked meal landscape.
            </p>
          </div>
        </section>

        {/* Profile Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="md:w-1/3">
                <div className="relative">
                  <img 
                    src="https://res.cloudinary.com/dols3w27e/image/upload/v1762012087/wakk2qrg6hlud881nkit.jpg" 
                    alt="Rahul Vishwakarma, Founder & CEO" 
                    className="rounded-full shadow-2xl w-full max-w-xs mx-auto border-8 border-white/50"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <a 
                      href="https://www.linkedin.com/in/rahul-vishwakarma-101346192/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Linkedin className="h-6 w-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Twitter className="h-6 w-6 text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="font-bold text-3xl md:text-4xl mb-6 text-foreground">About Rahul</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Rahul Vishwakarma, the Founder and CEO of Tiffin Wale, is the mastermind behind India's first and largest tiffin marketplace. His journey began with a simple yet powerful vision: to connect every individual with the authentic taste of home-cooked meals, no matter where they are. This idea has since blossomed into a nationwide movement, empowering hundreds of local tiffin centers and delighting thousands of customers daily.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A natural-born leader and innovator, Rahul's passion for technology and community has been the cornerstone of Tiffin Wale's success. He has meticulously crafted a platform that is not only technologically advanced but also deeply human-centric. His leadership style is defined by a relentless pursuit of excellence and an unwavering commitment to the success of our partners and the satisfaction of our customers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision & Mission Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">A Vision for India</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Building a future where technology and tradition converge to bring the comfort of home-cooked meals to every doorstep.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Technological Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  "My vision is to harness the power of technology to solve a deeply human need. We are building a smart, intuitive, and seamless platform that makes discovering and enjoying home-cooked meals easier than ever before. We are not just a food delivery service; we are a technology company with a heart."
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 border border-accent/20">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Community Empowerment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  "Tiffin Wale was founded on the principle of community. We are creating a national network of local entrepreneurs, empowering them with the tools and visibility to grow their businesses. Every meal ordered on our platform is a vote of support for a local business, and that is a legacy I am incredibly proud to build."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-bold text-3xl md:text-4xl mb-4">Join the Revolution</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Be a part of Rahul's vision to redefine India's food landscape. Whether you're a customer seeking authentic meals or a tiffin center ready to grow, there's a place for you at Tiffin Wale.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/meal-delivery">
                        <a className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors">
                            Find Your Meal
                        </a>
                    </Link>
                    <Link href="/contact-us">
                        <a className="inline-block bg-secondary text-secondary-foreground font-semibold py-3 px-8 rounded-full hover:bg-secondary/90 transition-colors">
                            Partner With Us
                        </a>
                    </Link>
                </div>
            </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}
