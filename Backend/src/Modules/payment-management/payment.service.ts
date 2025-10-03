import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
    private readonly baseUrl = 'https://api.flutterwave.com/v3';
    private readonly secretKey = process.env.FLW_SECRET_KEY;

    constructor(
        private prisma: PrismaService,
        private purchasingUserService: PurchasingUserService, // inject user service
    ) { }

    // Create payment for an order (default: all Flutterwave methods)
    async createPayment(order: any, paymentMethod?: string) {
        const txRef = `abytechtx-${uuidv4()}`;
        const paymentOptions = paymentMethod ?? 'card,mobilemoneyrwanda,ussd,account,qr';

        // Save payment record
        await this.prisma.payment.create({
            data: {
                orderId: order.id,
                txRef,
                amount: order.amount,
                currency: order.currency,
                status: 'PENDING',
                paymentMethod: paymentOptions,
            },
        });

        // Call Flutterwave API
        const payload = {
            tx_ref: txRef,
            amount: order.amount,
            currency: order.currency,
            redirect_url: `${process.env.BASE_URL}/payments/callback`,
            payment_options: paymentOptions,
            customer: {
                email: order.customerEmail,
                phonenumber: order.customerPhone,
                name: order.customerName,
            },
        };

        try {
            const res = await axios.post<any>(`${this.baseUrl}/payments`, payload, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Flutterwave response:', res.data);

            return res.data.data.link;
        } catch (error) {
            console.error('Flutterwave payment error:', error.response?.data || error.message);
            throw new BadRequestException('Failed to create Flutterwave payment');
        }
    }
async verifyPaymentAndGetRedirect(txRef: string, transactionId: string): Promise<string> {
  // 1️⃣ Verify with Flutterwave
  const res = await axios.get<any>(`${this.baseUrl}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${this.secretKey}` },
  });

  const data = res.data.data;
  const status = data.status === 'successful' ? 'SUCCESSFUL' : 'FAILED';
  console.log('data : +> ::: ', data);
  
  const paymentMethod = data.payment_type || data.payment_type || 'unknown'; // Flutterwave field for method

  // 2️⃣ Update Payment record (now includes paymentMethod)
  const payment = await this.prisma.payment.update({
    where: { txRef },
    data: {
      status,
      transactionId,
      paymentMethod, // save which method was used
    },
  });

  // 3️⃣ Get order with items
  const order = await this.prisma.order.findUnique({
    where: { id: payment.orderId },
    include: { orderItems: true },
  });
  if (!order) throw new BadRequestException('Order not found for this payment');

  // 4️⃣ Link or create PurchasingUser
  const user: any = await this.purchasingUserService.createOrGetUser({
    name: order.customerName,
    email: order.customerEmail,
    phoneNumber: order.customerPhone,
  });

  // 5️⃣ Update order
  await this.prisma.order.update({
    where: { id: order.id },
    data: {
      status: status === 'SUCCESSFUL' ? 'COMPLETED' : order.status,
      purchasingUserId: user.id ?? user.user?.id,
    },
  });

  // 6️⃣ Decrease product quantity if successful
  if (status === 'SUCCESSFUL') {
    for (const item of order.orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }
  }

  // 7️⃣ Construct frontend redirect URL
  return `${process.env.FRONTEND_BASE_URL}/payment-status?status=${status === 'SUCCESSFUL' ? 'success' : 'failed'}&orderId=${order.id}&amount=${order.amount}&currency=${order.currency}&method=${paymentMethod}`;
}



}
