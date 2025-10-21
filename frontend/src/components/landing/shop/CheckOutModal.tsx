import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2, ShoppingCart, User, FileCheck } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import usePurchasingUserAuth from '../../../context/PurchasingUserAuthContext';
import productService from '../../../services/ProductService';
import orderService, { type CreateOrderData } from '../../../services/orderService';
import { API_URL } from '../../../api/api';

interface ValidationIssue {
  productId: string;
  productName: string;
  cartQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
}

interface SingleProduct {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartQuantity: any;
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  discount?: number;
  perUnit: string;
  images?: string[];
  quantity: number;
  availability: boolean;
  initialQuantity?: number; // Quantity to checkout
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleProduct?: SingleProduct | null; // New prop for single product checkout
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, singleProduct = null }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = usePurchasingUserAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [validatedItems, setValidatedItems] = useState<any[]>([]);
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single product state
  const [singleProductQuantity, setSingleProductQuantity] = useState(1);
  const [singleProductRemoved, setSingleProductRemoved] = useState(false);

  // Determine if we're in single product mode
  const isSingleProductMode = !!singleProduct;

  // Initialize single product quantity
  useEffect(() => {
    if (singleProduct && isOpen) {
      setSingleProductQuantity(singleProduct.initialQuantity || 1);
      setSingleProductRemoved(false);
    }
  }, [singleProduct, isOpen]);

  // Prefill customer info if user is authenticated
  useEffect(() => {
    if (isOpen && user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phoneNumber || '');
    }
  }, [isOpen, user]);

  // Validate cart/product on mount and when dependencies change
  useEffect(() => {
    if (isOpen && step === 1) {
      if (isSingleProductMode) {
        validateSingleProduct();
      } else {
        validateCart();
      }
    }
  }, [isOpen, step, cart.length, isSingleProductMode]);

  const validateSingleProduct = async () => {
    setLoading(true);
    setError(null);
    const issues: ValidationIssue[] = [];

    try {
      // Fetch latest product data
      const product = await productService.getProductById(singleProduct!.id);
      
      const issue: ValidationIssue = {
        productId: product.id,
        productName: product.name,
        cartQuantity: singleProductQuantity,
        availableQuantity: product.quantity,
        isAvailable: product.quantity >= singleProductQuantity && product.availability
      };

      if (!issue.isAvailable) {
        issues.push(issue);
      }

      setValidationIssues(issues);
      setValidatedItems([{
        ...singleProduct,
        cartQuantity: singleProductQuantity,
        dbQuantity: product.quantity,
        dbAvailability: product.availability,
        discount: product.discount || 0
      }]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to validate product. Please try again.');
      issues.push({
        productId: singleProduct!.id,
        productName: singleProduct!.name,
        cartQuantity: singleProductQuantity,
        availableQuantity: 0,
        isAvailable: false
      });
      setValidationIssues(issues);
    } finally {
      setLoading(false);
    }
  };

  const validateCart = async () => {
    setLoading(true);
    setError(null);
    const issues: ValidationIssue[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validated: any[] = [];

    try {
      for (const item of cart) {
        try {
          const product = await productService.getProductById(item.id);
          
          const issue: ValidationIssue = {
            productId: product.id,
            productName: product.name,
            cartQuantity: item.cartQuantity,
            availableQuantity: product.quantity,
            isAvailable: product.quantity >= item.cartQuantity && product.availability
          };

          if (!issue.isAvailable) {
            issues.push(issue);
          }

          validated.push({
            ...item,
            dbQuantity: product.quantity,
            dbAvailability: product.availability,
            discount: product.discount || 0
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          issues.push({
            productId: item.id,
            productName: item.name,
            cartQuantity: item.cartQuantity,
            availableQuantity: 0,
            isAvailable: false
          });
        }
      }

      setValidationIssues(issues);
      setValidatedItems(validated);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to validate cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (isSingleProductMode) {
      setSingleProductQuantity(newQuantity);
      
      // Update validation state
      setValidatedItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, cartQuantity: newQuantity } : item
        )
      );
      
      // Check if this creates a validation issue
      const item = validatedItems.find(v => v.id === productId);
      if (item) {
        if (newQuantity > item.dbQuantity) {
          setValidationIssues([{
            productId,
            productName: item.name,
            cartQuantity: newQuantity,
            availableQuantity: item.dbQuantity,
            isAvailable: false
          }]);
        } else {
          setValidationIssues([]);
        }
      }
    } else {
      updateQuantity(productId, newQuantity);
      
      // Update local validation state optimistically
      setValidatedItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, cartQuantity: newQuantity } : item
        )
      );
      
      // Check if this creates a validation issue
      const item = validatedItems.find(v => v.id === productId);
      if (item) {
        if (newQuantity > item.dbQuantity) {
          setValidationIssues(prev => {
            const existing = prev.find(i => i.productId === productId);
            if (existing) {
              return prev.map(i =>
                i.productId === productId
                  ? { ...i, cartQuantity: newQuantity }
                  : i
              );
            }
            return [...prev, {
              productId,
              productName: item.name,
              cartQuantity: newQuantity,
              availableQuantity: item.dbQuantity,
              isAvailable: false
            }];
          });
        } else {
          setValidationIssues(prev => prev.filter(i => i.productId !== productId));
        }
      }
    }
  };

  const handleRemoveItem = (productId: string) => {
    if (isSingleProductMode) {
      // In single product mode, removing the item closes the modal
      setSingleProductRemoved(true);
      handleClose();
    } else {
      removeFromCart(productId);
      setValidatedItems(prev => prev.filter(item => item.id !== productId));
      setValidationIssues(prev => prev.filter(issue => issue.productId !== productId));
    }
  };

  const canProceedToStep2 = () => {
    if (isSingleProductMode) {
      return validationIssues.length === 0 && !singleProductRemoved;
    }
    return validationIssues.length === 0 && cart.length > 0;
  };

  const canProceedToStep3 = () => {
    return customerName.trim() !== '' && 
           customerEmail.trim() !== '' && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
           customerPhone.trim() !== '';
  };

  const getItemsToDisplay = () => {
    if (isSingleProductMode) {
      return validatedItems.length > 0 ? validatedItems : [];
    }
    return validatedItems;
  };

  const calculateTotal = () => {
    const items = isSingleProductMode ? validatedItems : cart;
    return items.reduce((sum, item) => {
      const currentPrice = item.discount && item.discount > 0 
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + (currentPrice * item.cartQuantity);
    }, 0);
  };

  const calculateOriginalTotal = () => {
    const items = isSingleProductMode ? validatedItems : cart;
    return items.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  };

  const calculateSavings = () => {
    return calculateOriginalTotal() - calculateTotal();
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    setError(null);

    try {
const itemsToOrder = isSingleProductMode ? validatedItems : cart;

const orderData: CreateOrderData = {
  customerName,
  customerEmail,
  customerPhone,
  currency: 'RWF',
items: itemsToOrder.map((item: SingleProduct) => ({
  product: item,
  id: item.id,
  productId: item.id,
  price: item.discount && item.discount > 0
    ? item.price * (1 - item.discount / 100)
    : item.price,
  quantity: item.cartQuantity
}))



};


    const result = await orderService.checkout(orderData);
      
      // Clear cart only if we're not in single product mode
      if (!isSingleProductMode) {
        clearCart();
      }
      
      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      } else {
        alert('Order created successfully!');
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    if (!user) {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
    } else {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phoneNumber || '');
    }
    setValidationIssues([]);
    setValidatedItems([]);
    setError(null);
    setSingleProductRemoved(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const itemsToDisplay = getItemsToDisplay();
  const hasItems = itemsToDisplay.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isSingleProductMode ? 'Quick Checkout' : 'Checkout'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-300'
              }`}>
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Validate {isSingleProductMode ? 'Product' : 'Cart'}</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full transition-all ${step >= 2 ? 'bg-teal-600 w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-300'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Customer Info</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full transition-all ${step >= 3 ? 'bg-teal-600 w-full' : 'w-0'}`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-300'
              }`}>
                <FileCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: Cart/Product Validation */}
          {step === 1 && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <span className="ml-3 text-gray-600">
                    Validating {isSingleProductMode ? 'product' : 'cart items'}...
                  </span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  {validationIssues.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            {isSingleProductMode ? 'Product needs attention' : 'Some items need attention'}
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please update {isSingleProductMode ? 'quantity' : 'quantities'} or remove {isSingleProductMode ? 'the product' : 'items'} before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!hasItems ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        {isSingleProductMode ? 'No product selected' : 'Your cart is empty'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {itemsToDisplay.map((item) => {
                        const issue = validationIssues.find(i => i.productId === item.id);
                        const hasIssue = !!issue;
                        const currentPrice = item.discount && item.discount > 0 
                          ? item.price * (1 - item.discount / 100)
                          : item.price;

                        return (
                          <div
                            key={item.id}
                            className={`border rounded-lg p-4 ${
                              hasIssue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex gap-4">
                              {item.images && item.images[0] && (
                                <img
                                  src={`${API_URL}${item.images[0]}`}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">{item.brand} - {item.size}</p>
                                <div className="text-sm font-medium text-gray-900 mt-1 flex items-center gap-2">
                                  <span>
                                    {currentPrice.toLocaleString()} RWF / {item.perUnit}
                                  </span>
                                  {item.discount && item.discount > 0 && (
                                    <>
                                      <span className="text-sm text-gray-500 line-through">
                                        {item.price.toLocaleString()} RWF
                                      </span>
                                      <span className="text-sm text-pink-500">
                                        {item.discount}% off
                                      </span>
                                    </>
                                  )}
                                </div>

                                <div className="mt-3 flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-700">Quantity:</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max={item.dbQuantity}
                                      value={item.cartQuantity}
                                      onChange={(e) => handleQuantityUpdate(item.id, parseInt(e.target.value) || 1)}
                                      className="w-20 px-2 py-1 border rounded text-center"
                                      disabled={item.dbQuantity === 0}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-sm text-red-600 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>

                                {hasIssue && (
                                  <div className="mt-2 text-sm">
                                    {issue.availableQuantity === 0 ? (
                                      <p className="text-red-700 font-medium">
                                        ⚠️ Out of stock - Please remove this item
                                      </p>
                                    ) : (
                                      <p className="text-red-700">
                                        ⚠️ Only {issue.availableQuantity} available (you want {issue.cartQuantity})
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  {(currentPrice * item.cartQuantity).toLocaleString()} RWF
                                </p>
                                {item.discount && item.discount > 0 && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {(item.price * item.cartQuantity).toLocaleString()} RWF
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Customer Information */}
          {step === 2 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+250 XXX XXX XXX"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-medium text-teal-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {customerName}</p>
                  <p><span className="font-medium">Email:</span> {customerEmail}</p>
                  <p><span className="font-medium">Phone:</span> {customerPhone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-3">
                  {itemsToDisplay.map((item) => {
                    const currentPrice = item.discount && item.discount > 0 
                      ? item.price * (1 - item.discount / 100)
                      : item.price;

                    return (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <span>
                              {item.cartQuantity} × {currentPrice.toLocaleString()} RWF
                            </span>
                            {item.discount && item.discount > 0 && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {item.price.toLocaleString()} RWF
                                </span>
                                <span className="text-sm text-pink-500">
                                  {item.discount}% off
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">
                          {(currentPrice * item.cartQuantity).toLocaleString()} RWF
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{calculateTotal().toLocaleString()} RWF</span>
                  </div>
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Savings</span>
                      <span className="text-pink-500">-{calculateSavings().toLocaleString()} RWF</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-teal-600">{calculateTotal().toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => {
              if (step === 1) {
                handleClose();
              } else {
                setStep(step - 1);
              }
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            disabled={submitting}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 1) {
                if (canProceedToStep2()) setStep(2);
              } else if (step === 2) {
                if (canProceedToStep3()) setStep(3);
              } else if (step === 3) {
                handleSubmitOrder();
              }
            }}
            disabled={
              (step === 1 && !canProceedToStep2()) ||
              (step === 2 && !canProceedToStep3()) ||
              submitting ||
              loading
            }
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 3 ? 'Submit & Proceed to Payment' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;