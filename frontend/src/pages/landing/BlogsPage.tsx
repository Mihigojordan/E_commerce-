import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import HeaderBanner from '../../components/landing/HeaderBanner';
import blogService from '../../services/blogService';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/api';

interface Reply {
  id: string;
  blogId: string;
  fullName: string;
  email: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  quote?: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  replies?: Reply[];
}

export default function HRBlogsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  const navigate = useNavigate();

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await blogService.getAllBlogs();

        // CRITICAL: Normalize response to always be an array
        let fetchedBlogs: Blog[] = [];

        if (Array.isArray(response)) {
          fetchedBlogs = response;
        } else if (response && typeof response === 'object') {
          // Common patterns: { data: [...] }, { blogs: [...] }, etc.
          if (Array.isArray(response.data)) {
            fetchedBlogs = response.data;
          } else if (Array.isArray(response.blogs)) {
            fetchedBlogs = response.blogs;
          } else if (Array.isArray(response.results)) {
            fetchedBlogs = response.results;
          }
          // Add more fallback keys if needed
        }

        // Final safety: ensure it's an array
        setBlogs(Array.isArray(fetchedBlogs) ? fetchedBlogs : []);
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to fetch blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Derive categories safely — only if blogs is array and has items
  const categories: string[] = [
    'All',
    ...new Set(
      Array.isArray(blogs)
        ? blogs
            .map((blog) => blog.category)
            .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '')
        : []
    )
  ];

  // Filter posts
  const filteredPosts = Array.isArray(blogs)
    ? blogs.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.quote?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handleViewMore = (id: string) => {
    if (!id) return;
    navigate(`/blogs/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-15"></div>
      </div>

      <HeaderBanner
        title="HR Blogs"
        subtitle="Home / Blogs"
        backgroundStyle="image"
        icon={<BookOpen className="w-10 h-10" />}
      />

      {/* Search and Filter */}
      <section className="py-12 relative">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles or topics..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1); // Reset page on filter
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Grid */}
      <section className="py-12 relative">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-8 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
              <div className="inline-flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading blogs...</span>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
              <div className="text-sm">
                {searchTerm || selectedCategory !== 'All'
                  ? 'No blogs found matching your criteria'
                  : 'No blogs available at the moment'}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
                <div className="text-sm text-gray-600">
                  Showing {currentPosts.length} of {filteredPosts.length} articles
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleViewMore(post.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          post.image
                            ? `${API_URL}${post.image}`
                            : 'https://via.placeholder.com/400x200?text=No+Image'
                        }
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {post.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.quote || post.description || 'No preview available'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Unknown Date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(post.replies?.length || 0)} Replies
                        </span>
                      </div>

                      <div className="flex items-center justify-end">
                        <span className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-primary-50'
                      }`}
                      aria-label={`Page ${i + 1}`}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}