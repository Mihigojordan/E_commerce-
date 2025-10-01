// src/services/paymentService.ts
import api from '../api/api'; // your axios instance

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED';

export interface Payment {
  id: string;
  orderId: string;
  txRef: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const paymentService = {
  /**
   * Create a payment for an order
   * @param orderId - ID of the order
   * @param paymentMethod - optional, default: 'card,mobilemoneyrwanda,ussd,account,qr'
   * @returns link to Flutterwave checkout
   */
  async createPayment(orderId: string, paymentMethod?: string): Promise<string> {
    try {
      const response = await api.post(`/orders/${orderId}/payment`, { paymentMethod });
      return response.data.link; // Flutterwave payment link
    } catch (error: any) {
      console.error('Error creating payment:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Verify a payment callback from Flutterwave
   * @param txRef - transaction reference sent to Flutterwave
   * @param transactionId - transaction ID from Flutterwave
   */
  async verifyPayment(txRef: string, transactionId: string): Promise<Payment> {
    try {
      const response = await api.get(`/payments/callback`, {
        params: { tx_ref: txRef, transaction_id: transactionId },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Optional: get payment by transaction reference (if needed)
   */
  async getPayment(txRef: string): Promise<Payment> {
    try {
      const response = await api.get(`/payments/${txRef}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payment:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default paymentService;
