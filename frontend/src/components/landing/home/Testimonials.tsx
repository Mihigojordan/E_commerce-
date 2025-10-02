/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Users } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import testimonialService, { type Testimonial } from '../../../services/testmonialService';
import { API_URL } from '../../../api/api';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl p-8 shadow-sm border border-primary-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[230px] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden ring-4 ring-primary-100">
            {testimonial.profileImage ? (
              <img
                src={`${API_URL}${testimonial.profileImage}`}
                alt={testimonial.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-initials')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-initials w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-cyan-500 text-white text-lg font-bold';
                    fallback.textContent = testimonial.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-cyan-500 text-white text-lg font-bold">
                {testimonial.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-md font-bold text-gray-900">{testimonial.fullName}</h4>
            <p className="text-primary-600 font-medium text-sm">{testimonial.position}</p>
          </div>
        </div>
        
        <div 
          className="text-gray-600 leading-relaxed text-sm mb-4 line-clamp-4"
          dangerouslySetInnerHTML={{__html: testimonial.message ? `${testimonial.message}` : '"Thank you for your excellent service!"'}}
        />
      </div>
      
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(testimonial.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const testimonialData = await testimonialService.getAllTestimonials();
        setTestimonials(testimonialData);
      } catch (err: any) {
        setError('Failed to load testimonials. Please try again later.');
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="w-full py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-14">
          <div className="text-center mb-16">
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 h-[280px] animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-14">
          <div className="text-center mb-16">
            <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              Take a look what our <span className="bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">clients say</span> about us
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border-2 border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Testimonials</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-cyan-600 text-white rounded-full hover:from-primary-700 hover:to-cyan-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (testimonials.length === 0) {
    return (
      <div className="w-full py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-14">
          <div className="text-center mb-16">
            <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6">
              Take a look what our <span className="bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">clients say</span> about us
            </h2>
            <p className="text-md text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied partners on how our ecommerce platform has boosted their online presence and transformed their business growth.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl border-2 border-primary-100">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Testimonials Yet</h3>
            <p className="text-gray-600 text-center max-w-md text-lg">
              We're collecting feedback from our valued customers. Check back soon to see what they have to say!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success State with Testimonials
  return (
    <div className="w-full py-24 px-4 bg-white">
      <div className="w-11/12 mx-auto px-4 lg:px-14">
        <div className="text-center mb-16">
          <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-4">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Take a look what our <span className="bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">clients say</span> about us
          </h2>
          <p className="text-md text-gray-600 max-w-3xl mx-auto text-md">
            Hear from our satisfied partners on how our ecommerce platform has boosted their online presence and transformed their business growth.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            loop={testimonials.length > 3}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="testimonial-swiper min-h-[260px]"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <>
              <button
                ref={prevRef}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-xl rounded-full p-4 hover:bg-primary-50 transition-all duration-300 border-2 border-primary-100 hover:border-primary-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-primary-600" />
              </button>
              <button
                ref={nextRef}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-xl rounded-full p-4 hover:bg-primary-50 transition-all duration-300 border-2 border-primary-100 hover:border-primary-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-primary-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;