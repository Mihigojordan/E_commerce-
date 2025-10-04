import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShoppingCart,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Settings,
  DollarSign,
  Clock,
  Download,
} from "lucide-react";
import jsPDF from 'jspdf';
import orderService, { type Order, type OrderStatus } from "../../../services/orderService";
import { useNavigate, useOutletContext } from "react-router-dom";
import { type OutletContextType } from "../../../router";

type ViewMode = "table" | "grid" | "list";

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const OrderDashboard: React.FC = () => {
  const { role } = useOutletContext<OutletContextType>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Order>("customerName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      setError("Access restricted to admin users");
      setLoading(false);
      return;
    }
    loadData();
  }, [role]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allOrders]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setAllOrders(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allOrders];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order?.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order?.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      if (sortBy === "amount") {
        const aNum = Number(aValue) || 0;
        const bNum = Number(bValue) || 0;
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setOrders(filtered);
    setCurrentPage(1);
  };

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(order => order.status === "PENDING").length;
  const completedOrders = allOrders.filter(order => order.status === "COMPLETED").length;
  const cancelledOrders = allOrders.filter(order => order.status === "CANCELLED").length;

  const handleViewOrder = (order: Order) => {
    if (!order?.id) return;
    navigate(`/${role}/dashboard/order-management/${order.id}`);
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return new Date().toLocaleDateString("en-GB");
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? new Date().toLocaleDateString("en-GB")
      : parsedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const getPaymentStatus = (order: Order): string => {
    if (!order.payments || order.payments.length === 0) return "N/A";
    
    const successfulPayment = order.payments.find(p => p.status === "SUCCESSFUL");
    if (successfulPayment) return "SUCCESSFUL";
    
    const pendingPayment = order.payments.find(p => p.status === "PENDING");
    if (pendingPayment) return "PENDING";
    
    return "FAILED";
  };

  const getPaymentAmount = (order: Order): string => {
    if (!order.payments || order.payments.length === 0) return "N/A";
    
    const successfulPayment = order.payments.find(p => p.status === "SUCCESSFUL");
    const latestPayment = order.payments[order.payments.length - 1];
    const paymentToShow = successfulPayment || latestPayment;
    
    return formatCurrency(paymentToShow.amount, order.currency);
  };

  const handleDownloadPDF = async (order: Order) => {
    if (!order?.id) return;
    
    setGeneratingPDF(order.id);
    showOperationStatus('info', 'Generating PDF...');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      // Helper function to add text with word wrap
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Header
      pdf.setFillColor(34, 197, 94);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER RECEIPT', pageWidth / 2, 15, { align: 'center' });
      
      yPos = 35;
      pdf.setTextColor(0, 0, 0);

      // Order Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Order Information', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Order ID: ${order.id}`, margin, yPos);
      yPos += 6;
      pdf.text(`Order Date: ${formatDate(order.createdAt)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Status: ${order.status}`, margin, yPos);
      yPos += 6;
      pdf.text(`Total Amount: ${formatCurrency(order.amount, order.currency)}`, margin, yPos);
      yPos += 10;

      // Customer Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Information', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${order.customerName || 'N/A'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Email: ${order.customerEmail || 'N/A'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Phone: ${order.customerPhone || 'N/A'}`, margin, yPos);
      yPos += 10;

      // Payment Information
      if (order.payments && order.payments.length > 0) {
        const successfulPayment = order.payments.find(p => p.status === "SUCCESSFUL");
        const displayPayment = successfulPayment || order.payments[order.payments.length - 1];

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Payment Information', margin, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Payment Status: ${displayPayment.status}`, margin, yPos);
        yPos += 6;
        pdf.text(`Payment Method: ${displayPayment.paymentMethod || 'N/A'}`, margin, yPos);
        yPos += 6;
        pdf.text(`Payment Amount: ${formatCurrency(displayPayment.amount, displayPayment.currency)}`, margin, yPos);
        yPos += 6;
        pdf.text(`Transaction Ref: ${displayPayment.txRef || 'N/A'}`, margin, yPos);
        yPos += 10;
      }

      // Order Items
      if (order.orderItems && order.orderItems.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Order Items', margin, yPos);
        yPos += 8;

        // Table header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Product', margin + 2, yPos);
        pdf.text('Qty', pageWidth - margin - 50, yPos);
        pdf.text('Price', pageWidth - margin - 30, yPos);
        yPos += 8;

        // Table rows
        pdf.setFont('helvetica', 'normal');
        order.orderItems.forEach((item, index) => {
          if (yPos > pageHeight - 30) {
            pdf.addPage();
            yPos = margin;
          }

          const productName = item.product.name || 'N/A';
          const quantity = item.quantity.toString();
          const price = formatCurrency(item.product.price, order.currency);

          pdf.text(productName.substring(0, 40), margin + 2, yPos);
          pdf.text(quantity, pageWidth - margin - 50, yPos);
          pdf.text(price, pageWidth - margin - 30, yPos);
          yPos += 7;

          // Add line separator
          if (index < order.orderItems.length - 1) {
            pdf.setDrawColor(220, 220, 220);
            pdf.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
          }
        });

        yPos += 5;
      }

      // Total
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL:', pageWidth - margin - 60, yPos);
      pdf.text(formatCurrency(order.amount, order.currency), pageWidth - margin - 30, yPos, { align: 'right' });

      // Footer
      yPos = pageHeight - 20;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      pdf.text('Thank you for your order!', pageWidth / 2, yPos + 5, { align: 'center' });

      // Save PDF
      pdf.save(`Order_${order.id}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      showOperationStatus('success', 'PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showOperationStatus('error', 'Failed to generate PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const renderTableView = () => (
    <div className="bg-white rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">#</th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy("customerName");
                  setSortOrder(sortBy === "customerName" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "customerName" ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                onClick={() => {
                  setSortBy("amount");
                  setSortOrder(sortBy === "amount" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Order Amount</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "amount" ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden sm:table-cell">
                <div className="flex items-center space-x-1">
                  <span>Payment Status</span>
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden sm:table-cell">
                <div className="flex items-center space-x-1">
                  <span>Payment Amount</span>
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => {
                  setSortBy("status");
                  setSortOrder(sortBy === "status" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Order Status</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "status" ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden sm:table-cell">
                <div className="flex items-center space-x-1">
                  <span>Attempts</span>
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder(sortBy === "createdAt" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "createdAt" ? "text-green-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-right py-2 px-2 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentOrders.map((order, index) => (
              <tr key={order.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2 text-gray-700">{startIndex + index + 1}</td>
                <td className="py-2 px-2">
                  <div>
                    <div className="font-medium text-gray-900 text-xs truncate max-w-32">{order.customerName || "N/A"}</div>
                    <div className="text-gray-500 text-xs truncate max-w-32">{order.customerEmail || "No email"}</div>
                  </div>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden lg:table-cell font-medium">
                  {formatCurrency(order.amount, order.currency)}
                </td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      getPaymentStatus(order) === "SUCCESSFUL" ? "bg-green-100 text-green-800" :
                      getPaymentStatus(order) === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      getPaymentStatus(order) === "FAILED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getPaymentStatus(order)}
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell font-medium">
                  {getPaymentAmount(order)}
                </td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">
                  {order.payments?.length || 0}
                </td>
                <td className="py-2 px-2 text-gray-700 hidden md:table-cell">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-gray-400 hover:text-green-600 p-1"
                      title="View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(order)}
                      disabled={generatingPDF === order.id}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-50"
                      title="Download PDF"
                    >
                      {generatingPDF === order.id ? (
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {currentOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-shadow"
        >
          <div className="mb-3">
            <div className="font-medium text-gray-900 text-xs truncate">{order.customerName || "N/A"}</div>
            <div className="text-gray-500 text-xs truncate">{order.customerEmail || "No email"}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-green-600 text-sm">{formatCurrency(order.amount, order.currency)}</div>
              <span
                className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-xs">Payment: {getPaymentStatus(order)}</div>
              <div className="text-gray-500 text-xs font-medium">{getPaymentAmount(order)}</div>
            </div>
            <div className="text-gray-500 text-xs">Items: {order.orderItems.length}</div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => handleViewOrder(order)}
                className="text-gray-400 hover:text-green-600 p-1"
                title="View"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDownloadPDF(order)}
                disabled={generatingPDF === order.id}
                className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-50"
                title="Download PDF"
              >
                {generatingPDF === order.id ? (
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
      {currentOrders.map((order) => (
        <div key={order.id} className="px-4 py-3 hover:bg-gray-25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{order.customerName || "N/A"}</div>
                <div className="text-gray-500 text-xs truncate">{order.customerEmail || "No email"} • {order.customerPhone || "No phone"}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-semibold text-green-600 text-xs">{formatCurrency(order.amount, order.currency)}</span>
                  <span className="text-gray-400 text-xs">Items: {order.orderItems.length}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-4 gap-4 text-xs text-gray-600 flex-1 max-w-xl px-4">
              <span
                className={`inline-flex px-1.5 py-0.5 rounded-full font-medium ${
                  order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
              <span
                className={`inline-flex px-1.5 py-0.5 rounded-full font-medium ${
                  getPaymentStatus(order) === "SUCCESSFUL" ? "bg-green-100 text-green-800" :
                  getPaymentStatus(order) === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                  getPaymentStatus(order) === "FAILED" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {getPaymentStatus(order)}
              </span>
              <span>{getPaymentAmount(order)}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => handleViewOrder(order)}
                className="text-gray-400 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                title="View Order"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownloadPDF(order)}
                disabled={generatingPDF === order.id}
                className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50"
                title="Download PDF"
              >
                {generatingPDF === order.id ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between bg-white px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 text-xs rounded ${
                currentPage === page
                  ? "bg-green-500 text-white"
                  : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-xs">
      <div className="bg-white shadow-md">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Order Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">View your order history</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending Orders</p>
                <p className="text-lg font-semibold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Completed Orders</p>
                <p className="text-lg font-semibold text-gray-900">{completedOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Cancelled Orders</p>
                <p className="text-lg font-semibold text-gray-900">{cancelledOrders}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1 px-2 py-1.5 text-xs border rounded transition-colors ${
                  showFilters ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-3 h-3" />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-") as [keyof Order, "asc" | "desc"];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="customerName-asc">Customer (A-Z)</option>
                <option value="customerName-desc">Customer (Z-A)</option>
                <option value="amount-asc">Amount (Low to High)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "table" ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Table View"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "grid" ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "list" ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="List View"
                >
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-xs">{error}</div>
        )}

        {loading ? (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
            <div className="inline-flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading orders...</span>
            </div>
          </div>
        ) : currentOrders.length === 0 ? (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
            <div className="text-xs">
              {searchTerm ? "No orders found matching your criteria" : "No orders found"}
            </div>
          </div>
        ) : (
          <div>
            {viewMode === "table" && renderTableView()}
            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {renderPagination()}
          </div>
        )}

        {operationStatus && (
          <div className="fixed top-4 right-4 z-50">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-xs ${
                operationStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : operationStatus.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"
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
};

export default OrderDashboard;