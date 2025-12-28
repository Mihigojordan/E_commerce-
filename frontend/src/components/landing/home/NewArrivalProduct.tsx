/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import productService, { type Product } from '../../../services/ProductService';
import { API_URL } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NewArrivalProduct: React.FC = () => {
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs = ['Featured', 'Popular', 'New Arrivals'];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let params: any = { limit: 6 }; // Limit to 6 products for a 3x2 grid

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

      // ✅ Handle different response structures safely
      const productsData =
        Array.isArray(response.data)
          ? response.data
          : response.data?.products ||
            response.products ||
            response.items ||
            [];

      setProducts(productsData);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load new arrivals. Please try again later.');
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
            className={`w-4 h-4 ${
              index < Math.floor(normalizedRating / 20)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="text-xs text-gray-700 ml-1">
          {normalizedRating.toFixed(0)}%
        </span>
      </div>
    );
  };

  const getBadge = (product: Product) => {
    if (product.discount && product.discount > 0) {
      return { text: `-${product.discount}%`, color: 'bg-pink-500' };
    }
    if (
      new Date(product.createdAt) >
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    ) {
      return { text: 'New', color: 'bg-primary-500' };
    }
    if (product.review && product.review >= 4.5) {
      return { text: 'Best Seller', color: 'bg-orange-400' };
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
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2326a69a' fill-opacity='1'%3E%3Cpath d='M40 40L20 60h40L40 40zm0-40L20 20h40L40 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="w-11/12 mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              <span className="text-primary-600">New</span> Arrivals
            </h2>
            <div className="flex gap-2 bg-slate-900/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-lg shadow-primary-500/30'
                      : 'text-slate-100 hover:bg-primary-300/50 hover:text-primary-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <motion.button
            onClick={() => navigate('/products')}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 10px 20px rgba(38, 166, 154, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 text-primary-600 font-medium tracking-widest text-sm uppercase hover:text-primary-700 transition-all duration-300"
          >
            <span>View More</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Empty State */}
        {!Array.isArray(products) || products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl font-medium text-slate-900 mb-2">
              No New Arrivals Available
            </p>
            <p className="text-sm text-primary-700 tracking-wide">
              Check back later for new products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <AnimatePresence>
              {products.map((product) => {
                const badge = getBadge(product);
                const discountedPrice =
                  product.discount && product.discount > 0
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
                    {/* Product Image */}
                    <div className="relative bg-gray-100 p-6 h-48 flex items-center justify-center ring-1 ring-slate-200 group-hover:ring-2 group-hover:ring-primary-300 transition-all duration-300">
                      {badge && (
                        <span
                          className={`absolute top-3 left-3 ${badge.color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm`}
                        >
                          {badge.text}
                        </span>
                      )}
                      {!product.availability && (
                        <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 z-10">
                          Out of Stock
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
                          <p className="text-sm">No Image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4 relative z-10">
                      <p className="text-xs text-primary-600 font-medium tracking-[2px] mb-2">
                        {product.brand || 'Unknown Brand'}
                      </p>
                      <h3
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-sm font-medium text-slate-900 mb-2 hover:text-primary-800 transition-colors duration-300 cursor-pointer line-clamp-2 min-h-[2.5rem]"
                      >
                        {product.name}
                      </h3>
                      {renderStars(product.review)}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-primary-600 font-bold text-lg">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {product.discount && product.discount > 0 && (
                            <span className="text-gray-400 line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            boxShadow:
                              '0 10px 20px rgba(38, 166, 154, 0.3)',
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary-500/30"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
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

export default NewArrivalProduct;
