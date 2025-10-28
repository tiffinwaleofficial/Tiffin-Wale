import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Award, IndianRupee, Target, Linkedin, Twitter } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";

export default function RiyaTiwariPage() {
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
            <span className="text-primary font-semibold">Riya Tiwari</span>
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
                Founder & CFO
              </span>
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Riya Tiwari
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-3xl leading-relaxed">
              The brilliant mind and compassionate visionary shaping the financial destiny of Tiffin Wale, turning a bold idea into a thriving reality.
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
                    src="https://res.cloudinary.com/dols3w27e/image/upload/v1761637006/qvmwdrprx2gciejp0awi.jpg" 
                    alt="Riya Tiwari, Founder & CFO" 
                    className="rounded-full shadow-2xl w-full max-w-xs mx-auto border-8 border-white/50"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <a href="#" className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Linkedin className="h-6 w-6 text-white" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Twitter className="h-6 w-6 text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="font-bold text-3xl md:text-4xl mb-6 text-foreground">About Riya</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  As a Founder and the Chief Financial Officer of Tiffin Wale, Riya Tiwari is the strategic anchor of our entire operation. Her exceptional foresight and deep understanding of market dynamics have been the bedrock of our financial stability. It was her groundbreaking work that forged our revolutionary marketplace model, creating a platform built on integrity, transparency, and a genuine passion for empowering local food entrepreneurs.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Riya's vision transcends mere financial metrics. She is the passionate champion of a sustainable ecosystem where every home chef and tiffin partner can flourish. Her masterful approach to financial planning and risk management has not only weathered economic uncertainties but has attracted key investors who believe in our mission. It was Riya's unwavering dedication and brilliant negotiation that secured the crucial partnerships and funding that catapulted Tiffin Wale from a local startup to a national phenomenon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Contributions Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Key Contributions</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Celebrating the pivotal decisions and impactful initiatives led by Riya.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <IndianRupee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Secured Seed Funding</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Led the charge in securing initial investment, transforming an idea into a well-funded and operational reality.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Partner-First Model</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Architected a unique financial model that prioritizes the profitability and growth of our tiffin partners, ensuring shared success.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Market Expansion</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Masterminded the financial strategy for expanding into 5+ cities, ensuring each launch was a resounding success.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Social Impact</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Spearheaded initiatives for partner financial literacy, fostering a community of empowered entrepreneurs.
                </p>
              </div>
            </div>
          </div>
        </section>
         
         {/* Vision & Mission Section */}
         <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">A Vision for Growth</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fueling a revolution in the home-cooked meal industry with financial acumen and a passion for community empowerment.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
                  <IndianRupee className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Financial Strategy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  "From day one, my mission has been to build more than just a company. I wanted to build a financial foundation of trust and opportunity. A framework that not only fuels our growth but also lifts our partners, creating lasting value for everyone in the Tiffin Wale family. We're not just building a business; we're building a legacy."
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 border border-accent/20">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Empowering Partners</h3>
                <p className="text-muted-foreground leading-relaxed">
                  "For me, the heart of Tiffin Wale beats in the kitchens of our partners. Our success is a direct reflection of theirs. That's why I am relentlessly focused on creating transparent systems and providing powerful financial tools. We're not just a platform; we are a partner in their journey to financial independence and entrepreneurial success."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-bold text-3xl md:text-4xl mb-4">Connect with Our Vision</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Inspired by Riya's vision for a financially inclusive and thriving tiffin marketplace? Explore our platform or consider joining our network of partners.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/corporate-plans">
                        <a className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors">
                            For Corporates
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
