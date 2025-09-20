// src/services/productService.ts
import { API_URL } from '../api/api'; // keep for reference if needed
import api from '../api/api'; // axios instance

export interface Product {
  id: string;
  name: string;
  images: string[];
  brand: string;
  size: string;
  quantity: number;
  price: number;
  perUnit: string;
  description: string;
  subDescription: string | null;
  availability: boolean;
  tags: string[];
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  review?: number;
}

export interface CreateProductData {
  name: string;
  images?: string[];
  brand: string;
  size: string;
  quantity: number;
  price: number;
  perUnit: string;
  description: string;
  subDescription?: string | null;
  review?: number;
  availability?: boolean;
  tags?: string[];
  categoryId: number | string;
}

export interface ProductReview {
  id: string;
  productId: string;
  fullName: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const productService = {
  // ----------- PRODUCTS -----------
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching product:', error.response?.data || error.message);
      throw error;
    }
  },

  async createProduct(productData: FormData): Promise<Product> {
    try {
      console.log('➡️ Data being sent to createProduct:');
      for (const [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await api.post('/products', productData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating product:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateProduct(id: string, productData: FormData | CreateProductData): Promise<Product> {
    try {
      console.log('➡️ Data being sent to updateProduct:', productData);
      const response = await api.put(`/products/${id}`, productData);
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating product:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting product:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    size?: string;
    availability?: boolean;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    search?: string;
  }): Promise<{ data: Product[]; pagination: any }> {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching products:', error.response?.data || error.message);
      throw error;
    }
  },

  async bulkUpdateAvailability(productIds: string[], availability: boolean) {
    try {
      const response = await api.put('/products/bulk/availability', { productIds, availability });
      return response.data;
    } catch (error: any) {
      console.error('Error bulk updating availability:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateProductQuantity(id: string, quantity: number) {
    try {
      const response = await api.put(`/products/${id}/quantity`, { quantity });
      return response.data;
    } catch (error: any) {
      console.error('Error updating product quantity:', error.response?.data || error.message);
      throw error;
    }
  },

  async getLowStockProducts(threshold: number = 5) {
    try {
      const response = await api.get('/products/inventory/low-stock', { params: { threshold } });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching low stock products:', error.response?.data || error.message);
      throw error;
    }
  },

  async searchProducts(query: string, page = 1, limit = 10) {
    try {
      const response = await api.get('/products/search/query', {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching products:', error.response?.data || error.message);
      throw error;
    }
  },

  // ----------- REVIEWS -----------
  async createReview(data: {
    productId: string;
    fullName: string;
    email: string;
    rating: number;
    comment: string;
  }): Promise<ProductReview> {
    try {
      const response = await api.post('/product-reviews', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating review:', error.response?.data || error.message);
      throw error;
    }
  },

  async getReviews(productId: string): Promise<ProductReview[]> {
    try {
      const response = await api.get(`/product-reviews/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching reviews:', error.response?.data || error.message);
      throw error;
    }
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`/product-reviews/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting review:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default productService;
