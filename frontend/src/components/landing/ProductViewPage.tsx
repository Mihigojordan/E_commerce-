
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Share2, 
  Search,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import productService, { type Product, type ProductReview } from '../../services/ProductService';
import categoryService, { type Category } from '../../services/categoryService';
import { API_URL } from '../../api/api';
import Swal from 'sweetalert2';

interface ProductCardProps {
  product: Product;
  tag?: string;
  tagColor?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  tag, 
  tagColor = 'bg-blue-500' 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ratingPercentage = product.review ? Math.floor(product.review * 20) : 50;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {tag && (
          <span className={`absolute top-4 left-4 ${tagColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg`}>
            {tag}
          </span>
        )}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 z-10 shadow-md opacity-0 group-hover:opacity-100"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        <img 
          src={`${API_URL}${product.images[0]}` || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{product.brand}</p>
          <span className="text-xs text-gray-400">{ratingPercentage}%</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-3 text-base leading-snug hover:text-teal-600 cursor-pointer transition-colors">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-teal-600">${product.price.toFixed(2)}</span>
          </div>
          
          <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewMorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([16, 300]);
  const [minPriceInput, setMinPriceInput] = useState('16');
  const [maxPriceInput, setMaxPriceInput] = useState('300');
  const [newProductsLoading, setNewProductsLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newProductsError, setNewProductsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const reviewData = await productService.getReviews(id);
        setReviews(reviewData);
        setReviewsLoading(false);
      } catch (err) {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.categoryId) return;
      setRelatedLoading(true);
      try {
        const response = await productService.getAllProducts({
          categoryId: product.categoryId,
          limit: 4,
        });
        setRelatedProducts(response.data.filter((p: Product) => p.id !== id));
        setRelatedLoading(false);
      } catch (err) {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product, id]);

  // Fetch categories
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

  // Fetch new products
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

  // Validate and update price range
  useEffect(() => {
    const min = parseFloat(minPriceInput) || 0;
    const max = parseFloat(maxPriceInput) || 10000; // Default max if empty
    if (min < 0 || max < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Price values cannot be negative.',
      });
      return;
    }
    if (min > max) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price Range',
        text: 'Minimum price cannot be greater than maximum price.',
      });
      return;
    }
    setPriceRange([min, max]);
  }, [minPriceInput, maxPriceInput]);

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'hot': return 'bg-pink-500';
      case 'new': return 'bg-teal-500';
      case 'sale': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const handleNavigateProduct = (product: Product) => {
    if (!product.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product ID is missing.',
      });
      return;
    }
    navigate(`/product/${product.id}`);
  };

  // Handle filter application
  const handleApplyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('categoryId', selectedCategory.toString());
    if (priceRange[0] !== 16) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] !== 300) params.append('maxPrice', priceRange[1].toString());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    navigate(`/products?${params.toString()}`);
  }, [selectedCategory, priceRange, searchQuery, navigate]);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error || 'Product not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        onClick={() => handleCategorySelect(category.id)}
                        className={`text-gray-600 hover:text-teal-600 hover:font-medium transition-all duration-200 flex items-center justify-between w-full ${
                          selectedCategory === category.id ? 'border-l-3 border-teal-500 pl-4 font-medium text-teal-600' : ''
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Filters</h3>
              
              {/* Search by Name */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Search by Name</h4>
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search products"
                  />
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    min="0"
                    aria-label="Minimum price"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    min="0"
                    aria-label="Maximum price"
                  />
                </div>
              </div>

              <button 
                onClick={handleApplyFilters}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                aria-label="Apply filters"
              >
                <Filter className="h-4 w-4 inline mr-2" />
                Apply Filters
              </button>
            </div>

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
                    <div 
                      key={product.id} 
                      className="flex gap-4 group cursor-pointer" 
                      onClick={() => handleNavigateProduct(product)}
                      role="button"
                      aria-label={`View product ${product.name}`}
                    >
                      <img 
                        src={`${API_URL}${product.images[0]}` || 'https://via.placeholder.com/60'} 
                        alt={product.name} 
                        className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">{product.name}</h4>
                        <p className="text-sm text-teal-600 font-semibold">${product.price.toFixed(2)}</p>
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
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                    <button 
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white z-10"
                      aria-label="Zoom image"
                    >
                      <Search className="h-5 w-5 text-gray-600" />
                    </button>
                    <img 
                      src={`${API_URL}${product.images[selectedImage]}` || 'https://via.placeholder.com/600'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-lg overflow-hidden aspect-square ${
                          selectedImage === index ? 'ring-2 ring-teal-500' : ''
                        }`}
                        aria-label={`Select image ${index + 1} of ${product.name}`}
                      >
                        <img 
                          src={`${API_URL}${image}` || 'https://via.placeholder.com/120'} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-lg text-teal-600 mb-4">{product.tags[0]}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl font-bold text-teal-600">${product.price.toFixed(2)}</span>
                    </div>

                    <p className="text-gray-600 mb-6">{product.description}</p>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="flex gap-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-x" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button 
                      className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to cart
                    </button>

                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-3 border rounded-md hover:bg-gray-50 transition-colors ${
                        isWishlisted ? 'text-red-500 border-red-200' : 'text-gray-600'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button 
                      className="p-3 border rounded-md hover:bg-gray-50 transition-colors"
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Share and Availability */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-600">Share this:</span>
                        <div className="flex gap-2">
                          <button aria-label="Share on Facebook"><Facebook className="h-4 w-4 text-blue-600" /></button>
                          <button aria-label="Share on Twitter"><Twitter className="h-4 w-4 text-blue-400" /></button>
                          <button aria-label="Share on Instagram"><Instagram className="h-4 w-4 text-pink-500" /></button>
                          <button aria-label="Share on YouTube"><Youtube className="h-4 w-4 text-red-600" /></button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Tags:</span> {product.tags.join(', ')}</p>
                      <p><span className="font-medium">Availability:</span> 
                        <span className={product.availability ? 'text-green-600' : 'text-red-600'}>
                          {product.availability ? `${product.quantity} Items In Stock` : 'Out of Stock'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="border-t">
                <div className="flex border-b">
                  {['DESCRIPTION', 'REVIEWS'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium text-sm ${
                        activeTab === tab
                          ? 'text-teal-600 border-b-2 border-teal-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      aria-label={`View ${tab.toLowerCase()}`}
                    >
                      {tab} {tab === 'REVIEWS' ? `(${reviews.length})` : ''}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {activeTab === 'DESCRIPTION' && (
                    <div className="prose max-w-none">
                      <p className="text-gray-600 mb-4">{product.subDescription || product.description}</p>
                    </div>
                  )}

                  {activeTab === 'REVIEWS' && (
                    <div>
                      <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-lg font-semibold">{product.review?.toFixed(1) || '0.0'}</span>
                            <span className="text-gray-600">({reviews.length} reviews)</span>
                          </div>
                        </div>

                        {reviewsLoading ? (
                          <p className="text-gray-600">Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                          <p className="text-gray-600">No reviews yet.</p>
                        ) : (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div key={review.id} className="border-b pb-6 last:border-b-0">
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                      {review.fullName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{review.fullName}</h4>
                                    <div className="flex items-center gap-2">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-8">
                          <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input 
                                type="text" 
                                placeholder="Your Name" 
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                aria-label="Your name"
                              />
                              <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                aria-label="Your email"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Your Rating</label>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <button key={i} aria-label={`Rate ${i + 1} stars`}>
                                    <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400 transition-colors" />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea 
                              placeholder="Write your review..." 
                              rows={4}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                              aria-label="Write your review"
                            />
                            <button 
                              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                              aria-label="Submit review"
                            >
                              Submit Review
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Related Products</h2>
                <div className="flex gap-2">
                  <button 
                    className="p-2 border rounded-lg hover:bg-gray-50"
                    aria-label="Previous related products"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 border rounded-lg hover:bg-gray-50"
                    aria-label="Next related products"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {relatedLoading ? (
                <p className="text-gray-600">Loading related products...</p>
              ) : relatedProducts.length === 0 ? (
                <p className="text-gray-600">No related products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      tag={relatedProduct.tags[0]}
                      tagColor={getTagColor(relatedProduct.tags[0] || '')}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ViewMorePage;
