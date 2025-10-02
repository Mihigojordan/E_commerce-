/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import productService, { type Product } from '../../../services/ProductService';
import { API_URL } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState('New added');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs = ['Featured', 'Popular', 'New added'];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let params: any = { limit: 8 };
      
      // Adjust sorting based on active tab
      if (activeTab === 'Featured') {
        params.sortBy = 'review';
        params.sortOrder = 'desc';
      } else if (activeTab === 'Popular') {
        params.sortBy = 'sales';
        params.sortOrder = 'desc';
      } else {
        params.sortBy = 'createdAt';
        params.sortOrder = 'desc';
      }

      const response = await productService.getAllProducts(params);
      setProducts(response.data);
    } catch (err: any) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number | undefined) => {
    const normalizedRating = rating ? (rating / 5) * 100 : 0; // Convert 0-5 rating to 0-100%
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${index < Math.floor(normalizedRating / 20) ? 'fill-primary-400 text-primary-400' : 'fill-gray-300 text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="text-xs text-primary-700 ml-1">{normalizedRating}%</span>
      </div>
    );
  };

  const getBadge = (product: Product) => {
    if (product.discount && product.discount > 0) {
      return { text: `-${product.discount}%`, color: 'bg-pink-500' };
    }
    if (new Date(product.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) {
      return { text: 'New', color: 'bg-primary-400' };
    }
    if (product.review && product.review >= 4.5) {
      return { text: 'Best Sell', color: 'bg-orange-400' };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-4 bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-4 bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 bg-gradient-to-br min-h-[50vh] from-slate-50 via-primary-50/30 to-slate-100 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8860b' fill-opacity='1'%3E%3Cpath d='M40 40L20 60h40L40 40zm0-40L20 20h40L40 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="w-11/12 mx-auto relative z-10">
        {/* Tabs and View More */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/30'
                    : 'text-slate-100 hover:bg-primary-300/50 hover:text-primary-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <motion.button
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(217, 119, 6, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 text-primary-600 font-medium tracking-widest text-sm uppercase hover:text-primary-700 transition-all duration-300"
          >
            <span>View More</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl  font-medium text-slate-900 mb-2">No Products Available</p>
            <p className="text-sm text-primary-700 tracking-wide">Check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((product) => {
                const badge = getBadge(product);
                const discountedPrice = product.discount && product.discount > 0 
                  ? product.price * (1 - product.discount / 100)
                  : product.price;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                    className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Premium hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>

                    {/* Product Image */}
                    <div className="relative bg-gray-100 p-6 h-72 flex items-center justify-center ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-primary-300 transition-all duration-300">
                      {badge && (
                        <span className={`absolute top-4 left-4 ${badge.color} text-white text-xs font-bold px-3 py-1.5 rounded-full border border-${badge.color.replace('bg-', '')}-300/50 shadow-sm`}>
                          {badge.text}
                        </span>
                      )}
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`${API_URL}${product.images[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center text-primary-600 font-medium">
                          <p className="text-sm">Product Image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent z-10" />
                    </div>

                    {/* Product Details */}
                    <div className="p-6 relative z-10">
                      <p className="text-xs text-primary-600 font-medium tracking-[2px] mb-2">{product.brand}</p>
                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-lg  font-medium text-slate-900 mb-2 hover:text-primary-800 transition-colors duration-300 cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      {renderStars(product.review)}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-primary-600 font-bold text-lg">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {!!product.discount && !!product.discount > 0 && (
                            <span className="text-slate-400 line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(217, 119, 6, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary-500/30"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary-400/0 group-hover:border-primary-400/30 rounded-tr-2xl transition-all duration-500" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;