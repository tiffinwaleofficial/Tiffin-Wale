import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentMethod, PaymentMethodSchema } from './schemas/payment-method.schema';
import { RazorpayService } from './razorpay.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
    ConfigModule,
  ],
  controllers: [PaymentController, WebhookController],
  providers: [PaymentService, RazorpayService],
  exports: [PaymentService, RazorpayService],
})
export class PaymentModule {}
