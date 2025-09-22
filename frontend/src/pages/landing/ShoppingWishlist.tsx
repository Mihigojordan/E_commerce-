import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  X,
  RotateCw,
  ShoppingCart
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/api';
import Swal from 'sweetalert2';
import { type Product } from '../../services/ProductService';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [localWishlist, setLocalWishlist] = useState<Product[]>(wishlist);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  // Sync local wishlist with context wishlist
  useEffect(() => {
    setLocalWishlist(wishlist);
  }, [wishlist]);

  // Check if the wishlist has changed
  const hasWishlistChanged = () => {
    if (localWishlist.length !== wishlist.length) return true;
    return localWishlist.some((localItem, index) => {
      const wishlistItem = wishlist[index];
      if (!wishlistItem) return true;
      return localItem.id !== wishlistItem.id;
    });
  };

  // Remove item from local wishlist with confirmation
  const removeFromLocalWishlist = (id: string, itemName: string) => {
    Swal.fire({
      title: 'Remove Item',
      text: `Are you sure you want to remove "${itemName}" from your wishlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromWishlist(id);
        setLocalWishlist(prev => prev.filter(item => item.id !== id));
        Swal.fire({
          title: 'Removed!',
          text: `"${itemName}" has been removed from your wishlist.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Clear entire wishlist with confirmation
  const clearLocalWishlist = () => {
    Swal.fire({
      title: 'Clear Wishlist',
      text: 'Are you sure you want to remove all items from your wishlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear wishlist!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        clearWishlist();
        setLocalWishlist([]);
        Swal.fire({
          title: 'Wishlist Cleared!',
          text: 'All items have been removed from your wishlist.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Add item to cart and optionally remove from wishlist
  const addToCartFromWishlist = (item: Product) => {
    if (!item.availability || item.quantity < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'This product is out of stock.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    addToCart(item, 1);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${item.name} has been added to your cart!`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Update wishlist (sync local changes to context)
  const handleUpdateWishlist = async () => {
    setIsUpdating(true);
    try {
      const localIds = new Set(localWishlist.map(item => item.id));
      wishlist.forEach(item => {
        if (!localIds.has(item.id)) {
          removeFromWishlist(item.id);
        }
      });

      if (localWishlist.length === 0) {
        clearWishlist();
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      Swal.fire({
        title: 'Wishlist Updated!',
        text: 'Your wishlist has been successfully updated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update your wishlist. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate back to shop
  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // Navigate to cart
  const handleViewCart = () => {
    navigate('/cart');
  };

  const totalItems = localWishlist.length;

  if (localWishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700">Home</button>
              <span className="text-gray-400">›</span>
              <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700">Shop</button>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500">Your Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-gray-300 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your wishlist yet.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700">Home</button>
            <span className="text-gray-400">›</span>
            <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700">Shop</button>
            <span className="text-gray-400">›</span>
            <span className="text-gray-500">Your Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
          {localWishlist.length > 0 && (
            <button
              onClick={clearLocalWishlist}
              className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm"
            >
              <X className="h-4 w-4" />
              Clear Wishlist
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-3">Availability</div>
                  <div className="col-span-1">Add to Cart</div>
                  <div className="col-span-1">Remove</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {localWishlist.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <img
                          src={`${API_URL}${item.images[0]}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </div>

                      <div className="col-span-4">
                        <h3
                          className="font-medium text-gray-900 mb-1 hover:text-primary-600 cursor-pointer"
                          onClick={() => navigate(`/products/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Brand: {item.brand}</span>
                          <span>Size: {item.size}</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className="text-lg font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <span
                          className={`text-sm ${
                            item.availability ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {item.availability ? `${item.quantity} In Stock` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="col-span-1">
                        <button
                          onClick={() => addToCartFromWishlist(item)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="Add to cart"
                          disabled={!item.availability}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="col-span-1">
                        <button
                          onClick={() => removeFromLocalWishlist(item.id, item.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleContinueShopping}
                    className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleUpdateWishlist}
                    disabled={isUpdating || !hasWishlistChanged()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCw className="h-4 w-4" />
                    )}
                    Update Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Wishlist Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems})</span>
                </div>
              </div>

              <button
                onClick={handleViewCart}
                className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <ShoppingCart className="h-5 w-5" />
                View Cart
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                  <Heart className="h-4 w-4" />
                  Saved for Later
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;