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
import { Response, Request } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * =========================
   * PESAPAL IPN (SERVER → SERVER)
   * =========================
   */
  @Post('ipn')
  async pesapalIpn(@Req() req: Request, @Res() res: Response) {
    console.log('📩 PESAPAL IPN RECEIVED');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);

    // Pesapal ONLY requires 200 OK
    return res.status(200).send('OK');
  }

  /**
   * =========================
   * PESAPAL CALLBACK (USER REDIRECT)
   * =========================
   */
  @Get('callback')
  async pesapalCallback(
    @Query('OrderTrackingId') orderTrackingId: string,
    @Query('OrderMerchantReference') merchantReference: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    const redirectUrl =
      await this.paymentService.verifyPaymentAndGetRedirect(
        merchantReference,
        status,
      );

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
