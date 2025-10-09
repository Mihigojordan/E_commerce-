import React from 'react';
import { ArrowRight } from 'lucide-react';
import watches from '../../../assets/images/banner/jewery7.jpg';
import earrings from '../../../assets/images/banner/banner3.jpg';
import handbags from '../../../assets/images/banner/banner4.jpg';



const PromoCards = () => {
  const promoData = [
    {
      id: 1,
      label: 'Smart Offer',
      title: 'Save 20% on Woman Watches',
      textColor: 'text-purple-900',
      labelColor: 'text-purple-600',
      buttonColor: 'text-primary-600',
      bgImage: watches // Add your background image path here
    },
    {
      id: 2,
      label: 'Sale off',
      title: 'Great Summer Collection',
      textColor: 'text-blue-900',
      labelColor: 'text-blue-600',
      buttonColor: 'text-primary-600',
      bgImage: earrings // Add your background image path here
    },
    {
      id: 3,
      label: 'New Arrivals',
      title: "Shop Today's Deals & Offers",
      textColor: 'text-orange-900',
      labelColor: 'text-orange-600',
      buttonColor: 'text-primary-600',
      bgImage: handbags // Add your background image path here
    }
  ];

  return (
    <div className="w-full pb-12 flex justify-center px-4 bg-white">
      <div className=" w-11/12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoData.map((promo) => (
            <div
              key={promo.id}
              className=" p-8 relative overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer min-h-[220px] flex flex-col justify-between"
              style={{
                backgroundImage: promo.bgImage ? `url(${promo.bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: promo.bgImage ? 'transparent' : '#f3f4f6'
              }}
            >
                          <div className="absolute inset-0 bg-gradient-to-r  from-primary-800/30 via-black/60 to-transparent"></div>
              <div className="relative z-10">
                <p className={`${promo.labelColor} text-sm font-medium mb-2`}>
                  {promo.label}
                </p>
                <h3 className={`${promo.textColor} text-2xl font-bold mb-6 leading-tight max-w-[200px]`}>
                  {promo.title}
                </h3>
                <button className={`${promo.buttonColor} font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300`}>
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Placeholder text when no background image */}
              {!promo.bgImage && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <p className="text-sm font-medium text-gray-500">Add background image</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCards;