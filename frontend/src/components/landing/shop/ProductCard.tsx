import React from 'react';
import { 
  Heart, 
  Star, 
  ShoppingCart,
  MessageCircle, 
} from 'lucide-react';
import { useWishlist } from '../../../context/WishlistContext';
import { API_URL } from '../../../api/api';
import { type Product } from '../../../services/ProductService';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatPrice } from '../../../utils/dateUtils';
import { motion } from 'framer-motion';


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

    const shareToWhatsApp = (product) => {
    const message = `Check out this beautiful ${product.name}! 💎✨\n\nSee more amazing jewelry at: ${import.meta.env.VITE_WEBSITE_URL}/products/${product.id}\n\nHow can I get more information about this piece?`;
    const whatsappUrl = `https://wa.me/250791813289?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const currentPrice = product.discount && product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {tag && (
          <span className={`absolute top-4 left-4 ${tagColor} text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg`}>
            {tag}
          </span>
        )}
       <div className="absolute top-4 right-4 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              shareToWhatsApp(product);
            }}
            className="p-2 bg-green-500 backdrop-blur-sm rounded-full text-white hover:bg-green-600 transition-all duration-300 shadow-md opacity-0 group-hover:opacity-100"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
          
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
          
          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;