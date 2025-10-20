import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import testimonialService from '../../services/testmonialService'; // Adjust import path as needed

const Testimonials = () => {
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials from the database
 useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  fetchTestimonials();
}, []);

  // Testimonials slideshow functions
  const nextTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  };

  const prevTestimonialSlide = () => {
    setCurrentTestimonialSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3));
  };

  // Auto-slide functionality for testimonials
  useEffect(() => {
    if (testimonials.length === 0) return; // Skip if no testimonials
    const timer = setInterval(nextTestimonialSlide, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-8xl mx-auto px-14 lg:px-14">
        <div className="text-center mb-16">
          <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-4">
            TESTIMONIALS
          </div>
          <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Take a look what our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">clients say</span> about us
          </h2>
          <p className="text-md text-gray-600 max-w-3xl mx-auto text-md">
            Hear from our satisfied partners on how our ecommerce platform has boosted their online presence and transformed their business growth.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading testimonials...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center text-gray-600">No testimonials available.</div>
        ) : (
          <div className="relative">
            {/* Testimonials Slideshow */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {testimonials.slice(slideIndex * 3, slideIndex * 3 + 3).map((testimonial) => (
                        <div 
                          key={testimonial.id}
                          className="bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-center mb-6">
                            <img 
                              src={testimonial.profileImage || 'https://placehold.co/100x100?text=User'} 
                              alt={testimonial.fullName}
                              className="w-16 h-16 rounded-full object-cover mr-4 ring-4 ring-primary-100"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900 text-md">{testimonial.fullName}</h4>
                              <p className="text-primary-600 font-medium text-sm">{testimonial.position}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            "{testimonial.message}"
                          </p>
                          <div className="flex mt-4">
                            {[...Array(testimonial.rate)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-primary-50 transition-colors border-2 border-primary-100"
            >
              <ChevronLeft className="w-6 h-6 text-primary-600" />
            </button>
            <button 
              onClick={nextTestimonialSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-xl rounded-full p-4 hover:bg-primary-50 transition-colors border-2 border-primary-100"
            >
              <ChevronRight className="w-6 h-6 text-primary-600" />
            </button>

            {/* Testimonials Dots Indicator */}
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentTestimonialSlide === index 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;