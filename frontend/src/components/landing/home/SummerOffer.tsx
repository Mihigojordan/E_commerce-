import React from 'react';

function SummerOffer() {
  const cards = [
    {
      title: 'primary Quartz Blush',
      description: 'Delicate primary quartz pieces with soft pink elegance!',
      gradient: 'from-pink-100 via-pink-200 to-primary-300',
      buttonColor: 'text-primary-600',
      accent: 'border-pink-200',
    },
    {
      title: 'Coral Sunset',
      description: 'Warm coral and peach tones for summer radiance!',
      gradient: 'from-orange-100 via-peach-200 to-orange-300',
      buttonColor: 'text-orange-600',
      accent: 'border-orange-200',
    },
    {
      title: 'Lavender Dreams',
      description: 'Soft lavender gemstones with ethereal purple hues!',
      gradient: 'from-purple-100 via-lavender-200 to-purple-300',
      buttonColor: 'text-purple-600',
      accent: 'border-purple-200',
    },
  ];

  return (
    <div className=" bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 p-2 ">
      <div className="max-w-8xl">
      
        
        <div className="flex flex-wrap justify-center gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative w-[470px] h-[230px] p-8 text-primary-800 shadow-2xl transform transition-all duration-300 hover:-translate-y-4 hover:shadow-3xl bg-gradient-to-br ${card.gradient} rounded-2xl border-2 ${card.accent} backdrop-blur-sm overflow-hidden group`}
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary-400/50"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary-400/50"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg">
                  {card.title}
                </h2>
                <p className="mb-8 text-md font-light leading-relaxed opacity-90">
                  {card.description}
                </p>
                <button
                  className={`group/btn px-8 py-1 text-lg font-bold rounded-full bg-white/95 backdrop-blur-sm ${card.buttonColor} hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20`}
                >
                  <span className="flex items-center gap-2">
                    Explore Collection
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                  </span>
                </button>
              </div>
       
         </div>
          ))}
        </div>
    
      </div>
    </div>
  );
}

export default SummerOffer;