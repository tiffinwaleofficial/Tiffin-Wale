import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RazorpayService } from './razorpay.service';
import { PaymentService } from './payment.service';

@ApiTags('payment-webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('razorpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Razorpay webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook event' })
  async handleRazorpayWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() webhookEvent: any,
  ) {
    // In a real implementation, you would:
    // 1. Verify the webhook signature
    // 2. Process the webhook event based on its type
    // 3. Update the payment status in your database
    
    // Example webhook event handling:
    try {
      if (!signature) {
        return { success: false, message: 'Missing signature' };
      }

      // Log the webhook event type
      console.log(`Received Razorpay webhook: ${webhookEvent.event}`);

      // Different event types to handle
      switch (webhookEvent.event) {
        case 'payment.authorized':
          // Process payment authorized event
          // Update payment status to AUTHORIZED
          break;
          
        case 'payment.captured':
          // Process payment captured event
          // Update payment status to CAPTURED
          break;
          
        case 'payment.failed':
          // Process payment failed event
          // Update payment status to FAILED
          break;
          
        case 'refund.processed':
          // Process refund processed event
          // Update payment status to REFUNDED
          break;
          
        default:
          console.log(`Unhandled webhook event type: ${webhookEvent.event}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return { 
        success: false, 
        message: 'Error processing webhook',
        error: error.message 
      };
    }
  }
} 