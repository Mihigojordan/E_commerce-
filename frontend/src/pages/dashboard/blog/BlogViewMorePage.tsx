import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  MessageCircle,
  Share2,
  Heart,
  Send,
  Quote,
  ArrowLeft,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Edit
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import blogService, { type Blog, type BlogReply } from '../../../services/blogService';
import { API_URL } from '../../../api/api';

const BlogViewMorePage: React.FC = () => {
  const { id: blogId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [replies, setReplies] = useState<BlogReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentPage, setCurrentPage] = useState(1);
  const [replyForm, setReplyForm] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [submittingReply, setSubmittingReply] = useState(false);
  const repliesPerPage = 4;

  useEffect(() => {
    fetchBlog();
    fetchReplies();
  }, [blogId]);

  const fetchBlog = async () => {
    if (!blogId) return;
    try {
      setLoading(true);
      const blogData = await blogService.getBlogById(blogId);
      if (blogData) {
        setBlog(blogData);
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    if (!blogId) return;
    try {
      const repliesData = await blogService.getReplies(blogId);
      setReplies(repliesData);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyForm.fullName.trim() || !replyForm.email.trim() || !replyForm.message.trim() || !blogId) {
      return;
    }

    try {
      setSubmittingReply(true);
      const newReply = await blogService.addReply(blogId, replyForm);
      setReplies(prev => [newReply, ...prev]);
      setReplyForm({ fullName: '', email: '', message: '' });
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(replies.length / repliesPerPage);
  const indexOfLastReply = currentPage * repliesPerPage;
  const indexOfFirstReply = indexOfLastReply - repliesPerPage;
  const currentReplies = replies.slice(indexOfFirstReply, indexOfLastReply);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog Management
        </button>

        {/* Blog Post */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image */}
          {blog.image && (
            <div className="relative h-64 sm:h-80 lg:h-[60vh]">
              <img
                src={`${API_URL}${blog.image}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all ${isLiked ? 'text-red-500' : 'text-gray-600'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Title and Meta Info */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{replies.length} replies</span>
                </div>
              </div>
            </div>

            {/* Edit Blog Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate(`/admin/dashboard/blog-management/edit/${blogId}`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Blog
              </button>
            </div>

            {/* Tabs Section */}
            <div className="border-t">
              <div className="px-8">
                <div className="flex space-x-8 border-b">
                  {['description', 'replies'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab} {tab === 'replies' && `(${replies.length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-8 py-8">
                {activeTab === 'description' && (
                  <>
                    {blog.quote && (
                      <div className="relative bg-primary-50 border-l-4 border-primary-500 p-6 mb-8 rounded-r-xl">
                        <Quote className="absolute top-4 left-4 w-6 h-6 text-primary-500 opacity-30" />
                        <blockquote className="text-lg italic text-gray-700 font-medium pl-8">
                          "{blog.quote}"
                        </blockquote>
                      </div>
                    )}
                    <div className="bg-white p-3 rounded border text-xs text-gray-700 leading-relaxed">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: blog.description
                        }}
                      />
                    </div>
                    {blog.updatedAt && new Date(blog.updatedAt).getTime() !== new Date(blog.createdAt!).getTime() && (
                      <div className="text-sm text-gray-500 mt-6">
                        Last updated: {formatDate(blog.updatedAt)} at {formatTime(blog.updatedAt)}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'replies' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-primary-600" />
                        Replies ({replies.length})
                      </h2>
                      <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Add Reply
                      </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                      <form onSubmit={handleReplySubmit} className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share your thoughts</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={replyForm.fullName}
                              onChange={(e) => setReplyForm(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={replyForm.email}
                              onChange={(e) => setReplyForm(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={replyForm.message}
                            onChange={(e) => setReplyForm(prev => ({ ...prev, message: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            placeholder="Share your thoughts about this blog post..."
                            required
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submittingReply}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
                          >
                            {submittingReply ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            {submittingReply ? 'Submitting...' : 'Submit Reply'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="px-6 py-2.5 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Replies List */}
                    {replies.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No replies yet</h3>
                        <p className="text-gray-500">Be the first to share your thoughts on this blog post!</p>
                      </div>
                    ) : (
                      <>
                        {currentReplies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-primary-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">{reply.fullName}</h4>
                                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Mail className="w-3 h-3" />
                                    <span>{reply.email}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(reply.createdAt)}</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTime(reply.createdAt)}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{reply.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {replies.length > repliesPerPage && (
                          <div className="flex items-center justify-between mt-6">
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </button>
                            <span className="text-sm text-gray-600">
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                }`}
                            >
                              Next
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewMorePage;