/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getAllBlogs, type Blog } from '../../../services/blogService';
import { API_URL } from '../../../api/api';
import banner1 from '../../../assets/images/banner-5.jpg';
import banner2 from '../../../assets/images/banner/banner4.jpg';
import banner3 from '../../../assets/images/back-banner/back-banner-1.jpg';
import { useNavigate } from 'react-router-dom';

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const offerCards = [
    {
      id: 1,
      label: 'Accessories',
      title: 'Save 17% on Autumn Hat',
      buttonColor: 'text-teal-600',
      bgImage: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=700&h=800&fit=crop'
    },
    {
      id: 2,
      label: 'Big Offer',
      title: "Save 20% on Women's socks",
      buttonColor: 'text-teal-600',
      bgImage: banner2
    },
    {
      id: 3,
      label: 'Smart Offer',
      title: 'Save 20% on Eardrop',
      buttonColor: 'text-teal-600',
      bgImage: banner3
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await getAllBlogs();
      setBlogs(blogData);
    } catch (err: any) {
      setError('Failed to load blogs. Please try again later.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown Date';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (title: string) => {
    const colors = ['text-teal-600', 'text-blue-600', 'text-pink-600', 'text-orange-600'];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-4 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-4 bg-white flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 bg-white">
      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Section - Blog Posts */}
          <div className="xl:col-span-1">
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-teal-600">From</span>{' '}
              <span className="text-gray-800">blog</span>
            </h2>

            <div className="flex items-center justify-between flex-wrap gap-3">
              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs available</h3>
                  <p className="text-gray-500">Check back later for new blog posts.</p>
                </div>
              ) : (
                blogs.map((post) => (
                  <div key={post.id} className="flex gap-4 flex-col sm:flex-row group cursor-pointer">
                    {/* Blog Image */}
                    <div className="w-full sm:w-56 h-40 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {post.image ? (
                        <img
                          src={`${API_URL}${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-xs text-gray-400">Blog Image</p>
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="flex-1"  onClick={()=> navigate(`/blogs/${post?.id}`)}>
                      <p className={`${getCategoryColor(post.title)} text-sm font-medium mb-2`}>
                        Blog
                      </p>
                      <h3 className="text-gray-900 font-semibold text-base mb-3 leading-snug line-clamp-3 group-hover:text-teal-600 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{post.replies?.length || 0} Reviews</span>
                      </div>
                      <button 
                     
                      className="text-teal-600 font-semibold text-sm hover:gap-2 flex items-center gap-1 transition-all duration-300">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Section - Offer Cards */}
          <div className="xl:col-span-2  grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerCards.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                  offer.id === 1 ? 'md:row-span-2 min-h-[400px]' : 'min-h-[190px]'
                } flex flex-col justify-between`}
                style={{
                  backgroundImage: offer.bgImage ? `url(${offer.bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: offer.bgImage ? 'transparent' : '#f3f4f6'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"></div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    {offer.label}
                  </p>
                  <h3 className="text-gray-900 text-2xl font-bold mb-4 leading-tight max-w-[200px]">
                    {offer.title}
                  </h3>
                  <button 
                  onClick={()=> navigate('/products')}
                  className={`${offer.buttonColor} font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300`}>
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Placeholder when no background image */}
                {!offer.bgImage && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <p className="text-sm font-medium text-gray-500">Add background image</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;