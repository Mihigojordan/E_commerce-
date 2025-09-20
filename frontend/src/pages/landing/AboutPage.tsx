import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, Trophy, Globe, ShoppingBag, Heart, CheckCircle, Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';

const AboutPage = () => {
  const [currentClientsSlide, setCurrentClientsSlide] = useState(0);
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);

  // Team members data - updated roles for ecommerce theme
  const teamMembers = [
    {
      name: "Patric Adams",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
    },
    {
      name: "Dilan Specter",
      role: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
    },
    {
      name: "Tomas Baker",
      role: "Senior Ecommerce Strategist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
    },
    {
      name: "Norton Mendos",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"
    }
  ];

  // Testimonials data - updated for ecommerce theme
  const testimonials = [
    {
      name: "J. Bezos",
      company: "Amazon Inc",
      text: "This platform revolutionized our online sales with seamless integration and user-friendly features. Highly recommended for any ecommerce business.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "B. Gates",
      company: "Microsoft Stores",
      text: "The best ecommerce solution we've used. Excellent customer support and vast product management tools.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      featured: true
    },
    {
      name: "B. Meyers",
      company: "Shopify Experts",
      text: "Transformed our online store with powerful analytics and easy customization. A game-changer for ecommerce.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "J. Bezos",
      company: "Amazon Inc",
      text: "This platform revolutionized our online sales with seamless integration and user-friendly features. Highly recommended for any ecommerce business.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "J. Bezos",
      company: "Amazon Inc",
      text: "This platform revolutionized our online sales with seamless integration and user-friendly features. Highly recommended for any ecommerce business.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "J. Bezos",
      company: "Amazon Inc",
      text: "This platform revolutionized our online sales with seamless integration and user-friendly features. Highly recommended for any ecommerce business.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
  ];

  // Updated Client logos with image URLs instead of text
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

  // Clients slideshow functions
  const nextClientsSlide = () => {
    setCurrentClientsSlide((prev) => (prev + 1) % Math.ceil(clientLogos.length / 6));
  };

  const prevClientsSlide = () => {
    setCurrentClientsSlide((prev) => (prev - 1 + Math.ceil(clientLogos.length / 6)) % Math.ceil(clientLogos.length / 6));
  };

  // Testimonials slideshow functions
  const nextTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  };

  const prevTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3));
  };

  // // Auto-slide functionality for clients
  // useEffect(() => {
  //   const timer = setInterval(nextClientsSlide, 3500);
  //   return () => clearInterval(timer);
  // }, []);

  // Auto-slide functionality for testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonialSlide, 5000);
    return () => clearInterval(timer);
  }, []);

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
      {/* Mission Section - Updated for ecommerce */}
      <div className=" pt-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-5 ">
                OUR COMPANY
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-8">
                We are Building The Ultimate Ecommerce Platform For Seamless Shopping
              </h1>
              <div className="space-y-6 text-md text-gray-600">
                <p>
                  Our platform offers a vast selection of products from top brands, with fast delivery and secure payments.
                </p>
                <p>
                  We focus on providing an exceptional online shopping experience, from browsing to checkout, ensuring customer satisfaction every step of the way.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=400&fit=crop" 
                  alt="Team celebration"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
              <div className="space-y-6 pt-12">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=400&fit=crop" 
                  alt="Team meeting"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - Minor updates */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-4">
                OUR TEAM
              </div>
              <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
                Top team of experts
              </h2>
              <p className="text-md text-gray-600 max-w-2xl">
                Our dedicated team drives innovation in ecommerce, delivering top-notch solutions for online businesses.
              </p>
            </div>
            <button className="hidden lg:block px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-colors">
              All Members
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-teal-600 font-medium mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3">
                    <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
                    <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - Updated to show three cards per slide */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto">
              Take a look what our clients say about us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied partners on how our ecommerce platform has boosted their online presence.
            </p>
          </div>
          
          <div className="relative">
            {/* Testimonials Slideshow - Three cards per slide */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial, index) => (
                        <div 
                          key={index}
                          className={`bg-gray-50 rounded-2xl p-8 ${
                            testimonial.featured 
                              ? 'border-2 border-teal-500 transform lg:scale-105 shadow-xl bg-white' 
                              : 'shadow-lg'
                          }`}
                        >
                          <div className="flex items-center mb-6">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                              <p className="text-teal-600 text-sm">{testimonial.company}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            "{testimonial.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Navigation */}
            <button 
              onClick={prevTestimonialSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={nextTestimonialSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Testimonials Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonialSlide === index ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Clients Section - Updated with images */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            <span className="text-teal-600">Featured</span> Clients
          </h3>
          
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
                        <img 
                          src={client.logo} 
                          alt={client.name}
                          className="mx-auto h-12 object-contain group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Clients Navigation Arrows */}
            <button 
              onClick={prevClientsSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={nextClientsSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Clients Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(clientLogos.length / 6) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentClientsSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentClientsSlide === index ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-3 rounded-lg shadow-lg hover:bg-teal-700 transition-colors z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AboutPage;