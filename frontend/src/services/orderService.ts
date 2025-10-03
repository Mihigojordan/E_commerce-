// src/services/orderService.ts
import api from '../api/api'; // your axios instance

export interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment?: any;
  purchasingUserId?: string;
}

export interface CreateOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  currency: string;
  items: OrderItem[];
}

export interface OrderQuery {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const orderService = {
  // ✅ Checkout
  async checkout(data: CreateOrderData): Promise<{ order: Order; paymentLink: string }> {
    try {
      const response = await api.post('/orders/checkout', data);
      return response.data;
    } catch (error: any) {
      console.error('Error during checkout:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Get order by ID
  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching order ${orderId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Fetch all orders with optional query filters
  async getAllOrders(query?: OrderQuery): Promise<Order[]> {
    try {
      const response = await api.get('/orders', { params: query });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all orders:', error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Fetch orders by user ID
  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching orders for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Optional: Update order status
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating order ${orderId} status:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default orderService;
