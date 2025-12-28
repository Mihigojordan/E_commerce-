/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Share2, 
  Facebook,
  Twitter,
  Instagram,

  Youtube,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import productService, { type Product, type ProductReview } from '../../../services/ProductService';
import categoryService, { type Category } from '../../../services/categoryService';
import { API_URL } from '../../../api/api';
import Swal from 'sweetalert2';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import WhatsAppButton from '../../common/WhatsAppButton';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { formatCurrency, formatPrice } from '../../../utils/dateUtils';

const ShopViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
const [priceRange, setPriceRange] = useState([16, 8000]);
  const [minPriceInput, setMinPriceInput] = useState('16');
const [maxPriceInput, setMaxPriceInput] = useState('8000');
  const [newProductsLoading, setNewProductsLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newProductsError, setNewProductsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Check if product is in cart
  const isInCart = useCallback(() => {
    if (!id || !product) return false;
    return cart.some(item => item.id === id);
  }, [id, product, cart]);

  const toggleWishlist = useCallback(() => {
    if (!id) return;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      Swal.fire({
        title: 'Removed from Wishlist',
        text: 'This product has been removed from your wishlist.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      if (!product) return;
      addToWishlist(product);
      Swal.fire({
        title: 'Added to Wishlist',
        text: `${product.name} has been added to your wishlist!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }, [id, product, isInWishlist, removeFromWishlist, addToWishlist]);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Failed to load product. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !id) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      setQuantity(cartItem.cartQuantity);
    } else {
      setQuantity(1);
    }
  }, [cart, id, product]);

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

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.categoryId) return;
      setRelatedLoading(true);
      try {
        const response = await productService.getAllProducts({
          category: product.categoryId.toString(),
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

  useEffect(() => {
    const min = parseFloat(minPriceInput) || 0;
    const max = parseFloat(maxPriceInput) || 10000;
    if (min < 0 || max < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Price values cannot be negative.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    if (min > max) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price Range',
        text: 'Minimum price cannot be greater than maximum price.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    setPriceRange([min, max]);
  }, [minPriceInput, maxPriceInput]);

  const getTagColor = useCallback((tag: string) => {
    switch (tag.toLowerCase()) {
      case 'hot': return 'bg-pink-500';
      case 'new': return 'bg-primary-500';
      case 'sale': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }, []);

  const handleNavigateProduct = useCallback((product: Product) => {
    if (!product.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product ID is missing.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    navigate(`/products/${product.id}`);
  }, [navigate]);

  const handleApplyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('categoryId', selectedCategory.toString());
    if (priceRange[0] !== 16) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] !== 8000) params.append('maxPrice', priceRange[1].toString());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    
    navigate(`/products?${params.toString()}`);
  }, [selectedCategory, priceRange, searchQuery, navigate]);

  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleCartAction = useCallback(() => {
    if (!product || !id) return;
    
    const currentInCart = isInCart();
    if (currentInCart) {
      updateQuantity(id, quantity);
      Swal.fire({
        title: 'Cart Updated',
        text: `${product.name} quantity updated to ${quantity}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      addToCart(product, quantity);
      Swal.fire({
        title: 'Added to Cart',
        text: `${product.name} has been added to your cart!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }, [product, id, quantity, isInCart, updateQuantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product || !id) return;
    
    // Stock validation
    if (!product.availability || product.quantity < quantity) {
      Swal.fire({
        title: 'Out of Stock',
        text: product.availability 
          ? `Only ${product.quantity} units of ${product.name} available.`
          : `${product.name} is currently out of stock.`,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        timer: 2000,
      });
      return;
    }

    // Open checkout modal with single product
    setIsCheckoutModalOpen(true);
  }, [product, id, quantity]);

  const handleReviewSubmit = async () => {
    if (!id || !product) return;

    // Validate inputs
    if (!reviewName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Name',
        text: 'Please enter your name.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    if (!reviewEmail.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Email',
        text: 'Please enter your email.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reviewEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Rating',
        text: 'Please select a rating between 1 and 5 stars.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const newReview = await productService.createReview({
        productId: id,
        fullName: reviewName,
        email: reviewEmail,
        rating: reviewRating,
        comment: reviewComment.trim() || 'No comment provided.',
      });
      setReviews(prev => [...prev, newReview]);
      setReviewName('');
      setReviewEmail('');
      setReviewRating(0);
      setReviewComment('');
      setCurrentPage(1);
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted',
        text: 'Your review has been successfully submitted!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Failed to submit your review. Please try again.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleStarClick = useCallback((rating: number) => {
    setReviewRating(rating);
  }, []);

  // Calculate discounted price
  const discountedPrice = product?.discount && product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product?.price;

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Prepare single product data for checkout modal
  const singleProductForCheckout = product && id ? {
    id,
    name: product.name,
    brand: product.brand,
    size: product.size || 'N/A',
    price: product.price,
    discount: product.discount,
    perUnit: product.perUnit,
    images: product.images,
    quantity: product.quantity,
    availability: product.availability,
    initialQuantity: quantity
  } : null;

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !product) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">{error || 'Product not found.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50"
      >
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-72 space-y-6"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">Category</h3>
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
                  <ul className="space-y-4">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => handleCategorySelect(category.id)}
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

              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                minPriceInput={minPriceInput}
                setMinPriceInput={setMinPriceInput}
                maxPriceInput={maxPriceInput}
                setMaxPriceInput={setMaxPriceInput}
                selectedColors={[]} 
                setSelectedColors={() => {}} 
                selectedConditions={[]} 
                setSelectedConditions={() => {}} 
                setCurrentPage={setCurrentPage}
                onApplyFilters={handleApplyFilters}
                showColorAndConditionFilters={false} 
              />

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 text-lg">New Products</h3>
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
                  <div className="space-y-5">
                    {newProducts.map((productItem) => (
                      <div 
                        key={productItem.id} 
                        className="flex gap-4 group cursor-pointer" 
                        onClick={() => handleNavigateProduct(productItem)}
                        role="button"
                        aria-label={`View product ${productItem.name}`}
                      >
                        <img 
                          src={`${API_URL}${productItem.images[0]}` || 'https://via.placeholder.com/60'} 
                          alt={productItem.name} 
                          className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {productItem.name}
                          </h4>
                          <p className="text-sm text-primary-600 font-semibold">{formatPrice(productItem.price)}</p>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(productItem.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>

            <motion.main 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      <button 
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white z-10 transition-colors"
                        aria-label="Zoom image"
                      >
                        <Search className="h-5 w-5 text-gray-600" />
                      </button>
                      <img 
                        src={`${API_URL}${product.images[selectedImage]}` || 'https://via.placeholder.com/600'} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <AnimatePresence>
                        {product.images.map((image, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setSelectedImage(index)}
                            className={`relative rounded-lg overflow-hidden aspect-square ${
                              selectedImage === index ? 'ring-2 ring-primary-500' : ''
                            }`}
                            aria-label={`Select image ${index + 1} of ${product.name}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img 
                              src={`${API_URL}${image}` || 'https://via.placeholder.com/120'} 
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                      {product.tags[0] && (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTagColor(product.tags[0])} text-white mb-4`}>
                          {product.tags[0]}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-4 mb-4">
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 transition-colors ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-3xl font-bold text-primary-600">{formatPrice(discountedPrice!)}</span>
                        {product.discount && product.discount > 0 && (
                          <>
                            <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                            <span className="text-sm text-red-600 font-medium">{product.discount}% OFF</span>
                          </>
                        )}
                        <span className="text-gray-500">/ {product.perUnit}</span>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium border-x border-gray-200" aria-label={`Quantity: ${quantity}`}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (quantity < product.quantity) {
                                setQuantity(quantity + 1);
                              } else {
                                Swal.fire({
                                  title: 'Stock Limited',
                                  text: `Only ${product.quantity} units of ${product.name} available.`,
                                  icon: 'warning',
                                  confirmButtonColor: '#3085d6',
                                  timer: 2000,
                                });
                              }
                            }}
                            className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={quantity >= product.quantity}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <motion.button 
                          onClick={handleCartAction}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex-1 bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 ${
                            isInCart() ? 'bg-green-600 hover:bg-green-700' : ''
                          }`}
                          disabled={!product.availability || product.quantity < quantity}
                          aria-label={isInCart() ? `Update quantity of ${product.name} in cart` : `Add ${quantity} ${product.name} to cart`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {isInCart() ? 'Update Cart' : 'Add to Cart'}
                        </motion.button>

                        <motion.button
                          onClick={toggleWishlist}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 border rounded-md hover:bg-gray-50 transition-colors ${
                            isInWishlist(id || '') ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-600 border-gray-200'
                          }`}
                          aria-label={isInWishlist(id || '') ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={`h-5 w-5 transition-colors ${isInWishlist(id || '') ? 'fill-current' : ''}`} />
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          aria-label="Share product"
                        >
                          <Share2 className="h-5 w-5 text-gray-600" />
                        </motion.button>
                      </div>

                      {/* Buy Now Button */}
                      <motion.button 
                        onClick={handleBuyNow}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-md hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!product.availability || product.quantity < quantity}
                        aria-label="Buy now"
                      >
                        <Zap className="h-5 w-5" />
                        Buy Now
                      </motion.button>
                      
                      {/* WhatsApp Button */}
                      <div className="mt-3">
                        <WhatsAppButton
                          productName={product.name}
                          productId={product.id}
                          productPrice={currentPrice}
                          size="md"
                          variant="inline"
                          showText={true}
                          className="w-full justify-center"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-600">Share this:</span>
                          <div className="flex gap-2">
                            <motion.button whileTap={{ scale: 0.95 }} aria-label="Share on Facebook">
                              <Facebook className="h-4 w-4 text-blue-600 hover:scale-110 transition-transform" />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }} aria-label="Share on Twitter">
                              <Twitter className="h-4 w-4 text-blue-400 hover:scale-110 transition-transform" />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }} aria-label="Share on Instagram">
                              <Instagram className="h-4 w-4 text-pink-500 hover:scale-110 transition-transform" />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }} aria-label="Share on YouTube">
                              <Youtube className="h-4 w-4 text-red-600 hover:scale-110 transition-transform" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><span className="font-medium">Tags:</span> {product.tags.join(', ')}</p>
                        <p><span className="font-medium">Availability:</span> 
                          <span className={product.availability ? 'text-green-600' : 'text-red-600 font-medium'}>
                            {product.availability ? ` ${product.quantity} Items In Stock` : ' Out of Stock'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t">
                  <div className="flex border-b">
                    {['DESCRIPTION', 'REVIEWS'].map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.02 }}
                        className={`px-6 py-4 font-medium text-sm flex-1 text-center ${
                          activeTab === tab
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        aria-label={`View ${tab.toLowerCase()}`}
                      >
                        {tab} {tab === 'REVIEWS' ? `(${reviews.length})` : ''}
                      </motion.button>
                    ))}
                  </div>

                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    {activeTab === 'DESCRIPTION' && (
                      <div className="prose prose-lg max-w-none">
                        <div
                          className="space-y-6 text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: product.subDescription! || 'No content available' }}
                        />
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
                                    className={`h-5 w-5 transition-colors ${i < Math.floor(product.review || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-lg font-semibold">{product.review?.toFixed(1) || '0.0'}</span>
                              <span className="text-gray-600">({reviews.length} reviews)</span>
                            </div>
                          </div>

                          {reviewsLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                              <span className="ml-2 text-gray-600">Loading reviews...</span>
                            </div>
                          ) : reviews.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                              <p className="text-lg font-medium mb-2">No reviews yet.</p>
                              <p className="text-sm">Be the first to write a review!</p>
                            </div>
                          ) : (
                            <div>
                              <AnimatePresence>
                                {currentReviews.map((review) => (
                                  <motion.div 
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-b pb-6 mb-6 last:border-b-0"
                                  >
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                          {review.fullName.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900">{review.fullName}</h4>
                                        <div className="flex items-center gap-2">
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star 
                                                key={i} 
                                                className={`h-4 w-4 transition-colors ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                              />
                                            ))}
                                          </div>
                                          <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              {totalPages > 1 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="mt-8 flex items-center justify-center gap-4"
                                >
                                  <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-colors"
                                    aria-label="Previous reviews page"
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                    Previous
                                  </button>

                                  <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                      <motion.button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        whileHover={{ scale: 1.05 }}
                                        className={`px-3 py-1 rounded-md font-medium transition-colors ${
                                          currentPage === i + 1
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        aria-label={`Go to reviews page ${i + 1}`}
                                      >
                                        {i + 1}
                                      </motion.button>
                                    ))}
                                  </div>

                                  <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-colors"
                                    aria-label="Next reviews page"
                                  >
                                    Next
                                    <ChevronRight className="h-5 w-5" />
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 pt-8 border-t"
                          >
                            <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                  type="text" 
                                  placeholder="Your Name" 
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  value={reviewName}
                                  onChange={(e) => setReviewName(e.target.value)}
                                  aria-label="Your name"
                                />
                                <input 
                                  type="email" 
                                  placeholder="Your Email" 
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  value={reviewEmail}
                                  onChange={(e) => setReviewEmail(e.target.value)}
                                  aria-label="Your email"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Your Rating</label>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.button
                                      key={i}
                                      onClick={() => handleStarClick(i + 1)}
                                      whileHover={{ scale: 1.2 }}
                                      className="focus:outline-none"
                                      aria-label={`Rate ${i + 1} star${i + 1 === 1 ? '' : 's'}`}
                                    >
                                      <Star 
                                        className={`h-6 w-6 transition-colors ${
                                          i < reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                        } hover:text-yellow-400`} 
                                      />
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                              <textarea 
                                placeholder="Write your review..." 
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                aria-label="Write your review"
                              />
                              <motion.button 
                                onClick={handleReviewSubmit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmittingReview || reviewRating === 0}
                                className={`w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                  isSubmittingReview ? 'animate-pulse' : ''
                                }`}
                                aria-label="Submit review"
                              >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                              </motion.button>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Previous related products"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      aria-label="Next related products"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                {relatedLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-gray-600">Loading related products...</span>
                  </div>
                ) : relatedProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium mb-2">No related products found.</p>
                    <p className="text-sm">Check out other items in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {relatedProducts.map((relatedProduct) => (
                        <motion.div
                          key={relatedProduct.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard
                            product={relatedProduct}
                            tag={relatedProduct.tags[0]}
                            tagColor={getTagColor(relatedProduct.tags[0] || '')}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </motion.main>
          </div>
        </div>
      </motion.div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        singleProduct={singleProductForCheckout}
      />
    </>
  );
};

export default ShopViewPage;