/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function LuxuryHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "EXCLUSIVE COLLECTION",
      heading: "Timeless Elegance",
      subHeading: "Handcrafted Excellence",
      description:
        "Discover our most coveted pieces, meticulously crafted for those who appreciate the finest things in life",
      buttonText: "Explore Collection",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    },
    {
      title: "HERITAGE COLLECTION",
      heading: "Diamond Mastery",
      subHeading: "Unparalleled Brilliance",
      description:
        "Each diamond tells a story of perfection, selected for exceptional clarity and fire",
      buttonText: "View Diamonds",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    },
    {
      title: "COUTURE JEWELRY",
      heading: "Bespoke Artistry",
      subHeading: "One-of-a-Kind Pieces",
      description:
        "Commission a masterpiece that reflects your unique vision and extraordinary taste",
      buttonText: "Begin Journey",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    },
  ];

  const luxuryOffers = [
    {
      category: "SIGNATURE RINGS",
      title: "Exceptional Diamonds",
      subtitle: "Starting from $15,000",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
    },
    {
      category: "HAUTE COUTURE",
      title: "Limited Edition",
      subtitle: "Exclusive Earrings",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 relative overflow-hidden  flex items-center">
      {/* Enhanced Background Pattern with Shimmer */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8860b' fill-opacity='1'%3E%3Cpath d='M40 40L20 60h40L40 40zm0-40L20 20h40L40 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
          {/* Main Hero Slider */}
          <div className="xl:col-span-2 relative">
            <div className=" md:h-[490px] rounded-3xl overflow-hidden relative shadow-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="h-full relative flex items-center justify-between p-6"
                >
                  {/* Background Image with enhanced overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${heroSlides[currentSlide].image})`,
                      filter: "brightness(1.1) contrast(1.05)",
                    }}
                  />
                  
                  {/* Sophisticated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />
                  
                  {/* Vignette effect */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className=" z-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mb-4"
                    >
                      <span className="inline-flex items-center text-xs font-semibold tracking-[4px] text-primary-400 bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-400/30">
                        {heroSlides[currentSlide].title}
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-6xl xl:text-7xl  font-light mb-2 leading-[1.1] text-white drop-shadow-2xl"
                    >
                      {heroSlides[currentSlide].heading}
                    </motion.h1>

                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-2xl xl:text-3xl font-light mb-6 text-primary-200/90 tracking-wide"
                    >
                      {heroSlides[currentSlide].subHeading}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-slate-100 mb-10 leading-relaxed font-light text-lg max-w-xl"
                    >
                      {heroSlides[currentSlide].description}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(217, 119, 6, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-10 py-4 md:mb-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium tracking-widest text-sm uppercase overflow-hidden transition-all duration-300 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/30 border border-primary-400/50"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {heroSlides[currentSlide].buttonText}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </motion.button>
                  </motion.div>

                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary-400/20 rounded-tl-3xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary-400/20 rounded-br-3xl" />
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Slide Indicators */}
              <div className="absolute bottom-8 left-12 flex items-center gap-4 bg-slate-900/40 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-700/50">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-500 rounded-full ${
                      index === currentSlide
                        ? "w-12 h-2 bg-gradient-to-r from-primary-500 to-primary-400 shadow-lg shadow-primary-500/50"
                        : "w-2 h-2 bg-slate-400 hover:bg-primary-300 hover:w-8"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Luxury Side Panels */}
          <div className="flex flex-col justify-center gap-3">
            {luxuryOffers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group  relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Premium hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>

                <div className="relative z-10 p-3">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-[3px] text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                      {offer.category}
                    </span>
                    <svg className="w-5 h-5 text-primary-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  <div className="relative w-full h-40 mb-2 rounded-xl overflow-hidden ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-primary-300 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent z-10" />
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary-400/0 group-hover:border-primary-400/30 rounded-tr-2xl transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LuxuryHeroSection;