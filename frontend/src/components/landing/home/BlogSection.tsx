// src/components/landing/home/BlogSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Blog {
  id: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  author?: string;
}

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Replace this with your real API endpoint
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">Loading blogs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-500">Error: {error}</p>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">No blog posts available.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Latest Articles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 line-clamp-3">{blog.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.author || "Admin"}</span>
                  <span>{blog.date ? new Date(blog.date).toLocaleDateString() : ""}</span>
                </div>
                <Link
                  to={`/blog/${blog.id}`}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
