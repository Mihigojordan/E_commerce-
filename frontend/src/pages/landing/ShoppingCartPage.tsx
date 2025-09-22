import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  X,
  RotateCw
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700">Home</button>
              <span className="text-gray-400">›</span>
              <button onClick={() => navigate('/products')} className="text-primary-600 hover:text-primary-700">Shop</button>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500">Your Cart</span>
            </nav>
          </div>
        </div>

        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
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
            <span className="text-gray-500">Your Cart</span>
          </nav>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {localCart.length > 0 && (
            <button
              onClick={clearLocalCart}
              className="text-red-600 hover:text-red-700 flex items-center gap-2 text-sm"
            >
              <X className="h-4 w-4" />
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-1">Subtotal</div>
                  <div className="col-span-1">Remove</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {localCart.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <img
                          src={`${API_URL}${item.images[0]}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </div>

                      <div className="col-span-5">
                        <h3 className="font-medium text-gray-900 mb-1 hover:text-primary-600 cursor-pointer"
                            onClick={() => navigate(`/products/${item.id}`)}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.description}
                        </p>
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

                      <div className="col-span-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.cartQuantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.cartQuantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                            {item.cartQuantity}
                          </span>
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.cartQuantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.cartQuantity >= item.quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <span className="text-lg font-medium text-gray-900">
                          ${(item.price * item.cartQuantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="col-span-1">
                        <button
                          onClick={() => removeFromLocalCart(item.id, item.name)}
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
                    onClick={handleUpdateCart}
                    disabled={isUpdating || !hasCartChanged()}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50"
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
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <ShoppingBag className="h-5 w-5" />
                Proceed to Checkout
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure Checkout
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-3">We accept:</p>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    V
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    M
                  </div>
                  <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    A
                  </div>
                  <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    P
                  </div>
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