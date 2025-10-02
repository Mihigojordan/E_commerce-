import React, { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Mail,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Settings,
  Minimize2,
} from "lucide-react";
import contactService from "../../services/contactService";

type ViewMode = "table" | "grid" | "list";

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: Date | string;
}

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const ContactMessagesDashboard: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [allMessages, setAllMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof ContactMessage>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [deleteConfirm, setDeleteConfirm] = useState<ContactMessage | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allMessages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const messages = await contactService.getAllMessages();
      setAllMessages(Array.isArray(messages) ? messages : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load contact messages");
      setAllMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allMessages];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (message) =>
          message?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message?.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "createdAt") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    setMessages(filtered);
    setCurrentPage(1);
  };

  const totalMessages = allMessages.length;

  const handleViewMessage = (message: ContactMessage) => {
    if (!message?.id) return;
    setSelectedMessage(message);
    setShowViewModal(true);
  };

  const handleDeleteMessage = async (message: ContactMessage) => {
    if (!message?.id) {
      showOperationStatus("error", "Invalid message ID");
      return;
    }
    
    try {
      setOperationLoading(true);
      await contactService.deleteMessage(message.id);
      setDeleteConfirm(null);
      await loadData(); // Reload data after deletion
      showOperationStatus("success", `Message from ${message.firstName} ${message.lastName} deleted successfully!`);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete message");
    } finally {
      setOperationLoading(false);
    }
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
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const formatMessage = (message: string, maxLength: number = 50): string => {
    if (!message) return "N/A";
    return message.length > maxLength ? message.substring(0, maxLength) + "..." : message;
  };

  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

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
                  setSortBy("firstName");
                  setSortOrder(sortBy === "firstName" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "firstName" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                onClick={() => {
                  setSortBy("email");
                  setSortOrder(sortBy === "email" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "email" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden sm:table-cell">Phone</th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium hidden md:table-cell">Message</th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder(sortBy === "createdAt" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "createdAt" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-right py-2 px-2 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentMessages.map((message, index) => (
              <tr key={message.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2 text-gray-700">{startIndex + index + 1}</td>
                <td className="py-2 px-2 font-medium text-gray-900 text-xs">
                  {`${message.firstName || "N/A"} ${message.lastName || ""}`}
                </td>
                <td className="py-2 px-2 text-gray-700 hidden lg:table-cell">{message.email || "N/A"}</td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">{message.phone || "N/A"}</td>
                <td className="py-2 px-2 text-gray-700 hidden md:table-cell">{formatMessage(message.message)}</td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">{formatDate(message.createdAt)}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="text-gray-400 hover:text-primary-600 p-1"
                      title="View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(message)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
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
      {currentMessages.map((message) => (
        <div
          key={message.id}
          className="bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-xs truncate">
                {`${message.firstName || "N/A"} ${message.lastName || ""}`}
              </div>
              <div className="text-gray-500 text-xs truncate">{message.email || "N/A"}</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">{formatMessage(message.message, 80)}</div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">{formatDate(message.createdAt)}</div>
            <div className="flex space-x-1">
              <button
                onClick={() => handleViewMessage(message)}
                className="text-gray-400 hover:text-primary-600 p-1"
                title="View"
              >
                <Eye className="w-3 h-3" />
              </button>
              <button
                onClick={() => setDeleteConfirm(message)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
      {currentMessages.map((message) => (
        <div key={message.id} className="px-4 py-3 hover:bg-gray-25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {`${message.firstName || "N/A"} ${message.lastName || ""}`}
                </div>
                <div className="text-gray-500 text-xs truncate">{message.email || "N/A"}</div>
                <div className="text-gray-600 text-xs truncate mt-1">{formatMessage(message.message, 100)}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-xs text-gray-600 flex-shrink-0">
              <span>{message.phone || "N/A"}</span>
              <span>{formatDate(message.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => handleViewMessage(message)}
                className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors"
                title="View Message"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirm(message)}
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Message"
              >
                <Trash2 className="w-4 h-4" />
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
          Showing {startIndex + 1}-{Math.min(endIndex, messages.length)} of {messages.length}
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
                  ? "bg-primary-500 text-white"
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
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="Toggle Sidebar"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Contact Messages</h1>
                <p className="text-xs text-gray-500 mt-0.5">View and manage contact messages</p>
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
              <div className="p-3 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Messages</p>
                <p className="text-lg font-semibold text-gray-900">{totalMessages}</p>
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
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1 px-2 py-1.5 text-xs border rounded transition-colors ${
                  showFilters ? "bg-primary-50 border-primary-200 text-primary-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
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
                  const [field, order] = e.target.value.split("-") as [keyof ContactMessage, "asc" | "desc"];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="firstName-asc">Name (A-Z)</option>
                <option value="firstName-desc">Name (Z-A)</option>
                <option value="email-asc">Email (A-Z)</option>
                <option value="email-desc">Email (Z-A)</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "table" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Table View"
                >
                  <List className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-gray-400 hover:text-gray-600"
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
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Loading messages...</span>
            </div>
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
            <div className="text-xs">
              {searchTerm ? "No messages found matching your criteria" : "No messages found"}
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
      </div>

      {operationStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded shadow-lg text-xs ${
              operationStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : operationStatus.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-primary-50 border border-primary-200 text-primary-800"
            }`}
          >
            {operationStatus.type === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
            {operationStatus.type === "error" && <XCircle className="w-4 h-4 text-red-600" />}
            {operationStatus.type === "info" && <AlertCircle className="w-4 h-4 text-primary-600" />}
            <span className="font-medium">{operationStatus.message}</span>
            <button onClick={() => setOperationStatus(null)} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded p-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 text-xs font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Delete Message</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-700">
                Are you sure you want to delete the message from{" "}
                <span className="font-semibold">
                  {deleteConfirm.firstName || "N/A"} {deleteConfirm.lastName || ""}
                </span>
                ?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(deleteConfirm)}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Message Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <p className="text-xs text-gray-900">{selectedMessage.firstName || "-"}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <p className="text-xs text-gray-900">{selectedMessage.lastName || "-"}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <p className="text-xs text-gray-900">{selectedMessage.email || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-xs text-gray-900">{selectedMessage.phone || "-"}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs text-gray-900 whitespace-pre-wrap">{selectedMessage.message || "-"}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Received At</label>
                <p className="text-xs text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedMessage(null);
                }}
                className="px-4 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setDeleteConfirm(selectedMessage);
                }}
                className="px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesDashboard;