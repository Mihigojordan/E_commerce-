/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Check, User, X, Star } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import testimonialService, { type Testimonial } from '../../../services/testmonialService';
import FileUploadTestimonial from '../../../components/dashboard/testimonial/FileUploadTestimonial';

interface TestimonialFormData {
  fullName: string;
  position: string;
  message: string;
  rate: number;
  profileImage?: File | null;
}

interface Errors {
  [key: string]: string | null;
}

const TestimonialForm: React.FC<{
  testimonialId?: string;
  onSuccess?: (response: any) => void;
  onCancel?: () => void;
}> = ({ testimonialId, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<TestimonialFormData>({
    fullName: '',
    position: '',
    message: '',
    rate: 0,
    profileImage: null,
  });
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8000"; // Adjust to your backend domain

  useEffect(() => {
    const fetchTestimonial = async () => {
      if (testimonialId) {
        setIsLoading(true);
        try {
          const testimonial = await testimonialService.getTestimonialById(testimonialId);
          if (testimonial) {
            setFormData({
              fullName: testimonial.fullName || '',
              position: testimonial.position || '',
              message: testimonial.message || '',
              rate: testimonial.rate || 0,
              profileImage: null,
            });
            if (testimonial.profileImage) {
              setExistingFile(
                testimonial.profileImage.startsWith('http')
                  ? testimonial.profileImage
                  : `${API_BASE_URL}${testimonial.profileImage}`
              );
            }
          }
        } catch (error: any) {
          setErrors(prev => ({ ...prev, general: error.message || 'Failed to load testimonial data' }));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTestimonial();
  }, [testimonialId]);

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFile(e.target?.result as string);
      reader.readAsDataURL(file);
      if (errors.profileImage) {
        setErrors(prev => ({ ...prev, profileImage: null }));
      }
    } else {
      setErrors(prev => ({ ...prev, profileImage: 'Please select a valid image file' }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setPreviewFile(null);
    setExistingFile(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.message.replace(/<[^>]+>/g, '').trim()) newErrors.message = 'Message is required';
    if (formData.rate < 1 || formData.rate > 5) newErrors.rate = 'Rating must be between 1 and 5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('rate', formData.rate.toString());
      if (formData.profileImage) formDataToSend.append('profileImage', formData.profileImage);

      let response: Testimonial;
      if (testimonialId) {
        response = await testimonialService.updateTestimonial(testimonialId, formDataToSend);
      } else {
        response = await testimonialService.createTestimonial(formDataToSend);
      }

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, general: error.message || 'Failed to save testimonial' }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 cursor-${interactive ? 'pointer' : 'default'} ${
            i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          onClick={interactive ? () => handleInputChange('rate', i) : undefined}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{testimonialId ? 'Loading testimonial...' : 'Saving testimonial...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              {testimonialId ? 'Update Testimonial' : 'Add New Testimonial'}
            </h1>
            <p className="text-primary-100 text-xs mt-1">
              Fill in the details to {testimonialId ? 'update' : 'create'} your testimonial
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-6">
            <FileUploadTestimonial
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
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Testimonial Information</h2>
                </div>
                <p className="text-xs text-gray-500">Enter the details for your testimonial</p>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter position or title"
                  />
                  {errors.position && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.position}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    value={formData.message}
                    onChange={(value) => handleInputChange('message', value)}
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
                    {errors.message ? (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {errors.message}
                      </p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">{formData.message.replace(/<[^>]+>/g, '').length} characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  {renderStars(formData.rate, true)}
                  {errors.rate && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.rate}
                    </p>
                  )}
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
                    <span>{testimonialId ? 'Update Testimonial' : 'Create Testimonial'}</span>
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

const TestimonialFormExample: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const { id: editingTestimonialId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (response: any) => {
    navigate('/admin/dashboard/testimonial-management');
    console.log("Testimonial saved successfully:", response);
    setShowForm(false);
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/testimonial-management');
    console.log("Form cancelled");
  };

  return (
    <TestimonialForm
      testimonialId={editingTestimonialId || undefined}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default TestimonialFormExample;