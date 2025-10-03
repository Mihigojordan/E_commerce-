import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Download,
  Share2,
  HelpCircle,
  Hash,
  User,
} from 'lucide-react';
import orderService, { type Order } from '../../services/orderService';
import { type OutletContextType } from '../../router';
import { API_URL } from '../../api/api';

interface OperationStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function CustomerOrderDetailView() {
  const { role } = useOutletContext<OutletContextType>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);

  useEffect(() => {
    if (role !== 'user') {
      setError('Access restricted to users');
      setLoading(false);
      return;
    }
    if (id) {
      loadOrder();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [role, id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrder(id!);
      setOrderData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
      setOrderData(null);
      setOperationStatus({ type: 'error', message: 'Failed to load order details' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5" />,
          message: 'Your order has been completed successfully!',
          bgColor: 'bg-green-50',
        };
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-5 h-5" />,
          message: 'Your order is being processed',
          bgColor: 'bg-yellow-50',
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-5 h-5" />,
          message: 'This order has been cancelled',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Package className="w-5 h-5" />,
          message: 'Order status unknown',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const formatCurrency = (amount: number, currency: string = 'RWF') => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency || 'RWF',
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-RW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateItemPrice = (item: Order['orderItems'][0]) => {
    const sellingPrice = Number(item.product.price);
    const discountAmount = (Number(item.product.discount) / 100) * sellingPrice;
    const discountedPrice = sellingPrice - discountAmount;
    const subtotal = discountedPrice * item.quantity;
    return { discountedPrice, discountAmount, subtotal };
  };

  const calculateTotals = () => {
    if (!orderData?.orderItems) return { subtotal: 0, totalDiscount: 0, total: 0 };
    let subtotal = 0;
    let totalDiscount = 0;
    orderData.orderItems.forEach((item) => {
      const { discountedPrice, discountAmount } = calculateItemPrice(item);
      subtotal += item.product.price * item.quantity;
      totalDiscount += discountAmount * item.quantity;
    });
    const total = subtotal - totalDiscount;
    return { subtotal, totalDiscount, total };
  };

  const handleDownload = () => {
    alert('Receipt download would start here. In production, this would generate a PDF receipt.');
  };

  const handleShare = () => {
    alert('Share functionality would open here. In production, this would allow sharing order details.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <div className="inline-flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading order details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-sm">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(orderData.status);
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className=" mx-auto space-y-6">
        {/* Status Banner */}
        <div className={`${statusInfo.bgColor} rounded-lg p-6 border-2 ${statusInfo.color.split(' ')[2]}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${statusInfo.color}`}>
              {statusInfo.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{statusInfo.message}</h1>
              <p className="text-gray-600 mt-1">Order placed on {formatDate(orderData.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                title="Download Receipt"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                title="Share Order"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Order ID Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-xl font-mono font-bold text-gray-900">{orderData.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border ${statusInfo.color} font-semibold flex items-center gap-2`}>
              {statusInfo.icon}
              <span>{orderData.status}</span>
            </div>
          </div>
        </div>

        {/* Order Progress Tracker */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  orderData.status === 'PENDING' || orderData.status === 'COMPLETED'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900 mt-2">Order Placed</p>
              <p className="text-xs text-gray-500">{formatDate(orderData.createdAt)}</p>
            </div>
            <div
              className={`flex-1 h-1 ${orderData.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'}`}
              style={{ marginBottom: '40px' }}
            ></div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  orderData.status === 'COMPLETED'
                    ? 'bg-green-500 text-white'
                    : orderData.status === 'PENDING'
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900 mt-2">Processing</p>
              <p className="text-xs text-gray-500">
                {orderData.status === 'PENDING' ? 'In progress' : orderData.status === 'COMPLETED' ? 'Completed' : 'Pending'}
              </p>
            </div>
            <div
              className={`flex-1 h-1 ${orderData.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'}`}
              style={{ marginBottom: '40px' }}
            ></div>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  orderData.status === 'COMPLETED' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900 mt-2">Completed</p>
              <p className="text-xs text-gray-500">
                {orderData.status === 'COMPLETED' ? formatDate(orderData.updatedAt) : 'Waiting'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({orderData.orderItems.length})
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {orderData.orderItems.map((item) => {
              const { discountedPrice, discountAmount, subtotal } = calculateItemPrice(item);
              return (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <img
                    src={`${API_URL}${item.product.images[0]}` || 'https://via.placeholder.com/48'}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.product.brand}</p>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-gray-500">Size: {item.product.size}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.product.discount > 0 ? (
                          <div>
                            <p className="text-sm text-gray-400 line-through">{formatCurrency(item.product.price)}</p>
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(discountedPrice)}</p>
                            <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              {item.product.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(discountedPrice)}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-sm text-gray-500">Per {item.product.perUnit}</p>
                      <p className="text-base font-semibold text-gray-900">Subtotal: {formatCurrency(subtotal)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(totals.totalDiscount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(orderData.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {orderData.payment && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment ID</p>
                <p className="font-mono text-sm text-gray-900">{orderData.payment.id || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
                <p className="font-mono text-sm text-gray-900">{orderData.payment.txRef || 'N/A'}</p>
              </div>
              {orderData.payment.transactionId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm text-gray-900">{orderData.payment.transactionId}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize">{orderData.payment.paymentMethod || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    orderData.payment.status === 'SUCCESSFUL'
                      ? 'bg-green-100 text-green-800'
                      : orderData.payment.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {orderData.payment.status || 'N/A'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Amount</p>
                <p className="font-semibold text-gray-900">{formatCurrency(orderData.payment.amount, orderData.payment.currency)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Currency</p>
                <p className="font-semibold text-gray-900">{orderData.payment.currency || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Created</p>
                <p className="font-semibold text-gray-900">{formatDate(orderData.payment.createdAt)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Payment Updated</p>
                <p className="font-semibold text-gray-900">{formatDate(orderData.payment.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {orderData.purchasingUser && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">User ID</p>
                  <p className="font-mono text-sm text-gray-900">{orderData.purchasingUser.id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{orderData.purchasingUser.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{orderData.purchasingUser.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">{orderData.purchasingUser.phoneNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Created</p>
                  <p className="font-semibold text-gray-900">{formatDate(orderData.purchasingUser.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Updated</p>
                  <p className="font-semibold text-gray-900">{formatDate(orderData.purchasingUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-700 mb-3">
                If you have any questions about your order, please don't hesitate to contact our customer support team.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {operationStatus && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-sm ${
                operationStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : operationStatus.type === 'error'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="font-medium">{operationStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}