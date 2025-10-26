import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  productName?: string;
  productId?: string;
  productPrice?: number;
  productImage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'floating' | 'inline' | 'card';
  showText?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  productId,
  productPrice,
  productImage,
  className = '',
  size = 'md',
  variant = 'inline',
  showText = false
}) => {
  const phoneNumber = '+250788826965'; // Peace Bijouteri's real WhatsApp number
  
  const handleWhatsAppClick = () => {
    let message = '';
    
    if (productName && productId) {
      // Product-specific message
      message = `Hello! I'm interested in this beautiful ${productName} 💎✨\n\n`;
      if (productPrice) {
        message += `Price: $${productPrice}\n`;
      }
      message += `Product ID: ${productId}\n\n`;
      message += `Could you please provide more information about this piece? I'd love to know about:\n`;
      message += `• Availability\n`;
      message += `• Size options\n`;
      message += `• Customization possibilities\n`;
      message += `• Delivery options\n\n`;
      message += `Thank you! 🙏`;
    } else {
      // General inquiry message
      message = `Hello Peace Bijouteri! 👋\n\nI'm interested in your jewelry collection and would like to know more about:\n\n`;
      message += `• Available pieces\n`;
      message += `• Custom jewelry options\n`;
      message += `• Pricing information\n`;
      message += `• Visit your shop\n\n`;
      message += `Thank you! 💎✨`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2 text-xs';
      case 'lg':
        return 'p-4 text-lg';
      default:
        return 'p-3 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'floating':
        return 'fixed bottom-6 right-6 z-50 rounded-full shadow-2xl hover:shadow-3xl';
      case 'card':
        return 'rounded-lg shadow-md hover:shadow-lg';
      default:
        return 'rounded-lg';
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        bg-gradient-to-r from-green-500 to-green-600 
        hover:from-green-600 hover:to-green-700 
        text-white font-semibold 
        transition-all duration-300 
        flex items-center gap-2 
        ${getSizeClasses()} 
        ${getVariantClasses()} 
        ${className}
      `}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className={iconSize} />
      {showText && (
        <span className="hidden sm:inline">
          {productName ? 'Ask About This' : 'WhatsApp Us'}
        </span>
      )}
      
      {/* Subtle pulse animation for floating variant */}
      {variant === 'floating' && (
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
      )}
    </motion.button>
  );
};

export default WhatsAppButton;
