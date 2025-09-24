import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // adjust the import path as needed

// ContactMessage interface
export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: Date;
}

// Input type for creating a message
export type CreateContactMessageInput = Omit<ContactMessage, 'id' | 'createdAt'>;

// Delete response
interface DeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Contact Service
 * Handles all contact-related API calls
 */
class ContactService {
  private api: AxiosInstance = api;

  /**
   * Submit a new contact message
   * @param messageData - Contact message data
   * @returns Success response
   */
  async createContactMessage(messageData: CreateContactMessageInput): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await this.api.post(
        '/contact',
        messageData,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating contact message:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create contact message';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all contact messages
   * @returns Array of contact messages
   */
  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const response: AxiosResponse<ContactMessage[]> = await this.api.get('/contact');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch contact messages';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a contact message
   * @param id - Contact message ID
   * @returns Response with success message
   */
  async deleteMessage(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/contact/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting contact message:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete contact message';
      throw new Error(errorMessage);
    }
  }
}

// Singleton instance
const contactService = new ContactService();
export default contactService;

// Named exports
export const { createContactMessage, getAllMessages, deleteMessage } = contactService;
