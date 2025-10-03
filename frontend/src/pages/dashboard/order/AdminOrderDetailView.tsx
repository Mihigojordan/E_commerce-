import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import {
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Hash,
} from 'lucide-react';
import orderService, { type Order } from '../../../services/orderService';
import { type OutletContextType } from '../../../router';
import { API_URL } from '../../../api/api';

interface OperationStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function AdminOrderDetailView() {
  const { role } = useOutletContext<OutletContextType>();
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);

  useEffect(() => {
    if (role !== 'admin') {
      setError('Access restricted to admin users');
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESSFUL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESSFUL':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CANCELLED':
      case 'FAILED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

const calculateItemPrice = (item: Order['orderItems'][0]) => {
  const sellingPrice = Number(item.product.price) || 0; // safer than parseFloat
  const discountPercent = Number(item.product?.discount) || 0;

  // Calculate discount amount
  const discountAmount = (discountPercent / 100) * sellingPrice;

  // Apply discount
  const discountedPrice = sellingPrice - discountAmount;

  // Total for all quantities
  const totalPrice = discountedPrice * (item.quantity || 1);

  return {
    discountedPrice,
    discountAmount,
    totalPrice,
  };
};


  const calculateTotalOrderPrice = () => {
    if (!orderData?.orderItems) return 0;
    return orderData.orderItems.reduce((total, item) => {
      const { totalPrice } = calculateItemPrice(item);
      return total + totalPrice;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-sm">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-500 mt-1">Order ID: {orderData.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(orderData.status)}`}>
              {getStatusIcon(orderData.status)}
              <span className="font-semibold">{orderData.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(orderData.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(orderData.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Order Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(orderData.amount, orderData.currency)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information from Order */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information (Order Data)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium text-gray-900">{orderData.customerName || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customer Email</p>
                <p className="font-medium text-gray-900">{orderData.customerEmail || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customer Phone</p>
                <p className="font-medium text-gray-900">{orderData.customerPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registered User Information (if applicable) */}
        {orderData.purchasingUser && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Registered User Account
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900">{orderData.purchasingUser.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Name</p>
                  <p className="font-medium text-gray-900">{orderData.purchasingUser.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Email</p>
                  <p className="font-medium text-gray-900">{orderData.purchasingUser.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Phone</p>
                  <p className="font-medium text-gray-900">{orderData.purchasingUser.phoneNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium text-gray-900">{formatDate(orderData.purchasingUser.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Account Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(orderData.purchasingUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        {orderData.payment && (
          <div className="bg-white rounded-lg shadow-sm p-6 w-full border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full place-item-center gap-4">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-medium text-gray-900">{orderData.payment.id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Transaction Ref</p>
                  <p className="font-medium text-gray-900">{orderData.payment.txRef || 'N/A'}</p>
                </div>
              </div>
              {orderData.payment.transactionId && (
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-900">{orderData.payment.transactionId}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900 capitalize">{orderData.payment.paymentMethod || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(orderData.payment.status)}`}>
                    {orderData.payment.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Amount</p>
                  <p className="font-medium text-gray-900">{formatCurrency(orderData.payment.amount || 0, orderData.payment.currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Currency</p>
                  <p className="font-medium text-gray-900">{orderData.payment.currency || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Created</p>
                  <p className="font-medium text-gray-900">{formatDate(orderData.payment.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Payment Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(orderData.payment.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderData.orderItems.map((item) => {
                  const { discountedPrice, discountAmount } = calculateItemPrice(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${API_URL}${item.product.images[0]}` || 'https://via.placeholder.com/48'}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{item.product.perUnit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.product.brand}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.product.size}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(discountedPrice, orderData.currency)}</td>
                      <td className="px-6 py-4 text-right">
                        {item.product.discount > 0 ? (
                          <div>
                            <span className="text-sm font-medium text-orange-600">{item.product.discount}%</span>
                            <p className="text-xs text-gray-500">-{formatCurrency(discountAmount, orderData.currency)}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(item.subtotal, orderData.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-right text-gray-900">TOTAL ORDER</td>
                  <td className="px-6 py-4 text-right text-lg text-gray-900">{formatCurrency(calculateTotalOrderPrice(), orderData.currency)}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
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
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">{operationStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}