import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  ShoppingBag, 
  Home,
  ArrowRight,
  Package,
  Mail,
  Phone,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const status = searchParams.get('status'); // 'success' or 'failed'
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    // Simulate a brief loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate(`/user/dashboard/my-orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing payment status...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Success Animation Container */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-teal-600" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {orderId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Order ID</span>
                  <span className="text-gray-900 font-semibold font-mono text-sm bg-gray-50 px-3 py-1 rounded">
                    #{orderId}
                  </span>
                </div>
              )}
              
              {transactionId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Transaction ID</span>
                  <span className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-1 rounded">
                    {transactionId}
                  </span>
                </div>
              )}
              
              {amount && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Amount Paid</span>
                  <span className="text-2xl font-bold text-teal-600">
                    {parseFloat(amount).toLocaleString()} RWF
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* What's Next Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Order Confirmation Email</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive a confirmation email with your order details shortly.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Order Processing</h4>
                  <p className="text-sm text-gray-600">
                    Our team will prepare your order for shipment within 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Stay Updated</h4>
                  <p className="text-sm text-gray-600">
                    We'll keep you informed about your order status via email and SMS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewOrders}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <Package className="w-5 h-5" />
              View My Orders
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
            <button
              onClick={handleGoHome}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1 mx-auto"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Failed Animation Container */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-pulse">
              <XCircle className="w-16 h-16 text-red-600" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We couldn't process your payment. Please try again or use a different payment method.
            </p>
          </div>

          {/* Error Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Transaction Details
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {transactionId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Transaction ID</span>
                  <span className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-1 rounded">
                    {transactionId}
                  </span>
                </div>
              )}
              
              {amount && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Attempted Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    {parseFloat(amount).toLocaleString()} RWF
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold text-sm">
                  <XCircle className="w-4 h-4" />
                  Failed
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </button>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help with your payment?</p>
            <button
              onClick={() => navigate('/contact')}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1 mx-auto"
            >
              <Phone className="w-4 h-4" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for invalid or missing status
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Unknown Status Animation Container */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6 animate-pulse">
            <AlertTriangle className="w-16 h-16 text-yellow-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Payment Status Unknown
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We couldn't determine the status of your payment. Please check your order history or contact support for assistance.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Transaction Details
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            {transactionId && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Transaction ID</span>
                <span className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-1 rounded">
                  {transactionId}
                </span>
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Attempted Amount</span>
                <span className="text-xl font-bold text-gray-900">
                  {parseFloat(amount).toLocaleString()} RWF
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 font-medium">Status</span>
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                Unknown
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleViewOrders}
            className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
          >
            <Package className="w-5 h-5" />
            Check Orders
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help with your payment?</p>
          <button
            onClick={() => navigate('/contact')}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1 mx-auto"
          >
            <Phone className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;