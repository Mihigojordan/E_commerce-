import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Package } from 'lucide-react';
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
import categoryService, { type Category } from '../../../services/categoryService';
import { API_URL } from '../../../api/api';

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await categoryService.getAllCategories();
        // Filter active categories and remove duplicates by name
        const uniqueCategories = Array.from(
          new Map(fetchedCategories.filter(cat => cat.status === 'active').map(cat => [cat.name, cat])).values()
        );
        setCategories(uniqueCategories);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Loading State
  if (loading) {
    return (
      <div className="w-full py-12 px-4 bg-white">
        <div className="w-11/12 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-9 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl h-[250px] animate-pulse">
                <div className="bg-gray-200 w-full h-[150px] rounded-md mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mx-auto"></div>
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
      <div className="w-full py-12 px-4 bg-white">
        <div className="w-11/12 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="text-priamry-600">Popular</span>{' '}
              <span className="text-gray-800">Categories</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 rounded-2xl border-2 border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Categories</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-priamry-600 text-white rounded-lg hover:bg-priamry-700 transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div className="w-full py-12 px-4 bg-white">
        <div className="w-11/12 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              <span className="text-priamry-600">Popular</span>{' '}
              <span className="text-gray-800">Categories</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 px-4   ">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Categories Available</h3>
            <p className="text-gray-600 text-center max-w-md">
              We're currently updating our categories. Please check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success State with Categories
  return (
    <div className="w-full py-12 px-4 bg-white">
      <div className="w-11/12 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-priamry-600">Popular</span>{' '}
            <span className="text-gray-800">Categories</span>
          </h2>
          
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-priamry-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-priamry-600 hover:text-white transition-all duration-300 flex items-center justify-center group"
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
          className="category-swiper h-[300px]"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-primary-100 p-4 rounded-2xl w-[195px] h-[250px] text-center group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="mb-8 overflow-hidden w-full h-[150px] flex items-center justify-center">
                  {category.category_image ? (
                    <img 
                      src={`${API_URL}${category.category_image}`} 
                      alt={category.name} 
                      className="mx-auto w-[100%] h-[100%] object-cover rounded-md transform group-hover:scale-125 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-icon w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center';
                          fallback.innerHTML = `<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-priamry-50 to-priamry-100 rounded-md flex items-center justify-center">
                      <Package className="w-16 h-16 text-priamry-400" />
                    </div>
                  )}
                </div>
                <p className="text-gray-700 font-semibold text-sm">
                  {category.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}