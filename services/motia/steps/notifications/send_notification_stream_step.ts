import { ApiRouteConfig, ApiRouteHandler } from 'motia'
import { z } from 'zod'
import { notificationSchema } from '../../streams/notifications.stream'

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'SendNotification',
  method: 'POST',
  path: '/notifications/send',
  bodySchema: z.object({
    userId: z.string(),
    userType: z.enum(['student', 'partner', 'admin']),
    type: z.enum(['order_status', 'general', 'promotion', 'system']),
    title: z.string(),
    message: z.string(),
    data: z.record(z.any()).optional(),
    expiresAt: z.string().optional(),
  }),
  emits: ['notification_sent'],
  responseSchema: {
    201: notificationSchema
  }
}

export const handler: ApiRouteHandler<any, any, any> = async (req: any, context: any) => {
  const { streams, emit } = context
  const { userId, userType, type, title, message, data, expiresAt } = req.body

  // Create notification in Motia stream
  const notificationId = crypto.randomUUID()
  const notification = await streams.notifications.set(userId, notificationId, {
    id: notificationId,
    userId,
    userType,
    type,
    title,
    message,
    data,
    read: false,
    timestamp: new Date().toISOString(),
    expiresAt,
  })

  // Emit event to trigger NestJS WebSocket broadcast
  await emit({
    topic: 'notification_sent',
    data: {
      notification,
      targetUser: userId,
      userType,
    }
  })

  return { status: 201, body: notification }
}


