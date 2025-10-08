import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import productService, { type Product } from '../../services/ProductService';

interface SearchBarProps {
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        search: searchQuery,
        limit: 5, // Show only 5 suggestions
        page: 1,
      });
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

 const handleSearch = () => {
  if (searchQuery.trim()) {
    // Get current params and add search
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('search', searchQuery.trim());
    currentParams.set('page', '1'); // Reset to page 1
    
    navigate(`/products?${currentParams.toString()}`);
    setShowSuggestions(false);
    setSearchQuery('');
  }
};

  const handleSuggestionClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-2xl mx-8'}`} ref={searchRef}>
      <div className="relative flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for items..."
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-l-lg focus:outline-none focus:border-primary-500 transition-colors pr-10"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}

        <button
          onClick={handleSearch}
          className="bg-primary-600 text-white px-6 py-2 rounded-r-lg hover:bg-primary-700 transition-colors duration-300 flex items-center space-x-2"
        >
          <Search size={20} />
          {!isMobile && <span className="hidden lg:block">Search</span>}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {/* Suggestions List */}
              <div className="py-2">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.id)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Search size={20} />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{product.brand}</p>
                        <span className="text-xs text-gray-300">•</span>
                        <p className="text-sm font-semibold text-primary-600">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Availability Badge */}
                    <div className="flex-shrink-0">
                      {product.availability ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Results */}
              <div className="border-t border-gray-200">
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-center text-sm text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;