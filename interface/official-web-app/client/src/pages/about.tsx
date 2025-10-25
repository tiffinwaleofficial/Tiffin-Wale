import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Award, Users, Store, MapPin, Target, Heart, Shield, TrendingUp, ChefHat, Star, Clock, Zap } from "lucide-react";
import { Link } from "wouter";
import MobileAppBanner from "@/components/MobileAppBanner";
import AppStoreButtons from "@/components/AppStoreButtons";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-secondary/20 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/">
              <span className="text-gray-500 hover:text-primary cursor-pointer transition-colors">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-primary font-semibold">About Us</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="inline-block mb-4">
                  <span className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    India's #1 Tiffin Marketplace
                  </span>
                </div>
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                  Connecting India
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    One Meal at a Time
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                  TiffinWale began with a revolutionary idea: create India's first marketplace connecting hungry individuals with verified home chefs and tiffin centers. No middlemen, just authentic home-cooked meals delivered fresh.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Founded in 2023, we've transformed from a vision to reality, now partnering with <span className="text-primary font-semibold">100+ verified tiffin centers</span> across <span className="text-primary font-semibold">200+ locations</span>, serving <span className="text-primary font-semibold">50,000+ happy customers</span> their daily dose of delicious, home-style meals.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary mb-1">100+</div>
                    <div className="text-sm text-muted-foreground">Tiffin Centers</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                    <div className="text-sm text-muted-foreground">Happy Customers</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary mb-1">4.6★</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary mb-1">200+</div>
                    <div className="text-sm text-muted-foreground">Locations</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80" 
                    alt="TiffinWale marketplace - connecting customers with tiffin centers" 
                    className="rounded-3xl shadow-2xl w-full border-4 border-white/50"
                  loading="eager"
                  width={800}
                  height={500}
                />
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">Marketplace Model</div>
                        <div className="text-xs text-muted-foreground">Browse, Compare, Subscribe</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Our Mission & Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Building India's most trusted tiffin marketplace, one authentic meal at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower home chefs and tiffin centers by providing a transparent marketplace platform while ensuring customers get access to authentic, home-cooked meals they can trust. We're democratizing the tiffin industry, making quality meals accessible to everyone.
                </p>
              </div>

              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 border border-accent/20">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-foreground">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the go-to platform for home-cooked meals across India and beyond, creating a thriving ecosystem where tiffin centers grow their business and customers enjoy delicious, nutritious meals that feel like home - all at the tap of a button.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="text-center mb-12">
              <h2 className="font-bold text-3xl mb-6 text-foreground">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at TiffinWale
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Trust & Safety</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every tiffin center is verified through rigorous quality and hygiene audits. Customer safety is our top priority.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Customer First</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  From browsing to delivery, every feature is designed with customer satisfaction and convenience in mind.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Partner Growth</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We empower tiffin centers with technology, visibility, and support to scale their business sustainably.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 border border-gray-100 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Quality Excellence</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Maintaining high standards across all partner centers through continuous monitoring and feedback.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Journey */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Our Journey</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From idea to India's #1 tiffin marketplace
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary transform md:-translate-x-1/2"></div>
                
                {/* Timeline Items */}
                <div className="space-y-16">
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent transform md:-translate-x-1/2 shadow-lg ring-4 ring-white"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-20 md:pl-0 md:pr-12 md:text-right order-2 md:order-1">
                        <span className="inline-block text-primary font-bold text-sm mb-2">Early 2023</span>
                        <h3 className="font-bold text-2xl mb-3">The Vision</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Conceived the idea of India's first tiffin marketplace during a conversation between food lovers frustrated with limited options. The goal: connect customers with multiple verified tiffin centers.
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-20 md:pl-12 order-1 md:order-2 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80" 
                          alt="TiffinWale beginning - the marketplace vision" 
                          className="rounded-2xl shadow-xl w-full border-4 border-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent transform md:-translate-x-1/2 shadow-lg ring-4 ring-white"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-20 md:pl-0 md:pr-12 md:text-right order-2">
                        <span className="inline-block text-primary font-bold text-sm mb-2">Mid 2023</span>
                        <h3 className="font-bold text-2xl mb-3">Launch & First Partners</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Launched with 10 verified tiffin centers in Indore. Developed iOS and Android apps with real-time tracking. Reached 5,000 downloads in the first month!
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-20 md:pl-12 order-1 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1650367310179-e1b69c0e4485?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80" 
                          alt="TiffinWale first partners onboarded" 
                          className="rounded-2xl shadow-xl w-full border-4 border-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent transform md:-translate-x-1/2 shadow-lg ring-4 ring-white"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-20 md:pl-0 md:pr-12 md:text-right order-2">
                        <span className="inline-block text-primary font-bold text-sm mb-2">Late 2023 - 2024</span>
                        <h3 className="font-bold text-2xl mb-3">Rapid Expansion</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Expanded to 50+ tiffin centers across 5 cities (Indore, Bhopal, Ujjain, Dewas, Ratlam). Integrated RazorPay for secure payments. Crossed 25,000 active users!
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-20 md:pl-12 order-1 md:order-2 pb-6 md:pb-0">
                        <img 
                          src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80" 
                          alt="TiffinWale expansion across India" 
                          className="rounded-2xl shadow-xl w-full border-4 border-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-8 md:left-1/2 -top-1 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent transform md:-translate-x-1/2 shadow-lg ring-4 ring-white"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                      <div className="md:w-1/2 pl-20 md:pl-0 md:pr-12 md:text-right order-2">
                        <span className="inline-block text-primary font-bold text-sm mb-2">2025 & Beyond</span>
                        <h3 className="font-bold text-2xl mb-3">India's #1 Marketplace</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Now 100+ verified centers, 200+ locations, 50,000+ customers, 4.6★ rating. Plans for AI-powered recommendations, corporate B2B platform, and expansion to 50+ cities by 2026!
                        </p>
                      </div>
                      <div className="md:w-1/2 pl-20 md:pl-12 order-1 pb-6 md:pb-0">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=250&q=80" 
                            alt="TiffinWale today - India's leading marketplace" 
                            className="rounded-2xl shadow-xl w-full border-4 border-white"
                          />
                          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                            #1 in India!
                          </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="mt-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20 max-w-4xl mx-auto">
              <h3 className="font-bold text-2xl md:text-3xl text-center mb-8 text-foreground">Our Impact Today</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Partner Centers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">200+</div>
                  <div className="text-sm text-muted-foreground">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                  <div className="text-sm text-muted-foreground">Meals Delivered</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl mb-6 text-foreground">Meet Our Leadership</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The passionate team behind India's #1 tiffin marketplace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="relative inline-block mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                    alt="Rohit Sharma, CEO & Founder" 
                    className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg" 
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-foreground">Rohit Sharma</h3>
                <p className="text-primary font-semibold mb-2">CEO & Founder</p>
                <p className="text-sm text-muted-foreground">Visionary behind marketplace</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-block mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Priya Patel, COO" 
                    className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg" 
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-foreground">Priya Patel</h3>
                <p className="text-primary font-semibold mb-2">COO</p>
                <p className="text-sm text-muted-foreground">Operations & Partner Relations</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-block mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Vikram Mehta, CTO" 
                    className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg" 
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-foreground">Vikram Mehta</h3>
                <p className="text-primary font-semibold mb-2">CTO</p>
                <p className="text-sm text-muted-foreground">Technology & Innovation</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-block mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                    alt="Neha Singh, Head of Quality" 
                    className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary transition-all duration-300 shadow-lg" 
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-foreground">Neha Singh</h3>
                <p className="text-primary font-semibold mb-2">Head of Quality</p>
                <p className="text-sm text-muted-foreground">Quality Assurance & Standards</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
                Join 50,000+ Happy Customers
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Download the TiffinWale app today. Browse 100+ verified tiffin centers, compare by ratings, and enjoy authentic home-cooked meals delivered daily to your doorstep.
              </p>
              <div className="mb-8">
            <AppStoreButtons />
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                  <span>4.6★ Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>100% Verified Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>On-Time Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileAppBanner />
    </div>
  );
}