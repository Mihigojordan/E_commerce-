/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Check, BookOpen, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import blogService, { type Blog } from '../../../services/blogService';
import FileUploadBlog from '../../../components/dashboard/blog/FileUploadBlog';

interface BlogFormData {
  title: string;
  description: string;
  quote: string;
  image?: File | null;
}

interface Errors {
  [key: string]: string | null;
}

const BlogForm: React.FC<{
  blogId?: string;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}> = ({ blogId, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    description: '',
    quote: '',
    image: null,
  });
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8000"; // Adjust to your backend domain

  useEffect(() => {
    const fetchBlog = async () => {
      if (blogId) {
        setIsLoading(true);
        try {
          const blog = await blogService.getBlogById(blogId);
          if (blog) {
            setFormData({
              title: blog.title || '',
              description: blog.description || '',
              quote: blog.quote || '',
              image: null,
            });
            if (blog.image) {
              setExistingFile(
                blog.image.startsWith('http')
                  ? blog.image
                  : `${API_BASE_URL}${blog.image}`
              );
            }
          }
        } catch (error: any) {
          setErrors(prev => ({ ...prev, general: error.message || 'Failed to load blog data' }));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleInputChange = (field: keyof BlogFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFile(e.target?.result as string);
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
    } else {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewFile(null);
    setExistingFile(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) newErrors.title = 'Blog title is required';
    if (!formData.description.replace(/<[^>]+>/g, '').trim()) newErrors.description = 'Description is required';
    if (formData.quote && formData.quote.length > 200) {
      newErrors.quote = 'Quote cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.quote) formDataToSend.append('quote', formData.quote);
      if (formData.image) formDataToSend.append('blog_image', formData.image);

      let response: Blog;
      if (blogId) {
        response = await blogService.updateBlog(blogId, formDataToSend);
      } else {
        response = await blogService.createBlog(formDataToSend);
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, general: error.message || 'Failed to save blog' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{blogId ? 'Loading blog...' : 'Saving blog...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  bg-gray-50 py-6">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {blogId ? 'Update Blog' : 'Add New Blog'}
            </h1>
            <p className="text-primary-100 text-xs mt-1">
              Fill in the details to {blogId ? 'update' : 'create'} your blog post
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-6">
            <FileUploadBlog
              previewFile={previewFile}
              existingFile={existingFile}
              errors={errors}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Blog Information</h2>
                </div>
                <p className="text-xs text-gray-500">Enter the details for your blog post</p>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter blog title"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    theme="snow"
                    className="w-full text-sm border border-gray-200 rounded-lg"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link'],
                        ['clean'],
                      ],
                    }}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.description}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.description.replace(/<[^>]+>/g, '').length} characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Quote (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => handleInputChange('quote', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter a short quote (max 200 characters)"
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.quote ? (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.quote}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.quote.length}/200</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium bg-gradient-to-r from-primary-600 to-primary-600 text-white rounded-lg hover:from-primary-700 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <Check className="h-4 w-4" />
                    <span>{blogId ? 'Update Blog' : 'Create Blog'}</span>
                  </button>
                </div>
              </div>

              {errors.general && (
                <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {errors.general}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const { id: editingBlogId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (response: any) => {
    navigate('/admin/dashboard/blog-management');
    console.log("Blog saved successfully:", response);
    setShowForm(false);
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/blog-management');
    console.log("Form cancelled");
  };

  return (
    <BlogForm
      blogId={editingBlogId || undefined}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default BlogFormExample;