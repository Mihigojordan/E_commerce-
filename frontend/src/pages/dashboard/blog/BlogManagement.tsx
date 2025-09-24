import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
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
  FileText,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Settings,
  Minimize2,
  MessageSquare,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import blogService from "../../../services/blogService";
const API_BASE_URL = "http://localhost:8000"; // change to your backend domain

type ViewMode = "table" | "grid" | "list";

interface Blog {
  id: string;
  title: string;
  description: string;
  quote?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  replies?: {
    id: string;
    blogId: string;
    fullName: string;
    email: string;
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const BlogDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Blog>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const [deleteConfirm, setDeleteConfirm] = useState<Blog | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allBlogs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs();
      setAllBlogs(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
      setAllBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allBlogs];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (blog) =>
          blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog?.description?.replace(/<[^>]+>/g, '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog?.quote?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        const aDate = typeof aValue === "string" || aValue instanceof Date ? new Date(aValue) : new Date(0);
        const bDate = typeof bValue === "string" || bValue instanceof Date ? new Date(bValue) : new Date(0);
        return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }

      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";
      return sortOrder === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(bStr);
    });

    setBlogs(filtered);
    setCurrentPage(1);
  };

  const totalBlogs = allBlogs.length;
  const blogsWithReplies = allBlogs.filter(blog => blog.replies && blog.replies.length > 0).length;

  const handleAddBlog = () => {
    navigate('/admin/dashboard/blog-management/add');
  };

  const handleEditBlog = (blog: Blog) => {
    if (!blog?.id) return;
    navigate(`/admin/dashboard/blog-management/edit/${blog.id}`);
  };

  const handleViewBlog = (blog: Blog) => {
    if (!blog?.id) return;
    navigate(`/admin/dashboard/blog-management/${blog.id}`);
  };

  const handleDeleteBlog = async (blog: Blog) => {
    if (!blog?.id) {
      showOperationStatus("error", "Invalid blog ID");
      return;
    }
    try {
      setOperationLoading(true);
      await blogService.deleteBlog(blog.id);
      setDeleteConfirm(null);
      await loadData();
      showOperationStatus("success", `${blog.title} deleted successfully!`);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete blog");
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
        });
  };

  const getBlogImage = (image?: string): string => {
    if (image) {
      if (image.startsWith("http")) return image;
      return `${API_BASE_URL}${image}`;
    }
    return "";
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const renderTableView = () => (
    <div className="bg-white rounded border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">#</th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">Image</th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortBy("title");
                  setSortOrder(sortBy === "title" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Blog Title</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "title" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                onClick={() => {
                  setSortBy("description");
                  setSortOrder(sortBy === "description" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Description</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "description" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th
                className="text-left py-2 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                onClick={() => {
                  setSortBy("createdAt");
                  setSortOrder(sortBy === "createdAt" ? (sortOrder === "asc" ? "desc" : "asc") : "asc");
                }}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <ChevronDown className={`w-3 h-3 ${sortBy === "createdAt" ? "text-primary-600" : "text-gray-400"}`} />
                </div>
              </th>
              <th className="text-right py-2 px-2 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentBlogs.map((blog, index) => (
              <tr key={blog.id || index} className="hover:bg-gray-25">
                <td className="py-2 px-2 text-gray-700">{startIndex + index + 1}</td>
                <td className="py-2 px-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {getBlogImage(blog.image) ? (
                      <img
                        src={getBlogImage(blog.image)}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${getBlogImage(blog.image) ? 'hidden' : 'flex'}`}>
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </td>
                <td className="py-2 px-2">
                  <div>
                    <div className="font-medium text-gray-900 text-xs truncate max-w-32">{blog.title || "N/A"}</div>
                    <div className="text-gray-500 text-xs truncate max-w-32">{blog.quote || "No quote"}</div>
                  </div>
                </td>
                <td className="py-2 px-2 text-gray-700 hidden lg:table-cell max-w-48">
                  <div
                    className="text-xs truncate"
                    dangerouslySetInnerHTML={{ __html: blog.description || "N/A" }}
                  />
                </td>
                <td className="py-2 px-2 text-gray-700 hidden sm:table-cell">{formatDate(blog.createdAt)}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleViewBlog(blog)}
                      className="text-gray-400 hover:text-primary-600 p-1"
                      title="View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="text-gray-400 hover:text-primary-600 p-1"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(blog)}
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
      {currentBlogs.map((blog) => (
        <div
          key={blog.id}
          className="bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-shadow"
        >
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
            {getBlogImage(blog.image) ? (
              <img
                src={getBlogImage(blog.image)}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${getBlogImage(blog.image) ? 'hidden' : 'flex'}`}>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute top-2 right-2">
              <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                {blog.replies?.length || 0} Replies
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="font-medium text-gray-900 text-xs truncate">{blog.title || "N/A"}</div>
              <div className="text-gray-500 text-xs truncate">{blog.quote || "No quote"}</div>
            </div>
            <div
              className="text-gray-700 text-xs truncate"
              dangerouslySetInnerHTML={{ __html: blog.description || "N/A" }}
            />
            <div className="text-gray-500 text-xs truncate">{formatDate(blog.createdAt)}</div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewBlog(blog)}
                  className="text-gray-400 hover:text-primary-600 p-1"
                  title="View"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="text-gray-400 hover:text-primary-600 p-1"
                  title="Edit"
                >
                  <Edit className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirm(blog)}
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
      {currentBlogs.map((blog) => (
        <div key={blog.id} className="px-4 py-3 hover:bg-gray-25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getBlogImage(blog.image) ? (
                  <img
                    src={getBlogImage(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center ${getBlogImage(blog.image) ? 'hidden' : 'flex'}`}>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{blog.title || "N/A"}</div>
                <div className="text-gray-500 text-xs truncate">{blog.quote || "No quote"}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-500 text-xs">{formatDate(blog.createdAt)}</span>
                  {blog.replies && blog.replies.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 text-xs">{blog.replies.length} replies</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-xs text-gray-600 flex-1 max-w-xl px-4">
              <div className="truncate">
                <div
                  className="text-xs"
                  dangerouslySetInnerHTML={{ __html: blog.description || "N/A" }}
                />
              </div>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => handleViewBlog(blog)}
                className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors"
                title="View Blog"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEditBlog(blog)}
                className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors"
                title="Edit Blog"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirm(blog)}
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Blog"
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
          Showing {startIndex + 1}-{Math.min(endIndex, blogs.length)} of {blogs.length}
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
                <h1 className="text-lg font-semibold text-gray-900">Blog Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage your blog content</p>
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
              <button
                onClick={handleAddBlog}
                disabled={operationLoading}
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
                <span>Add Blog</span>
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
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Blogs</p>
                <p className="text-lg font-semibold text-gray-900">{totalBlogs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Blogs with Replies</p>
                <p className="text-lg font-semibold text-gray-900">{blogsWithReplies}</p>
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
                  placeholder="Search blogs..."
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
                  const [field, order] = e.target.value.split("-") as [keyof Blog, "asc" | "desc"];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="description-asc">Description (A-Z)</option>
                <option value="description-desc">Description (Z-A)</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
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
              <span className="text-xs">Loading blogs...</span>
            </div>
          </div>
        ) : currentBlogs.length === 0 ? (
          <div className="bg-white rounded border border-gray-200 p-8 text-center text-gray-500">
            <div className="text-xs">
              {searchTerm ? "No blogs found matching your criteria" : "No blogs found"}
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
                <h3 className="text-sm font-semibold text-gray-900">Delete Blog</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.title || "N/A"}</span>?
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
                onClick={() => handleDeleteBlog(deleteConfirm)}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;