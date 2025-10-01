import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment-management/payment.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('checkout')
  async checkout(@Body() body: any) {
    // Create order
    const order = await this.orderService.createOrder(body);

    // Create payment and get Flutterwave link
      const paymentLink = await this.paymentService.createPayment(order, 'card,mobilemoneyrwanda,ussd,account,qr');

    return { order, paymentLink };
  }

  @Get(':id')
  async getOrder(@Param('id') orderId: string) {
    return this.orderService.getOrder(orderId);
  }
}
