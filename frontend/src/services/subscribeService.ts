import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // adjust path if needed

// Subscriber interface
export interface Subscriber {
  id: number;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Input types
export type CreateSubscriberInput = Pick<Subscriber, 'email'>;
export type UpdateSubscriberInput = Pick<Subscriber, 'email'>;

// Delete response
interface DeleteResponse {
  success?: boolean;
  message?: string;
}

/**
 * Subscriber Service
 * Handles all subscriber-related API calls
 */
class SubscriberService {
  private api: AxiosInstance = api;

  /**
   * Create a new subscriber
   * @param email - Subscriber email
   * @returns Created subscriber
   */
  async createSubscriber(email: string): Promise<Subscriber> {
    try {
      const response: AxiosResponse<Subscriber> = await this.api.post('/subscribers', { email });
      return response.data;
    } catch (error: any) {
      console.error('Error creating subscriber:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create subscriber';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all subscribers
   * @returns Array of subscribers
   */
  async getAllSubscribers(): Promise<Subscriber[]> {
    try {
      const response: AxiosResponse<Subscriber[]> = await this.api.get('/subscribers');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch subscribers';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get subscriber by ID
   * @param id - Subscriber ID
   * @returns Subscriber or null if not found
   */
  async getSubscriberById(id: number): Promise<Subscriber | null> {
    try {
      const response: AxiosResponse<Subscriber> = await this.api.get(`/subscribers/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching subscriber by ID:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch subscriber';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a subscriber
   * @param id - Subscriber ID
   * @param email - New email
   * @returns Updated subscriber
   */
  async updateSubscriber(id: number, email: string): Promise<Subscriber> {
    try {
      const response: AxiosResponse<Subscriber> = await this.api.patch(`/subscribers/${id}`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating subscriber:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update subscriber';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a subscriber
   * @param id - Subscriber ID
   * @returns Response with success message
   */
  async deleteSubscriber(id: number): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/subscribers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete subscriber';
      throw new Error(errorMessage);
    }
  }
}

// Singleton instance
const subscriberService = new SubscriberService();
export default subscriberService;

// Named exports
export const {
  createSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
} = subscriberService;
