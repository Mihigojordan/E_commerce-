import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PurchasingUserService } from '../purchasingUser/purchasingUser.service';
import { EmailService } from 'src/Global/email/email.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    PurchasingUserService,
    EmailService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
