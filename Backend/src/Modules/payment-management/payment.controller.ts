import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * PESAPAL IPN (WEBHOOK)
   */
  @Post('ipn')
  async pesapalIpn(@Req() req: Request, @Res() res: Response) {
    console.log('📩 PESAPAL IPN RECEIVED', req.body);
    await this.paymentService.handlePesapalIpn(req.body);
    return res.status(200).send('OK');
  }

  /**
   * USER REDIRECT CALLBACK
   */
  @Get('callback')
  async pesapalCallback(@Res() res: Response) {
    // Redirect to frontend page; frontend will poll for real status
    return res.redirect(
      `${process.env.BASE_URL}/payment-status?status=processing`,
    );
  }

  /**
   * RETRY PAYMENT
   */
  @Post('retry/:orderId')
  async retryPayment(@Param('orderId') orderId: string) {
    return this.paymentService.retryPayment(orderId);
  }

  /**
   * GET PAYMENT STATUS (for frontend polling)
   */
  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string, @Res() res: Response) {
    const status = await this.paymentService.getPaymentStatus(paymentId);

    if (!status) throw new NotFoundException('Payment not found');

    return res.json({ status });
  }
}
