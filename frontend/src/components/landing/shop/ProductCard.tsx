import React from 'react';
import WhatsAppButton from '../../common/WhatsAppButton';
import { useWishlist } from '../../../context/WishlistContext';
import { API_URL } from '../../../api/api';
import { type Product } from '../../../services/ProductService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatPrice } from '../../../utils/dateUtils';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';

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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const ratingPercentage = product.review ? Math.floor(product.review * 20) : 50;

  const handleNavigateProduct = () => {
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
  };

  const toggleWishlist = () => {
    if (!product.id) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

<<<<<<< HEAD
 
=======
  const shareToWhatsApp = (product: Product) => {
  const message = `Check out this beautiful ${product.name}! %0A%0ASee more amazing jewelry at: ${window.location.origin}/products/${product.id}%0A%0AHow can I get more information about this piece?`;
  const whatsappUrl = `https://wa.me/250788826965?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
>>>>>>> 980eaaa03397ab332583c352fa737610e2072163

  const currentPrice = product.discount && product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      {/* Product Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {tag && (
          <span className={`absolute top-4 left-4 ${tagColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg`}>
            {tag}
          </span>
        )}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
<<<<<<< HEAD
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <WhatsAppButton
              productName={product.name}
              productId={product.id}
              productPrice={currentPrice}
              size="sm"
              variant="card"
              className="shadow-md"
            />
          </motion.div>
          
=======

>>>>>>> 980eaaa03397ab332583c352fa737610e2072163
          <button
            onClick={toggleWishlist}
            className="p-2 bg-white rounded-full hover:bg-gray-50 transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        <img 
          src={`${API_URL}${product.images[0]}` || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      
      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{product.brand}</p>
          <span className="text-xs text-gray-400">{ratingPercentage}%</span>
        </div>
        
        <h3 
          onClick={handleNavigateProduct}
          className="font-semibold text-gray-900 mb-3 text-base leading-snug hover:text-primary-600 cursor-pointer transition-colors"
        >
          {product.name}
        </h3>
        
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
        
        {/* Price + Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">{formatPrice(currentPrice)}</span>
            {product.discount && product.discount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">${formatPrice(product.price)}</span>
                <span className="text-sm text-pink-500 font-medium">{product.discount}% off</span>
              </div>
            )}
          </div>

          {/* Cart + WhatsApp on same line */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <WhatsAppButton
              productName={product.name}
              productId={product.id}
              productPrice={currentPrice}
              size="sm"
              variant="card"
              className="shadow-sm"
            />
            <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
