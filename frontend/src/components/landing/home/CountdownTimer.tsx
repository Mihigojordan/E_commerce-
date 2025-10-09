import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import banner2 from '../../../assets/images/banner/jewery5.jpg'
import banner3 from '../../../assets/images/banner/jewery6.jpg'

const PromoCard = ({ bgColor, badge, title, subtitle, price, originalPrice, days, hours, mins, secs, bgImage }) => {
  return (
    <div 
      className={`${bgColor} w-full rounded-lg overflow-hidden shadow-lg min-h-[400px] bg-cover bg-center bg-no-repeat relative`}
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent"></div>
      
      <div className="relative z-10 p-8 md:p-10 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-500">{badge}</h2>
        </div>
        <p className="text-sm text-gray-200 mb-4">Limited quantities.</p>
        
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
          {title}
        </h3>
        {subtitle && <p className="text-gray-300 mb-6">{subtitle}</p>}
        
        <div className="mb-6">
          <span className="text-3xl font-bold text-red-500">${price}</span>
          <span className="text-xl text-gray-200 line-through ml-3">${originalPrice}</span>
        </div>
        
        <p className="text-sm font-medium text-gray-300 mb-3">Hurry Up! Offer End In:</p>
        
        <div className="flex gap-2 mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-primary-700 text-white rounded-md w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{String(days).padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-gray-200 mt-1 uppercase">Days</span>
          </div>
          
          <div className="flex items-center justify-center text-2xl font-bold text-gray-200">:</div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary-700 text-white rounded-md w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{String(hours).padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-gray-200 mt-1 uppercase">Hours</span>
          </div>
          
          <div className="flex items-center justify-center text-2xl font-bold text-gray-300">:</div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary-700 text-white rounded-md w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{String(mins).padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-gray-200 mt-1 uppercase">Mins</span>
          </div>
          
          <div className="flex items-center justify-center text-2xl font-bold text-gray-300">:</div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary-700 text-white rounded-md w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{String(secs).padStart(2, '0')}</span>
            </div>
            <span className="text-xs text-gray-300 mt-1 uppercase">Sec</span>
          </div>
        </div>
        
        <button className="border-2 border-primary-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700 hover:text-white transition-colors flex items-center gap-2">
          Shop Now
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [timer1, setTimer1] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [timer2, setTimer2] = useState({ days: 5, hours: 7, mins: 11, secs: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer2(prev => {
        let { days, hours, mins, secs } = prev;
        
        if (secs > 0) {
          secs--;
        } else {
          secs = 59;
          if (mins > 0) {
            mins--;
          } else {
            mins = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
      <div className=" w-full flex justify-center bg-gray-50 p-4 md:p-8">
      <div className=" flex  flex-col lg:flex-row  justify-center gap-6 w-11/12 ">
        <PromoCard
          bgColor="bg-gradient-to-br from-gray-100 to-gray-200"
          badge="Deal of the Day."
          title="Summer Collection New Morden Design"
          subtitle=""
          price="139.00"
          originalPrice="160.99"
          days={timer1.days}
          hours={timer1.hours}
          mins={timer1.mins}
          secs={timer1.secs}
          bgImage={banner3} // Add your image URL here: bgImage="/path/to/your/image.jpg"
        />
        
        <PromoCard
          bgColor="bg-gradient-to-br from-cyan-100 to-blue-100"
          badge="Women Necklace"
          title="Try something new on vacation"
          subtitle="Rings & Necklaces"
          price="178.00"
          originalPrice="256.99"
          days={timer2.days}
          hours={timer2.hours}
          mins={timer2.mins}
          secs={timer2.secs}
          bgImage={banner2} // Add your image URL here: bgImage="/path/to/your/image.jpg"
        />
      </div>
    </div>
  );
};

export default CountdownTimer;