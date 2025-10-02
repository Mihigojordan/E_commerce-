/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import testimonialService, { type Testimonial } from '../../../services/testmonialService';
import { API_URL } from '../../../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 min-h-[200px] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
            {testimonial.profileImage ? (
              <img
                src={`${API_URL}${testimonial.profileImage}`}
                alt={testimonial.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                {testimonial.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{testimonial.fullName}</h4>
            <p className="text-xs text-gray-500">{testimonial.position}</p>
          </div>
        </div>
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(testimonial.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600 line-clamp-4" 
        dangerouslySetInnerHTML={{__html:testimonial.message || 'Thank you for your service'}}
        />
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

  if (loading) {
    return (
      <div className="w-full py-12 px-4 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-4 bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 bg-gray-50">
      <div className="w-11/12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-teal-600">What Our</span>{' '}
            <span className="text-gray-800">Customers Say</span>
          </h2>
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-teal-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-gray-900 mb-2">No testimonials available</p>
            <p className="text-sm text-gray-500">Check back later for customer feedback.</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
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
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide  key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TestimonialSection;