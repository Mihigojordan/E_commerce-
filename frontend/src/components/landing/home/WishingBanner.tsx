import React from 'react';
import BannerImage from '../../../assets/highlights/IMGE1711.JPG';

function WishingBanner() {
  return (
    <div
      className="relative min-h-48 bg-fixed overflow-hidden bg-gradient-to-br from-pink-50 via-primary-50 to-yellow-50 bg-cover bg-center w-[95%] m-auto border-none rounded-lg"
      style={{ backgroundImage: `url(${BannerImage})`, }}
    >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Scattered dots */}
        <div className="absolute top-12 right-96 w-2 h-2 bg-primary-300 rounded-full opacity-60"></div>
        <div className="absolute top-20 right-80 w-3 h-3 bg-primary-400 rounded-full opacity-40"></div>
        <div className="absolute top-32 right-72 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute top-16 right-64 w-2.5 h-2.5 bg-primary-300 rounded-full opacity-45"></div>
        <div className="absolute top-24 right-56 w-1 h-1 bg-yellow-500 rounded-full opacity-60"></div>
        <div className="absolute top-36 right-48 w-2 h-2 bg-primary-400 rounded-full opacity-35"></div>

        {/* Abstract line drawings */}
        <svg className="absolute bottom-0 left-0 w-64 h-64 text-gray-300 opacity-30" viewBox="0 0 200 200" fill="none">
          <path d="M20 150 Q60 120 100 150 T180 140" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M10 170 Q50 140 90 170 T170 160" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <ellipse cx="40" cy="160" rx="15" ry="25" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-20 40 160)"/>
        </svg>

        <svg className="absolute top-0 right-0 w-48 h-48 text-gray-300 opacity-25" viewBox="0 0 150 150" fill="none">
          <path d="M120 20 Q90 50 120 80 T110 140" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M100 30 Q70 60 100 90 T90 150" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-6 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-primary-500 font-medium text-lg tracking-wide">
    Shop Today’s Deals
              </p>
              <h1 className="text-4xl lg:text-2xl xl:text-3xl font-bold text-gray-100 leading-tight">
         Happy Mother's Day. Big Sale Up to 40%
                <br />
            </h1>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default WishingBanner;