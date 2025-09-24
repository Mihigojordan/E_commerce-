import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Trophy, Globe, ShoppingBag, ArrowUp, Award, Target, Zap, Shield } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';
import Testimonials from '../../components/landing/Testmonial'; // Adjust import path as needed

const AboutPage = () => {
  const [currentClientsSlide, setCurrentClientsSlide] = useState(0);

  // Client logos
  const clientLogos = [
    { name: "Mockup", logo: "https://placehold.co/150x50?text=Mockup&bg=ffffff&fg=000000" },
    { name: "The Backward", logo: "https://placehold.co/150x50?text=The+Backward&bg=ffffff&fg=000000" },
    { name: "Shutter Speed", logo: "https://placehold.co/150x50?text=Shutter+Speed&bg=ffffff&fg=000000" },
    { name: "Travel", logo: "https://placehold.co/150x50?text=Travel&bg=ffffff&fg=000000" },
    { name: "The Retro Studio", logo: "https://placehold.co/150x50?text=The+Retro+Studio&bg=ffffff&fg=000000" },
    { name: "A Design Hub", logo: "https://placehold.co/150x50?text=A+Design+Hub&bg=ffffff&fg=000000" },
    { name: "Creative Co", logo: "https://placehold.co/150x50?text=Creative+Co&bg=ffffff&fg=000000" },
    { name: "Brand Studio", logo: "https://placehold.co/150x50?text=Brand+Studio&bg=ffffff&fg=000000" },
    { name: "Digital Hub", logo: "https://placehold.co/150x50?text=Digital+Hub&bg=ffffff&fg=000000" }
  ];

  // Statistics data
  const stats = [
    { number: "10M+", label: "Happy Customers", icon: Users },
    { number: "500K+", label: "Products Sold", icon: ShoppingBag },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "150+", label: "Countries Served", icon: Globe }
  ];

  // Features data
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Ultra-fast loading times and seamless performance across all devices and platforms."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with SSL encryption and PCI compliance for safe transactions."
    },
    {
      icon: Target,
      title: "AI-Powered Analytics",
      description: "Advanced analytics and insights to help you understand your customers better."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized globally for excellence in ecommerce innovation and customer satisfaction."
    }
  ];

  // Clients slideshow functions
  const nextClientsSlide = () => {
    setCurrentClientsSlide((prev) => (prev + 1) % Math.ceil(clientLogos.length / 6));
  };

  const prevClientsSlide = () => {
    setCurrentClientsSlide((prev) => (prev - 1 + Math.ceil(clientLogos.length / 6)) % Math.ceil(clientLogos.length / 6));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBanner
        title="About Us"
        subtitle="Home / About Us"
        backgroundStyle="image"
      />

      {/* Main About Section with Gradient */}
      <div className="py-10 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="max-w-8xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-12">
            <div>
              <div className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-5">
                OUR COMPANY
              </div>
              <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 leading-loose mb-8">
                We are Building The Ultimate 
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Ecommerce Platform</span> For Seamless Shopping
              </h1>
              <div className="space-y-6 text-md text-gray-600 leading-loose">
                <p>
                  Our platform offers a vast selection of products from top brands, with fast delivery and secure payments. We've revolutionized the way people shop online with cutting-edge technology and user-centric design.
                </p>
                <p>
                  We focus on providing an exceptional online shopping experience, from browsing to checkout, ensuring customer satisfaction every step of the way. Our AI-powered recommendation engine and seamless payment processing make shopping effortless and enjoyable.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=400&fit=crop" 
                  alt="Team celebration"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-6 pt-12">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=400&fit=crop" 
                  alt="Team meeting"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-24 bg-white">
        <div className="max-w-8xl mx-auto px-6 lg:px-14">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Mission & Vision</span>
            </h2>
            <p className="text-md text-gray-600 max-w-3xl mx-auto">
              Driving the future of ecommerce with innovation, integrity, and customer-first approach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-md leading-loose">
                To democratize ecommerce by providing businesses of all sizes with powerful, affordable, and easy-to-use tools that enable them to succeed in the digital marketplace. We believe every entrepreneur deserves access to world-class ecommerce technology.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-loose text-md">
                To become the world's most trusted and innovative ecommerce platform, empowering millions of businesses to thrive online while creating exceptional shopping experiences that delight customers globally.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-8xl mx-auto px-6 lg:px-14 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop" 
                alt="Our story"
                className="rounded-3xl shadow-xl w-full h-[420px] object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-5">
                OUR STORY
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                From Startup to <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Global Leader</span>
              </h2>
              <div className="space-y-6 text-md text-gray-600">
                <p>
                  Founded in 2018 by a team of passionate entrepreneurs, we started with a simple vision: make ecommerce accessible to everyone. What began as a small project in a garage has now grown into a global platform serving millions of users worldwide.
                </p>
                <p>
                  Through continuous innovation, customer feedback, and relentless dedication to excellence, we've built not just a platform, but a community of successful online businesses that trust us to power their growth.
                </p>
                <p>
                  Today, we're proud to be at the forefront of ecommerce technology, constantly pushing boundaries and setting new standards for what online commerce can achieve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Featured Clients Section */}
      <div className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50 border-t border-teal-100">
        <div className="max-w-8xl mx-auto px-6 lg:px-14">
          <h3 className="text-3xl lg:text-3xl font-bold text-center text-gray-900 mb-4">
            Trusted by <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Industry Leaders</span>
          </h3>
          <p className="text-md text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Join thousands of successful businesses who trust our platform to power their growth
          </p>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentClientsSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(clientLogos.length / 6) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                    {clientLogos.slice(slideIndex * 6, slideIndex * 6 + 6).map((client, index) => (
                      <div key={index} className="text-center group cursor-pointer">
                        <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                          <img 
                            src={client.logo} 
                            alt={client.name}
                            className="mx-auto h-12 object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clients Navigation Arrows */}
            <button 
              onClick={prevClientsSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-teal-50 transition-colors border-2 border-teal-100"
            >
              <ChevronLeft className="w-6 h-6 text-teal-600" />
            </button>
            <button 
              onClick={nextClientsSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-teal-50 transition-colors border-2 border-teal-100"
            >
              <ChevronRight className="w-6 h-6 text-teal-600" />
            </button>
          </div>

          {/* Clients Dots Indicator */}
          <div className="flex justify-center mt-10 space-x-3">
            {Array.from({ length: Math.ceil(clientLogos.length / 6) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentClientsSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentClientsSlide === index 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AboutPage;