import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MessageSquare,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ChevronRight,
  ChevronLeft,
  Send,
  User,
  Mail,
  Clock
} from 'lucide-react';
import HeaderBanner from './HeaderBanner';
import blogService from '../../services/blogService';
import { API_URL } from '../../api/api';

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

interface BlogReply {
  id: string;
  blogId: string;
  fullName: string;
  email: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HeaderBannerProps {
  title: string;
  subtitle: string;
  backgroundStyle: 'image' | string;
  icon: React.ReactNode;
}

const BlogViewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [replies, setReplies] = useState<BlogReply[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyForm, setReplyForm] = useState<{ fullName: string; email: string; message: string }>({
    fullName: '',
    email: '',
    message: ''
  });
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const repliesPerPage = 5;

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch the current blog
        const currentBlog = await blogService.getBlogById(id);
        setBlog(currentBlog);

        // Fetch replies for the blog
        const blogReplies = await blogService.getReplies(id);
        setReplies(blogReplies);

        // Fetch all blogs for the latest articles
        const allBlogs = await blogService.getAllBlogs();
        const filteredBlogs = allBlogs
          .filter((b: Blog) => b.id !== id)
          .sort((a: Blog, b: Blog) =>
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
          )
          .slice(0, 5);
        setLatestBlogs(filteredBlogs);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog or replies');
        setBlog(null);
        setReplies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !replyForm.fullName || !replyForm.email || !replyForm.message) return;

    try {
      setSubmittingReply(true);
      await blogService.addReply(id, {
        fullName: replyForm.fullName,
        email: replyForm.email,
        message: replyForm.message
      });
      const updatedReplies = await blogService.getReplies(id);
      setReplies(updatedReplies);
      setReplyForm({ fullName: '', email: '', message: '' });
      setShowReplyForm(false);
      setCurrentPage(1); // Reset to first page to show new reply
    } catch (err: any) {
      setError(err.message || 'Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const title = blog?.title || '';

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      });
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown Date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date?: Date): string => {
    if (!date) return 'Unknown Time';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Pagination for replies
  const totalPages = Math.ceil(replies.length / repliesPerPage);
  const startIndex = (currentPage - 1) * repliesPerPage;
  const currentReplies = replies.slice(startIndex, startIndex + repliesPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-gray-700">Loading blog...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!blog || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Blog not found'}</h2>
          <Link
            to="/blogs"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary-200 rounded-full opacity-30"></div>
      </div>

      <HeaderBanner
        title="Blog Details"
        subtitle="Home / Blogs / Article"
        backgroundStyle="image"
        icon={<MessageSquare className="w-10 h-10" />}
      />

      <div className="py-12 relative">
        <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Back Button */}
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Link>

              {/* Main Article */}
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Hero Image */}
                <div className="relative">
                  <img
                    src={blog.image ? `${API_URL}${blog.image}` : 'https://via.placeholder.com/800x400'}
                    alt={blog.title}
                    className="w-full h-[30vh] sm:h-[50vh] object-cover"
                  />
                </div>

                {/* Article Header */}
                <div className="p-8">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {blog.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {(replies.length || 0).toLocaleString()} Replies
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none mb-8">
                    <div
                      className="space-y-6 text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: blog.description || 'No content available' }}
                    />
                  </div>

                  {/* Replies Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-primary-600" />
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
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === 1
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
                              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === totalPages
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

                  {/* Share Buttons */}
                  <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-700 mr-2">Share:</span>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Latest Blogs */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Latest Articles</h3>
                  <div className="space-y-4">
                    {latestBlogs.map((latestBlog) => (
                      <Link
                        key={latestBlog.id}
                        to={`/blogs/${latestBlog.id}`}
                        className="block group hover:bg-gray-50 p-4 rounded-lg transition-colors"
                      >
                        <div className="flex space-x-4">
                          <img
                            src={latestBlog.image ? `${API_URL}${latestBlog.image}` : 'https://via.placeholder.com/80x64'}
                            alt={latestBlog.title}
                            className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                              {latestBlog.title}
                            </h4>
                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(latestBlog.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/blogs"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mt-4 text-sm"
                  >
                    View All Articles
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                  <p className="text-primary-100 text-sm mb-4">Get the latest HR insights delivered to your inbox weekly.</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-300"
                    />
                    <button className="w-full bg-white text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewPage;