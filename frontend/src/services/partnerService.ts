import { type AxiosInstance, type AxiosResponse } from 'axios';
import api from '../api/api'; // adjust path as needed

// Partner interface
export interface Partner {
  id: string;
  name?: string;
  logo: string;
  createdAt?: Date;
}

// Input types
export type CreatePartnerInput = Omit<Partner, 'id' | 'createdAt'>;
export type UpdatePartnerInput = Partial<CreatePartnerInput>;

// Delete response
interface DeleteResponse {
  success?: boolean;
  message: string;
}

/**
 * Partner Service
 * Handles all partner-related API calls
 */
class PartnerService {
  private api: AxiosInstance = api;

  /**
   * Create a new partner
   * @param partnerData - Partner data (FormData or JSON)
   * @returns Created partner
   */
  async createPartner(partnerData: FormData | CreatePartnerInput): Promise<Partner> {
    try {
      const response: AxiosResponse<Partner> = await this.api.post('/patners', partnerData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating partner:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create partner';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all partners
   * @returns Array of partners
   */
  async getAllPartners(): Promise<Partner[]> {
    try {
      const response: AxiosResponse<Partner[]> = await this.api.get('/patners');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching partners:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch partners';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get partner by ID
   * @param id - Partner ID
   * @returns Partner or null if not found
   */
  async getPartnerById(id: string): Promise<Partner | null> {
    try {
      const response: AxiosResponse<Partner> = await this.api.get(`/patners/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching partner by ID:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch partner';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a partner
   * @param id - Partner ID
   * @param updateData - Data to update
   * @returns Updated partner
   */
  async updatePartner(id: string, updateData: FormData | UpdatePartnerInput): Promise<Partner> {
    try {
      const response: AxiosResponse<Partner> = await this.api.put(`/patners/${id}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating partner:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update partner';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a partner
   * @param id - Partner ID
   * @returns Response with success message
   */
  async deletePartner(id: string): Promise<DeleteResponse> {
    try {
      const response: AxiosResponse<DeleteResponse> = await this.api.delete(`/patners/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting partner:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete partner';
      throw new Error(errorMessage);
    }
  }
}

// Singleton instance
const partnerService = new PartnerService();
export default partnerService;

// Named exports
export const {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} = partnerService;
