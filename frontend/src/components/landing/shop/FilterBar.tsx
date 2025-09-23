import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Filter, Search, X } from 'lucide-react';

interface ProductFilters {
  category?: string;
  brand?: string;
  availability?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  size?: string;
}

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  minPriceInput: string;
  setMinPriceInput: (value: string) => void;
  maxPriceInput: string;
  setMaxPriceInput: (value: string) => void;
  setCurrentPage: (page: number) => void;
  categories?: { id: number; name: string }[];
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  minPriceInput,
  setMinPriceInput,
  maxPriceInput,
  setMaxPriceInput,
  setCurrentPage,
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available brands, tags, and sizes (these could come from an API)
  const availableBrands = ['Brand A', 'Brand B', 'Brand C'];
  const availableTags = ['New', 'Sale', 'Hot'];
  const availableSizes = ['S', 'M', 'L', 'XL'];

  // Custom debounce function
  const debounce = useCallback((fn: (...args: any[]) => void, delay: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }, []);

  // Debounced search handler
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      setFilters((prev) => ({ ...prev, search: value || undefined }));
      setCurrentPage(1);
    },
    [setSearchQuery, setCurrentPage]
  );

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

  // Handle price input changes with validation
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue < 0)) {
      setPriceError('Price must be a positive number');
      return;
    }

    if (type === 'min') {
      setMinPriceInput(value);
      setFilters((prev) => ({ ...prev, minPrice: value ? numValue : undefined }));
      if (maxPriceInput && numValue > parseFloat(maxPriceInput)) {
        setPriceError('Minimum price cannot exceed maximum price');
      } else {
        setPriceError(null);
      }
    } else {
      setMaxPriceInput(value);
      setFilters((prev) => ({ ...prev, maxPrice: value ? numValue : undefined }));
      if (minPriceInput && numValue < parseFloat(minPriceInput)) {
        setPriceError('Maximum price cannot be less than minimum price');
      } else {
        setPriceError(null);
      }
    }
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const newCategoryId = categoryId ? parseInt(categoryId) : null;
    setSelectedCategory(newCategoryId);
    setFilters((prev) => ({ ...prev, category: newCategoryId ? categories.find(c => c.id === newCategoryId)?.name : undefined }));
    setCurrentPage(1);
  };

  // Handle brand change
  const handleBrandChange = (brand: string) => {
    setFilters((prev) => ({ ...prev, brand: brand || undefined }));
    setCurrentPage(1);
  };

  // Handle size change
  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({ ...prev, size: size || undefined }));
    setCurrentPage(1);
  };

  // Toggle tag filter
  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFilters((prev) => ({ ...prev, tags: newTags.length > 0 ? newTags : undefined }));
    setCurrentPage(1);
  };

  // Handle availability change
  const handleAvailabilityChange = (availability: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, availability }));
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setMinPriceInput('16');
    setMaxPriceInput('300');
    setSelectedCategory(null);
    setFilters({});
    setPriceError(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key as keyof ProductFilters] !== undefined) ||
    minPriceInput !== '16' || maxPriceInput !== '300' || selectedCategory !== null;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
          <span>{isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg lg:hidden">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Search</h4>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => debouncedSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory?.toString() || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Select category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Brand Filter */}
        {availableBrands.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Brand</h4>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.brand || ''}
              onChange={(e) => handleBrandChange(e.target.value)}
              aria-label="Select brand"
            >
              <option value="">All Brands</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Size Filter */}
        {availableSizes.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Size</h4>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.size || ''}
              onChange={(e) => handleSizeChange(e.target.value)}
              aria-label="Select size"
            >
              <option value="">All Sizes</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Availability Filter */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                className="mr-3 text-primary-500 focus:ring-primary-500"
                checked={filters.availability === undefined}
                onChange={() => handleAvailabilityChange(undefined)}
                aria-label="All products"
              />
              <span className="text-gray-700">All Products</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                className="mr-3 text-primary-500 focus:ring-primary-500"
                checked={filters.availability === true}
                onChange={() => handleAvailabilityChange(true)}
                aria-label="Available only"
              />
              <span className="text-gray-700">Available Only</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                className="mr-3 text-primary-500 focus:ring-primary-500"
                checked={filters.availability === false}
                onChange={() => handleAvailabilityChange(false)}
                aria-label="Out of stock"
              />
              <span className="text-gray-700">Out of Stock</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={minPriceInput}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              min="0"
              step="0.01"
              aria-label="Minimum price"
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={maxPriceInput}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              min="0"
              step="0.01"
              aria-label="Maximum price"
            />
          </div>
          {priceError && (
            <p className="text-red-500 text-sm mt-2">{priceError}</p>
          )}
        </div>

        {/* Tags Filter */}
        {availableTags.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 rounded text-primary-500 focus:ring-primary-500"
                    checked={filters.tags?.includes(tag) || false}
                    onChange={() => toggleTag(tag)}
                    aria-label={`Filter by tag ${tag}`}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Active Filters:</h5>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Search: {filters.search}
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Category: {filters.category}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.brand && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Brand: {filters.brand}
                  <button
                    onClick={() => handleBrandChange('')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.size && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Size: {filters.size}
                  <button
                    onClick={() => handleSizeChange('')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.availability !== undefined && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Availability: {filters.availability ? 'Available' : 'Out of Stock'}
                  <button
                    onClick={() => handleAvailabilityChange(undefined)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {minPriceInput !== '16' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Min Price: ${minPriceInput}
                  <button
                    onClick={() => handlePriceChange('min', '16')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {maxPriceInput !== '300' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Max Price: ${maxPriceInput}
                  <button
                    onClick={() => handlePriceChange('max', '300')}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Tag: {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;