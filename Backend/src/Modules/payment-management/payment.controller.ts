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
   * ⚠️ This is the ONLY place where payment is confirmed
   */
  @Post('ipn')
  async pesapalIpn(@Req() req: Request, @Res() res: Response) {
    console.log('📩 PESAPAL IPN RECEIVED');
    console.log(req.body);

    await this.paymentService.handlePesapalIpn(req.body);

    return res.status(200).send('OK');
  }

  /**
   * =========================
   * USER REDIRECT CALLBACK
   * =========================
   * ❌ DO NOT update DB here
   */
  @Get('callback')
  async pesapalCallback(@Res() res: Response) {
    return res.redirect(
      `${process.env.FRONTEND_BASE_URL}/payment-status?status=processing`,
    );
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
