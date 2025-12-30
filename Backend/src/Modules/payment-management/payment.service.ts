import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/Global/email/email.service';

/* ======================== PESAPAL RESPONSE TYPES ======================== */

interface PesapalTokenResponse {
  token: string;
  expiryDate: string;
  status: string;
  message: string;
}

interface PesapalIPNResponse {
  ipn_id: string;
  status: string;
  message: string;
}

interface PesapalSubmitOrderResponse {
  checkout_url: string;
  status: string;
  message: string;
}

/* ============================== SERVICE ============================== */

@Injectable()
export class PaymentService {
  [x: string]: any;
  private readonly baseUrl = 'https://cybqa.pesapal.com/pesapalv3';
  private readonly consumerKey = process.env.PESAPAL_CONSUMER_KEY!;
  private readonly consumerSecret = process.env.PESAPAL_CONSUMER_SECRET!;
  private readonly ipnUrl = process.env.PESAPAL_IPN_URL!;

  constructor(
    private prisma: PrismaService,
    private purchasingUserService: PurchasingUserService,
    private email: EmailService,
  ) {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('Pesapal credentials not set');
    }

    if (!this.ipnUrl || this.ipnUrl.includes('http://http')) {
      throw new Error('Invalid PESAPAL_IPN_URL');
    }
  }

  /* ============================ TOKEN ============================ */

  private async getToken(): Promise<string> {
    try {
      const res = await axios.post<PesapalTokenResponse>(
        `${this.baseUrl}/api/Auth/RequestToken`,
        {
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret,
        },
        { headers: { Accept: 'application/json' } },
      );

      return res.data.token;
    } catch (err: any) {
      console.error('Pesapal token error:', err.response?.data || err.message);
      throw new BadRequestException('Failed to authenticate with Pesapal');
    }
  }

  /* ============================= IPN ============================= */

  private async registerIPN(token: string): Promise<string> {
    try {
      const res = await axios.post<PesapalIPNResponse>(
        `${this.baseUrl}/api/URLSetup/RegisterIPN`,
        {
          url: this.ipnUrl,
          ipn_notification_type: 'POST',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      return res.data.ipn_id;
    } catch (err: any) {
      console.error('IPN registration error:', err.response?.data || err.message);
      throw new BadRequestException('Failed to register IPN');
    }
  }

  /* ========================= CREATE PAYMENT ========================= */

  async createPayment(order: any, p0?: string): Promise<string> {
    const token = await this.getToken();
    const notification_id = await this.registerIPN(token);

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
      currency: order.currency, // RWF or USD
      amount: order.amount,
      description: `Order #${order.id}`,
      callback_url: `${process.env.BASE_URL}/payments/callback`,
      notification_id,

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

    try {
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

      return res.data.checkout_url;
    } catch (err: any) {
      console.error('Submit order error:', err.response?.data || err.message);
      throw new BadRequestException('Failed to create Pesapal payment');
    }
  }

  /* ======================== VERIFY PAYMENT ======================== */

  async verifyPaymentAndGetRedirect(
orderTrackingId: string, pesapal_status: string, status?: string,
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
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) throw new BadRequestException('Order not found');

    const user: any = await this.purchasingUserService.createOrGetUser({
      name: order.customerName,
      email: order.customerEmail,
      phoneNumber: order.customerPhone,
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED', purchasingUserId: user.id ?? user.user?.id },
    });

    for (const item of order.orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

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
}
