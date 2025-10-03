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
} from "lucide-react";
import orderService, { type Order, type OrderStatus } from "../../services/orderService";
import { useNavigate, useOutletContext } from "react-router-dom";
import usePurchasingUserAuth from "../../context/PurchasingUserAuthContext";
import { type OutletContextType } from "../../router";

type ViewMode = "table" | "grid" | "list";

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const CustomerOrderDashboard: React.FC = () => {
  const { role } = useOutletContext<OutletContextType>();
  const { user } = usePurchasingUserAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Order>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "user") {
      setError("Access restricted to users");
      setLoading(false);
      return;
    }
    if (user?.id) {
      loadData();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [role, user?.id]);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allOrders]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrdersByUser(user!.id);
      setAllOrders(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load your orders");
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
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(searchTerm.toLowerCase())
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
    navigate(`/${role}/dashboard/my-orders/${order.id}`);
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
    return order.payment?.status || "N/A";
  };

  const getPaymentAmount = (order: Order): string => {
    return order.payment?.amount ? formatCurrency(order.payment.amount, order.currency) : "N/A";
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
                  setSortBy("createdAt");
                  setSortOrder(sortBy === "createdAt" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "createdAt" ? "text-green-600" : "text-gray-400"}`} />
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
                  <span>Amount</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "amount" ? "text-green-600" : "text-gray-400"}`} />
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
                  <span>Status</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "status" ? "text-green-600" : "text-gray-400"}`} />
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
              <th className="text-right py-2 px-2 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentOrders.map((order, index) => (
              <tr key={order.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2 text-gray-700">{startIndex + index + 1}</td>
                <td className="py-2 px-2 text-gray-700">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-2 text-gray-700 hidden lg:table-cell font-medium">
                  {formatCurrency(order.amount, order.currency)}
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
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-gray-400 hover:text-green-600 p-1"
                      title="View"
                    >
                      <Eye className="w-3 h-3" />
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
            <div className="font-medium text-gray-900 text-xs truncate">Order #{order.id}</div>
            <div className="text-gray-500 text-xs">{formatDate(order.createdAt)}</div>
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
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => handleViewOrder(order)}
                className="text-gray-400 hover:text-green-600 p-1"
                title="View"
              >
                <Eye className="w-3 h-3" />
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
                <div className="font-medium text-gray-900 text-sm truncate">Order #{order.id}</div>
                <div className="text-gray-500 text-xs truncate">{formatDate(order.createdAt)}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-semibold text-green-600 text-xs">{formatCurrency(order.amount, order.currency)}</span>
                  <span className="text-gray-400 text-xs">Items: {order.orderItems.length}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4 text-xs text-gray-600 flex-1 max-w-xl px-4">
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
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => handleViewOrder(order)}
                className="text-gray-400 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                title="View Order"
              >
                <Eye className="w-4 h-4" />
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
                <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
                <p className="text-xs text-gray-500 mt-0.5">Your order history</p>
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
                  placeholder="Search orders by ID or status..."
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
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
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
              <span className="text-xs">Loading your orders...</span>
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
                  : "bg-green-50 border border-green-200 text-green-800"
              }`}
            >
              <AlertCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">{operationStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderDashboard;