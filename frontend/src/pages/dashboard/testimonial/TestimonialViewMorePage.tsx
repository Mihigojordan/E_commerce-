import React, { useState, useEffect } from 'react';
import { Calendar, User, Star, ArrowLeft, Clock, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import testimonialService, { type Testimonial } from '../../../services/testmonialService';
import { API_URL } from '../../../api/api';

const TestimonialViewMorePage: React.FC = () => {
  const { id: testimonialId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonial();
  }, [testimonialId]);

  const fetchTestimonial = async () => {
    if (!testimonialId) return;
    try {
      setLoading(true);
      const testimonialData = await testimonialService.getTestimonialById(testimonialId);
      if (testimonialData) {
        setTestimonial(testimonialData);
      }
    } catch (error) {
      console.error('Failed to fetch testimonial:', error);
    } finally {
      setLoading(false);
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

  const renderStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${i <= rate ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Testimonial not found</div>
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
          Back to Testimonial Management
        </button>

        {/* Testimonial Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Image */}
          {testimonial.profileImage && (
            <div className="relative h-64 sm:h-80 lg:h-[60vh]">
              <img
                src={testimonial.profileImage.startsWith('http') ? testimonial.profileImage : `${API_URL}${testimonial.profileImage}`}
                alt={testimonial.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                  e.currentTarget.alt = 'Image not available';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <div className="p-8">
            {/* Title and Meta Info */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{testimonial.fullName}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{testimonial.position || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(testimonial.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(testimonial.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{renderStars(testimonial.rate)}</span>
                </div>
              </div>
            </div>

            {/* Edit Testimonial Button */}
            <div className="mb-6">
              <button
                onClick={() => navigate(`/admin/dashboard/testimonial-management/edit/${testimonialId}`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Testimonial
              </button>
            </div>

            {/* Testimonial Content */}
            <div className="px-8 py-8">
              <div className="bg-white p-3 rounded border text-xs text-gray-700 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: testimonial.message || 'N/A'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialViewMorePage;