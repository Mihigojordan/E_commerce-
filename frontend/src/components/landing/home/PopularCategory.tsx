import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Import images
import rings from '../../../assets/category-thumb-1.jpg';
import necklaces from '../../../assets/category-thumb-2.jpg';
import bracelets from '../../../assets/category-thumb-3.jpg';
import watches from '../../../assets/category-thumb-4.jpg';
import earrings from '../../../assets/category-thumb-5.jpg';
import handbags from '../../../assets/category-thumb-8.jpg';
import Bangles from '../../../assets/category-thumb-8.jpg';

const categories = [
  {
    title: 'Rings',
    image: rings,
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700'
  },
  {
    title: 'Necklaces',
    image: necklaces,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  {
    title: 'Bracelets',
    image: bracelets,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  {
    title: 'Watches',
    image: watches,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  {
    title: 'Earrings',
    image: earrings,
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  {
    title: 'Luxury Handbags',
    image: handbags,
    bgColor: 'bg-primary-100',
    textColor: 'text-primary-700'
  },
  {
    title: 'Bangles',
    image: Bangles,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  },
  {
    title: 'Bangles',
    image: Bangles,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  }
];

export default function PopularCategories() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full py-12 px-4 bg-white">
      <div className="w-11/12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-primary-600">Popular</span>{' '}
            <span className="text-gray-800">Categories</span>
          </h2>
          
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
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
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 20,
            },
          }}
          className="category-swiper h-[300px] "
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-primary-100 p-4 rounded-2xl  w-[195px] h-[250px] text-center group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8 overflow-hidden w-full ">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="mx-auto w-[100%] h-[100%] object-contain rounded-md transform group-hover:scale-125 transition-transform duration-500"
                  />
                </div>
                <p className={`${category.textColor} font-semibold text-sm`}>
                  {category.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}