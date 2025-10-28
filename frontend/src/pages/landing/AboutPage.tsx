import React, { useState } from 'react';
import {  Trophy, ArrowUp, Award, Target, Zap, Shield } from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';
import TestimonialSection from '../../components/landing/home/Testimonials';

const AboutPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentClientsSlide] = useState(0);

  


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
                ELEGANCE • TRUST • AUTHENTICITY
              </div>
              <h1 className="text-4xl lg:text-4xl font-bold text-gray-900 leading-loose mb-8">
                Timeless Jewelry, Crafted For Your Most Beautiful Moments
              </h1>
              <div className="space-y-6 text-md text-gray-600 leading-loose">
                <p>
                  Founded in 2008 by <strong>Nsengiyunva Vincent</strong>, Peace Bijouteri began as a small jewelry shop in the heart of Kigali, Rwanda. Built on passion, precision, and elegance, it has grown into one of the city’s most trusted destinations for authentic gold, diamond, and luxury jewelry.
                </p>
                <p>
                  Every piece in our collection tells a story — crafted with care, designed for beauty, and made to last. From timeless gold rings to elegant diamond accessories, Peace Bijouteri offers the perfect balance of quality, originality, and sophistication.
                </p>
                <p>
                  Our mission is simple — to help you celebrate life’s most beautiful moments with jewelry that shines as bright as your story.
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
              Elegant craftsmanship, honest guidance, and lasting value you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-md leading-loose">
                To help you celebrate life’s most meaningful moments with authentic, beautifully crafted jewelry — designed to be worn, loved, and passed on.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-loose text-md">
                To be Kigali’s most trusted destination for fine jewelry — where elegance meets authenticity, and every customer feels confident and valued.
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
                Established in 2008 — Built on Craftsmanship and Trust
              </h2>
              <div className="space-y-6 text-md text-gray-600">
                <p>
                  In 2008, <strong>Nsengiyunva Vincent</strong> opened Peace Bijouteri with a clear purpose: to bring authentic, high‑quality jewelry to Kigali with honesty and care. What began as a small boutique has become a trusted name for gold, diamond, and luxury accessories.
                </p>
                <p>
                  Our pieces are chosen and crafted with attention to detail — from elegant rings and necklaces to timeless gifts made to celebrate engagements, anniversaries, and milestones.
                </p>
                <p>
                  Visit us at <strong>28 KN 84 St, Kigali</strong> and experience the essence of elegance and craftsmanship.
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