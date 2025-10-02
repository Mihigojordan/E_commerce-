/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import banner2 from '../../../assets/images/banner-10.jpg';
import productService, { type Product } from '../../../services/ProductService';
import { API_URL } from '../../../api/api';

const ProductCard = ({ image, title, price, originalPrice }) => {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Image
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-teal-600">${price}</span>
          <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const PromoCard = ({ bgImage, badge, title, discount }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="relative h-full min-h-[400px] rounded-lg overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(135deg, #e0f2f1 0%, #fffff 100%)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="text-gray-700 font-medium mb-2">{badge}</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <button 
          onClick={() => navigate('/products')}
          className="bg-white text-teal-700 px-6 py-2 rounded-md font-semibold hover:bg-teal-700 hover:text-white transition-colors flex items-center gap-2 w-fit"
        >
          Shop Now
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState('deals');
  const [products, setProducts] = useState<{
    deals: Product[];
    selling: Product[];
    releases: Product[];
  }>({ deals: [], selling: [], releases: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'deals', label: 'Deals & Outlet' },
    { id: 'selling', label: 'Top Selling' },
    { id: 'releases', label: 'Hot Releases' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch products for each tab
        const [dealsData, sellingData, releasesData] = await Promise.all([
          productService.getAllProducts({ tags: ['Sale'], limit: 3 }),
          productService.getAllProducts({ tags: ['Top'], limit: 3 }),
          productService.getAllProducts({ tags: ['New'], limit: 3 })
        ]);

        setProducts({
          deals: dealsData.data,
          selling: sellingData.data,
          releases: releasesData.data
        });
      } catch (err: any) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateDiscountedPrice = (product: Product) => {
    return product.discount && product.discount > 0 
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Promo Card */}
          <div className="lg:col-span-1">
            <PromoCard
              bgImage={banner2}
              badge="Shoes Zone"
              title="Save 17% on All Items"
              discount="17%"
            />
          </div>

          {/* Right Tabs Section */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-gray-800'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products[activeTab].length === 0 ? (
                <div className="text-center py-8 col-span-full">
                  <p className="text-lg font-medium text-gray-900 mb-2">No products available</p>
                  <p className="text-sm text-gray-500">Check back later for new products.</p>
                </div>
              ) : (
                products[activeTab].map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.images[0] ? `${API_URL}${product.images[0]}` : ''}
                    title={product.name}
                    price={calculateDiscountedPrice(product)}
                    originalPrice={product.price.toFixed(2)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabsSection;