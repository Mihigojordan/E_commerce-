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

  /* ========================
     IPN ENDPOINT
  ======================== */
  @Post('ipn')
  async pesapalIpn(@Req() req: Request, @Res() res: Response) {
    console.log('📩 IPN RECEIVED:', req.body);
    await this.paymentService.handlePesapalIpn(req.body);
    return res.status(200).send('OK');
  }

  /* ========================
     CALLBACK (🔥 MANUAL TRIGGER)
  ======================== */
  @Get('callback')
  async pesapalCallback(@Req() req: Request, @Res() res: Response) {
    const trackingId = req.query.OrderTrackingId as string;
    const paymentId = req.query.OrderMerchantReference as string;

    if (!trackingId || !paymentId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?status=failed`,
      );
    }

    try {
      await this.paymentService.triggerIpnManually(paymentId, trackingId);

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?status=success`,
      );
    } catch (err) {
      console.error('❌ Manual IPN failed:', err);

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?status=failed`,
      );
    }
  }

  /* ========================
     PAYMENT STATUS
  ======================== */
  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string, @Res() res: Response) {
    const status = await this.paymentService.getPaymentStatus(paymentId);
    if (!status) throw new NotFoundException('Payment not found');
    return res.json({ status });
  }
}
