/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, User } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { API_URL } from '../../../api/api';
import blogService, { type Blog } from '../../../services/blogService';
import 'swiper/css';
import 'swiper/css/navigation';

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {blog.image && (
        <img
          src={`${API_URL}${blog.image}`}
          alt={blog.title}
          className="w-full h-52 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
      )}

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h3>
          <p
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: blog.excerpt || blog.description?.substring(0, 150) + '...',
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-6 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{blog.author || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{blog.date ? new Date(blog.date).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getAllBlogs();
        setBlogs(Array.isArray(response) ? response : []);
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 w-40 mx-auto rounded"></div>
            <div className="h-5 bg-gray-200 w-3/4 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[320px] bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Blog</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-24 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Blog</h2>
        <p className="text-gray-600">
          No blog posts are available at the moment. Please check back later.
        </p>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-14">
        <div className="text-center mb-16">
          <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase mb-4">
            BLOG
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Latest <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Insights</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with our latest news, industry trends, and helpful tips from our experts.
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            loop={blogs.length > 3}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.blog-next',
              prevEl: '.blog-prev',
            }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="blog-swiper min-h-[300px]"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <BlogCard blog={blog} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          {blogs.length > 3 && (
            <>
              <button
                className="blog-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-primary-50 border border-primary-100 transition"
                aria-label="Previous Blog"
              >
                <ChevronLeft className="w-5 h-5 text-primary-600" />
              </button>
              <button
                className="blog-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-primary-50 border border-primary-100 transition"
                aria-label="Next Blog"
              >
                <ChevronRight className="w-5 h-5 text-primary-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
