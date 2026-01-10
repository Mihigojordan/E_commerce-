import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { EmailService } from 'src/Global/email/email.service';
import { v4 as uuidv4 } from 'uuid';

/* ========================
   TYPES
======================== */
interface PesapalTokenResponse {
  token: string;
}

interface PesapalSubmitOrderResponse {
  checkout_url?: string;
  redirect_url?: string;
}

interface PesapalIpnPayload {
  OrderTrackingId: string;
  OrderMerchantReference: string;
  Status: string;
}

/* ========================
   PAYMENT SERVICE
======================== */
@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://cybqa.pesapal.com/pesapalv3';
  private readonly consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
  private readonly consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
  private readonly notificationId = process.env.PESAPAL_NOTIFICATION_ID!;
  private readonly apiUrl = process.env.API_URL!; // https://ecommerce.abyride.com

  constructor(
    private readonly prisma: PrismaService,
    private readonly purchasingUserService: PurchasingUserService,
    private readonly emailService: EmailService,
  ) {}

  /* ========================
     AUTH TOKEN
  ======================== */
  private async getToken(): Promise<string> {
    const res = await axios.post<PesapalTokenResponse>(
      `${this.baseUrl}/api/Auth/RequestToken`,
      {
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret,
      },
      { headers: { Accept: 'application/json' } },
    );
    return res.data.token;
  }

  /* ========================
     CREATE PAYMENT
  ======================== */
  async createPayment(order: any): Promise<string> {
    const token = await this.getToken();
    const txRef = `rw-${uuidv4()}`;

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        txRef,
        status: 'PENDING',
        paymentMethod: 'PESAPAL',
      },
    });

    const [firstName, ...rest] = order.customerName.split(' ');
    const lastName = rest.join(' ') || 'N/A';

    const payload = {
      id: payment.id,
      currency: order.currency,
      amount: order.amount.toFixed(2),
      description: `Order #${order.id}`,
      callback_url: `${this.apiUrl}/payments/callback`,
      notification_id: this.notificationId,
      billing_address: {
        email_address: order.customerEmail,
        phone_number: order.customerPhone,
        country_code: 'RW',
        first_name: firstName,
        last_name: lastName,
      },
    };

    const res = await axios.post<PesapalSubmitOrderResponse>(
      `${this.baseUrl}/api/Transactions/SubmitOrderRequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    if (!res.data.checkout_url && !res.data.redirect_url) {
      throw new BadRequestException('Pesapal did not return a payment URL');
    }

    return res.data.checkout_url ?? res.data.redirect_url!;
  }

  /* ========================
     MANUAL IPN TRIGGER 🔥
  ======================== */
  async triggerIpnManually(paymentId: string, trackingId: string) {
    const payload: PesapalIpnPayload = {
      OrderTrackingId: trackingId,
      OrderMerchantReference: paymentId,
      Status: 'COMPLETED',
    };

    await axios.post(`${this.apiUrl}/payments/ipn`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /* ========================
     IPN HANDLER (CORE LOGIC)
  ======================== */
  async handlePesapalIpn(payload: PesapalIpnPayload): Promise<void> {
    console.log('🔥 IPN PAYLOAD:', payload);

    const paymentId = payload.OrderMerchantReference;
    const status = payload.Status?.toUpperCase();

    if (status !== 'COMPLETED') return;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.status === 'SUCCESSFUL') return;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESSFUL' },
      });

      const order = await tx.order.findUnique({
        where: { id: payment.orderId },
        include: { orderItems: true },
      });

      if (!order) throw new BadRequestException('Order not found');

      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      const userResult = await this.purchasingUserService.createOrGetUser({
        name: order.customerName,
        email: order.customerEmail,
        phoneNumber: order.customerPhone,
      });

      const user = 'user' in userResult ? userResult.user : userResult;

      await tx.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED', purchasingUserId: user.id },
      });

      await this.emailService.sendEmail(
        user.email,
        'Payment Successful',
        'payment-success',
        {
          name: user.name,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          paymentMethod: 'Pesapal',
          year: new Date().getFullYear(),
        },
      );
    });
  }

  async getPaymentStatus(paymentId: string): Promise<string | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    return payment?.status ?? null;
  }
}
