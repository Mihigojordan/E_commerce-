// src/services/categoryService.ts
import api from '../api/api'; // axios instance

export interface Category {
  id: number;
  name: string;
  subCategory?: string;
  status?: string;
  category_image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  subCategory?: string;
  status?: string;
  category_image?: File; // 👈 allow file upload
}

export interface UpdateCategoryData {
  name?: string;
  subCategory?: string;
  status?: string;
  category_image?: File; // 👈 allow file upload
}

const categoryService = {
  async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.subCategory) formData.append('subCategory', data.subCategory);
      if (data.status) formData.append('status', data.status);
      if (data.category_image) {
        formData.append('category_image', data.category_image);
      }

      const response = await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating category:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching categories:', error.response?.data || error.message);
      throw error;
    }
  },

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching category:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.subCategory) formData.append('subCategory', data.subCategory);
      if (data.status) formData.append('status', data.status);
      if (data.category_image) {
        formData.append('category_image', data.category_image);
      }

      const response = await api.patch(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating category:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteCategory(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting category:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default categoryService;
