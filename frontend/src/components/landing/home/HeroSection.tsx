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
    <div className="bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Hero Slider */}
          <div className="xl:col-span-2 relative">
            <div className="h-[600px] rounded-3xl overflow-hidden relative shadow-2xl bg-white border border-primary-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="h-full relative flex items-center justify-between p-12"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center rounded-3xl"
                    style={{
                      backgroundImage: `url(${heroSlides[currentSlide].image})`,
                    }}
                  />
                  {/* Overlay for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 via-white/40 to-primary-100/50 rounded-3xl" />

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-lg z-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mb-2"
                    >
                      <span className="text-xs font-medium tracking-[3px] text-primary-500 border-b border-primary-300 pb-1">
                        {heroSlides[currentSlide].title}
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-5xl xl:text-6xl font-light mb-3 leading-tight text-primary-900"
                    >
                      {heroSlides[currentSlide].heading}
                    </motion.h1>

                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-2xl xl:text-3xl font-light mb-6 text-primary-600"
                    >
                      {heroSlides[currentSlide].subHeading}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-primary-600 mb-8 leading-relaxed font-light"
                    >
                      {heroSlides[currentSlide].description}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-8 py-4 rounded-md bg-primary-900 text-white font-light tracking-wider text-sm uppercase overflow-hidden transition-all duration-300 hover:bg-primary-800 hover:shadow-xl"
                    >
                      <span className="relative z-10">
                        {heroSlides[currentSlide].buttonText}
                      </span>
                    </motion.button>
                  </motion.div>

                  {/* Subtle border */}
                  <div className="absolute inset-0 border-2 border-primary-200/50 rounded-3xl" />
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-12 flex space-x-3">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-12 h-1 transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-primary-800 shadow-lg shadow-primary-400/50"
                        : "bg-primary-300 hover:bg-primary-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Luxury Side Panels */}
          <div className="flex flex-col justify-center gap-12">
            {luxuryOffers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-white border-2 border-primary-100 rounded-2xl p-4 overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <span className="text-xs font-medium tracking-[2px] text-primary-400 border-b border-primary-200 pb-1 inline-block mb-2 -mt-8">
                    {offer.category}
                  </span>

                  <div className="relative w-full h-48 mb-2 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent z-10" />
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 border border-primary-100 rounded-xl"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LuxuryHeroSection;
