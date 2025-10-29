import { EventConfig, EventHandler } from 'motia'
import { z } from 'zod'
import { orderStatusSchema } from '../../streams/order-status.stream'

export const config: EventConfig = {
  type: 'event',
  name: 'OrderStatusUpdateStream',
  emits: ['order_status_updated'],
  subscribes: ['order_status_changed'],
  input: z.object({
    orderId: z.string(),
    status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
    userId: z.string(),
    partnerId: z.string(),
    message: z.string().optional(),
    estimatedTime: z.number().optional(),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),
  }),
}

export const handler: EventHandler<any, any> = async (event: any, context: any) => {
  const { streams, emit } = context
  const { orderId, status, userId, partnerId, message, estimatedTime, location } = event.data

  // Update order status in Motia stream
  const orderStatus = await streams.orderStatus.set(orderId, 'current', {
    orderId,
    status,
    userId,
    partnerId,
    timestamp: new Date().toISOString(),
    message,
    estimatedTime,
    location,
  })

  // Emit event to trigger NestJS WebSocket broadcast
  await emit({
    topic: 'order_status_updated',
    data: {
      orderStatus,
      targetUsers: [userId, partnerId],
      broadcastType: 'order_update',
    }
  })
}


