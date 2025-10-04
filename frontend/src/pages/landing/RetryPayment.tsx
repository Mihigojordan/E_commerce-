import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import orderService, { type Order } from '../../services/orderService';

export default function RetryPaymentPage() {
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [retrying, setRetrying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load order ID from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
      fetchOrder(orderIdParam);
    }
  }, []);

  // Update URL when order ID changes
  const updateUrlParams = (id: string) => {
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set('orderId', id);
    } else {
      url.searchParams.delete('orderId');
    }
    window.history.replaceState({}, '', url);
  };

  const fetchOrder = async (id: string) => {
    const trimmedId = id.trim();
    
    if (!trimmedId) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setOrder(null);

    try {
      const fetchedOrder = await orderService.getOrder(trimmedId);
      
      // Validate order structure
      if (!fetchedOrder || typeof fetchedOrder !== 'object') {
        throw new Error('Invalid order data received');
      }

      if (!fetchedOrder.id) {
        throw new Error('Order is missing required ID field');
      }

      // Validate payments array exists
      if (!Array.isArray(fetchedOrder.payments)) {
        throw new Error('Invalid payments data');
      }

      setOrder(fetchedOrder);
      updateUrlParams(trimmedId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order. Please check the order ID.';
      setError(errorMessage);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrderId(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
    
    if (!value) {
      setOrder(null);
      setError('');
      updateUrlParams('');
    }
  };

  const handleFetchOrder = () => {
    if (!orderId.trim()) {
      setError('Order ID cannot be empty');
      return;
    }
    
    fetchOrder(orderId);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (orderId.trim()) {
        fetchOrder(orderId);
      } else {
        setError('Order ID cannot be empty');
      }
    }
  };

  // Get the most recent payment status
  const getLatestPaymentStatus = () => {
    if (!order || !order.payments || order.payments.length === 0) {
      return null;
    }
    
    // Sort by createdAt descending to get the most recent payment
    const sortedPayments = [...order.payments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return sortedPayments[0].status;
  };

  // Check if there's any failed payment
  const hasFailedPayment = () => {
    if (!order || !order.payments || order.payments.length === 0) {
      return false;
    }
    
    return order.payments.some(payment => payment.status === 'FAILED');
  };

  // Can retry if the latest payment is FAILED
  const canRetryPayment = () => {
    const latestStatus = getLatestPaymentStatus();
    return latestStatus === 'FAILED';
  };

  const handleRetryPayment = async () => {
    if (!order) {
      setError('No order found');
      return;
    }

    if (!canRetryPayment()) {
      setError('Payment retry is not available for this order');
      return;
    }

    setRetrying(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await orderService.retryPayment(order.id);
      
      // Validate response
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }

      if (response.message) {
        setSuccessMessage(response.message);
      }
      
      // Redirect to payment link if provided
      if (response.link && typeof response.link === 'string') {
        setTimeout(() => {
          window.location.href = response.link;
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to retry payment. Please try again.';
      setError(errorMessage);
    } finally {
      setRetrying(false);
    }
  };

  const latestPaymentStatus = getLatestPaymentStatus();
  const totalPaymentAttempts = order?.payments?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-cyan-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <RefreshCw className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Retry Payment</h1>
            <p className="text-gray-600">Enter your order ID to retry a failed payment</p>
          </div>

          <div className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={orderId}
                onChange={handleOrderIdChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter Order ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                aria-label="Order ID"
                aria-invalid={!!error}
              />
              <button
                onClick={handleFetchOrder}
                disabled={loading || !orderId.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Fetch Order'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" role="alert">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3" role="status">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {order && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">{order.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{order.customerEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">
                    {order.currency || ''} {order.amount ? order.amount.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Latest Payment Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    latestPaymentStatus === 'SUCCESSFUL' 
                      ? 'bg-green-100 text-green-700'
                      : latestPaymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {latestPaymentStatus || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Attempts:</span>
                  <span className="font-medium text-gray-900">{totalPaymentAttempts}</span>
                </div>
              </div>

              {/* Payment History */}
              {order.payments && order.payments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment History</h3>
                  <div className="space-y-2">
                    {[...order.payments]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((payment, index) => (
                        <div key={payment.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              {index === 0 ? 'Latest' : `Attempt ${order.payments.length - index}`}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {new Date(payment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            payment.status === 'SUCCESSFUL' 
                              ? 'bg-green-100 text-green-700'
                              : payment.status === 'FAILED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                {canRetryPayment() ? (
                  <button
                    onClick={handleRetryPayment}
                    disabled={retrying}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {retrying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Retry Payment
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium">Payment Retry Not Available</p>
                      <p className="text-amber-700 text-sm mt-1">
                        {latestPaymentStatus === 'SUCCESSFUL' 
                          ? 'This payment has already been completed successfully.'
                          : latestPaymentStatus === 'PENDING'
                          ? 'A payment is currently pending. Please wait for it to complete.'
                          : 'Payment retry is only available for failed payments.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!order && !loading && !error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Enter an order ID to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}