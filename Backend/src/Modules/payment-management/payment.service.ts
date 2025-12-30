import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/Global/email/email.service';

/* ======================== TYPES ======================== */

interface PesapalTokenResponse {
  token: string;
}

interface PesapalSubmitOrderResponse {
  checkout_url?: string;
  redirect_url?: string;
  status: string;
  message: string;
}

/* ======================== SERVICE ======================== */

@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://cybqa.pesapal.com/pesapalv3';
  private readonly consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
  private readonly consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
  private readonly notificationId = process.env.PESAPAL_NOTIFICATION_ID!;

  constructor(
    private prisma: PrismaService,
    private purchasingUserService: PurchasingUserService,
    private email: EmailService,
  ) {}

  /* ======================== TOKEN ======================== */

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

  /* ======================== CREATE PAYMENT ======================== */

  async createPayment(order: any, p0?: string): Promise<string> {
    const token = await this.getToken();

    const txRef = `rw-${uuidv4()}`;

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        txRef,
        amount: order.amount,
        currency: order.currency,
        status: 'PENDING',
        paymentMethod: 'pesapal',
      },
    });

    const [firstName, ...rest] = order.customerName.split(' ');
    const lastName = rest.join(' ') || 'N/A';

    const payload = {
      id: txRef,
      currency: order.currency,
      amount: Number(order.amount).toFixed(2),
      description: `Order #${order.id}`,
      callback_url: `${process.env.BASE_URL}/payments/callback`,
      notification_id: this.notificationId,

      billing_address: {
        email_address: order.customerEmail,
        phone_number: order.customerPhone,
        country_code: 'RW',
        first_name: firstName,
        last_name: lastName,
        line_1: 'Kigali',
        city: 'Kigali',
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

    console.log('Pesapal response:', res.data);

    return res.data.checkout_url || res.data.redirect_url!;
  }

  /* ======================== VERIFY PAYMENT ======================== */

  async verifyPaymentAndGetRedirect(
    orderTrackingId: string,
    pesapal_status: string,
  ): Promise<string> {
    if (pesapal_status !== 'COMPLETED') {
      return `${process.env.FRONTEND_BASE_URL}/payment-status?status=failed`;
    }

    const payment = await this.prisma.payment.update({
      where: { txRef: orderTrackingId },
      data: { status: 'SUCCESSFUL' },
    });

    const order = await this.prisma.order.findUnique({
      where: { id: payment.orderId },
      include: { orderItems: true },
    });

    if (!order) throw new BadRequestException('Order not found');

    const user: any = await this.purchasingUserService.createOrGetUser({
      name: order.customerName,
      email: order.customerEmail,
      phoneNumber: order.customerPhone,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED', purchasingUserId: user.id },
    });

    await this.email.sendEmail(
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

    return `${process.env.FRONTEND_BASE_URL}/payment-status?status=success&orderId=${order.id}`;
  }

  /* ======================== RETRY ======================== */

  async retryPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    return this.createPayment(order);
  }
}
