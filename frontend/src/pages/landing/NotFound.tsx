import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, ArrowLeft, Package, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-green-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-gray-200 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-400 animate-bounce" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lost Your Sparkle?
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for has wandered off into the jewelry vault. Let's get you back to the collection.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-green-600 hover:from-primary-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/product')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Now
              </button>
              <button
                onClick={() => navigate('/product')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <Search className="w-4 h-4" />
                Search Products
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  );
}