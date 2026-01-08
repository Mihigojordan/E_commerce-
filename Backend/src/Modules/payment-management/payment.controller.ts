import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * =========================
   * PESAPAL IPN (WEBHOOK)
   * =========================
   */
  @Post('ipn')
  async pesapalIpn(@Req() req: Request, @Res() res: Response) {
    console.log('📩 PESAPAL IPN RECEIVED');
    console.log(req.body);

    await this.paymentService.handlePesapalIpn(req.body);

    // Pesapal only expects 200 OK
    return res.status(200).send('OK');
  }

  /**
   * =========================
   * USER REDIRECT CALLBACK
   * =========================
   */
  @Get('callback')
  async pesapalCallback(
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    const redirectUrl =
      status === 'COMPLETED'
        ? `${process.env.FRONTEND_BASE_URL}/payment-status?status=processing`
        : `${process.env.FRONTEND_BASE_URL}/payment-status?status=failed`;

    return res.redirect(redirectUrl);
  }

  /**
   * =========================
   * RETRY PAYMENT
   * =========================
   */
  @Post('retry/:orderId')
  async retryPayment(@Param('orderId') orderId: string) {
    return this.paymentService.retryPayment(orderId);
  }
}
