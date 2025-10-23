// services/materialsService.ts

import api from '../api/api'; // Import the Axios instance

export interface Category {
  [x: string]: any;
  created_at: string | Date | undefined;
  id: number;
  name: string;
  subCategory: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  subCategory: string;
  status: 'active' | 'inactive';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class MaterialService {
  private api: AxiosInstance;

  constructor() {
    this.api = api; // Use the imported Axios instance
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const response: AxiosResponse<Category[]> = await this.api.get('/categories');
      console.log('API Response:', response.data); // Debug log
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    try {
      const response: AxiosResponse<Category> = await this.api.post('/categories', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  async updateCategory(id: number, data: CreateCategoryInput): Promise<void> {
    try {
      await this.api.put(`/categories/${id}`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await this.api.delete(`/categories/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }

  validateCategoryData(data: CreateCategoryInput): ValidationResult {
    const errors: string[] = [];
    if (!data.name || data.name.trim() === '') {
      errors.push('Category name is required');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new MaterialService();