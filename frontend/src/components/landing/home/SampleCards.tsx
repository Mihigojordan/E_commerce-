import React from 'react';

import image1 from '../../../assets/feature-1.png'
import image2 from '../../../assets/feature-2.png'
import image3 from '../../../assets/feature-3.png'
import image4 from '../../../assets/feature-4.png'
import image5 from '../../../assets/feature-5.png'
import image6 from '../../../assets/feature-6.png'


function SampleCards() {
  const cards = [
    { 
      title: 'Authentic Materials', 
      image:image1, // replace with your real image path
      bgColor: 'bg-pink-100', 
      textColor: 'text-teal-700' 
    },
    { 
      title: 'Trusted Since 2008', 
      image: image2, 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-700' 
    },
    { 
      title: 'Premium Craftsmanship', 
      image: image3, 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-700' 
    },
    { 
      title: 'Elegant Gifting', 
      image: image4, 
      bgColor: 'bg-purple-100', 
      textColor: 'text-purple-700' 
    },
    { 
      title: 'Timeless Design', 
      image: image5, 
      bgColor: 'bg-pink-100', 
      textColor: 'text-pink-700' 
    },
    { 
      title: 'Personalized Service', 
      image: image6, 
      bgColor: 'bg-teal-100', 
      textColor: 'text-teal-700' 
    },
  ];

  return (
    <div className="flex justify-between space-x-4 p-2 flex-wrap py-6 px-12 ">
      {cards.map((card, index) => (
        <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg shadow-md w-[230px] h-[200px] text-center">
      

          {/* Image instead of icon */}
          <div className="mb-4">
            <img src={card.image} alt={card.title} className="mx-auto w-[80%] h-[70%] object-contain"/>
          </div>
              {/* Title holder with background color */}
          <div className={`${card.bgColor} p-2 rounded mb-2`}>
            <p className={`${card.textColor} font-semibold text-sm`}>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SampleCards;
