import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid3X3, 
  List, 
  Star
} from 'lucide-react';
import productService, { type Product } from '../../services/ProductService';
import categoryService, { type Category } from '../../services/categoryService';
import { API_URL } from '../../api/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/landing/shop/ProductCard';
import FilterBar from '../../components/landing/shop/FilterBar';

const ShoppingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([16, 300]);
  const [minPriceInput, setMinPriceInput] = useState('16');
  const [maxPriceInput, setMaxPriceInput] = useState('300');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newProductsLoading, setNewProductsLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProductsError, setNewProductsError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({ total: 0, page: 1, limit: 9, totalPages: 1 });

  const navigate = useNavigate();

  const handleNavigateProduct = (product: Product) => {
    if (!product.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product ID is missing.',
      });
      return;
    }
    navigate(`/products/${product.id}`);
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response);
        setCategoryLoading(false);
      } catch (err: any) {
        setCategoryError('Failed to load categories. Please try again.');
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch new products on mount
  useEffect(() => {
    const fetchNewProducts = async () => {
      setNewProductsLoading(true);
      try {
        const response = await productService.getAllProducts({
          tags: ['New'],
          limit: 4,
        });
        setNewProducts(response.data);
        setNewProductsLoading(false);
      } catch (err: any) {
        setNewProductsError('Failed to load new products. Please try again.');
        setNewProductsLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  // Fetch products or search results
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        tags: selectedColors.length > 0 ? selectedColors : undefined,
        availability: selectedConditions.includes('New') ? true : undefined,
        sort: sortBy === 'Price: Low to High' ? 'price:asc' :
              sortBy === 'Price: High to Low' ? 'price:desc' :
              sortBy === 'Newest' ? 'createdAt:desc' :
              sortBy === 'Best Rating' ? 'review:desc' : undefined,
        categoryId: selectedCategory || undefined,
      };

      const response = await productService.getAllProducts(params);
      setProducts(response.data);
      setPagination({
        total: response.pagination?.total || response.data.length,
        page: response.pagination?.page || currentPage,
        limit: response.pagination?.limit || itemsPerPage,
        totalPages: response.pagination?.totalPages || Math.ceil(response.pagination?.total / itemsPerPage) || 1,
      });
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, priceRange, selectedColors, selectedConditions, sortBy, selectedCategory]);

  const fetchSearchResults = useCallback(async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await productService.searchProducts(searchQuery.trim(), currentPage, itemsPerPage);
      setProducts(response.data);
      setPagination({
        total: response.pagination?.total || response.data.length,
        page: response.pagination?.page || currentPage,
        limit: response.pagination?.limit || itemsPerPage,
        totalPages: response.pagination?.totalPages || Math.ceil(response.pagination?.total / itemsPerPage) || 1,
      });
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to search products. Please try again.');
      setLoading(false);
    }
  }, [searchQuery, currentPage, itemsPerPage, fetchProducts]);

  // Fetch products or search results when filters, search, or category change
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    } else {
      fetchProducts();
    }
  }, [searchQuery, fetchSearchResults, fetchProducts]);

  // Update price range when inputs change
  useEffect(() => {
    const min = parseFloat(minPriceInput) || 0;
    const max = parseFloat(maxPriceInput) || Infinity;
    if (min <= max) {
      setPriceRange([min, max]);
      setCurrentPage(1); // Reset to first page on price change
    }
  }, [minPriceInput, maxPriceInput]);

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'hot': return 'bg-pink-500';
      case 'new': return 'bg-primary-500';
      case 'best sell': return 'bg-orange-500';
      case 'sale': return 'bg-blue-500';
      case '50%': return 'bg-pink-600';
      case '25%': return 'bg-purple-500';
      case '70%': return 'bg-orange-600';
      default: return 'bg-blue-500';
    }
  };

  // Generate pagination buttons dynamically
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Show up to 5 page numbers
    const totalPages = pagination.totalPages;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-medium shadow-md transition-colors ${
            currentPage === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
          aria-label={`Go to page ${i}`}
        >
          {i.toString().padStart(2, '0')}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 xl:w-72 space-y-6">
            {/* Categories */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-lg">Categories</h3>
              {categoryLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading...</span>
                </div>
              ) : categoryError ? (
                <p className="text-red-500 text-sm">{categoryError}</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-600 text-sm">No categories available.</p>
              ) : (
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className={`text-sm sm:text-base text-left w-full py-2 px-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === null 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      aria-label="View all categories"
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage(1);
                        }}
                        className={`text-sm sm:text-base text-left w-full py-2 px-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id 
                            ? 'bg-primary-50 text-primary-600 font-medium' 
                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                        aria-label={`Select category ${category.name}`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              minPriceInput={minPriceInput}
              setMinPriceInput={setMinPriceInput}
              maxPriceInput={maxPriceInput}
              setMaxPriceInput={setMaxPriceInput}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedConditions={selectedConditions}
              setSelectedConditions={setSelectedConditions}
              setCurrentPage={setCurrentPage}
            />

            {/* New Products */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 sm:mb-6 text-lg">New Products</h3>
              {newProductsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                </div>
              ) : newProductsError ? (
                <p className="text-red-500 text-sm">{newProductsError}</p>
              ) : newProducts.length === 0 ? (
                <p className="text-gray-600 text-sm">No new products available.</p>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {newProducts.map((product) => (
                    <div key={product.id} className="flex gap-3 sm:gap-4 group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => handleNavigateProduct(product)}>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                        <img 
                          src={`${API_URL}${product.images[0]}` || 'https://via.placeholder.com/60'} 
                          alt={product.name} 
                          className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-sm sm:text-base truncate">{product.name}</h4>
                        <p className="text-sm text-primary-600 font-semibold">${product.price.toFixed(2)}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
              <div>
                <p className="text-gray-700 text-base sm:text-lg">
                  We found <span className="font-bold text-primary-600 text-lg sm:text-xl">{pagination.total} items</span> for you!
                </p>
                {selectedCategory && (
                  <p className="text-sm text-gray-500 mt-1">
                    in {categories.find(cat => cat.id === selectedCategory)?.name}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border">
                  <Grid3X3 className="h-4 w-4 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Show:</span>
                  <select 
                    className="bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    aria-label="Select items per page"
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                    <option value="36">36</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border">
                  <List className="h-4 w-4 text-gray-600" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Sort:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none min-w-0"
                    aria-label="Sort products"
                  >
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                    <option>Best Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center text-gray-600 py-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3">Loading products...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">
                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-600 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto">
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search query to find what you're looking for.</p>
                  {(selectedCategory || searchQuery || selectedColors.length > 0 || selectedConditions.length > 0) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                        setSelectedColors([]);
                        setSelectedConditions([]);
                        setMinPriceInput('16');
                        setMaxPriceInput('300');
                        setCurrentPage(1);
                      }}
                      className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    tag={product.tags[0]}
                    tagColor={getTagColor(product.tags[0] || '')}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.total > 0 && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <button
                  className="px-3 py-2 sm:px-4 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-none"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                
                <div className="flex gap-2 order-3 sm:order-none">
                  {getPaginationButtons()}
                </div>
                
                <button
                  className="px-3 py-2 sm:px-4 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-none"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  aria-label="Next page"
                >
                  Next
                </button>
                
                <div className="text-xs sm:text-sm text-gray-500 order-4 sm:order-none mt-2 sm:mt-0">
                  Page {currentPage} of {pagination.totalPages}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;