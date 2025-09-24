import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  X,
  RotateCw,
  Shield
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/api';
import Swal from 'sweetalert2';

const ShoppingCartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [localCart, setLocalCart] = useState(cart);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const hasCartChanged = () => {
    if (localCart.length !== cart.length) return true;
    return localCart.some((localItem, index) => {
      const cartItem = cart[index];
      if (!cartItem) return true;
      return localItem.id !== cartItem.id || localItem.cartQuantity !== cartItem.cartQuantity;
    });
  };

  const updateLocalQuantity = (id: string, newQuantity: number) => {
    setLocalCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cartQuantity: Math.max(1, Math.min(newQuantity, item.quantity)) } : item
      )
    );
  };

  const removeFromLocalCart = (id: string, itemName: string) => {
    Swal.fire({
      title: 'Remove Item',
      text: `Are you sure you want to remove "${itemName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id)
        setLocalCart(prev => prev.filter(item => item.id !== id));

        Swal.fire({
          title: 'Removed!',
          text: `"${itemName}" has been removed from your cart.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const clearLocalCart = () => {
    Swal.fire({
      title: 'Clear Cart',
      text: 'Are you sure you want to remove all items from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear cart!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        setLocalCart([]);
        Swal.fire({
          title: 'Cart Cleared!',
          text: 'All items have been removed from your cart.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleUpdateCart = async () => {
    setIsUpdating(true);
    try {
      const localIds = new Set(localCart.map(item => item.id));
      cart.forEach(item => {
        if (!localIds.has(item.id)) {
          removeFromCart(item.id);
        }
      });

      localCart.forEach(localItem => {
        const cartItem = cart.find(item => item.id === localItem.id);
        if (!cartItem) {
          updateQuantity(localItem.id, localItem.cartQuantity);
        } else if (cartItem.cartQuantity !== localItem.cartQuantity) {
          updateQuantity(localItem.id, localItem.cartQuantity);
        }
      });

      if (localCart.length === 0) {
        clearCart();
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      Swal.fire({
        title: 'Cart Updated!',
        text: 'Your cart has been successfully updated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to update cart:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update your cart. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalItems = localCart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const subtotal = localCart.reduce((sum, item) => sum + item.cartQuantity * item.price, 0);

  if (localCart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Breadcrumb */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700 font-medium">Home</button>
              <span className="text-gray-400">•</span>
              <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700 font-medium">Shop</button>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-8xl mx-auto px-4 py-10">
          <div className="text-center bg-white rounded-2xl shadow-sm p-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Ready to start shopping? Browse our products and add items to your cart.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-200 inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-16 py-6">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700 font-medium">Home</button>
            <span className="text-gray-400">•</span>
            <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700 font-medium">Shop</button>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-16 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          </div>
          {localCart.length > 0 && (
            <button
              onClick={clearLocalCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {localCart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`${API_URL}${item.images[0]}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors text-sm"
                          onClick={() => navigate(`/products/${item.id}`)}>
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromLocalCart(item.id, item.name)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span>{item.brand}</span>
                      <span>•</span>
                      <span>Size: {item.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-lg">
                        <button
                          onClick={() => updateLocalQuantity(item.id, item.cartQuantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                          disabled={item.cartQuantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[2.5rem] text-center">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() => updateLocalQuantity(item.id, item.cartQuantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                          disabled={item.cartQuantity >= item.quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${(item.price * item.cartQuantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <button
                  onClick={handleContinueShopping}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-2 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </button>
                <button
                  onClick={handleUpdateCart}
                  disabled={isUpdating || !hasCartChanged()}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                >
                  {isUpdating ? (
                    <RotateCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCw className="h-4 w-4" />
                  )}
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center gap-2 mb-4 font-medium shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="h-4 w-4" />
                Checkout
              </button>

              {/* Security Badge */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-full border border-green-100">
                  <Shield className="h-3 w-3 text-green-600" />
                  Secure Checkout
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Accepted payments:</p>
                <div className="flex gap-1">
                  <div className="w-7 h-4 bg-primary-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                  <div className="w-7 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                  <div className="w-7 h-4 bg-primary-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                  <div className="w-7 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;