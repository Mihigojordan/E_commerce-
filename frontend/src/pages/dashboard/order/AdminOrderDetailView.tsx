import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Download,
} from 'lucide-react';
import orderService, { type Order } from '../../../services/orderService';
import { type OutletContextType } from '../../../router';
import { API_URL } from '../../../api/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

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
    const sellingPrice = Number(item.product.price) || 0;
    const discountPercent = Number(item.product?.discount) || 0;

    const discountAmount = (discountPercent / 100) * sellingPrice;
    const discountedPrice = sellingPrice - discountAmount;
    const totalPrice = discountedPrice * (item.quantity || 1);

    return {
      discountedPrice,
      discountAmount,
      totalPrice,
    };
  };

   const handleDownload = async () => {
      if (!contentRef.current || !orderData) return;
      
      setIsGeneratingPDF(true);
      setOperationStatus({ type: 'info', message: 'Generating PDF...' });
  
      try {
        // Clone the content to manipulate it
        const originalContent = contentRef.current;
        const clonedContent = originalContent.cloneNode(true) as HTMLElement;
        
        // Hide the download button in the cloned content
        const downloadButtons = clonedContent.querySelectorAll('button');
        downloadButtons.forEach(btn => {
          if (btn.innerHTML.includes('Download') || btn.innerHTML.includes('download')) {
            btn.style.display = 'none';
          }
        });
  
        // Append cloned content temporarily to body
        clonedContent.style.position = 'absolute';
        clonedContent.style.left = '-9999px';
        clonedContent.style.width = originalContent.offsetWidth + 'px';
        document.body.appendChild(clonedContent);
  
        // Generate canvas from the cloned content with higher quality
        const canvas = await html2canvas(clonedContent, {
          scale: 3, // Increased scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: '#f9fafb',
          windowWidth: 1200, // Set a good width for rendering
        });
  
        // Remove cloned content
        document.body.removeChild(clonedContent);
  
        // Calculate PDF dimensions (A4 landscape for more space)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Add margins for better appearance
        const margin = 10; // 10mm margin on all sides
        const availableWidth = pdfWidth - (2 * margin);
        const availableHeight = pdfHeight - (2 * margin);
        
        const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(availableWidth / (imgWidth * 0.264583), availableHeight / (imgHeight * 0.264583));
        
        const scaledWidth = imgWidth * 0.264583 * ratio;
        const scaledHeight = imgHeight * 0.264583 * ratio;
        
        let heightLeft = scaledHeight;
        let position = 0;
  
        // Add first page with margin
        pdf.addImage(imgData, 'PNG', margin, margin + position, scaledWidth, scaledHeight);
        heightLeft -= availableHeight;
  
        // Add additional pages if content is longer than one page
        while (heightLeft > 0) {
          position = -(availableHeight - margin) * Math.ceil((scaledHeight - heightLeft) / availableHeight);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position + margin, scaledWidth, scaledHeight);
          heightLeft -= availableHeight;
        }
  
        // Save the PDF
        pdf.save(`Order_${orderData.id}_${new Date().toISOString().split('T')[0]}.pdf`);
        
        setOperationStatus({ type: 'success', message: 'PDF downloaded successfully!' });
        setTimeout(() => setOperationStatus(null), 3000);
      } catch (error) {
        console.error('Error generating PDF:', error);
        setOperationStatus({ type: 'error', message: 'Failed to generate PDF' });
        setTimeout(() => setOperationStatus(null), 3000);
      } finally {
        setIsGeneratingPDF(false);
      }
    };
  

  const calculateTotalOrderPrice = () => {
    if (!orderData?.orderItems) return 0;
    return orderData.orderItems.reduce((total, item) => {
      const { totalPrice } = calculateItemPrice(item);
      return total + totalPrice;
    }, 0);
  };

  // Group payments by retry chain
  const organizePaymentsByRetry = (payments: any[]) => {
    if (!payments || payments.length === 0) return [];

    // Find root payments (those without retryOfPaymentId)
    const rootPayments = payments.filter(p => !p.retryOfPaymentId);
    
    // Build chains for each root payment
    return rootPayments.map(root => {
      const chain = [root];
      
      // Find all retries recursively
      const findRetries = (parentId: string) => {
        const retries = payments.filter(p => p.retryOfPaymentId === parentId);
        retries.forEach(retry => {
          chain.push(retry);
          findRetries(retry.id);
        });
      };
      
      findRetries(root.id);
      return chain;
    });
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

  const statusInfo = getStatusInfo(orderData.status);
  const paymentChains = organizePaymentsByRetry(orderData.payments || []);
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-sm">
      <div className="max-w-7xl mx-auto space-y-6" ref={contentRef}>
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
                        disabled={isGeneratingPDF}
                        className={`p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 ${
                          isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Download Receipt"
                      >
                        {isGeneratingPDF ? (
                          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
        
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

        {/* Payment Information - Updated for Multiple Payments */}
        {orderData.payments && orderData.payments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment History ({orderData.payments.length} {orderData.payments.length === 1 ? 'Payment' : 'Payments'})
            </h2>
            
            <div className="space-y-6">
              {paymentChains.map((chain, chainIndex) => (
                <div key={chainIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">
                      Payment Attempt #{chainIndex + 1}
                      {chain.length > 1 && <span className="text-gray-500 font-normal ml-2">({chain.length} attempts)</span>}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {chain.map((payment, attemptIndex) => (
                      <div
                        key={payment.id}
                        className={`bg-white rounded-lg p-4 border-2 ${
                          payment.status === 'SUCCESSFUL' 
                            ? 'border-green-300' 
                            : payment.status === 'FAILED'
                            ? 'border-red-300'
                            : 'border-yellow-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {attemptIndex > 0 && (
                              <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-medium">
                                <RefreshCw className="w-3 h-3" />
                                Retry #{attemptIndex}
                              </div>
                            )}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1">{payment.status || 'N/A'}</span>
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="flex items-start gap-2">
                            <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Payment ID</p>
                              <p className="font-medium text-gray-900 text-xs break-all">{payment.id}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Transaction Ref</p>
                              <p className="font-medium text-gray-900 text-xs">{payment.txRef || 'N/A'}</p>
                            </div>
                          </div>

                          {payment.transactionId && (
                            <div className="flex items-start gap-2">
                              <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Transaction ID</p>
                                <p className="font-medium text-gray-900 text-xs">{payment.transactionId}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Payment Method</p>
                              <p className="font-medium text-gray-900 text-xs capitalize">{payment.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-medium text-gray-900 text-xs">{formatCurrency(payment.amount || 0, payment.currency)}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Last Updated</p>
                              <p className="font-medium text-gray-900 text-xs">{formatDate(payment.updatedAt)}</p>
                            </div>
                          </div>

                          {payment.retryOfPaymentId && (
                            <div className="flex items-start gap-2 col-span-full">
                              <RefreshCw className="w-4 h-4 text-orange-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Retry Of Payment</p>
                                <p className="font-medium text-orange-600 text-xs break-all">{payment.retryOfPaymentId}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">Payment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-blue-600">Total Payments</p>
                  <p className="font-bold text-blue-900">{orderData.payments.length}</p>
                </div>
                <div>
                  <p className="text-green-600">Successful</p>
                  <p className="font-bold text-green-900">
                    {orderData.payments.filter(p => p.status === 'SUCCESSFUL').length}
                  </p>
                </div>
                <div>
                  <p className="text-red-600">Failed</p>
                  <p className="font-bold text-red-900">
                    {orderData.payments.filter(p => p.status === 'FAILED').length}
                  </p>
                </div>
                <div>
                  <p className="text-yellow-600">Pending</p>
                  <p className="font-bold text-yellow-900">
                    {orderData.payments.filter(p => p.status === 'PENDING').length}
                  </p>
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