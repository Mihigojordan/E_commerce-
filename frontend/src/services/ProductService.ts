import { API_URL } from '../api/api'; // Keep this for reference if needed
import api from '../api/api'; // Import the axios instance

interface Product {
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
}

// Define interface for create/update data to match backend expectations
interface CreateProductData {
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
  categoryId: number | string; // Allow string or number, as backend handles both
}

const productService = {
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error.response?.data || error.message);
      throw error;
    }
  },

async createProduct(productData: FormData): Promise<Product> {
    try {
      // Log the FormData contents for debugging
      console.log('Data being sent to createProduct:');
      for (const [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send FormData without setting Content-Type (browser handles it)
      const response = await api.post('/products', productData);

      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error('Error creating product:', error.response?.data || error.message);
      throw error;
    }
  },

  async updateProduct(id: string, productData: CreateProductData): Promise<Product> {
    try {
      // Log the data being sent
      console.log('Data being sent to updateProduct:', JSON.stringify(productData, null, 2));

      const response = await api.put(`/products/${id}`, productData);

      return response.data;
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default productService;