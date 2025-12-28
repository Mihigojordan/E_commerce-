import React, { useState } from 'react';
import {  Trophy, ArrowUp, Award, Target, Gem, Crown } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';
import TestimonialSection from '../../components/landing/home/Testimonials';

const AboutPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentClientsSlide] = useState(0);

  


  // Features data
  const features = [
    {
      icon: Gem,
      title: "Authentic Gold & Diamonds",
      description: "Every piece is certified authentic with guaranteed quality and purity standards."
    },
    {
      icon: Crown,
      title: "Handcrafted Excellence",
      description: "Meticulously crafted jewelry pieces designed for elegance and lasting beauty."
    },
    {
      icon: Target,
      title: "Personalized Service",
      description: "Dedicated assistance to help you find the perfect piece for every special moment."
    },
    {
      icon: Award,
      title: "Trusted Since 2008",
      description: "Over 15 years of excellence serving customers in Kigali with premium jewelry."
    }
  ];



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBanner
        title="About Peace Bijouteri"
        subtitle="Home / About"
        backgroundStyle="image"
      />

      {/* Main About Section with Gradient */}
      <div className="py-10 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-8xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-12">
            <div>
              <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-5">
                PEACE BIJOUTERI
              </div>
              <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 leading-loose mb-8">
                Crafting Elegance Since 
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> 2008</span> - Your Trusted Jewelry Destination
              </h1>
              <div className="space-y-6 text-md text-gray-600 leading-loose">
                <p>
                  Founded in 2008 by Nsengiyunva Vincent, Peace Bijouteri began as a small jewelry shop in the heart of Kigali, Rwanda. Built on passion, precision, and elegance, it quickly grew into one of the city's most trusted destinations for authentic gold, diamond, and luxury jewelry.
                </p>
                <p>
                  Every piece in our collection tells a story — crafted with care, designed for beauty, and made to last. From timeless gold rings to elegant diamond accessories, Peace Bijouteri offers customers the perfect balance of quality, originality, and sophistication.
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
              Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Promise</span>
            </h2>
            <p className="text-md text-gray-600 max-w-3xl mx-auto">
              Celebrating life's most beautiful moments with jewelry that shines as bright as your story.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-md leading-loose">
                To help you celebrate life's most beautiful moments with jewelry that shines as bright as your story. We are committed to providing authentic, high-quality jewelry pieces that reflect elegance, trust, and authenticity in every design.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-loose text-md">
                To be Rwanda's premier destination for authentic luxury jewelry, known for our craftsmanship, integrity, and the ability to create pieces that become treasured family heirlooms passed down through generations.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
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
      <div className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
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
              <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-5">
                OUR STORY
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
                From Humble Beginnings to <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Kigali's Jewelry Excellence</span>
              </h2>
              <div className="space-y-6 text-md text-gray-600">
                <p>
                  Founded in 2008 by Nsengiyunva Vincent, Peace Bijouteri began as a small jewelry shop in the heart of Kigali, Rwanda. What started as a passion for fine jewelry and craftsmanship has grown into one of the city's most trusted destinations for authentic gold, diamond, and luxury jewelry pieces.
                </p>
                <p>
                  Through dedication to quality, authenticity, and personalized service, we've built lasting relationships with customers who trust us to help them celebrate life's most precious moments. Every piece we offer is carefully selected and crafted to meet our high standards of excellence.
                </p>
                <p>
                  Today, we're proud to continue our legacy of providing exceptional jewelry pieces that combine traditional craftsmanship with modern elegance, ensuring that each customer finds the perfect piece to tell their unique story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Featured Clients Section */}
    

      {/* Floating Action Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AboutPage;