import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Loader2, ShoppingCart, User, FileCheck } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import productService from '../../../services/ProductService';
import orderService from '../../../services/orderService';
import { API_URL } from '../../../api/api';

interface ValidationIssue {
  productId: string;
  productName: string;
  cartQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [validatedItems, setValidatedItems] = useState<any[]>([]);
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Validate cart items against database
  useEffect(() => {
    if (isOpen && step === 1) {
      validateCart();
    }
  }, [isOpen, step]);

  const validateCart = async () => {
    setLoading(true);
    setError(null);
    const issues: ValidationIssue[] = [];
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
            dbAvailability: product.availability
          });
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
    } catch (err) {
      setError('Failed to validate cart items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
    // Re-validate after update
    setTimeout(() => validateCart(), 100);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    setTimeout(() => validateCart(), 100);
  };

  const canProceedToStep2 = () => {
    return validationIssues.length === 0 && cart.length > 0;
  };

  const canProceedToStep3 = () => {
    return customerName.trim() !== '' && 
           customerEmail.trim() !== '' && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
           customerPhone.trim() !== '';
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        currency: 'RWF',
        items: cart.map(item => ({
          productId: item.id,
          price: item.price,
          quantity: item.cartQuantity
        }))
      };

      const result = await orderService.checkout(orderData);
      
      // Clear cart on success
      clearCart();
      
      // Redirect to payment link
      if (result.paymentLink) {
        window.location.href = result.paymentLink;
      } else {
        alert('Order created successfully!');
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setValidationIssues([]);
    setValidatedItems([]);
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
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
              <span className="text-sm font-medium">Validate Cart</span>
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
          {/* Step 1: Cart Validation */}
          {step === 1 && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                  <span className="ml-3 text-gray-600">Validating cart items...</span>
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
                          <p className="font-medium text-yellow-800">Some items need attention</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please update quantities or remove items before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {validatedItems.map((item) => {
                        const issue = validationIssues.find(i => i.productId === item.id);
                        const hasIssue = !!issue;

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
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                  {item.price.toLocaleString()} RWF / {item.perUnit}
                                </p>

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
                                  {(item.price * item.cartQuantity).toLocaleString()} RWF
                                </p>
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
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.cartQuantity} × {item.price.toLocaleString()} RWF
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.cartQuantity * item.price).toLocaleString()} RWF
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-teal-600">{calculateTotal().toLocaleString()} RWF</span>
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