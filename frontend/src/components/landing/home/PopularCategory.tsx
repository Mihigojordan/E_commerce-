import React from 'react';

import rings from '../../../assets/category-thumb-1.jpg';
import necklaces from '../../../assets/category-thumb-2.jpg';
import bracelets from '../../../assets/category-thumb-3.jpg';
import watches from '../../../assets/category-thumb-4.jpg';
import earrings from '../../../assets/category-thumb-5.jpg';
import handbags from '../../../assets/category-thumb-8.jpg';
import Bangles from '../../../assets/category-thumb-8.jpg';

function PopularCategory() {
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
      bgColor: 'bg-teal-100', 
      textColor: 'text-teal-700' 
    },
      { 
      title: 'Bangles', 
      image: Bangles, 
      bgColor: 'bg-teal-100', 
      textColor: 'text-orange-700' 
    },
  ];

  return (
    <div>

        <h1 className='p-2 mt-4 text-2xl  capitalize font-medium -mb-4 mx-8'> <span className='text-primary-600'> Popular</span> Category </h1>
    <div className="flex justify-center flex-wrap gap-4 p-4 py-6">
      {categories.map((category, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 p-4 rounded-lg shadow-md w-[195px] h-[280px] text-center"
        >
          <div className="mb-8">
            <img 
              src={category.image} 
              alt={category.title} 
              className="mx-auto w-[100%] h-[70%] object-contain rounded-md"
            />
          </div>
          <p className={`${category.textColor} font-semibold text-sm`}>
            {category.title}
          </p>
        </div>
      ))}
    </div>
    </div>
  );
}

export default PopularCategory;
