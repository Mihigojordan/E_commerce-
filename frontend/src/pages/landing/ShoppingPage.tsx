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
          limit: 3,
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
          className={`px-4 py-2 rounded-lg font-medium shadow-md transition-colors ${
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
      <div className="w-12/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6">
            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Category</h3>
              {categoryLoading ? (
                <p className="text-gray-600">Loading categories...</p>
              ) : categoryError ? (
                <p className="text-red-500">{categoryError}</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-600">No categories available.</p>
              ) : (
                <ul className="space-y-4">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage(1); // Reset to first page on category change
                        }}
                        className={`text-gray-600 hover:text-primary-600 hover:font-medium transition-all duration-200 flex items-center justify-between w-full ${
                          selectedCategory === category.id ? 'border-l-3 border-primary-500 pl-4 font-medium text-primary-600' : ''
                        }`}
                        aria-label={`Select category ${category.name}`}
                      >
                        <span>{category.name}</span>
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">New Products</h3>
              {newProductsLoading ? (
                <p className="text-gray-600">Loading new products...</p>
              ) : newProductsError ? (
                <p className="text-red-500">{newProductsError}</p>
              ) : newProducts.length === 0 ? (
                <p className="text-gray-600">No new products available.</p>
              ) : (
                <div className="space-y-5">
                  {newProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 group cursor-pointer" onClick={() => handleNavigateProduct(product)}>
                      <img 
                        src={`${API_URL}${product.images[0]}` || 'https://via.placeholder.com/60'} 
                        alt={product.name} 
                        className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h4>
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

            {/* Promotion Banner */}
            <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-purple-700 p-8 rounded-xl text-white overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative text-center">
                <p className="text-sm opacity-90 mb-2 font-medium">Women's Sale</p>
                <h3 className="text-xl font-bold mb-4 leading-tight">Save 17% on<br />Office Dress</h3>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Shop Now →
                </button>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-700 text-lg">
                We found <span className="font-bold text-primary-600 text-xl">{pagination.total} items</span> for you!
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border">
                  <Grid3X3 className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">Show:</span>
                  <select 
                    className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when items per page changes
                    }}
                    aria-label="Select items per page"
                  >
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                    <option value="36">36</option>
                    <option value="all">All</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border">
                  <List className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1); // Reset to first page on sort change
                    }}
                    className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
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
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">
                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                <p className="text-lg font-medium">No products found.</p>
                <p className="text-sm">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-8 mb-12">
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
            {pagination.total > 0 && (
              <div className="flex justify-center items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  «
                </button>
                {getPaginationButtons()}
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  aria-label="Next page"
                >
                  »
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;