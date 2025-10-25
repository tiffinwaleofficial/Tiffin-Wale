import { EventStepConfig, Handlers } from 'motia'
import { orderStatusSchema } from '../streams/order-status.stream'

export const config: EventStepConfig = {
  type: 'event',
  name: 'OrderStatusUpdateStream',
  emits: ['order_status_updated'],
  listens: ['order_status_changed'],
}

export const handler: Handlers.EventHandler = async (event, { streams, emit }) => {
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
  await emit('order_status_updated', {
    orderStatus,
    targetUsers: [userId, partnerId],
    broadcastType: 'order_update',
  })

  return { success: true, orderStatus }
}


