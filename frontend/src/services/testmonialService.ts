import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // adjust import path

// Testimonial interface
export interface Testimonial {
  id: string;
  fullName: string;
  profileImage?: string;
  position: string;
  message: string;
  rate: number;
  createdAt?: Date;
}

// Input types
export type CreateTestimonialInput = Omit<Testimonial, 'id' | 'createdAt'>;
export type UpdateTestimonialInput = Partial<CreateTestimonialInput>;

// Delete response
interface DeleteResponse {
  success?: boolean;
  message: string;
}

/**
 * Testimonial Service
 * Handles all testimonial-related API calls
 */
class TestimonialService {
  private api: AxiosInstance = api;

  /**
   * Create a new testimonial
   * @param testimonialData - Testimonial data
   * @returns Created testimonial
   */
  async createTestimonial(
    testimonialData: FormData | CreateTestimonialInput
  ): Promise<Testimonial> {
    try {
      const response: AxiosResponse<Testimonial> = await this.api.post(
        '/testimonials',
        testimonialData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating testimonial:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create testimonial';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all testimonials
   * @returns Array of testimonials
   */
  async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      const response: AxiosResponse<Testimonial[]> =
        await this.api.get('/testimonials');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch testimonials';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get testimonial by ID
   * @param id - Testimonial ID
   * @returns Testimonial or null if not found
   */
  async getTestimonialById(id: string): Promise<Testimonial | null> {
    try {
      const response: AxiosResponse<Testimonial> = await this.api.get(
        `/testimonials/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching testimonial by ID:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch testimonial';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a testimonial
   * @param id - Testimonial ID
   * @param updateData - Data to update
   * @returns Updated testimonial
   */
  async updateTestimonial(
    id: string,
    updateData: FormData | UpdateTestimonialInput
  ): Promise<Testimonial> {
    try {
      const response: AxiosResponse<Testimonial> = await this.api.put(
        `/testimonials/${id}`,
        updateData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update testimonial';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a testimonial
   * @param id - Testimonial ID
   * @returns Response with success message
   */
  async deleteTestimonial(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(
        `/testimonials/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete testimonial';
      throw new Error(errorMessage);
    }
  }
}

// Singleton instance
const testimonialService = new TestimonialService();
export default testimonialService;
